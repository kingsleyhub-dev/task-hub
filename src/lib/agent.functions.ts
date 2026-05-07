import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Msg = { role: "system" | "user" | "assistant" | "tool"; content: string; tool_call_id?: string; tool_calls?: any };

const SYSTEM = `You are CyberOps Assistant — an embedded AI inside the CyberTaskOps platform (a cybersecurity operations & task management SaaS by Kingsley Hub).

You help authorized operators and admins:
- Navigate the app (Dashboard, Users & Work IDs, Tasks, Tool Library, Script Repository, CEH Resource Center, Installation Guides, Audit Logs, Reports, Notifications, Settings).
- Summarize platform data (open tasks, pending scripts, recent audit events).
- Explain defensive cybersecurity concepts and CEH topics.

Rules:
- Ethical & defensive use only. Refuse offensive instructions targeting systems the user is not authorized for.
- Be concise, professional, SOC-grade tone.
- When the user asks to "go to / open / show me" a section, CALL the navigate tool with the correct route.
- When asked for live counts/lists (open tasks, pending scripts, recent audits), CALL query_platform.

Available routes: /dashboard /users /tasks /tools /scripts /ceh /installation /audit /reports /notifications /settings`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "navigate",
      description: "Navigate the user to a route inside CyberTaskOps.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Route path, e.g. /tasks, /scripts, /audit" },
          reason: { type: "string", description: "Short reason shown to the user" },
        },
        required: ["to"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "query_platform",
      description: "Fetch live counts/lists from the platform.",
      parameters: {
        type: "object",
        properties: {
          resource: {
            type: "string",
            enum: ["open_tasks", "pending_scripts", "recent_audits", "my_tasks", "unread_notifications"],
          },
          limit: { type: "number" },
        },
        required: ["resource"],
        additionalProperties: false,
      },
    },
  },
];

async function runQuery(supabase: any, userId: string, resource: string, limit = 10) {
  const lim = Math.min(Math.max(limit ?? 10, 1), 25);
  switch (resource) {
    case "open_tasks": {
      const { data } = await supabase.from("tasks").select("code,title,priority,status,deadline").neq("status", "Completed").order("deadline", { ascending: true }).limit(lim);
      return data ?? [];
    }
    case "my_tasks": {
      const { data } = await supabase.from("tasks").select("code,title,priority,status,deadline").eq("assignee_id", userId).limit(lim);
      return data ?? [];
    }
    case "pending_scripts": {
      const { data } = await supabase.from("scripts").select("name,language,category,created_at").eq("approval_status", "Pending Review").order("created_at", { ascending: false }).limit(lim);
      return data ?? [];
    }
    case "recent_audits": {
      const { data } = await supabase.from("audit_logs").select("event,detail,severity,created_at").order("created_at", { ascending: false }).limit(lim);
      return data ?? [];
    }
    case "unread_notifications": {
      const { data } = await supabase.from("notifications").select("title,body,created_at").eq("user_id", userId).eq("read", false).order("created_at", { ascending: false }).limit(lim);
      return data ?? [];
    }
  }
  return [];
}

export const chatWithAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { messages: Msg[] }) => data)
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const messages: Msg[] = [{ role: "system", content: SYSTEM }, ...data.messages];

    const actions: { type: "navigate"; to: string; reason?: string }[] = [];

    // up to 3 tool round-trips
    for (let i = 0; i < 4; i++) {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          tools: TOOLS,
        }),
      });

      if (resp.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
      if (!resp.ok) throw new Error(`AI gateway error: ${resp.status}`);

      const body = await resp.json();
      const choice = body.choices?.[0]?.message;
      if (!choice) throw new Error("Empty response from AI");

      const toolCalls = choice.tool_calls ?? [];
      if (toolCalls.length === 0) {
        return { reply: choice.content ?? "", actions };
      }

      messages.push({ role: "assistant", content: choice.content ?? "", tool_calls: toolCalls });

      for (const tc of toolCalls) {
        const name = tc.function?.name;
        let args: any = {};
        try { args = JSON.parse(tc.function?.arguments ?? "{}"); } catch {}
        let result: any = null;
        if (name === "navigate") {
          actions.push({ type: "navigate", to: args.to, reason: args.reason });
          result = { ok: true, navigated_to: args.to };
        } else if (name === "query_platform") {
          result = await runQuery(context.supabase, context.userId, args.resource, args.limit);
        } else {
          result = { error: "unknown tool" };
        }
        messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
      }
    }

    return { reply: "I couldn't complete that request. Please try rephrasing.", actions };
  });
