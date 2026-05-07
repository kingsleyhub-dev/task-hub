import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code2, ShieldAlert, Plus, Check, X } from "lucide-react";
import { useScripts } from "@/hooks/useData";
import { StatusBadge } from "@/components/StatusBadges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logEvent } from "@/hooks/useData";

export const Route = createFileRoute("/_app/scripts")({ component: ScriptsPage });

function ScriptsPage() {
  const { data, loading } = useScripts();
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", language: "Python", category: "", description: "", content: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submitScript() {
    if (!user) return;
    if (!form.name.trim() || !form.content.trim()) return toast.error("Name and content are required");
    setSubmitting(true);
    const { error } = await supabase.from("scripts").insert({
      ...form, author_id: user.id, approval_status: "Pending Review",
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Submitted for review");
    setOpen(false);
    setForm({ name: "", language: "Python", category: "", description: "", content: "" });
  }

  async function decide(id: string, name: string, status: "Approved" | "Rejected") {
    const notes = status === "Rejected" ? prompt("Reason for rejection (optional):") ?? "" : "";
    const { error } = await supabase.from("scripts").update({
      approval_status: status,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
      review_notes: notes || null,
    }).eq("id", id);
    if (error) return toast.error(error.message);
    await logEvent(user?.id, `script.${status.toLowerCase()}`, `${status} script "${name}"`, "Medium");
    toast.success(`Script ${status.toLowerCase()}`);
  }

  return (
    <div>
      <PageHeader
        title="Script Repository"
        subtitle="Reviewed and approved scripts for monitoring, hardening, automation and reporting."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyber-cyan to-cyber-blue text-primary-foreground">
                <Plus className="size-4 mr-1" /> Submit script
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader><DialogTitle>Submit script for review</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div><Label>Language</Label><Input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></div>
                </div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>Content</Label><Textarea rows={10} className="font-mono text-xs" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={submitScript} disabled={submitting}>Submit for review</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Alert className="mb-5 border-cyber-purple/40 bg-cyber-purple/10">
        <ShieldAlert className="size-4 text-cyber-purple" />
        <AlertTitle className="text-cyber-purple">Approval workflow</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Submissions enter <b>Pending Review</b>. Admins are notified and can <b>Approve</b> or <b>Reject</b>. Authors are notified of the decision.
        </AlertDescription>
      </Alert>

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Script</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              {isAdmin && <TableHead className="text-right">Review</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && data.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No scripts in repository.</TableCell></TableRow>}
            {data.map(s => (
              <TableRow key={s.id} className="border-border/60 hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-cyber-cyan" />
                    <div>
                      <div className="font-mono text-sm">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{s.language ?? "—"}</TableCell>
                <TableCell className="text-sm">{s.category ?? "—"}</TableCell>
                <TableCell className="text-sm">{s.author?.name ?? "—"}</TableCell>
                <TableCell><StatusBadge value={s.approval_status} /></TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                    {s.approval_status === "Pending Review" ? (
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" className="border-cyber-green/40 text-cyber-green hover:bg-cyber-green/10" onClick={() => decide(s.id, s.name, "Approved")}>
                          <Check className="size-3.5" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => decide(s.id, s.name, "Rejected")}>
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
