import type { SkillCategory } from "@/types";

export const skillCategories: SkillCategory[] = [
  {
    name: "AI Engineering",
    icon: "🧠",
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "Azure AI Foundry & Azure OpenAI (GPT-4o, Embeddings, Function Calling)", level: 96, category: "AI/ML" },
      { name: "Semantic Kernel", level: 94, category: "AI/ML" },
      { name: "Advanced RAG (Hybrid Search, Re-ranking, Query Expansion)", level: 95, category: "AI/ML" },
      { name: "Multi-Agent Orchestration (AutoGen, LangGraph, CrewAI)", level: 90, category: "AI/ML" },
      { name: "MCP — Model Context Protocol", level: 88, category: "AI/ML" },
      { name: "LangChain / LlamaIndex", level: 87, category: "AI/ML" },
      { name: "LLM Evaluation (RAGAS, Prompt Engineering)", level: 90, category: "AI/ML" },
      { name: "Vector Databases (Azure AI Search, pgvector, ChromaDB)", level: 92, category: "AI/ML" },
    ],
  },
  {
    name: "Backend & System Design",
    icon: "🔧",
    color: "from-purple-500 to-violet-500",
    skills: [
      { name: "C# / .NET 8 / ASP.NET Core", level: 97, category: "Backend" },
      { name: "Python / FastAPI", level: 88, category: "Backend" },
      { name: "Microservices & Clean Architecture", level: 93, category: "Backend" },
      { name: "Event-Driven Systems (Azure Service Bus)", level: 90, category: "Backend" },
      { name: "REST API Design & Azure SDK Integration", level: 94, category: "Backend" },
      { name: "Domain-Driven Design", level: 88, category: "Backend" },
      { name: "OpenTelemetry & Distributed Tracing", level: 85, category: "Backend" },
      { name: "Resilience Patterns (Polly, Circuit Breakers)", level: 87, category: "Backend" },
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: "☁️",
    color: "from-cyan-500 to-teal-500",
    skills: [
      { name: "Microsoft Azure (Functions, API Mgmt, Service Bus, Key Vault)", level: 95, category: "DevOps" },
      { name: "Azure DevOps & GitHub Actions (CI/CD)", level: 92, category: "DevOps" },
      { name: "Docker & Containerization", level: 87, category: "DevOps" },
      { name: "Azure Blob Storage & Application Insights", level: 93, category: "DevOps" },
      { name: "Infrastructure as Code (Bicep)", level: 80, category: "DevOps" },
      { name: "Structured Logging & Observability", level: 90, category: "DevOps" },
      { name: "SonarQube & Quality Gates", level: 85, category: "DevOps" },
    ],
  },
  {
    name: "Data & Frontend",
    icon: "⚡",
    color: "from-orange-500 to-amber-500",
    skills: [
      { name: "PostgreSQL / SQL Server / Azure SQL", level: 90, category: "Backend" },
      { name: "pgvector / Azure Data Factory / Databricks", level: 82, category: "Backend" },
      { name: "React.js / TypeScript", level: 85, category: "Frontend" },
      { name: "Angular / RxJS", level: 83, category: "Frontend" },
      { name: "Blazor", level: 78, category: "Frontend" },
      { name: "Testing (xUnit, NUnit, Cypress, Playwright)", level: 87, category: "DevOps" },
      { name: "PySpark / Databricks", level: 75, category: "Backend" },
    ],
  },
];

export const allSkills = skillCategories.flatMap((cat) => cat.skills);

export const topSkillTags = [
  "Azure OpenAI",
  "Semantic Kernel",
  "Advanced RAG",
  ".NET 8 / C#",
  "Multi-Agent Systems",
  "MCP",
  "LangGraph",
  "AutoGen",
  "Azure AI Search",
  "pgvector",
  "Azure AI Foundry",
  "Python / FastAPI",
  "RAGAS",
  "Azure Functions",
  "LlamaIndex",
  "CrewAI",
];
