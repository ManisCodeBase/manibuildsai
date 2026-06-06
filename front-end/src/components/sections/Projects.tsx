"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ExternalLink, Github, ArrowUpRight, Zap, CheckCircle2, Clock } from "lucide-react";
import { cn, staggerChildren, fadeUpVariant } from "@/lib/utils";
import { projects } from "@/data/projects";
import type { ProjectCategory } from "@/types";

const categories: Array<{ label: string; value: "All" | ProjectCategory }> = [
  { label: "All", value: "All" },
  { label: "AI / ML", value: "AI" },
  { label: "Fullstack", value: "Fullstack" },
  { label: "Tools", value: "Tools" },
];

const statusConfig = {
  live: { label: "Live", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10" },
  "in-progress": { label: "In Progress", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
  archived: { label: "Archived", icon: Zap, color: "text-white/40", bg: "bg-white/5" },
};

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const status = statusConfig[project.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative glass-hover rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Card header gradient */}
      <div className={`h-40 bg-gradient-to-br ${project.imageGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 grid-background opacity-30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-black text-white/10 font-mono tracking-tighter select-none">
            {project.title.split(" ").map((w) => w[0]).join("").slice(0, 3)}
          </div>
        </div>

        {/* Status badge */}
        <div className={cn("absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.bg, status.color)}>
          <StatusIcon className="w-3 h-3" />
          {status.label}
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-medium border border-neon-blue/30">
            <Zap className="w-3 h-3" />
            Featured
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category */}
        <span className="text-xs font-mono text-neon-blue/60 uppercase tracking-widest mb-2">
          {project.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/55 leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-white/3 border border-white/5">
            <p className="text-xs font-mono text-neon-blue/70">{project.metrics}</p>
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 5).map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
          {project.techStack.length > 5 && (
            <span className="tech-badge">+{project.techStack.length - 5}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-neon-blue hover:text-neon-blue/80 font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors ml-auto"
          >
            <Github className="w-3.5 h-3.5" />
            Source
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<"All" | ProjectCategory>("All");
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-28 relative">
      <div className="section-container" ref={ref}>
        {/* Header */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-block font-mono text-sm text-neon-blue/70 mb-3 tracking-widest uppercase"
          >
            portfolio
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-4">
            Things I&apos;ve{" "}
            <span className="gradient-text">Actually Built</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-white/50 text-lg max-w-2xl mx-auto">
            Production systems, not side projects. Each one is live, battle-tested, and generating
            real value.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                activeCategory === cat.value
                  ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-neon"
                  : "glass text-white/50 hover:text-white hover:border-white/20 border border-white/10"
              )}
            >
              {cat.label}
              <span
                className={cn(
                  "ml-2 text-xs",
                  activeCategory === cat.value ? "text-white/70" : "text-white/30"
                )}
              >
                {cat.value === "All"
                  ? projects.length
                  : projects.filter((p) => p.category === cat.value).length}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="https://github.com/maniscodebase"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-secondary"
          >
            <Github className="w-4 h-4" />
            View all on GitHub
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
