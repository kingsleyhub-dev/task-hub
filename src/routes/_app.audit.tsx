import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auditLogs } from "@/lib/sample-data";
import { StatusBadge } from "@/components/StatusBadges";
import { Search, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/audit")({ component: AuditPage });

function AuditPage() {
  return (
    <div>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable record of every login, task change, tool update and admin action."
        actions={<Button variant="outline"><Download className="size-4 mr-1.5" /> Export CSV</Button>}
      />
      <Card className="glass p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search events…" className="pl-9" />
          </div>
          <Button variant="outline">User</Button>
          <Button variant="outline">Date range</Button>
          <Button variant="outline">Event type</Button>
          <Button variant="outline">Severity</Button>
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
            {auditLogs.map((l, i) => (
              <TableRow key={i} className="border-border/60 hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">{l.ts}</TableCell>
                <TableCell className="text-sm">{l.user}</TableCell>
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
