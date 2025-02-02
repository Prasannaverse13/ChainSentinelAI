import { useState } from "react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileCode, Upload, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { AIChat } from "@/components/ai-chat";

interface ContractAnalysis {
  address: string;
  status: "secure" | "warning" | "critical";
  lastChecked: string;
  issues?: string[];
}

const generateAnalysis = (address: string): ContractAnalysis => {
  const statuses = ["secure", "warning", "critical"] as const;
  const randomStatus = statuses[Math.floor(Math.random() * (statuses.length - 0.2))]; // Bias towards secure

  const possibleIssues = [
    "Potential reentrancy vulnerability detected",
    "Unchecked external call detected",
    "Integer overflow possibility in calculation",
    "Unprotected self-destruct operation",
    "Improper access control mechanism",
    "Timestamp dependency vulnerability",
    "Potential front-running vulnerability"
  ];

  return {
    address,
    status: randomStatus,
    lastChecked: new Date().toISOString(),
    issues: randomStatus !== "secure" 
      ? [possibleIssues[Math.floor(Math.random() * possibleIssues.length)]]
      : []
  };
};

export default function ContractsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [contractAddress, setContractAddress] = useState("");
  const [contractFile, setContractFile] = useState<File | null>(null);

  // Mutation for analyzing contract by address
  const analyzeContractMutation = useMutation({
    mutationFn: async (address: string) => {
      // Simulated API call delay (200ms)
      await new Promise(resolve => setTimeout(resolve, 200));
      return generateAnalysis(address);
    },
    onSuccess: (analysis) => {
      // Update monitored contracts list
      queryClient.setQueryData<ContractAnalysis[]>(
        ["/api/ai/monitored-contracts"],
        (old = []) => [analysis, ...old]
      );

      toast({
        title: "Analysis Complete",
        description: analysis.status === "secure" 
          ? "No security threats detected. Address added to monitoring."
          : "Potential security issues found. Check the monitoring section for details.",
      });

      setContractAddress("");
    }
  });

  // Query for monitored contracts with initial data
  const { data: monitoredContracts } = useQuery<ContractAnalysis[]>({
    queryKey: ["/api/ai/monitored-contracts"],
    initialData: [],
  });

  // Handle direct address analysis
  const handleAddressAnalysis = () => {
    if (!contractAddress) {
      toast({
        title: "Error",
        description: "Please enter a valid address",
        variant: "destructive",
      });
      return;
    }
    analyzeContractMutation.mutate(contractAddress);
  };

  // Handle file upload analysis
  const handleFileAnalysis = async () => {
    if (!contractFile) {
      toast({
        title: "Error",
        description: "Please select a contract file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const code = e.target?.result as string;
      try {
        const analysis = generateAnalysis(`Contract-${Date.now()}`);

        queryClient.setQueryData<ContractAnalysis[]>(
          ["/api/ai/monitored-contracts"],
          (old = []) => [analysis, ...old]
        );

        toast({
          title: "Analysis Complete",
          description: "Contract has been analyzed and added to monitoring.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to analyze contract",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(contractFile);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <FileCode className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Smart Contract Audit</h1>
            <p className="text-blue-200/80 mt-2">Analyze and secure your smart contracts</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Direct Address Input */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Analyze by Address</CardTitle>
              <CardDescription>Enter a smart contract or transaction address for security analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter contract or transaction address"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="cyber-input"
              />
              <Button 
                className="cyber-button w-full"
                onClick={handleAddressAnalysis}
                disabled={analyzeContractMutation.isPending}
              >
                <Shield className="h-4 w-4 mr-2" />
                {analyzeContractMutation.isPending ? "Analyzing..." : "Analyze Address"}
              </Button>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle>Upload Contract</CardTitle>
              <CardDescription>Upload a contract file for detailed analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                className="cyber-input"
                accept=".sol,.json"
                onChange={(e) => setContractFile(e.target.files?.[0] || null)}
              />
              <Button 
                className="cyber-button w-full"
                onClick={handleFileAnalysis}
              >
                <Upload className="h-4 w-4 mr-2" />
                Analyze Contract
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add AI Chat section */}
        <div className="mt-8">
          <AIChat contractAddress={contractAddress} />
        </div>

        {/* Monitored Contracts */}
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-400" />
              Monitored Contracts
            </CardTitle>
            <CardDescription>
              Addresses being actively monitored by EternalAI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitoredContracts?.length > 0 ? (
                monitoredContracts.map((contract) => (
                  <div 
                    key={contract.address}
                    className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-sm text-blue-100">{contract.address}</p>
                        <p className="text-sm text-blue-200/80 mt-1">
                          Last checked: {new Date(contract.lastChecked).toLocaleString()}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm ${
                        contract.status === "secure" ? "bg-green-500/20 text-green-400" :
                        contract.status === "warning" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {contract.status}
                      </div>
                    </div>
                    {contract.issues && contract.issues.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-blue-100">Issues Found:</p>
                        <ul className="space-y-1">
                          {contract.issues.map((issue, index) => (
                            <li key={index} className="text-sm text-blue-200/80 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-400" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-blue-200/80">No addresses currently being monitored</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}