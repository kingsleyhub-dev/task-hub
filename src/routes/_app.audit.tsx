import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuditLogs } from "@/hooks/useData";
import { StatusBadge } from "@/components/StatusBadges";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app/audit")({ component: AuditPage });

function AuditPage() {
  const { isAdmin } = useAuth();
  const { data, loading } = useAuditLogs(200);
  const [q, setQ] = useState("");

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Audit Logs" subtitle="Restricted view." />
        <Card className="glass p-8 text-center text-muted-foreground">
          You need administrator privileges to view audit logs.
        </Card>
      </div>
    );
  }

  const filtered = data.filter(l =>
    !q || l.event.toLowerCase().includes(q.toLowerCase()) ||
    (l.detail ?? "").toLowerCase().includes(q.toLowerCase()) ||
    (l.user?.name ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Immutable record of every login, task change, tool update and admin action." />
      <Card className="glass p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search events…" className="pl-9" />
        </div>
      </Card>
      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No audit events.</TableCell></TableRow>}
            {filtered.map((l) => (
              <TableRow key={l.id} className="border-border/60 hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                <TableCell className="text-sm">{l.user?.name ?? "system"} {l.user?.work_id && <span className="text-muted-foreground font-mono">· {l.user.work_id}</span>}</TableCell>
                <TableCell className="text-sm font-medium">{l.event}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{l.detail}</TableCell>
                <TableCell><StatusBadge value={l.severity} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
