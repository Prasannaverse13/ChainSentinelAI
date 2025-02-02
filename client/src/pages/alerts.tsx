import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AlertsPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Bell className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Security Alerts</h1>
            <p className="text-blue-200/80 mt-2">Monitor and respond to security notifications</p>
          </div>
        </div>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-green-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200/80">All systems operational</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* This will be populated with actual alerts */}
          <p className="text-blue-200/80">No active alerts at this time</p>
        </div>
      </div>
    </Layout>
  );
}
