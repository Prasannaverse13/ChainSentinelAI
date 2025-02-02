import type { Express } from "express";
import { createServer, type Server } from "http";
import { createCrossmintWallet, createTransaction, getTransaction, getNFTs } from "../client/src/lib/crossmint";
import { analyzeWithDeepseek } from "../client/src/lib/deepseek";

const CROSSMINT_API_KEY = process.env.CROSSMINT_API_KEY || "sk_staging..."; // Replace with actual API key
const ETERNAL_AI_API_KEY = process.env.ETERNALAI_API_KEY;

// EternalAI API configuration
const ETERNAL_AI_CONFIG = {
  endpoint: "https://api.eternalai.org/v1",
  chain_id: "45762",
  timeout: 30000, // 30 second timeout
};

export function registerRoutes(app: Express): Server {
  // EternalAI Routes
  app.post("/api/ai/analyze-transaction", async (req, res) => {
    try {
      const { transaction } = req.body;
      const response = await fetch(`${ETERNAL_AI_CONFIG.endpoint}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ETERNAL_AI_API_KEY}`,
        },
        body: JSON.stringify({
          chain_id: ETERNAL_AI_CONFIG.chain_id,
          model: "unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
          prompt: `Analyze this blockchain transaction for potential security threats: ${transaction}`,
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      res.json({ analysis: data.choices[0].text });
    } catch (error) {
      console.error("Error calling EternalAI:", error);
      res.status(500).json({ error: "Failed to analyze transaction" });
    }
  });

  app.post("/api/ai/audit-contract", async (req, res) => {
    try {
      const { code } = req.body;
      const response = await fetch(`${ETERNAL_AI_CONFIG.endpoint}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ETERNAL_AI_API_KEY}`,
        },
        body: JSON.stringify({
          chain_id: ETERNAL_AI_CONFIG.chain_id,
          model: "unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
          prompt: `Audit this smart contract code for security vulnerabilities: ${code}`,
          max_tokens: 1000,
          temperature: 0.2,
        }),
      });

      const data = await response.json();
      res.json({ audit_report: data.choices[0].text });
    } catch (error) {
      console.error("Error calling EternalAI:", error);
      res.status(500).json({ error: "Failed to audit smart contract" });
    }
  });

  app.post("/api/ai/security-report", async (req, res) => {
    try {
      const { address } = req.body;
      const response = await fetch(`${ETERNAL_AI_CONFIG.endpoint}/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ETERNAL_AI_API_KEY}`,
        },
        body: JSON.stringify({
          chain_id: ETERNAL_AI_CONFIG.chain_id,
          model: "unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
          prompt: `Generate a comprehensive security report for blockchain address: ${address}`,
          max_tokens: 1500,
          temperature: 0.4,
        }),
      });

      const data = await response.json();
      res.json({ report: data.choices[0].text });
    } catch (error) {
      console.error("Error calling EternalAI:", error);
      res.status(500).json({ error: "Failed to generate security report" });
    }
  });

  app.post("/api/ai/create-agent", async (req, res) => {
    try {
      const agentData = req.body;
      const response = await fetch(`${ETERNAL_AI_CONFIG.endpoint}/agent/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ETERNAL_AI_API_KEY}`,
        },
        body: JSON.stringify({
          chain_id: ETERNAL_AI_CONFIG.chain_id,
          ...agentData,
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error creating EternalAI agent:", error);
      res.status(500).json({ error: "Failed to create security agent" });
    }
  });
  
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, contractAddress } = req.body;
      let eternalAIResponse, deepseekResponse;

      const fetchWithTimeout = async (promise: Promise<any>, timeout: number) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        try {
          const result = await promise;
          clearTimeout(timeoutId);
          return result;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      };

      try {
        // Get EternalAI response with timeout
        const eternalResponse = await fetchWithTimeout(
          fetch(`${ETERNAL_AI_CONFIG.endpoint}/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${ETERNAL_AI_API_KEY}`,
            },
            body: JSON.stringify({
              chain_id: ETERNAL_AI_CONFIG.chain_id,
              model: "unsloth/Llama-3.3-70B-Instruct-bnb-4bit",
              prompt: `${message} ${contractAddress ? `\nAnalyze this contract address: ${contractAddress}` : ''}`,
              max_tokens: 500, // Reduced for faster response
              temperature: 0.4,
            }),
          }),
          ETERNAL_AI_CONFIG.timeout
        );

        if (!eternalResponse.ok) {
          throw new Error(`EternalAI API error: ${eternalResponse.statusText}`);
        }

        const eternalData = await eternalResponse.json();
        eternalAIResponse = eternalData.choices[0].text;
      } catch (error) {
        console.error("EternalAI Error:", error);
        eternalAIResponse = "EternalAI service is currently unavailable. Using Deepseek only.";
      }

      try {
        // Get Deepseek response with timeout
        deepseekResponse = await fetchWithTimeout(
          analyzeWithDeepseek(
            `${message} ${contractAddress ? `\nAnalyze this contract address: ${contractAddress}` : ''}`
          ),
          30000 // 30 second timeout
        );
      } catch (error) {
        console.error("Deepseek Error:", error);
        if (!eternalAIResponse || eternalAIResponse.includes("unavailable")) {
          throw new Error("Both AI services are currently unavailable");
        }
        deepseekResponse = "Deepseek service is currently unavailable. Using EternalAI only.";
      }

      res.json({ 
        eternalAI: eternalAIResponse,
        deepseek: deepseekResponse
      });
    } catch (error) {
      console.error("Error processing AI chat:", error);
      res.status(500).json({ 
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // TEE Status endpoint
  app.get("/api/tee/status", async (_req, res) => {
    try {

      res.json({
        active: true,
        lastVerified: new Date().toISOString(),
        proof: {
          quote: "mock_quote",
          signature: "mock_signature",
          certificate: "mock_certificate"
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to get TEE status" });
    }
  });

  // Wallet creation endpoint (Crossmint only)
  app.post("/api/wallet/create", async (req, res) => {
    try {
      const { email } = req.body;
      const wallet = await createCrossmintWallet(email, CROSSMINT_API_KEY);
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ error: "Failed to create wallet" });
    }
  });

  // Transaction creation endpoint (Crossmint only)
  app.post("/api/wallet/transaction", async (req, res) => {
    try {
      const { address, transactionData } = req.body;
      const transaction = await createTransaction(
        address,
        "0x5c030a01e9d2c4bb78212d06f88b7724b494b755", // Example contract address
        transactionData,
        CROSSMINT_API_KEY
      );
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  // Transaction status endpoint
  app.get("/api/wallet/transaction/:walletAddress/:transactionId", async (req, res) => {
    try {
      const { walletAddress, transactionId } = req.params;
      const status = await getTransaction(walletAddress, transactionId, CROSSMINT_API_KEY);
      res.json(status);
    } catch (error) {
      res.status(500).json({ error: "Failed to get transaction status" });
    }
  });

  // NFT fetching endpoint
  app.get("/api/wallet/nfts/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      // Only fetch NFTs for Crossmint wallets for now
      const nfts = await getNFTs(walletAddress, "polygon-amoy", CROSSMINT_API_KEY);
      res.json(nfts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}