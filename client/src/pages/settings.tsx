import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Sliders, Bell, Shield, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Settings className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Security Settings</h1>
            <p className="text-blue-200/80 mt-2">Configure your security preferences and integrations</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-400" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="alerts">Real-time Security Alerts</Label>
                <Switch id="alerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="transactions">Transaction Monitoring</Label>
                <Switch id="transactions" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="contracts">Smart Contract Analysis</Label>
                <Switch id="contracts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-400" />
                Security Integration Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="goldsky">Goldsky Integration</Label>
                <Switch id="goldsky" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="phala">Phala TEE Protection</Label>
                <Switch id="phala" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}