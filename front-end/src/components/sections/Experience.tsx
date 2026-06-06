"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { MapPin, Calendar, ExternalLink, CheckCircle } from "lucide-react";
import { cn, staggerChildren, fadeUpVariant } from "@/lib/utils";
import { experiences } from "@/data/experience";

const companyColors: Record<string, { accent: string; bg: string; border: string }> = {
  Insightsoftware: {
    accent: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/30",
  },
  Philips: {
    accent: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/30",
  },
  ADP: {
    accent: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/30",
  },
  "Option Matrix Infotech": {
    accent: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/30",
  },
};

function ExperienceCard({
  exp,
  index,
  isLast,
}: {
  exp: (typeof experiences)[0];
  index: number;
  isLast: boolean;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const colors = companyColors[exp.company] ?? {
    accent: "text-neon-blue",
    bg: "bg-neon-blue/10",
    border: "border-neon-blue/30",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="relative pl-10"
    >
      {/* Timeline line */}
      {!isLast && (
        <div className="timeline-line absolute left-3.5 top-12 bottom-0 transform -translate-x-1/2" />
      )}

      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.2, type: "spring", bounce: 0.4 }}
        className={cn(
          "absolute left-0 top-6 w-7 h-7 rounded-full flex items-center justify-center border-2",
          colors.bg,
          colors.border
        )}
      >
        <div className={cn("w-2.5 h-2.5 rounded-full", colors.bg, "border", colors.border)} />
      </motion.div>

      {/* Card */}
      <div className="glass-hover rounded-2xl p-6 mb-8 group">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
            <div className="flex items-center gap-2">
              <span className={cn("text-base font-semibold", colors.accent)}>
                {exp.company}
              </span>
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-medium",
                  colors.bg,
                  colors.accent,
                  "border",
                  colors.border
                )}
              >
                {exp.type === "full-time"
                  ? "Full-time"
                  : exp.type === "contract"
                  ? "Contract"
                  : "Freelance"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 text-sm text-white/40">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {exp.period}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {exp.location}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/55 text-sm leading-relaxed mb-4">{exp.description}</p>

        {/* Achievements */}
        <ul className="space-y-2 mb-5">
          {exp.achievements.map((achievement, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
              className="flex items-start gap-2.5 text-sm text-white/65"
            >
              <CheckCircle className="w-4 h-4 text-neon-blue/60 mt-0.5 flex-shrink-0" />
              {achievement}
            </motion.li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
          {exp.techStack.map((tech) => (
            <span key={tech} className="tech-badge text-xs">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="experience" className="py-28 relative">
      <div className="section-container" ref={ref}>
        {/* Header */}
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
            career
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-4">
            Where I&apos;ve <span className="gradient-text">Made Impact</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-white/50 text-lg max-w-2xl mx-auto">
            9+ years delivering production AI systems across finance, healthcare, and enterprise
            platforms — from full-stack roots to Agentic AI architecture.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {experiences.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              index={i}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>

        {/* Download resume CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <a
            href="/mani-resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-secondary"
          >
            <ExternalLink className="w-4 h-4" />
            Download Full Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
