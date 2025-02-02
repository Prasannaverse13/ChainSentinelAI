import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HelpCircle, Book, MessageSquare, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";

export default function SupportPage() {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <HelpCircle className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Support & Documentation</h1>
            <p className="text-blue-200/80 mt-2">Get help and learn about ChainSentinel</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Book className="h-5 w-5 text-blue-400" />
                Documentation
              </CardTitle>
              <CardDescription>
                Learn about ChainSentinel's features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-blue-100">Quick Links</h3>
                <ul className="space-y-2 text-blue-200/80">
                  <li>
                    <a 
                      href="/docs/getting-started" 
                      className="hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      • Getting Started Guide
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/docs/mode-network" 
                      className="hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      • Mode Network Integration
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/docs/security-features" 
                      className="hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      • Security Features Overview
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/docs/contract-monitoring" 
                      className="hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      • Smart Contract Monitoring
                    </a>
                  </li>
                </ul>
              </div>
              <Button className="cyber-button w-full">
                <Book className="h-4 w-4 mr-2" />
                Browse Full Documentation
              </Button>
            </CardContent>
          </Card>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-blue-400" />
                Support
              </CardTitle>
              <CardDescription>
                Get help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-blue-100">Contact Options</h3>
                <ul className="space-y-2 text-blue-200/80">
                  <li>• Technical Support</li>
                  <li>• Security Inquiries</li>
                  <li>• Feature Requests</li>
                  <li>• Bug Reports</li>
                </ul>
              </div>
              <a 
                href="https://x.com/_Prasanna_jo_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="cyber-button w-full">
                  <SiTwitter className="h-4 w-4 mr-2" />
                  Contact Support on X
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}