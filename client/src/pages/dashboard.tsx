import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import { Shield, Activity, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Shield className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Security Dashboard</h1>
            <p className="text-blue-200/80 mt-2">Real-time monitoring and security status</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-400" />
                Wallet Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200/80">No suspicious activity detected</p>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-200/80">0 pending alerts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
