import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useData";
import { Bell, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/notifications")({ component: NotificationsPage });

function NotificationsPage() {
  const { data, loading } = useNotifications();

  async function markRead(id: string) {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
    if (error) toast.error(error.message);
  }

  return (
    <div>
      <PageHeader title="Notifications" subtitle="Alerts, task updates, and system messages." />
      <div className="space-y-2">
        {loading && <Card className="glass p-6 text-center text-muted-foreground">Loading…</Card>}
        {!loading && data.length === 0 && (
          <Card className="glass p-10 text-center">
            <Bell className="size-8 text-cyber-cyan mx-auto mb-3" />
            <div className="font-semibold">All caught up</div>
            <div className="text-sm text-muted-foreground mt-1">You have no notifications.</div>
          </Card>
        )}
        {data.map(n => (
          <Card key={n.id} className={`glass p-4 flex justify-between items-start gap-4 ${n.read ? "opacity-60" : ""}`}>
            <div className="flex gap-3 min-w-0">
              <Bell className="size-4 text-cyber-cyan mt-1 shrink-0" />
              <div className="min-w-0">
                <div className="font-medium text-sm">{n.title}</div>
                <div className="text-sm text-muted-foreground">{n.body}</div>
                <div className="text-[11px] text-muted-foreground font-mono mt-1">{new Date(n.created_at).toLocaleString()}</div>
              </div>
            </div>
            {!n.read && (
              <Button size="sm" variant="outline" onClick={() => markRead(n.id)}>
                <CheckCircle2 className="size-3.5 mr-1" /> Mark read
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
