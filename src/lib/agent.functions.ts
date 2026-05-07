import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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
  .inputValidator((data: { messages: Msg[]; token: string }) => data)
  .handler(async ({ data }) => {
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!data.token) throw new Error("Unauthorized: missing session token");

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      global: { headers: { Authorization: `Bearer ${data.token}` } },
      auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    });
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(data.token);
    if (claimsErr || !claims?.claims?.sub) throw new Error("Unauthorized: invalid session");
    const userId = claims.claims.sub as string;

    // Resolve Gemini key: prefer DB-stored key (admin-managed), fall back to env
    let apiKey = process.env.GEMINI_API_KEY ?? "";
    try {
      const admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
      });
      const { data: row } = await admin.from("app_secrets").select("value").eq("key", "GEMINI_API_KEY").maybeSingle();
      if (row?.value) apiKey = row.value;
    } catch {}
    if (!apiKey) throw new Error("Gemini API key is not configured. Ask an admin to set it in Settings → AI Provider.");

    const messages: Msg[] = [{ role: "system", content: SYSTEM }, ...data.messages];

    const actions: { type: "navigate"; to: string; reason?: string }[] = [];

    for (let i = 0; i < 4; i++) {
      const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages,
          tools: TOOLS,
        }),
      });

      if (resp.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(`Gemini API error ${resp.status}: ${errText.slice(0, 200)}`);
      }

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
          result = await runQuery(supabase, userId, args.resource, args.limit);
        } else {
          result = { error: "unknown tool" };
        }
        messages.push({ role: "tool", tool_call_id: tc.id, content: JSON.stringify(result) });
      }
    }

    return { reply: "I couldn't complete that request. Please try rephrasing.", actions };
  });
