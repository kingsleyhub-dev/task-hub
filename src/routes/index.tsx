import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  Shield, KeyRound, ClipboardCheck, Wrench, GraduationCap,
  ScrollText, FileLock, ArrowRight, CheckCircle2,
} from "lucide-react";
import heroBg from "@/assets/cyber-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberTaskOps — Secure Cybersecurity Operations Platform | Kingsley Hub" },
      { name: "description", content: "Kingsley Hub CyberTaskOps: assign Work IDs, manage cybersecurity tasks, tools, scripts and CEH resources for authorized SOC and security teams." },
      { property: "og:title", content: "CyberTaskOps — Kingsley Hub" },
      { property: "og:description", content: "Premium cybersecurity work assignment & operations platform." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: KeyRound, title: "Work ID Management", desc: "Issue unique Work IDs to every analyst, lead, and trainee with full lifecycle control." },
  { icon: ClipboardCheck, title: "Cybersecurity Task Assignment", desc: "Assign defensive operations with priority, deadlines, status and audit trails." },
  { icon: Wrench, title: "Tool & Script Library", desc: "Curate approved tools and reviewed scripts with risk labels and usage policies." },
  { icon: GraduationCap, title: "CEH Resource Center", desc: "Structured ethical hacking learning paths, lab assignments and progress tracking." },
  { icon: ScrollText, title: "Audit Logs", desc: "Immutable activity history across users, tasks, tools and admin actions." },
  { icon: FileLock, title: "Secure Reporting", desc: "Executive-grade reports for compliance, performance and SOC operations." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      {/* Top nav */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#ethics" className="hover:text-foreground transition">Ethical Use</a>
            <Link to="/dashboard" className="hover:text-foreground transition">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-primary-foreground hover:opacity-90">
                Get Started <ArrowRight className="ml-1 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={heroBg} alt="" width={1920} height={1080} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        </div>
        <div className="absolute inset-0 cyber-grid opacity-30 -z-10" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-36">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-cyber-cyan mb-6">
            <span className="size-1.5 rounded-full bg-cyber-green animate-pulse" />
            Authorized Cybersecurity Operations Platform
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.05]">
            <span className="text-gradient-cyber">CyberTaskOps</span>
            <br />
            <span className="text-foreground">Secure Work Assignment & Cyber Operations.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Kingsley Hub's enterprise command center for SOC teams, IT security, penetration testing labs and
            compliance — manage cybersecurity tasks, users, tools, scripts and CEH resources in one premium platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground shadow-glow hover:opacity-90">
                Get Started <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="border-cyber-cyan/40 text-cyber-cyan hover:bg-cyber-cyan/10">
                View Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            {[
              ["8", "Active Operators"],
              ["12", "Active Tasks"],
              ["10", "Approved Tools"],
              ["99.97%", "Audit Integrity"],
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-xl p-4">
                <div className="text-2xl font-bold text-gradient-cyber">{v}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs font-mono text-cyber-cyan uppercase tracking-widest mb-2">Capabilities</div>
            <h2 className="text-3xl md:text-4xl font-bold">A complete cybersecurity command surface</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              Everything your SOC, red-team lab, or compliance group needs to coordinate authorized cybersecurity work.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-cyber-cyan/40 transition group">
                <div className="size-10 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition">
                  <f.icon className="size-5 text-cyber-cyan" />
                </div>
                <div className="font-semibold text-lg">{f.title}</div>
                <p className="text-sm text-muted-foreground mt-1.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ethics */}
      <section id="ethics" className="py-20 border-t border-border/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-strong rounded-2xl p-8 md:p-10 glow-border">
            <div className="flex items-center gap-3 text-cyber-green mb-4">
              <Shield className="size-5" />
              <span className="font-semibold uppercase text-xs tracking-widest">Ethical Use Policy</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Defensive, ethical and authorized — by design.</h2>
            <ul className="grid md:grid-cols-2 gap-3 text-sm">
              {[
                "Use only on systems you own or are explicitly authorized to test.",
                "Offensive tools restricted to approved labs and internal environments.",
                "Every script and tool requires admin review before production use.",
                "All activity is logged in immutable audit trails.",
                "No unauthorized exploitation, credential theft or destructive automation.",
                "CEH content is educational and aligned with legal and ethical frameworks.",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="size-4 text-cyber-green shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4 text-sm">
          <Logo tagline />
          <div className="text-muted-foreground">© 2026 Kingsley Hub. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
