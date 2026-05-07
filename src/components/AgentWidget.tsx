import { useState, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { chatWithAgent } from "@/lib/agent.functions";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

export function AgentWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm your **CyberOps Assistant**. Ask me to navigate, summarize tasks, list pending scripts, or explain a CEH concept." },
  ]);
  const navigate = useNavigate();
  const chat = useServerFn(chatWithAgent);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res: any = await chat({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.reply || "(no response)" }]);
      for (const a of res.actions ?? []) {
        if (a.type === "navigate" && typeof a.to === "string") {
          setTimeout(() => navigate({ to: a.to as never }), 400);
        }
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Agent failed");
      setMessages([...next, { role: "assistant", content: "⚠️ " + (e?.message ?? "Something went wrong.") }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg bg-gradient-to-br from-cyber-cyan via-cyber-blue to-cyber-purple text-primary-foreground hover:opacity-90"
          aria-label="Open AI assistant"
        >
          <Bot className="size-6" />
        </Button>
      )}
      {open && (
        <Card className="glass-strong fixed bottom-6 right-6 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-3rem))] flex flex-col border-cyber-cyan/40 shadow-2xl">
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">CyberOps Assistant</div>
                <div className="text-[10px] text-cyber-green leading-tight">● Online · agent mode</div>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}><X className="size-4" /></Button>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "bg-cyber-cyan/15 border border-cyber-cyan/30"
                    : "bg-muted/40 border border-border"
                }`}>
                  <div className="prose prose-sm prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_code]:text-cyber-cyan">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Thinking…
              </div>
            )}
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              placeholder="Ask anything or say 'open tasks'…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              disabled={busy}
            />
            <Button onClick={send} disabled={busy || !input.trim()} size="icon">
              <Send className="size-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
