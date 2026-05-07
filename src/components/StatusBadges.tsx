import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/40",
  High: "bg-orange-500/15 text-orange-400 border-orange-500/40",
  Medium: "bg-gold/15 text-gold border-gold/40",
  Low: "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40",
  Info: "bg-muted text-muted-foreground border-border",
  Completed: "bg-cyber-green/15 text-cyber-green border-cyber-green/40",
  "In Progress": "bg-cyber-blue/15 text-cyber-blue border-cyber-blue/40",
  "Under Review": "bg-cyber-purple/15 text-cyber-purple border-cyber-purple/40",
  Pending: "bg-muted text-muted-foreground border-border",
  Blocked: "bg-destructive/15 text-destructive border-destructive/40",
  Approved: "bg-cyber-green/15 text-cyber-green border-cyber-green/40",
  "Pending Review": "bg-gold/15 text-gold border-gold/40",
  Draft: "bg-muted text-muted-foreground border-border",
  Rejected: "bg-destructive/15 text-destructive border-destructive/40",
  Restricted: "bg-orange-500/15 text-orange-400 border-orange-500/40",
  Active: "bg-cyber-green/15 text-cyber-green border-cyber-green/40",
  Inactive: "bg-muted text-muted-foreground border-border",
  Installed: "bg-cyber-green/15 text-cyber-green border-cyber-green/40",
  "Lab Only": "bg-cyber-purple/15 text-cyber-purple border-cyber-purple/40",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", colorMap[value] ?? "border-border")}>
      {value}
    </Badge>
  );
}
