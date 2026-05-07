import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadges";
import { useProfiles } from "@/hooks/useData";
import { Search, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

function UsersPage() {
  const { data, loading } = useProfiles();
  const [q, setQ] = useState("");
  const filtered = data.filter(u =>
    !q || u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase()) ||
    (u.work_id ?? "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Users & Work IDs"
        subtitle="Manage operators, assigned Work IDs, departments and activity."
        actions={<Button variant="outline"><Download className="size-4 mr-1.5" /> Export</Button>}
      />

      <Card className="glass p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name, email or Work ID…" className="pl-9" />
          </div>
        </div>
      </Card>

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Operator</TableHead>
              <TableHead>Work ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No operators found.</TableCell></TableRow>}
            {filtered.map(u => (
              <TableRow key={u.id} className="border-border/60 hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {u.name.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase() || "OP"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{u.name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="font-mono text-cyber-cyan text-sm">{u.work_id ?? "—"}</span></TableCell>
                <TableCell className="text-sm">{u.department ?? "—"}</TableCell>
                <TableCell>
                  <span className={`text-sm font-mono ${u.risk_score > 15 ? "text-orange-400" : "text-cyber-green"}`}>
                    {u.risk_score}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{u.last_login ? new Date(u.last_login).toLocaleString() : "—"}</TableCell>
                <TableCell><StatusBadge value={u.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
