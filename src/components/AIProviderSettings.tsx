import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, ShieldCheck } from "lucide-react";

export function AIProviderSettings() {
  const { isAdmin } = useAuth();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return; }
    (async () => {
      const { data, error } = await supabase
        .from("app_secrets")
        .select("value, updated_at")
        .eq("key", "GEMINI_API_KEY")
        .maybeSingle();
      if (!error && data?.value) {
        setValue(data.value);
        setHasKey(true);
        setUpdatedAt(data.updated_at);
      }
      setLoading(false);
    })();
  }, [isAdmin]);

  async function save() {
    const trimmed = value.trim();
    if (!trimmed) { toast.error("Key cannot be empty"); return; }
    if (trimmed.length < 20 || trimmed.length > 200) { toast.error("That doesn't look like a valid Gemini API key"); return; }
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from("app_secrets").upsert({
      key: "GEMINI_API_KEY",
      value: trimmed,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setHasKey(true);
    setUpdatedAt(new Date().toISOString());
    toast.success("Gemini API key saved securely");
  }

  async function remove() {
    if (!confirm("Remove the stored Gemini key? The agent will stop working until a new key is set.")) return;
    setSaving(true);
    const { error } = await supabase.from("app_secrets").delete().eq("key", "GEMINI_API_KEY");
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setValue("");
    setHasKey(false);
    setUpdatedAt(null);
    toast.success("Key removed");
  }

  if (!isAdmin) {
    return (
      <Card className="glass p-6 max-w-2xl">
        <div className="flex items-center gap-3 text-muted-foreground">
          <ShieldCheck className="size-5 text-cyber-cyan" />
          <p className="text-sm">Only admins and super admins can manage AI provider credentials.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass p-6 max-w-2xl space-y-5">
      <div>
        <div className="flex items-center gap-2">
          <KeyRound className="size-5 text-cyber-cyan" />
          <h3 className="font-semibold">Gemini API Key</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Used by the CyberOps Assistant to call Google's Gemini models. Stored encrypted at rest, readable only by admins.
        </p>
      </div>

      <div>
        <Label htmlFor="gemini-key">API Key</Label>
        <div className="flex gap-2 mt-1.5">
          <div className="relative flex-1">
            <Input
              id="gemini-key"
              type={show ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={loading ? "Loading…" : "AIza..."}
              disabled={loading || saving}
              className="pr-10 font-mono"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={show ? "Hide key" : "Show key"}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>
        {hasKey && updatedAt && (
          <p className="text-xs text-muted-foreground mt-2">
            Last updated {new Date(updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={save}
          disabled={saving || loading}
          className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground"
        >
          {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : null}
          {hasKey ? "Update key" : "Save key"}
        </Button>
        {hasKey && (
          <Button variant="outline" onClick={remove} disabled={saving}>Remove</Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground border-t border-border pt-4">
        Get a key at{" "}
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-cyber-cyan hover:underline">
          aistudio.google.com/apikey
        </a>
        . Make sure the linked Google Cloud project has the Generative Language API enabled.
      </div>
    </Card>
  );
}
