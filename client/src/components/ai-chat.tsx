import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Bot, Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  content: string;
  type: "user" | "ai";
  sources?: {
    eternalAI?: string;
    deepseek?: string;
  };
}

interface AIChatProps {
  contractAddress?: string;
}

export function AIChat({ contractAddress }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      try {
        const response = await apiRequest("POST", "/api/ai/chat", {
          message,
          contractAddress,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to get AI response');
        }

        return response.json();
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      const aiResponse: string[] = [];

      if (data.eternalAI && !data.eternalAI.includes("unavailable")) {
        aiResponse.push("EternalAI: " + data.eternalAI);
      }

      if (data.deepseek && !data.deepseek.includes("unavailable")) {
        aiResponse.push("Deepseek: " + data.deepseek);
      }

      setMessages((prev) => [
        ...prev,
        {
          content: aiResponse.join("\n\n"),
          type: "ai",
          sources: {
            eternalAI: data.eternalAI,
            deepseek: data.deepseek,
          },
        },
      ]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });

      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, I'm having trouble connecting to the AI services right now. Please try again later.",
          type: "ai",
        },
      ]);
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { content: input, type: "user" }]);
    chatMutation.mutate(input);
    setInput("");
  };

  return (
    <Card className="cyber-card h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-400" />
          AI Security Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-blue-200/80 text-center pt-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <p>Ask me anything about smart contract security or blockchain safety!</p>
              <p className="text-sm mt-2">
                {contractAddress 
                  ? "I'll analyze the provided contract address for potential vulnerabilities."
                  : "You can also provide a contract address for specific security analysis."}
              </p>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-500/20 text-blue-100"
                    : "bg-blue-950/50 text-blue-200"
                }`}
              >
                {message.type === "ai" && (
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-blue-400">AI Assistant</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-blue-950/50 text-blue-200 p-3 rounded-lg flex items-center gap-2">
                <Bot className="h-4 w-4 animate-pulse" />
                <span>Analyzing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2 mt-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about security, analysis, or general questions..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="cyber-input"
          />
          <Button 
            onClick={handleSend}
            className="cyber-button"
            disabled={chatMutation.isPending}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}