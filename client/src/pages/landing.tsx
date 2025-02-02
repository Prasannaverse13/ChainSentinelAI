import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Wallet, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <Card className="cyber-card w-full max-w-4xl">
        <CardContent className="p-12 space-y-12">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-4">
              <Shield className="h-16 w-16 text-blue-400" />
              <h1 className="text-5xl font-bold cyber-glow bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                ChainSentinel
              </h1>
            </div>
            <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
              AI-powered security monitoring for your blockchain transactions and smart contracts on the Mode Network
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="cyber-card p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-blue-100">Real-time Protection</h2>
              <p className="text-blue-200/80">
                Monitor transactions, detect threats, and receive instant alerts powered by advanced AI analysis
              </p>
            </div>
            <div className="cyber-card p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-blue-100">Smart Contract Security</h2>
              <p className="text-blue-200/80">
                Automated auditing and vulnerability detection for your smart contracts
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <Link href="/connect">
              <Button className="cyber-button text-lg px-8 py-6 gap-3">
                <Wallet className="h-5 w-5" />
                Connect Wallet
                <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
