import { ethers } from 'ethers';

// Mode Network configuration
const MODE_NETWORK = {
  mainnet: {
    name: 'Mode Mainnet',
    chainId: 34443,
    rpcUrl: 'https://mainnet.mode.network/',
    explorer: 'https://explorer.mode.network/'
  },
  testnet: {
    name: 'Mode Testnet',
    chainId: 919,
    rpcUrl: 'https://sepolia.mode.network/',
    explorer: 'https://sepolia.explorer.mode.network/'
  }
};

// Initialize Mode Network provider
const getModeProvider = (network: 'mainnet' | 'testnet' = 'mainnet') => {
  return new ethers.JsonRpcProvider(MODE_NETWORK[network].rpcUrl);
};

// Goldsky API configuration
const GOLDSKY_API_KEY = import.meta.env.VITE_GOLDSKY_API_KEY;
const GOLDSKY_API_URL = 'https://api.goldsky.com/api/public';

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
}

// Function to fetch transaction history from Mode Network
export async function getTransactionHistory(address: string): Promise<Transaction[]> {
  const provider = getModeProvider();

  // Get the last 100 blocks
  const currentBlock = await provider.getBlockNumber();
  const transactions: Transaction[] = [];

  // Scan last 100 blocks for transactions
  for (let i = 0; i < 100; i++) {
    const block = await provider.getBlock(currentBlock - i, true);
    if (!block || !block.transactions) continue;

    // Type assertion for block transactions
    const blockTxs = block.transactions as ethers.TransactionResponse[];

    for (const tx of blockTxs) {
      if (tx.from === address || tx.to === address) {
        transactions.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to || '',
          value: tx.value.toString(),
          timestamp: block.timestamp * 1000 // Convert to milliseconds
        });
      }
    }
  }

  return transactions;
}

// Function to monitor real-time transactions
export function monitorTransactions(address: string, callback: (transaction: Transaction) => void) {
  const provider = getModeProvider();

  // Listen for pending transactions
  provider.on('pending', async (txHash: string) => {
    try {
      const tx = await provider.getTransaction(txHash);
      if (tx && (tx.from === address || tx.to === address)) {
        callback({
          hash: tx.hash,
          from: tx.from,
          to: tx.to || '',
          value: tx.value.toString(),
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error monitoring transaction:', error);
    }
  });

  // Return cleanup function directly
  return () => {
    provider.removeAllListeners('pending');
  };
}

// Function to query transaction data from Goldsky
export async function queryGoldskyData(address: string) {
  if (!GOLDSKY_API_KEY) {
    throw new Error('Goldsky API key not configured');
  }

  try {
    const response = await fetch(`${GOLDSKY_API_URL}/v1/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GOLDSKY_API_KEY}`
      },
      body: JSON.stringify({
        query: `
          query GetTransactions($address: String!) {
            transactions(
              where: { or: [{ from: $address }, { to: $address }] }
              orderBy: timestamp
              orderDirection: desc
              first: 100
            ) {
              hash
              from
              to
              value
              timestamp
            }
          }
        `,
        variables: { address }
      })
    });

    const data = await response.json();
    return data.data?.transactions || [];
  } catch (error) {
    console.error('Error querying Goldsky:', error);
    return [];
  }
}