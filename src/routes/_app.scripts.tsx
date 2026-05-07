import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code2, ShieldAlert } from "lucide-react";
import { useScripts } from "@/hooks/useData";
import { StatusBadge } from "@/components/StatusBadges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/scripts")({ component: ScriptsPage });

function ScriptsPage() {
  const { data, loading } = useScripts();

  return (
    <div>
      <PageHeader
        title="Script Repository"
        subtitle="Reviewed and approved scripts for monitoring, hardening, automation and reporting."
      />

      <Alert className="mb-5 border-cyber-purple/40 bg-cyber-purple/10">
        <ShieldAlert className="size-4 text-cyber-purple" />
        <AlertTitle className="text-cyber-purple">Approval required</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Scripts must only be used in authorized environments. All scripts require admin review before production use.
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>}
            {!loading && data.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No scripts in repository.</TableCell></TableRow>}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
