"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Cloud, Layers, Zap, Award, Building2 } from "lucide-react";
import { staggerChildren, fadeUpVariant } from "@/lib/utils";

const strengths = [
  {
    icon: Brain,
    title: "Agentic AI Systems",
    description:
      "Designing and shipping multi-agent orchestration, Advanced RAG pipelines, and MCP connectors that go from prototype to production in enterprise environments.",
    color: "text-neon-blue",
    bgColor: "bg-neon-blue/10",
    borderColor: "border-neon-blue/20",
  },
  {
    icon: Cloud,
    title: "Multi-Cloud Engineering",
    description:
      "Strong .NET backend foundation complemented by hands-on cloud engineering across Azure (AI Foundry, Functions, Service Bus) and AWS (Bedrock, Lambda, S3, RDS, DynamoDB, ECS/EKS) — with multi-model LLM routing to reduce vendor lock-in.",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-400/20",
  },
  {
    icon: Layers,
    title: "Enterprise Domain Experience",
    description:
      "Delivered AI-integrated systems across financial services (Insightsoftware), healthcare (Philips), and HCM (ADP) — domains where reliability and observability are non-negotiable.",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/20",
  },
  {
    icon: Zap,
    title: "Production-First Mindset",
    description:
      "AI systems that ship, get instrumented with OpenTelemetry, get evaluated with RAGAS, and improve over time. Not prototypes.",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
  },
];

const stats = [
  { value: "10+", label: "Years Engineering", icon: Award },
  { value: "4", label: "AI Systems in Prod", icon: Brain },
  { value: "60%", label: "Reporting Effort Cut", icon: Zap },
  { value: "3", label: "Industry Verticals", icon: Building2 },
];

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neon-blue/50 to-transparent" />

      <div className="section-container" ref={ref}>
        {/* Section Header */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-block font-mono text-sm text-neon-blue/70 mb-3 tracking-widest uppercase"
          >
            about me
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-6">
            10 years shipping software.
            <br />
            <span className="gradient-text">Now shipping AI that works.</span>
          </motion.h2>
          <motion.p
            variants={fadeUpVariant}
            className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            I&apos;m a Senior Software Engineer with around 10 years in the Microsoft and AWS
            ecosystems — from full-stack enterprise .NET to applied AI engineering. I specialize in{" "}
            <span className="text-neon-blue">Advanced RAG pipelines</span>,{" "}
            <span className="text-purple-400">multi-agent orchestration</span>, and{" "}
            <span className="text-cyan-400">LLM-powered automation</span> that solves real business
            problems in financial services, healthcare, and ERP — not prototypes that never reach
            production. Deep experience across{" "}
            <span className="text-amber-400">Azure AI Foundry</span>,{" "}
            <span className="text-orange-400">AWS Bedrock</span>, Semantic Kernel, and agentic
            frameworks. Currently completing an{" "}
            <span className="text-neon-blue">MSc in AI/ML at Liverpool John Moores University</span>.
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUpVariant}
                className="glass-hover rounded-2xl p-6 text-center group"
              >
                <Icon className="w-6 h-6 text-neon-blue/60 mx-auto mb-3 group-hover:text-neon-blue transition-colors" />
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Strengths */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {strengths.map((strength) => {
            const Icon = strength.icon;
            return (
              <motion.div
                key={strength.title}
                variants={fadeUpVariant}
                className={`glass-hover rounded-2xl p-6 border ${strength.borderColor} group cursor-default`}
              >
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${strength.bgColor} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${strength.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{strength.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{strength.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <blockquote className="relative max-w-2xl mx-auto">
            <div className="text-6xl text-neon-blue/20 font-serif absolute -top-4 -left-4">&ldquo;</div>
            <p className="text-xl sm:text-2xl text-white/70 font-light italic leading-relaxed px-8">
              Strong backend foundation in .NET, Azure, and AWS — extended with hands-on depth in
              Semantic Kernel, AWS Bedrock, agentic frameworks, and observable production AI
              behavior.
            </p>
            <div className="text-6xl text-neon-blue/20 font-serif absolute -bottom-8 -right-4">&rdquo;</div>
            <footer className="mt-6 text-sm text-white/30 font-mono">— Mani N, Senior AI Engineer</footer>
          </blockquote>
        </motion.div>
      </div>
    </section>
  );
}
