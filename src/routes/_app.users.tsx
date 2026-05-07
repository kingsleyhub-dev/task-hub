import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadges";
import { users } from "@/lib/sample-data";
import { Search, Download, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/_app/users")({ component: UsersPage });

function UsersPage() {
  return (
    <div>
      <PageHeader
        title="Users & Work IDs"
        subtitle="Manage operators, assign Work IDs, configure roles and track activity."
        actions={<>
          <Button variant="outline"><Download className="size-4 mr-1.5" /> Export</Button>
          <Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground"><Plus className="size-4 mr-1.5" /> Add User</Button>
        </>}
      />

      <Card className="glass p-4 mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search by name, email or Work ID…" className="pl-9" />
          </div>
          <Button variant="outline">All Roles</Button>
          <Button variant="outline">All Departments</Button>
          <Button variant="outline">Status</Button>
        </div>
      </Card>

      <Card className="glass overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead>Operator</TableHead>
              <TableHead>Work ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id} className="border-border/60 hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {u.name.split(" ").map(p=>p[0]).join("").slice(0,2)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="font-mono text-cyber-cyan text-sm">{u.workId}</span></TableCell>
                <TableCell className="text-sm">{u.role}</TableCell>
                <TableCell className="text-sm">{u.department}</TableCell>
                <TableCell className="text-sm">{u.completed}/{u.assigned}</TableCell>
                <TableCell>
                  <span className={`text-sm font-mono ${u.riskScore > 15 ? "text-orange-400" : "text-cyber-green"}`}>
                    {u.riskScore}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">{u.lastLogin}</TableCell>
                <TableCell><StatusBadge value={u.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
