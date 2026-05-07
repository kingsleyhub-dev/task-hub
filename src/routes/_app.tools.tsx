import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadges";
import { tools } from "@/lib/sample-data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Plus, ExternalLink, Wrench } from "lucide-react";

export const Route = createFileRoute("/_app/tools")({ component: ToolsPage });

function ToolsPage() {
  return (
    <div>
      <PageHeader
        title="Cybersecurity Tool Library"
        subtitle="Approved tools curated for authorized SOC, lab, and compliance use."
        actions={<Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">
          <Plus className="size-4 mr-1.5" /> Add Tool
        </Button>}
      />

      <Alert className="mb-5 border-orange-500/40 bg-orange-500/10">
        <ShieldAlert className="size-4 text-orange-400" />
        <AlertTitle className="text-orange-300">Authorized lab use only</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Offensive security tools are restricted to approved labs and internal environments. All tool usage requires admin approval.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map(t => (
          <Card key={t.id} className="glass p-5 hover:border-cyber-cyan/50 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center">
                <Wrench className="size-5 text-cyber-cyan" />
              </div>
              <StatusBadge value={t.approval} />
            </div>
            <div className="font-semibold">{t.name} <span className="text-xs text-muted-foreground font-normal font-mono">v{t.version}</span></div>
            <div className="text-xs text-cyber-cyan mt-0.5">{t.category}</div>
            <p className="text-sm text-muted-foreground mt-2">{t.purpose}</p>
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
              <div><span className="text-muted-foreground">OS:</span> {t.os}</div>
              <div><span className="text-muted-foreground">Risk:</span> <StatusBadge value={t.risk} /></div>
              <div className="col-span-2"><span className="text-muted-foreground">Status:</span> <StatusBadge value={t.status} /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1"><ExternalLink className="size-3.5 mr-1" /> Docs</Button>
              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
