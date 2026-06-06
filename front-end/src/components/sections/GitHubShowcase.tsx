"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, GitFork, ExternalLink, Code2, AlertCircle } from "lucide-react";
import { cn, staggerChildren, fadeUpVariant } from "@/lib/utils";
import { useGitHubRepos } from "@/hooks/useGitHubRepos";

const languageColors: Record<string, string> = {
  TypeScript: "bg-blue-500",
  JavaScript: "bg-yellow-500",
  Python: "bg-green-500",
  Rust: "bg-orange-600",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  "C++": "bg-pink-600",
  HTML: "bg-orange-500",
  CSS: "bg-purple-500",
  Shell: "bg-gray-500",
};

function RepoCard({ repo, index }: { repo: import("@/types").GitHubRepo; index: number }) {
  const langColor = languageColors[repo.language ?? ""] ?? "bg-white/30";

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="glass-hover rounded-2xl p-5 flex flex-col gap-3 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-neon-blue/60 flex-shrink-0" />
          <span className="font-mono font-semibold text-sm text-neon-blue group-hover:text-neon-blue/80 transition-colors truncate">
            {repo.name}
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 flex-shrink-0 transition-colors" />
      </div>

      {/* Description */}
      <p className="text-xs text-white/50 leading-relaxed line-clamp-2 flex-1">
        {repo.description ?? "No description provided."}
      </p>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-md bg-neon-blue/10 text-neon-blue/60 border border-neon-blue/10"
            >
              {topic}
            </span>
          ))}
        </div>
      )}

      {/* Footer stats */}
      <div className="flex items-center gap-4 pt-2 border-t border-white/5 text-xs text-white/40">
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <span className={cn("w-2.5 h-2.5 rounded-full", langColor)} />
            {repo.language}
          </div>
        )}
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {repo.stargazers_count}
        </div>
        <div className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          {repo.forks_count}
        </div>
      </div>
    </motion.a>
  );
}

function RepoSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
      <div className="h-4 bg-white/5 rounded w-3/4" />
      <div className="h-3 bg-white/5 rounded w-full" />
      <div className="h-3 bg-white/5 rounded w-2/3" />
      <div className="flex gap-2 mt-auto">
        <div className="h-3 bg-white/5 rounded w-16" />
        <div className="h-3 bg-white/5 rounded w-10" />
      </div>
    </div>
  );
}

export default function GitHubShowcase() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const { repos, loading, error } = useGitHubRepos("maniscodebase", 6);

  return (
    <section id="github" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />

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
            open source
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-4">
            Building in <span className="gradient-text">Public</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-white/50 text-lg max-w-2xl mx-auto">
            My open source work on GitHub. Real code, real commits, real impact.
          </motion.p>

          <motion.a
            variants={fadeUpVariant}
            href="https://github.com/maniscodebase"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm text-neon-blue hover:text-neon-blue/80 font-mono transition-colors"
          >
            github.com/maniscodebase
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        </motion.div>

        {/* Content */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <RepoSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-white/40"
          >
            <AlertCircle className="w-8 h-8 text-red-400/60" />
            <p className="text-sm">Could not load GitHub repositories.</p>
            <a
              href="https://github.com/maniscodebase"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue text-sm hover:underline"
            >
              View profile directly →
            </a>
          </motion.div>
        )}

        {!loading && !error && repos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {repos.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}

        {!loading && !error && repos.length === 0 && (
          <div className="text-center py-16 text-white/40">
            <p className="text-sm">No public repositories found.</p>
          </div>
        )}
      </div>
    </section>
  );
}
