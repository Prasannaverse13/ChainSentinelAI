import { apiRequest } from "@/lib/queryClient";

interface EternalAICompletion {
  id: string;
  choices: Array<{
    text: string;
    index: number;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface EternalAIAgent {
  id: string;
  agent_name: string;
  status: string;
  system_content: string;
}

const CHAIN_ID = "45762"; // Symbiosis chain ID

export async function analyzeTransaction(txData: string): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/analyze-transaction", {
      transaction: txData,
    });
    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("Error analyzing transaction:", error);
    throw error;
  }
}

export async function auditSmartContract(contractCode: string): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/audit-contract", {
      code: contractCode,
    });
    const data = await response.json();
    return data.audit_report;
  } catch (error) {
    console.error("Error auditing smart contract:", error);
    throw error;
  }
}

export async function generateSecurityReport(address: string): Promise<string> {
  try {
    const response = await apiRequest("POST", "/api/ai/security-report", {
      address,
    });
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error("Error generating security report:", error);
    throw error;
  }
}

export async function setupSecurityAgent(name: string): Promise<EternalAIAgent> {
  try {
    const response = await apiRequest("POST", "/api/ai/create-agent", {
      agent_name: name,
      chain_id: CHAIN_ID,
      system_content: "Advanced blockchain security monitoring and threat detection agent",
      bio: [
        "Specialized in detecting suspicious blockchain activities and potential threats",
        "Monitors transaction patterns for anomalies and potential security risks",
        "Provides real-time alerts and security recommendations",
      ],
      knowledge: [
        "Blockchain security best practices",
        "Common attack vectors in DeFi",
        "Transaction pattern analysis",
        "Smart contract vulnerability detection",
      ],
    });
    return response.json();
  } catch (error) {
    console.error("Error setting up security agent:", error);
    throw error;
  }
}
