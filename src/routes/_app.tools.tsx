import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTools } from "@/hooks/useData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert, Wrench } from "lucide-react";

export const Route = createFileRoute("/_app/tools")({ component: ToolsPage });

function ToolsPage() {
  const { data, loading } = useTools();

  return (
    <div>
      <PageHeader
        title="Cybersecurity Tool Library"
        subtitle="Approved tools curated for authorized SOC, lab, and compliance use."
      />

      <Alert className="mb-5 border-orange-500/40 bg-orange-500/10">
        <ShieldAlert className="size-4 text-orange-400" />
        <AlertTitle className="text-orange-300">Authorized lab use only</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Offensive security tools are restricted to approved labs and internal environments. All tool usage requires admin approval.
        </AlertDescription>
      </Alert>

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(t => (
          <Card key={t.id} className="glass p-5 hover:border-cyber-cyan/50 transition">
            <div className="flex justify-between items-start mb-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-cyber-cyan/20 to-cyber-purple/20 flex items-center justify-center">
                <Wrench className="size-5 text-cyber-cyan" />
              </div>
              <span className="text-xs text-cyber-green border border-cyber-green/40 rounded px-2 py-0.5">{t.status}</span>
            </div>
            <div className="font-semibold">{t.name} <span className="text-xs text-muted-foreground font-normal font-mono">v{t.version}</span></div>
            <div className="text-xs text-cyber-cyan mt-0.5">{t.category}</div>
            <p className="text-sm text-muted-foreground mt-2">{t.description}</p>
            {t.vendor && <div className="text-[11px] text-muted-foreground mt-3">Vendor: {t.vendor}</div>}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
