import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Forgot });

function Forgot() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) toast.error(error);
    else toast.success("Reset link sent. Check your inbox.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8">
        <Logo />
        <h1 className="text-2xl font-bold mt-6">Reset password</h1>
        <p className="text-sm text-muted-foreground mt-1">We'll send a secure reset link to your email.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label>Email</Label><Input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1.5" placeholder="you@kingsleyhub.io" /></div>
          <Button disabled={loading} className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">Send reset link</Button>
          <p className="text-xs text-muted-foreground text-center">
            <Link to="/login" className="text-cyber-cyan hover:underline">Back to sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
