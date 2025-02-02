import { Layout } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Flag, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { getTransactionHistory, type Transaction } from "@/lib/blockchain-monitor";
import { ethers } from "ethers";

export default function TransactionsPage() {
  const { toast } = useToast();

  // Query for transaction history
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/blockchain/transactions'],
    queryFn: async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return await getTransactionHistory(address);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }
    },
    enabled: typeof window !== 'undefined' && !!window.ethereum,
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <History className="h-12 w-12 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold cyber-glow">Transaction Monitor</h1>
            <p className="text-blue-200/80 mt-2">Track and analyze your blockchain transactions</p>
          </div>
        </div>

        <Card className="cyber-card">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-blue-200/80">Loading transactions...</p>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.hash} className="cyber-card p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-blue-300">
                          From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                        </p>
                        <p className="text-sm text-blue-300">
                          To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-100">{ethers.formatEther(tx.value)} ETH</p>
                        <p className="text-xs text-blue-300/70">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs font-mono text-blue-200/50 truncate max-w-[70%]">
                        {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => {
                          toast({
                            title: "Transaction Details",
                            description: `Hash: ${tx.hash}\nFrom: ${tx.from}\nTo: ${tx.to}`,
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                    {tx.status === 'warning' && (
                      <div className="mt-2 flex items-center gap-2 text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Potential security risk detected</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-blue-200/80">No transactions to display</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}