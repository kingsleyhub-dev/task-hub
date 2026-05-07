import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cehTopics } from "@/lib/sample-data";
import { GraduationCap, BookMarked, FlaskConical, Trophy, Scale } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/_app/ceh")({ component: CehPage });

function CehPage() {
  return (
    <div>
      <PageHeader
        title="CEH Resource Center"
        subtitle="Ethical hacking learning paths, lab assignments and progress tracking."
      />

      <Alert className="mb-5 border-cyber-cyan/40 bg-cyber-cyan/10">
        <Scale className="size-4 text-cyber-cyan" />
        <AlertTitle className="text-cyber-cyan">Educational & ethical content only</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          All CEH material is for authorized lab practice and certification preparation. Only test systems you own or are explicitly authorized to test.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: BookMarked, label: "Topics", value: 12 },
          { icon: FlaskConical, label: "Lab Assignments", value: 24 },
          { icon: Trophy, label: "Quizzes Passed", value: 8 },
          { icon: GraduationCap, label: "Avg Progress", value: "53%" },
        ].map(s => (
          <Card key={s.label} className="glass p-4 flex items-center gap-3">
            <div className="size-10 rounded-lg bg-cyber-cyan/15 flex items-center justify-center">
              <s.icon className="size-5 text-cyber-cyan" />
            </div>
            <div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {cehTopics.map(t => (
          <Card key={t.id} className="glass p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-xs font-mono text-cyber-cyan">{t.id}</div>
                <div className="font-semibold">{t.title}</div>
              </div>
              <Button size="sm" variant="outline">Open</Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">{t.completed} / {t.lessons} lessons completed</div>
            <Progress value={t.progress} className="mt-2 h-2" />
          </Card>
        ))}
      </div>
    </div>
  );
}
