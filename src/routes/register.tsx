import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const nav = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("Security Operations");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, name, department);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Account created. Your Work ID has been assigned.");
    nav({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8 glow-border">
        <Logo />
        <h1 className="text-2xl font-bold mt-6">Request access</h1>
        <p className="text-sm text-muted-foreground mt-1">Your Work ID will be auto-assigned (KH-####).</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label>Full name</Label><Input required value={name} onChange={(e)=>setName(e.target.value)} className="mt-1.5" placeholder="Jane Doe" /></div>
          <div><Label>Email</Label><Input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1.5" placeholder="jane@kingsleyhub.io" /></div>
          <div><Label>Department</Label><Input value={department} onChange={(e)=>setDepartment(e.target.value)} className="mt-1.5" placeholder="SOC / IR / CEH Lab" /></div>
          <div><Label>Password</Label><Input required type="password" minLength={8} value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1.5" /></div>
          <Button disabled={loading} className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">
            {loading && <Loader2 className="size-4 mr-2 animate-spin" />} Create Account
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => signInWithGoogle()}>
            Continue with Google
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-cyber-cyan hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
