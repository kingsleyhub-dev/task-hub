import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { notifications } from "@/lib/sample-data";
import { Bell, CheckCircle2, AlertTriangle, Wrench, Code2, User, Megaphone, Clock } from "lucide-react";

const iconMap: Record<string, any> = {
  task: CheckCircle2, deadline: Clock, review: Code2, tool: Wrench,
  alert: AlertTriangle, user: User, system: Megaphone,
};

export const Route = createFileRoute("/_app/notifications")({ component: NotifPage });

function NotifPage() {
  return (
    <div>
      <PageHeader title="Notifications" subtitle="Real-time alerts across tasks, tools, scripts and security events." />
      <Card className="glass divide-y divide-border/60">
        {notifications.map(n => {
          const Icon = iconMap[n.type] ?? Bell;
          return (
            <div key={n.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition">
              <div className="size-10 rounded-lg bg-cyber-cyan/15 flex items-center justify-center shrink-0">
                <Icon className="size-5 text-cyber-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.body}</div>
              </div>
              <div className="text-xs text-muted-foreground font-mono shrink-0">{n.time}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
