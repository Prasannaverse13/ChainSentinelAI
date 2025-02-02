import { Transaction } from './blockchain-monitor';
import { apiRequest } from "@/lib/queryClient";

// TEE monitoring configuration
const TEE_CONFIG = {
  mainnet: {
    endpoint: 'https://api.phala.network/tee/',
    attestationEndpoint: 'https://proof.phala.network/verify'
  },
  testnet: {
    endpoint: 'https://api-test.phala.network/tee/',
    attestationEndpoint: 'https://proof-test.phala.network/verify'
  }
};

interface TEEProof {
  quote: string;
  signature: string;
  certificate: string;
}

export async function verifyTEEAttestation(proof: TEEProof): Promise<boolean> {
  try {
    const response = await fetch(TEE_CONFIG.mainnet.attestationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proof)
    });
    const data = await response.json();
    return data.verified === true;
  } catch (error) {
    console.error('Error verifying TEE attestation:', error);
    return false;
  }
}

export function setupSecureMonitoring(address: string, callback: (transaction: Transaction) => void) {
  // Set up WebSocket connection to TEE endpoint
  const ws = new WebSocket(TEE_CONFIG.mainnet.endpoint);

  ws.onopen = () => {
    // Subscribe to address monitoring
    ws.send(JSON.stringify({
      type: 'subscribe',
      address: address
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'transaction') {
      callback(data.transaction);
    }
  };

  // Return cleanup function
  return () => {
    ws.close();
  };
}

// Function to get TEE verification status
export async function getTEEStatus(): Promise<{
  isActive: boolean;
  lastVerified: Date;
  proof?: TEEProof;
}> {
  try {
    const response = await apiRequest("GET", "/api/tee/status");
    const data = await response.json();
    return {
      isActive: data.active,
      lastVerified: new Date(data.lastVerified),
      proof: data.proof
    };
  } catch (error) {
    console.error('Error getting TEE status:', error);
    return {
      isActive: false,
      lastVerified: new Date()
    };
  }
}