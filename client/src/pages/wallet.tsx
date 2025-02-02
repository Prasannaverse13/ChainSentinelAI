import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Wallet, Shield, Wallet2, Lock } from "lucide-react";
import { connectMetaMask, type WalletConnection } from "@/lib/wallet";
import { getTransactionHistory, type Transaction } from "@/lib/blockchain-monitor";
import { setupSecureMonitoring, getTEEStatus, verifyTEEAttestation } from "@/lib/tee-monitor";
import { ethers } from "ethers";
import { Layout } from "@/components/layout";

interface TransactionStatus {
  status: "pending" | "success" | "failed";
  hash?: string;
}

interface NFT {
  id: string;
  name: string;
  collection: string;
}

export default function WalletPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
  const [transactionData, setTransactionData] = useState("");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { data: teeStatus } = useQuery({
    queryKey: ['/api/tee/status'],
    queryFn: getTEEStatus,
    refetchInterval: 30000
  });

  // Create Crossmint wallet mutation
  const createWalletMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/wallet/create", { email });
      const data = await res.json();
      return { type: "crossmint" as const, ...data };
    },
    onSuccess: (data) => {
      setWalletConnection(data);
      toast({
        title: "Crossmint Wallet Created",
        description: `Your wallet has been created successfully!`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Connect MetaMask handler
  const handleMetaMaskConnect = async () => {
    try {
      const connection = await connectMetaMask();
      setWalletConnection(connection);
      toast({
        title: "MetaMask Connected",
        description: "Successfully connected to MetaMask wallet!",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect to MetaMask",
        variant: "destructive",
      });
    }
  };

  // Transaction mutation
  const createTransactionMutation = useMutation({
    mutationFn: async (data: { address: string; transactionData: string }) => {
      const res = await apiRequest("POST", "/api/wallet/transaction", data);
      return res.json();
    },
    onSuccess: (data) => {
      setTransactionId(data.transactionId);
      toast({
        title: "Transaction Submitted",
        description: "Your transaction has been submitted successfully!",
      });
    },
  });

  // Query transaction status if we have a transaction ID
  const { data: transactionStatus } = useQuery<TransactionStatus>({
    queryKey: ["/api/wallet/transaction", transactionId],
    enabled: !!transactionId,
  });

  // Query NFTs if we have a wallet address
  const { data: nfts } = useQuery<NFT[]>({
    queryKey: ["/api/wallet/nfts", walletConnection?.address],
    enabled: !!walletConnection?.address,
  });

  // Load transaction history and set up monitoring when wallet is connected
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setupMonitoring = async () => {
      if (walletConnection?.address) {
        try {
          // Load transaction history
          const history = await getTransactionHistory(walletConnection.address);
          setTransactions(history);

          // Set up TEE-based monitoring
          cleanup = setupSecureMonitoring(walletConnection.address, (newTx) => {
            setTransactions(prev => [newTx, ...prev]);
            toast({
              title: "New Transaction",
              description: `Secure transaction ${newTx.hash.slice(0, 10)}... detected`,
            });
          });

          toast({
            title: "TEE Protection Active",
            description: "Your transactions are now being monitored in a secure TEE environment",
          });
        } catch (error) {
          console.error('Error setting up TEE monitoring:', error);
          toast({
            title: "Error",
            description: "Failed to initialize secure monitoring",
            variant: "destructive"
          });
        }
      }
    };

    setupMonitoring();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [walletConnection?.address, toast]);

  return (
    <Layout>
      <div className="w-full max-w-2xl mx-auto">
        <Card className="cyber-card">
          <CardHeader className="space-y-4">
            <CardTitle className="flex items-center gap-3 text-3xl font-bold cyber-glow">
              <Shield className="h-10 w-10 text-blue-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                ChainSentinel
              </span>
            </CardTitle>
            <CardDescription className="text-lg text-blue-200/80">
              Connect your wallet to start secure TEE-protected monitoring
            </CardDescription>
            {teeStatus?.isActive && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Lock className="h-4 w-4" />
                <span>TEE Protection Active</span>
                <span className="text-xs text-blue-300">
                  Last verified: {new Date(teeStatus.lastVerified).toLocaleString()}
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-8">
            {!walletConnection ? (
              <div className="space-y-6">
                <Button
                  onClick={handleMetaMaskConnect}
                  className="cyber-button w-full h-12 text-lg font-semibold"
                >
                  <Wallet className="h-6 w-6 mr-2" />
                  Connect MetaMask
                </Button>

                <div className="cyber-divider my-6" />

                <div className="space-y-4">
                  <Input
                    placeholder="Enter your email for Crossmint wallet"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="cyber-input h-12 text-lg"
                  />
                  <Button
                    onClick={() => createWalletMutation.mutate(email)}
                    disabled={!email || createWalletMutation.isPending}
                    className="cyber-button w-full h-12 text-lg font-semibold"
                  >
                    <Wallet2 className="h-6 w-6 mr-2" />
                    {createWalletMutation.isPending ? "Creating..." : "Create Crossmint Wallet"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="cyber-card p-4">
                  <p className="text-blue-300">Connected Wallet ({walletConnection.type})</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-mono text-sm text-blue-100/90">
                      {walletConnection.address.slice(0, 6)}...{walletConnection.address.slice(-4)}
                    </p>
                    <Button
                      variant="ghost"
                      className="text-xs text-blue-400 hover:text-blue-300"
                      onClick={() => {
                        toast({
                          title: "Full Address",
                          description: walletConnection.address,
                        });
                      }}
                    >
                      View Full
                    </Button>
                  </div>
                  <p className="text-xs text-blue-200/70 mt-2">
                    For your privacy, we display a truncated version of your wallet address
                  </p>
                </div>

                {walletConnection.type === "crossmint" && (
                  <div className="space-y-4">
                    <Input
                      placeholder="Enter transaction data"
                      value={transactionData}
                      onChange={(e) => setTransactionData(e.target.value)}
                      className="cyber-input"
                    />
                    <Button
                      onClick={() =>
                        createTransactionMutation.mutate({
                          address: walletConnection.address,
                          transactionData,
                        })
                      }
                      disabled={!transactionData || createTransactionMutation.isPending}
                      className="cyber-button w-full"
                    >
                      Send Transaction
                    </Button>
                  </div>
                )}

                {transactionStatus && (
                  <div className="cyber-card p-4">
                    <p className="text-blue-300">Transaction Status</p>
                    <p className="font-medium text-lg mt-2 capitalize text-blue-100">
                      {transactionStatus.status}
                    </p>
                    {transactionStatus.hash && (
                      <p className="text-sm font-mono mt-2 text-blue-200/70 truncate">
                        {transactionStatus.hash}
                      </p>
                    )}
                  </div>
                )}

                {nfts && nfts.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-blue-200">Your NFTs</p>
                    <div className="grid grid-cols-2 gap-4">
                      {nfts.map((nft) => (
                        <div key={nft.id} className="cyber-card p-4">
                          <p className="font-medium text-blue-100">{nft.name}</p>
                          <p className="text-sm text-blue-300/80 mt-1">
                            Collection: {nft.collection}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                  {transactions.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-xl font-semibold text-blue-200">Recent Transactions</p>
                      <div className="space-y-3">
                        {transactions.map((tx) => (
                          <div key={tx.hash} className="cyber-card p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm text-blue-300">From: {tx.from.slice(0, 10)}...</p>
                                <p className="text-sm text-blue-300">To: {tx.to.slice(0, 10)}...</p>
                              </div>
                              <div className="text-right">
                                <p className="text-blue-100">{ethers.formatEther(tx.value)} ETH</p>
                                <p className="text-xs text-blue-300/70">
                                  {new Date(tx.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs font-mono text-blue-200/50 mt-2 truncate">
                              {tx.hash}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}