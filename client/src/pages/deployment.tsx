import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cloud, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeploymentPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Cloud className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Security Deployment</h1>
            <p className="text-blue-200/80 mt-2">Deploy and manage TEE security measures</p>
          </div>
        </div>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <Shield className="h-8 w-8 text-blue-400" />
              Phala TEE Protection
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Deploy your secure computation environment using Phala Network's Trusted Execution Environment (TEE)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-blue-200/80">
                <Lock className="h-5 w-5 text-blue-400" />
                <span>Hardware-level security for transaction monitoring</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200/80">
                <Shield className="h-5 w-5 text-blue-400" />
                <span>Privacy-preserving computation with attestation proof</span>
              </div>
            </div>
            <Button className="cyber-button w-full py-6 text-lg font-semibold">
              <Shield className="h-5 w-5 mr-2" />
              Deploy TEE Environment
            </Button>
            <p className="text-sm text-blue-300/70 text-center">
              Your application will be deployed in a secure TEE environment with verifiable execution guarantees
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}