import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure organization, security policies, Work ID format and preferences." />
      <Tabs defaultValue="org" className="w-full">
        <TabsList className="glass">
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="workid">Work ID</TabsTrigger>
          <TabsTrigger value="notif">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="org">
          <Card className="glass p-6 space-y-4 max-w-2xl">
            <div><Label>Organization name</Label><Input className="mt-1.5" defaultValue="Kingsley Hub" /></div>
            <div><Label>Primary domain</Label><Input className="mt-1.5" defaultValue="kingsleyhub.io" /></div>
            <div><Label>Audit log retention (days)</Label><Input type="number" className="mt-1.5" defaultValue={365} /></div>
            <Button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-primary-foreground">Save</Button>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="glass p-6 max-w-2xl">
            <div className="space-y-3">
              {["Super Admin","Admin","Team Lead","Security Analyst","Student/Trainee","Viewer"].map(r => (
                <div key={r} className="flex justify-between items-center p-3 rounded-lg border border-border/60">
                  <div className="font-medium">{r}</div>
                  <Button size="sm" variant="outline">Edit permissions</Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="glass p-6 max-w-2xl space-y-4">
            {[
              ["Two-factor authentication", "Require 2FA for all admin accounts"],
              ["Account lockout", "Lock account after 5 failed attempts"],
              ["Session timeout (30 min)", "Sign out idle sessions automatically"],
              ["Password HIBP check", "Block passwords found in known breach databases"],
            ].map(([title, desc]) => (
              <div key={title} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{title}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
                <Switch defaultChecked />
              </div>
            ))}
          </Card>
        </TabsContent>

        <TabsContent value="workid">
          <Card className="glass p-6 max-w-2xl space-y-4">
            <div><Label>Work ID prefix</Label><Input className="mt-1.5" defaultValue="KH-" /></div>
            <div><Label>Work ID length</Label><Input type="number" className="mt-1.5" defaultValue={4} /></div>
            <p className="text-xs text-muted-foreground">Example: <span className="font-mono text-cyber-cyan">KH-0001</span></p>
          </Card>
        </TabsContent>

        <TabsContent value="notif">
          <Card className="glass p-6 max-w-2xl space-y-4">
            {["Task assignment","Deadline reminders","Security alerts","Admin announcements"].map(n => (
              <div key={n} className="flex justify-between items-center">
                <div className="font-medium">{n}</div>
                <Switch defaultChecked />
              </div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
