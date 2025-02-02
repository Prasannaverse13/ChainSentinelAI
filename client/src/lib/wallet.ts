import { BrowserProvider, JsonRpcSigner } from "ethers";

export type WalletType = "metamask" | "crossmint";

export interface WalletConnection {
  type: WalletType;
  address: string;
  chainId?: number;
  signer?: JsonRpcSigner;
}

export async function connectMetaMask(): Promise<WalletConnection> {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  // Request account access
  await window.ethereum.request({ method: "eth_requestAccounts" });
  
  // Create Web3Provider from MetaMask's provider
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const network = await provider.getNetwork();
  
  return {
    type: "metamask",
    address,
    chainId: Number(network.chainId),
    signer
  };
}

// Extend Window interface to include ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}
