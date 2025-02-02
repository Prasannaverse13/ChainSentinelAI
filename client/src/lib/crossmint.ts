import { Contract } from 'ethers';

const CROSSMINT_API_URL = "https://staging.crossmint.com/api/2022-06-09";

export async function createCrossmintWallet(email: string, apiKey: string) {
  const response = await fetch(`${CROSSMINT_API_URL}/wallets`, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "evm-smart-wallet",
      config: {
        adminSigner: {
          type: "evm-fireblocks-custodial"
        }
      },
      linkedUser: `email:${email}`
    })
  });

  return await response.json();
}

export async function prepareTransaction(contractAddress: string, walletAddress: string) {
  const CollectionAbi = [{
    constant: false,
    inputs: [{ indexed: false, internalType: "address", name: "recipient", type: "address" }],
    name: "mintTo",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  }];

  const contract = new Contract(contractAddress, CollectionAbi);
  return contract.interface.encodeFunctionData("mintTo", [walletAddress]);
}

export async function createTransaction(walletLocator: string, contractAddress: string, data: string, apiKey: string) {
  const response = await fetch(`${CROSSMINT_API_URL}/wallets/${walletLocator}/transactions`, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      params: {
        calls: [{
          data,
          value: "0",
          to: contractAddress
        }],
        chain: "polygon-amoy"
      }
    })
  });

  return await response.json();
}

export async function getTransaction(walletLocator: string, transactionId: string, apiKey: string) {
  const response = await fetch(
    `${CROSSMINT_API_URL}/wallets/${walletLocator}/transactions/${transactionId}`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey
      }
    }
  );
  return await response.json();
}

export async function getNFTs(walletAddress: string, chain: string, apiKey: string) {
  const response = await fetch(
    `${CROSSMINT_API_URL}/wallets/${chain}:${walletAddress}/nfts?page=1&perPage=5`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      }
    }
  );
  return await response.json();
}
