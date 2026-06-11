import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "enterprise-advanced-rag",
    title: "Enterprise Advanced RAG Platform",
    description:
      "Production-grade document intelligence platform for legal, finance, and consulting. Hybrid retrieval (BM25 + dense vector), semantic re-ranking, query rewriting, and RAGAS evaluation — with multi-cloud inference via Azure AI Foundry and AWS Bedrock.",
    longDescription:
      "Implemented hybrid retrieval combining BM25 keyword search with dense vector search, followed by semantic re-ranking to significantly improve precision over pure vector search on long-form enterprise documents. Engineered sliding-window and semantic chunking strategies tuned for financial and legal document structures. Built query rewriting and context enrichment stages that clarify and expand user queries before retrieval, improving answer groundedness. Extended the platform with an AWS Bedrock inference option, storing source documents in S3 and leveraging Bedrock Knowledge Bases for managed RAG — enabling side-by-side evaluation against the Azure AI Search retrieval path. Deployed via Azure Functions with API Management; integrated a RAGAS evaluation harness for ongoing retrieval quality measurement.",
    category: "AI",
    techStack: [
      "Azure AI Foundry",
      "Azure OpenAI",
      "AWS Bedrock",
      "AWS S3",
      "AWS Lambda",
      "Azure AI Search",
      ".NET 8",
      "Semantic Kernel",
      "pgvector",
      "RAGAS",
    ],
    liveUrl: undefined,
    githubUrl: "https://github.com/maniscodebase",
    featured: true,
    status: "live",
    metrics: "Hybrid BM25 + Vector · Multi-cloud inference · RAGAS Evaluated",
    imageGradient: "from-blue-600/20 via-cyan-500/10 to-indigo-600/20",
  },
  {
    id: "agentic-ai-reporting-system",
    title: "Agentic AI Reporting System",
    description:
      "Autonomous multi-agent orchestration system for enterprise financial reporting. Three-agent pipeline — Data Retrieval, LLM Analysis, and Report Generation — with agent state persisted in AWS DynamoDB and MCP tool layers for natural language database queries.",
    longDescription:
      "Designed a three-agent pipeline: a Data Retrieval Agent (SQL/API via MCP), an Analysis Agent (LLM reasoning), and a Report Generation Agent (structured document output). Built an MCP tool interaction layer enabling agents to query enterprise databases using natural language and invoke APIs dynamically at runtime. Implemented with Semantic Kernel + AutoGen; migrating to Microsoft Agent Framework (MAF) for enterprise lifecycle management. Agent state and conversation history persisted in AWS DynamoDB for low-latency, scalable session management across concurrent users. Reduced manual reporting effort by 60%.",
    category: "AI",
    techStack: [
      "Semantic Kernel",
      "AutoGen",
      "MCP",
      "Azure OpenAI",
      "AWS Bedrock",
      "AWS DynamoDB",
      ".NET 8",
      "LangGraph",
      "Microsoft Agent Framework",
    ],
    liveUrl: undefined,
    githubUrl: "https://github.com/maniscodebase",
    featured: true,
    status: "live",
    metrics: "60% reduction in manual reporting · 3-agent pipeline · DynamoDB session state",
    imageGradient: "from-purple-600/20 via-violet-500/10 to-pink-600/20",
  },
  {
    id: "careflow-clinical-ai",
    title: "CareFlow — AI Clinical Consultation System",
    description:
      "End-to-end AI system automating clinical consultation workflows. Agentic engine for patient intake, consultation documentation, and care plan generation with persistent vector memory across multi-turn sessions.",
    longDescription:
      "Built an agentic clinical workflow engine handling patient intake, consultation documentation, and care plan generation using Azure OpenAI and Semantic Kernel. Implemented context-aware conversation management with persistent vector memory, maintaining clinical context across multi-turn patient-provider sessions. Developed a real-time alert and escalation layer via Azure Service Bus to route critical flags to appropriate care teams.",
    category: "AI",
    techStack: [
      ".NET 8",
      "Azure OpenAI",
      "Semantic Kernel",
      "Azure Functions",
      "Azure Service Bus",
      "React",
      "pgvector",
    ],
    liveUrl: undefined,
    githubUrl: "https://github.com/maniscodebase",
    featured: true,
    status: "live",
    metrics: "Multi-turn memory · Real-time escalation · Healthcare-grade compliance",
    imageGradient: "from-cyan-600/20 via-teal-500/10 to-green-600/20",
  },
  {
    id: "xbrl-financial-intelligence",
    title: "XBRL/EDGAR Financial Intelligence Platform",
    description:
      "Financial intelligence platform targeting SEC EDGAR filings. Automated XBRL extraction pipeline, anomaly detection via cross-period validation, and statistical benchmarking against industry peer data.",
    longDescription:
      "Built an XBRL extraction pipeline to retrieve, parse, and normalize structured financial data from SEC EDGAR at scale using Azure Functions + Service Bus + PostgreSQL + Redis + Blob Storage. Designed anomaly detection APIs using numerical cross-period validation and statistical benchmarking against industry peer data. Produced a full HLD/LLD design covering ingestion architecture, orchestration, and evaluation strategy.",
    category: "AI",
    techStack: [
      "Azure Functions",
      "Azure Service Bus",
      "PostgreSQL",
      "Redis",
      "Blob Storage",
      "Python",
      ".NET 8",
    ],
    liveUrl: undefined,
    githubUrl: "https://github.com/maniscodebase",
    featured: false,
    status: "live",
    metrics: "SEC EDGAR ingestion · Cross-period anomaly detection · Full HLD/LLD",
    imageGradient: "from-amber-600/20 via-orange-500/10 to-red-600/20",
  },
  {
    id: "mcp-enterprise-connectors",
    title: "MCP Enterprise Connectors",
    description:
      "Model Context Protocol connectors enabling AI agents to interact with SQL databases, REST APIs, and external SaaS systems — supporting natural language queries, dynamic function calling, and real-time schema exploration.",
    longDescription:
      "Designed and built MCP (Model Context Protocol) enterprise connectors as part of the agentic reporting platform. These connectors allow AI agents to interact with enterprise data sources using standardized tool interfaces — enabling natural language queries over SQL, dynamic function calling against REST APIs, and real-time schema discovery at agent runtime.",
    category: "Tools",
    techStack: [
      "MCP",
      ".NET 8",
      "Azure OpenAI",
      "AWS Bedrock",
      "Semantic Kernel",
      "SQL Server",
      "Azure API Management",
    ],
    liveUrl: undefined,
    githubUrl: "https://github.com/maniscodebase",
    featured: false,
    status: "live",
    metrics: "Natural language SQL · Dynamic function calling · Schema exploration",
    imageGradient: "from-indigo-600/20 via-blue-500/10 to-cyan-600/20",
  },
  {
    id: "llm-evaluation-framework",
    title: "LLM Prompt Evaluation Framework",
    description:
      "Systematic prompt evaluation framework to measure and improve LLM output quality across model upgrades. Tracks groundedness, faithfulness, relevance, and hallucination rate across production AI pipelines.",
    longDescription:
      "Created a prompt evaluation framework used to systematically measure and improve LLM output quality, reducing hallucinations across model upgrades. Integrates RAGAS metrics (faithfulness, answer relevance, context recall/precision) with custom business-specific evaluation dimensions for financial and healthcare domains. Enables regression testing of prompts during model version upgrades and A/B testing of prompt variants across Azure OpenAI and AWS Bedrock model families.",
    category: "Tools",
    techStack: [
      "RAGAS",
      "Python",
      "Azure OpenAI",
      "AWS Bedrock",
      ".NET 8",
      "Azure AI Foundry",
      "Azure DevOps",
    ],
    liveUrl: undefined,
    githubUrl: "https://github.com/maniscodebase",
    featured: false,
    status: "live",
    metrics: "Hallucination tracking · RAGAS metrics · A/B prompt testing",
    imageGradient: "from-green-600/20 via-emerald-500/10 to-teal-600/20",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const getProjectsByCategory = (category: string) =>
  projects.filter((p) => p.category === category);
