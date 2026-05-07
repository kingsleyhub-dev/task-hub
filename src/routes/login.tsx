import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { Shield, KeyRound, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Welcome back, operator");
    nav({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden border-r border-border">
        <div className="absolute inset-0 cyber-grid opacity-20 -z-10" />
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-glow)" }} />
        <Link to="/"><Logo tagline /></Link>
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-cyber-cyan text-xs font-mono uppercase tracking-widest mb-3">
            <Shield className="size-4" /> Secure Access
          </div>
          <h2 className="text-3xl font-bold leading-tight">Welcome back to your cyber command center.</h2>
          <p className="text-muted-foreground mt-3">
            Authenticate to access your assigned Work ID, tasks, and the Kingsley Hub operations dashboard.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Authorized personnel only · all sessions are audit-logged</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md glass-strong rounded-2xl p-8 glow-border">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="text-2xl font-bold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your credentials to continue</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@kingsleyhub.io" className="mt-1.5" />
            </div>
            <div>
              <div className="flex justify-between"><Label htmlFor="pw">Password</Label>
                <Link to="/forgot-password" className="text-xs text-cyber-cyan hover:underline">Forgot?</Link>
              </div>
              <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground shadow-glow">
              {loading ? <Loader2 className="size-4 mr-2 animate-spin" /> : <KeyRound className="size-4 mr-2" />}
              Sign In Securely
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
              Continue with Google
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              No account? <Link to="/register" className="text-cyber-cyan hover:underline">Request access</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
