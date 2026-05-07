import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { tools } from "@/lib/sample-data";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_app/installation")({ component: Install });

function Install() {
  return (
    <div>
      <PageHeader
        title="Installation Guides"
        subtitle="Structured, admin-curated installation documentation for approved cybersecurity tools."
      />
      <Alert className="mb-5 border-cyber-cyan/40 bg-cyber-cyan/10">
        <BookOpen className="size-4 text-cyber-cyan" />
        <AlertTitle className="text-cyber-cyan">Internal documentation</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          Installation steps must be authored by an approved admin. Placeholders below are for documenting internal SOPs only.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-4">
        {tools.slice(0, 6).map(t => (
          <Card key={t.id} className="glass p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{t.name} <span className="text-xs text-muted-foreground">— {t.os}</span></div>
                <div className="text-xs text-cyber-cyan mt-0.5">{t.category}</div>
              </div>
              <Button size="sm" variant="outline">Edit Guide</Button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Prerequisites</div>
              <div className="text-muted-foreground">— Approved by admin · Lab/internal environment only</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-3">Verification checklist</div>
              <ul className="space-y-1.5">
                {["Service health check", "Configuration review", "Audit log enabled"].map(c => (
                  <li key={c} className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-3.5 text-cyber-green" /> {c}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
