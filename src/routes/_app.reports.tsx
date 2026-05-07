import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reports } from "@/lib/sample-data";
import { FileBarChart, Download, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/reports")({ component: ReportsPage });

function ReportsPage() {
  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and export executive reports across users, tasks, tools and CEH progress."
        actions={<>
          <Button variant="outline"><Download className="size-4 mr-1.5" /> Export PDF</Button>
          <Button variant="outline"><Download className="size-4 mr-1.5" /> Export CSV</Button>
        </>}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map(r => (
          <Card key={r.id} className="glass p-5 hover:border-cyber-cyan/50 transition">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-cyber-cyan/15 flex items-center justify-center">
                <FileBarChart className="size-5 text-cyber-cyan" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{r.name}</div>
                <div className="text-xs text-cyber-cyan mt-0.5">{r.type}</div>
                <div className="text-xs text-muted-foreground mt-2">Generated {r.generated} · {r.owner}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" className="flex-1"><FileText className="size-3.5 mr-1" /> View</Button>
              <Button size="sm" variant="outline" className="flex-1"><Download className="size-3.5 mr-1" /> PDF</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
