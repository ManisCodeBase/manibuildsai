"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, Sparkles, MapPin } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 grid-background opacity-40" />
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />
      <div className="glow-orb w-96 h-96 bg-neon-blue top-1/4 -left-24 animate-float" />
      <div
        className="glow-orb w-80 h-80 bg-neon-purple top-1/3 right-0 animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="glow-orb w-64 h-64 bg-neon-cyan bottom-1/4 left-1/3 animate-float"
        style={{ animationDelay: "4s" }}
      />
      <ParticleField />
    </div>
  );
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-neon-blue/30"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function StatusBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-blue/30 text-sm text-neon-blue/90 font-mono mb-6"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue" />
      </span>
      <Sparkles className="w-3.5 h-3.5" />
      Open to senior AI roles &amp; consulting
    </motion.div>
  );
}

export default function Hero() {
  const scrollToProjects = () =>
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      <GridBackground />

      <div className="section-container relative z-10 py-32 text-center">
        <StatusBadge />

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4"
        >
          <span className="text-white">Hi, I&apos;m </span>
          <span className="gradient-text neon-text">Mani</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="text-base sm:text-lg text-white/40 font-mono mb-5"
        >
          Senior Software Engineer · Applied AI Engineer · .NET, Azure, AWS &amp; Agentic AI
        </motion.p>

        {/* Type animation tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl font-mono text-white/70 mb-4 min-h-[2.5rem]"
        >
          <TypeAnimation
            sequence={[
              "I build production-grade AI systems",
              2000,
              "I ship multi-cloud AI on Azure & AWS",
              2000,
              "I architect Advanced RAG pipelines",
              2000,
              "I orchestrate multi-agent systems that scale",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-neon-blue/90"
          />
        </motion.div>

        {/* Code line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-sm sm:text-base text-white/35 font-mono max-w-2xl mx-auto mb-10"
        >
          <span className="text-neon-blue/60">const</span>{" "}
          <span className="text-purple-400">mani</span>{" "}
          <span className="text-white/40">= </span>
          <span className="text-green-400">
            10y @ Insightsoftware · Philips · ADP · AI/ML MSc @ LJMU
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <motion.button
            onClick={scrollToProjects}
            className="btn-primary text-base px-8 py-3.5 shadow-neon"
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            View Projects
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            onClick={scrollToContact}
            className="btn-secondary text-base px-8 py-3.5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          <a
            href="https://github.com/maniscodebase"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
          >
            <Github className="w-4 h-4 group-hover:text-neon-blue transition-colors" />
            maniscodebase
          </a>
          <span className="text-white/20 hidden sm:inline">·</span>
          <a
            href="https://www.linkedin.com/in/manibuildsai/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
          >
            <Linkedin className="w-4 h-4 group-hover:text-neon-blue transition-colors" />
            LinkedIn
          </a>
          <span className="text-white/20 hidden sm:inline">·</span>
          <a
            href="mailto:mani.ainml@gmail.com"
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/80 transition-colors group"
          >
            <Mail className="w-4 h-4 group-hover:text-neon-blue transition-colors" />
            mani.ainml@gmail.com
          </a>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5 text-sm text-white/30 font-mono">
            <MapPin className="w-3.5 h-3.5" />
            Hyderabad, India
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/20 text-xs font-mono"
          >
            <span>scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
