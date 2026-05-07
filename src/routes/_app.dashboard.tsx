import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadges";
import {
  Users, ListChecks, ShieldAlert, CheckCircle2, Wrench, Code2, Bell, Activity, KeyRound, TrendingUp,
} from "lucide-react";
import { tasks, users, tools, scripts, taskTrend, productivity, auditLogs } from "@/lib/sample-data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function Stat({ icon: Icon, label, value, accent, sub }: any) {
  return (
    <Card className="glass p-5 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 size-24 rounded-full opacity-20" style={{ background: accent }} />
      <div className="flex items-center justify-between">
        <div className={`size-10 rounded-lg flex items-center justify-center`} style={{ background: accent + "30" }}>
          <Icon className="size-5" style={{ color: accent }} />
        </div>
        <TrendingUp className="size-4 text-cyber-green" />
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
        {sub && <div className="text-[11px] text-cyber-green mt-1">{sub}</div>}
      </div>
    </Card>
  );
}

function Dashboard() {
  const completed = tasks.filter(t => t.status === "Completed").length;
  const pending = tasks.filter(t => t.status !== "Completed").length;
  const high = tasks.filter(t => t.priority === "High" || t.priority === "Critical").length;
  const activeWorkIds = users.filter(u => u.status === "Active").length;

  return (
    <div>
      <PageHeader
        title="SOC Operations Dashboard"
        subtitle="Real-time overview of cybersecurity tasks, tools, scripts and audit activity."
        actions={<>
          <Link to="/tasks"><Button variant="outline">View Tasks</Button></Link>
          <Link to="/users"><Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">+ New Operator</Button></Link>
        </>}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Stat icon={Users} label="Total Users" value={users.length} accent="oklch(0.78 0.17 200)" sub="+2 this month" />
        <Stat icon={KeyRound} label="Active Work IDs" value={activeWorkIds} accent="oklch(0.65 0.24 295)" />
        <Stat icon={ListChecks} label="Pending Tasks" value={pending} accent="oklch(0.82 0.14 85)" />
        <Stat icon={CheckCircle2} label="Completed" value={completed} accent="oklch(0.78 0.2 145)" />
        <Stat icon={ShieldAlert} label="High Priority" value={high} accent="oklch(0.65 0.24 22)" />
        <Stat icon={Wrench} label="Tools Installed" value={tools.length} accent="oklch(0.7 0.2 255)" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 mt-3">
        <Stat icon={Code2} label="Scripts Available" value={scripts.length} accent="oklch(0.78 0.17 200)" />
        <Stat icon={Bell} label="Security Alerts (24h)" value={3} accent="oklch(0.65 0.24 22)" sub="2 contained" />
        <Stat icon={Activity} label="Recent Activity (24h)" value={auditLogs.length} accent="oklch(0.65 0.24 295)" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="glass p-5 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="font-semibold">Task Throughput</div>
              <div className="text-xs text-muted-foreground">Completed vs created — last 7 days</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={taskTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.17 200)" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="oklch(0.78 0.17 200)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.65 0.24 295)" stopOpacity={0.6}/>
                  <stop offset="100%" stopColor="oklch(0.65 0.24 295)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.04 262 / 0.4)" />
              <XAxis dataKey="day" stroke="oklch(0.7 0.02 250)" fontSize={11} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.035 262)", border: "1px solid oklch(0.32 0.04 262)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="completed" stroke="oklch(0.78 0.17 200)" fill="url(#g1)" strokeWidth={2} />
              <Area type="monotone" dataKey="created" stroke="oklch(0.65 0.24 295)" fill="url(#g2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="glass p-5">
          <div className="font-semibold">User Productivity</div>
          <div className="text-xs text-muted-foreground mb-4">Score / 100</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={productivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.04 262 / 0.4)" />
              <XAxis dataKey="name" stroke="oklch(0.7 0.02 250)" fontSize={11} />
              <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.035 262)", border: "1px solid oklch(0.32 0.04 262)", borderRadius: 8 }} />
              <Bar dataKey="score" fill="oklch(0.78 0.2 145)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <Card className="glass p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">Active Tasks</div>
            <Link to="/tasks" className="text-xs text-cyber-cyan hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="p-3 rounded-lg border border-border/60 hover:border-cyber-cyan/40 transition">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{t.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-mono">{t.id} · {t.assignee} · {t.workId}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge value={t.priority} />
                    <StatusBadge value={t.status} />
                  </div>
                </div>
                <Progress value={t.progress} className="mt-3 h-1.5" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass p-5">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">Recent Activity</div>
            <Link to="/audit" className="text-xs text-cyber-cyan hover:underline">Audit logs</Link>
          </div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {auditLogs.slice(0, 8).map((l, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/40 transition">
                <div className="size-2 rounded-full bg-cyber-cyan mt-2 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{l.event} <span className="text-muted-foreground">— {l.detail}</span></div>
                  <div className="text-[11px] text-muted-foreground font-mono">{l.ts} · {l.user}</div>
                </div>
                <StatusBadge value={l.severity} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
