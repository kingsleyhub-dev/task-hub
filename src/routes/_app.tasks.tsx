import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadges";
import { useTasks, useProfiles, logEvent } from "@/hooks/useData";
import { Plus, Calendar, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tasks")({ component: TasksPage });

const groups = ["Pending", "In Progress", "Under Review", "Completed", "Blocked"] as const;

function TasksPage() {
  const { data: tasks, refresh } = useTasks();
  const { data: operators } = useProfiles();
  const { isAdmin, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Vulnerability Assessment",
    priority: "Medium", assignee_id: "", deadline: "",
  });

  async function createTask() {
    if (!form.title) return toast.error("Title required");
    setSaving(true);
    const code = `T-${Math.floor(1000 + Math.random() * 9000)}`;
    const { error } = await supabase.from("tasks").insert({
      code, title: form.title, description: form.description, category: form.category,
      priority: form.priority as "Low"|"Medium"|"High"|"Critical",
      assignee_id: form.assignee_id || null,
      deadline: form.deadline || null,
      created_by: user?.id ?? null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    await logEvent(user?.id, "task.created", `${code} · ${form.title}`, "Info");
    toast.success("Task created");
    setOpen(false);
    setForm({ ...form, title: "", description: "" });
    refresh();
  }

  async function changeStatus(id: string, status: typeof groups[number]) {
    const progress = status === "Completed" ? 100 : status === "In Progress" ? 50 : status === "Under Review" ? 80 : status === "Blocked" ? 25 : 0;
    const { error } = await supabase.from("tasks").update({ status, progress }).eq("id", id);
    if (error) return toast.error(error.message);
    await logEvent(user?.id, "task.status_changed", `${id.slice(0,8)} → ${status}`);
  }

  return (
    <div>
      <PageHeader
        title="Cybersecurity Task Assignment"
        subtitle="Assign authorized, ethical and defensive cybersecurity tasks to operators."
        actions={
          isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">
                  <Plus className="size-4 mr-1.5" /> New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Assign New Task</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} /></div>
                  <div><Label>Description</Label><Textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Category</Label>
                      <Input value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})} />
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <Select value={form.priority} onValueChange={(v)=>setForm({...form, priority:v})}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          {["Low","Medium","High","Critical"].map(p=> <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Assign to</Label>
                      <Select value={form.assignee_id} onValueChange={(v)=>setForm({...form, assignee_id:v})}>
                        <SelectTrigger><SelectValue placeholder="Operator" /></SelectTrigger>
                        <SelectContent>
                          {operators.map(o => <SelectItem key={o.id} value={o.id}>{o.name} ({o.work_id})</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Deadline</Label><Input type="date" value={form.deadline} onChange={(e)=>setForm({...form, deadline:e.target.value})} /></div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createTask} disabled={saving} className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">
                    {saving && <Loader2 className="size-4 mr-2 animate-spin" />} Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      />

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
                      <span className="font-mono text-[11px] text-cyber-cyan">{t.code ?? t.id.slice(0,8)}</span>
                      <StatusBadge value={t.priority} />
                    </div>
                    <div className="text-sm font-medium leading-snug">{t.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{t.category}</div>
                    <Progress value={t.progress} className="h-1 mt-3" />
                    <div className="flex justify-between items-center mt-3 text-[11px] text-muted-foreground">
                      <span>{t.assignee?.name?.split(" ")[0] ?? "—"} {t.assignee?.work_id ? `· ${t.assignee.work_id}` : ""}</span>
                      {t.deadline && <span className="flex items-center gap-1"><Calendar className="size-3" />{t.deadline.slice(5)}</span>}
                    </div>
                    {(isAdmin || t.assignee_id === user?.id) && (
                      <Select value={t.status} onValueChange={(v)=>changeStatus(t.id, v as typeof groups[number])}>
                        <SelectTrigger className="h-7 mt-2 text-[11px]"><SelectValue/></SelectTrigger>
                        <SelectContent>{groups.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
                {list.length === 0 && <div className="text-xs text-muted-foreground text-center py-6">No tasks</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
