import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { FormEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: Reset });

function Reset() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    nav({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8">
        <Logo />
        <h1 className="text-2xl font-bold mt-6">Set new password</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label>New password</Label><Input required type="password" minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button disabled={loading} className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">Update password</Button>
        </form>
      </div>
    </div>
  );
}
