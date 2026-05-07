import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code2, ShieldAlert, Plus, Eye, Download } from "lucide-react";
import { scripts } from "@/lib/sample-data";
import { StatusBadge } from "@/components/StatusBadges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/scripts")({ component: ScriptsPage });

function ScriptsPage() {
  return (
    <div>
      <PageHeader
        title="Script Repository"
        subtitle="Reviewed and approved scripts for monitoring, hardening, automation and reporting."
        actions={<Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">
          <Plus className="size-4 mr-1.5" /> Upload Script
        </Button>}
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
              <TableHead>Env</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scripts.map(s => (
              <TableRow key={s.id} className="border-border/60 hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Code2 className="size-4 text-cyber-cyan" />
                    <div>
                      <div className="font-mono text-sm">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.id} · v{s.version}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{s.lang}</TableCell>
                <TableCell className="text-sm">{s.category}</TableCell>
                <TableCell className="text-sm">{s.author}</TableCell>
                <TableCell><StatusBadge value={s.env} /></TableCell>
                <TableCell><StatusBadge value={s.status} /></TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{s.updated}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost"><Eye className="size-4" /></Button>
                    <Button size="icon" variant="ghost"><Download className="size-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
