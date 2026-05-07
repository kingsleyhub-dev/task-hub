import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadges";
import { tasks } from "@/lib/sample-data";
import { Plus, Search, Calendar } from "lucide-react";

export const Route = createFileRoute("/_app/tasks")({ component: TasksPage });

const groups = ["Pending", "In Progress", "Under Review", "Completed", "Blocked"] as const;

function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Cybersecurity Task Assignment"
        subtitle="Assign authorized, ethical and defensive cybersecurity tasks to operators."
        actions={<Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">
          <Plus className="size-4 mr-1.5" /> New Task
        </Button>}
      />

      <Card className="glass p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search tasks…" className="pl-9" />
          </div>
          <Button variant="outline">Category</Button>
          <Button variant="outline">Priority</Button>
          <Button variant="outline">Assignee</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
        {groups.map(g => {
          const list = tasks.filter(t => t.status === g);
          return (
            <div key={g} className="glass rounded-2xl p-3">
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="text-sm font-semibold">{g}</div>
                <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">{list.length}</span>
              </div>
              <div className="space-y-2 mt-2">
                {list.map(t => (
                  <div key={t.id} className="rounded-lg p-3 bg-card/60 border border-border/60 hover:border-cyber-cyan/50 transition">
                    <div className="flex justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[11px] text-cyber-cyan">{t.id}</span>
                      <StatusBadge value={t.priority} />
                    </div>
                    <div className="text-sm font-medium leading-snug">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{t.category}</div>
                    <Progress value={t.progress} className="h-1 mt-3" />
                    <div className="flex justify-between items-center mt-3 text-[11px] text-muted-foreground">
                      <span>{t.assignee.split(" ")[0]} · {t.workId}</span>
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{t.deadline.slice(5)}</span>
                    </div>
                  </div>
                ))}
                {list.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-6">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
