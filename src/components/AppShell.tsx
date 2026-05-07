import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Logo } from "./Logo";
import {
  LayoutDashboard, Users, ListChecks, Wrench, Code2, GraduationCap,
  BookOpen, ScrollText, FileBarChart, Bell, Settings, Search, Shield, LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/users", label: "Users & Work IDs", icon: Users },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/tools", label: "Tool Library", icon: Wrench },
  { to: "/scripts", label: "Script Repository", icon: Code2 },
  { to: "/ceh", label: "CEH Resource Center", icon: GraduationCap },
  { to: "/installation", label: "Installation Guides", icon: BookOpen },
  { to: "/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/"><Logo /></Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
          {nav.map((n) => {
            const active = location.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-sidebar-accent text-cyber-cyan shadow-[inset_0_0_0_1px_oklch(0.78_0.17_200/0.4)]"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="size-4" />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="glass rounded-lg p-3 text-xs">
            <div className="flex items-center gap-2 text-cyber-green">
              <Shield className="size-3.5" />
              <span className="font-semibold">Authorized Operations</span>
            </div>
            <p className="text-muted-foreground mt-1 leading-snug">
              Defensive & ethical use only. All activity is logged.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border glass-strong sticky top-0 z-30 flex items-center gap-4 px-4 md:px-6">
          <div className="md:hidden"><Logo size={28} withText={false} /></div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search tasks, users, tools…" className="pl-9 bg-input/50 border-border" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex border-cyber-green/40 text-cyber-green">
              <span className="size-1.5 rounded-full bg-cyber-green mr-1.5 animate-pulse" />
              SOC Online
            </Badge>
            <Link to="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 size-2 rounded-full bg-cyber-purple" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-xs font-bold text-primary-foreground">
                AO
              </div>
              <div className="hidden lg:block text-xs leading-tight">
                <div className="font-semibold">Adaeze Okafor</div>
                <div className="text-muted-foreground">KH-0001 · Super Admin</div>
              </div>
            </div>
            <Link to="/"><Button variant="ghost" size="icon"><LogOut className="size-4" /></Button></Link>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-border px-6 py-3 text-xs text-muted-foreground flex justify-between items-center">
          <span>© 2026 Kingsley Hub — CyberTaskOps. Authorized cybersecurity operations only.</span>
          <span className="font-mono text-cyber-cyan/70">v1.0 · build 0507</span>
        </footer>
      </div>
    </div>
  );
}
