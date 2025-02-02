import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export async function analyzeWithDeepseek(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-r1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4, // Lower temperature for faster, more focused responses
      top_p: 0.85,
      max_tokens: 1000, // Reduced max tokens for faster response
      presence_penalty: 0.2,
      frequency_penalty: 0.3,
    });

    return completion.choices[0]?.message?.content || 'No response from Deepseek';
  } catch (error) {
    console.error('Error calling Deepseek:', error);
    throw new Error(`Deepseek API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeContractSecurity(contractAddress: string): Promise<string> {
  const prompt = `Analyze the security of the smart contract at address ${contractAddress}. 
    Focus on critical vulnerabilities and potential risks. 
    Provide a concise security assessment.`;

  return analyzeWithDeepseek(prompt);
}