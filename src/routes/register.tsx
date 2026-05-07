import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import { FormEvent } from "react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const nav = useNavigate();
  function submit(e: FormEvent) { e.preventDefault(); nav({ to: "/dashboard" }); }
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md glass-strong rounded-2xl p-8 glow-border">
        <Logo />
        <h1 className="text-2xl font-bold mt-6">Request access</h1>
        <p className="text-sm text-muted-foreground mt-1">Admin will assign your Work ID after approval.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div><Label>Full name</Label><Input className="mt-1.5" defaultValue="" placeholder="Jane Doe" /></div>
          <div><Label>Email</Label><Input className="mt-1.5" type="email" placeholder="jane@kingsleyhub.io" /></div>
          <div><Label>Department</Label><Input className="mt-1.5" placeholder="SOC / IR / CEH Lab" /></div>
          <div><Label>Password</Label><Input className="mt-1.5" type="password" /></div>
          <Button className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">Submit Request</Button>
          <p className="text-xs text-muted-foreground text-center">
            Already have an account? <Link to="/login" className="text-cyber-cyan hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
