"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

const MOCK_RESPONSES: Record<string, string> = {
  default:
    "Hey! I'm Mani's AI Digital Twin. I can answer questions about his experience, projects, tech stack, and what he's building. What would you like to know?",
  experience:
    "Mani (Manikanta Neerukattu) has 10 years of experience in the Microsoft ecosystem. Currently a Senior Software Engineer — AI & Applied Intelligence at Insightsoftware (Jun 2023–Present), where he leads AI transformation of enterprise financial reporting systems. Previously at Philips (healthcare AI) and ADP (payroll/HCM microservices).",
  projects:
    "Mani's key production AI projects: (1) Enterprise Advanced RAG Platform — hybrid BM25 + vector search, semantic re-ranking, RAGAS evaluation for compliance documents; (2) Agentic AI Reporting System — 3-agent pipeline with MCP connectors, cut manual reporting by 60%; (3) CareFlow Clinical AI — multi-turn agentic workflow with vector memory for healthcare; (4) XBRL/EDGAR Financial Intelligence — SEC filing extraction + anomaly detection pipeline.",
  skills:
    "Core stack: Azure AI Foundry, Azure OpenAI (GPT-4o, Embeddings, Function Calling), Semantic Kernel, Advanced RAG, LangGraph, AutoGen, MCP (Model Context Protocol), .NET 8/C#, Python/FastAPI, pgvector, Azure AI Search, RAGAS. He's a .NET specialist who went deep into AI — not an AI researcher who learned to code.",
  contact:
    "Reach Mani at mani.ainml@gmail.com or connect on LinkedIn at linkedin.com/in/manifordev. He's open to senior AI engineering roles and consulting engagements — especially in financial services, healthcare, and enterprise SaaS.",
  hire:
    "Mani is open to senior AI engineering roles and selective consulting. He's particularly strong for teams building production RAG systems, agentic AI, or Azure AI Foundry integrations on .NET stacks. Email mani.ainml@gmail.com with your use case.",
  azure:
    "Mani is an Azure-native engineer. He's built production systems on Azure AI Foundry, Azure OpenAI, Azure AI Search, Azure Functions, Service Bus, API Management, Application Insights, Key Vault, and Azure DevOps CI/CD. He's pursuing the AI-102 Azure AI Engineer certification.",
  ai:
    "Mani's AI engineering philosophy: Advanced RAG over naive RAG, observable agents over black-box workflows, RAGAS-evaluated prompts over vibes. He focuses on the hard parts — hybrid retrieval, semantic re-ranking, multi-model routing, agent memory, and making LLM systems debuggable in production.",
  education:
    "Mani is currently pursuing an MSc in AI/ML at Liverpool John Moores University (UK, Expected 2026). He completed a Postgraduate Diploma in Generative AI & Applied ML at IIIT Bangalore (2025, CGPA 3.85/4.0) and is working toward the Azure AI Engineer Associate (AI-102) certification.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("education") || lower.includes("degree") || lower.includes("university") || lower.includes("certif") || lower.includes("ljmu") || lower.includes("iiit"))
    return MOCK_RESPONSES.education;
  if (lower.includes("experience") || lower.includes("background") || lower.includes("work") || lower.includes("company") || lower.includes("insightsoftware") || lower.includes("philips") || lower.includes("adp"))
    return MOCK_RESPONSES.experience;
  if (lower.includes("project") || lower.includes("built") || lower.includes("portfolio") || lower.includes("rag") || lower.includes("agentic") || lower.includes("careflow"))
    return MOCK_RESPONSES.projects;
  if (lower.includes("skill") || lower.includes("tech") || lower.includes("stack") || lower.includes("semantic kernel") || lower.includes("langchain") || lower.includes("langraph"))
    return MOCK_RESPONSES.skills;
  if (lower.includes("contact") || lower.includes("email") || lower.includes("reach"))
    return MOCK_RESPONSES.contact;
  if (lower.includes("hire") || lower.includes("available") || lower.includes("opportunity") || lower.includes("role") || lower.includes("job"))
    return MOCK_RESPONSES.hire;
  if (lower.includes("azure") || lower.includes("microsoft") || lower.includes("cloud") || lower.includes("foundry") || lower.includes("openai"))
    return MOCK_RESPONSES.azure;
  if (lower.includes("ai") || lower.includes("llm") || lower.includes("machine learning") || lower.includes("agent") || lower.includes("mcp"))
    return MOCK_RESPONSES.ai;
  return MOCK_RESPONSES.default;
}

const STARTER_PROMPTS = [
  "What AI projects has Mani built?",
  "Tell me about his experience",
  "What's his Semantic Kernel stack?",
  "Is he available to hire?",
];

interface DigitalTwinProps {
  onClose?: () => void;
  embedded?: boolean;
}

export default function DigitalTwin({ onClose, embedded = false }: DigitalTwinProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm Mani's AI Digital Twin. I can answer questions about his experience, projects, and what he's building. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true);

      // Simulate LLM response delay
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 1000));

      const response = getResponse(text);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, assistantMessage]);
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        embedded
          ? "h-full"
          : "fixed bottom-6 right-6 z-50 w-[380px] h-[560px] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border-b border-white/10 backdrop-blur-xl bg-background/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <Bot className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white">Mani&apos;s Digital Twin</span>
              <Sparkles className="w-3 h-3 text-neon-blue" />
            </div>
            <p className="text-xs text-white/40">AI-powered · Always available</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/95 backdrop-blur-xl">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex gap-2.5",
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-neon-blue to-neon-purple"
                    : "bg-gradient-to-br from-purple-600 to-indigo-600"
                )}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-3.5 h-3.5 text-white" />
                ) : (
                  <User className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",
                  message.role === "user" ? "chat-bubble-user" : "chat-bubble-ai",
                  "text-white/85"
                )}
              >
                {message.content}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2.5 items-end"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="chat-bubble-ai px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-neon-blue/60"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Starter prompts */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 bg-background/95 border-t border-white/5 flex flex-wrap gap-1.5">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-neon-blue/10 text-neon-blue/80 border border-neon-blue/20 hover:bg-neon-blue/20 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 p-3 bg-background/95 backdrop-blur-xl border-t border-white/5"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Mani..."
          rows={1}
          className="flex-1 resize-none bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-neon-blue/40 focus:bg-white/8 transition-all"
          style={{ maxHeight: "120px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.min(target.scrollHeight, 120) + "px";
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-neon hover:scale-105 active:scale-95"
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>

      {/* LLM integration note */}
      <div className="px-4 py-2 bg-background/95 border-t border-white/5 text-center">
        <p className="text-xs text-white/20 font-mono">
          {"// LLM integration ready · powered by mock responses"}
        </p>
      </div>
    </div>
  );
}
