"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { GraduationCap, Award, CheckCircle2, Clock } from "lucide-react";
import { cn, staggerChildren, fadeUpVariant } from "@/lib/utils";
import { education, certifications } from "@/data/education";

const degreeColors: Record<string, { accent: string; bg: string; border: string }> = {
  "ljmu-ms": { accent: "text-neon-blue", bg: "bg-neon-blue/10", border: "border-neon-blue/30" },
  "iiitb-pgdip": { accent: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/30" },
  "jntu-btech": { accent: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/30" },
};

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="education" className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />

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
            education &amp; credentials
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-4">
            Always <span className="gradient-text">Learning</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-white/50 text-lg max-w-2xl mx-auto">
            Formal training in AI/ML combined with a decade of hands-on production engineering.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Education */}
          <div className="lg:col-span-3 space-y-5">
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-sm font-mono text-white/40 uppercase tracking-widest mb-6"
            >
              <GraduationCap className="w-4 h-4 text-neon-blue" />
              Academic
            </motion.h3>

            {education.map((edu, i) => {
              const colors = degreeColors[edu.id] ?? {
                accent: "text-neon-blue",
                bg: "bg-neon-blue/10",
                border: "border-neon-blue/30",
              };

              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12 }}
                  className={cn(
                    "glass-hover rounded-2xl p-6 border flex items-start gap-5",
                    colors.border
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                      colors.bg
                    )}
                  >
                    <GraduationCap className={cn("w-5 h-5", colors.accent)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-white">
                        {edu.degree}{" "}
                        <span className={cn("text-sm font-normal", colors.accent)}>
                          — {edu.field}
                        </span>
                      </h4>
                      <span
                        className={cn(
                          "text-xs px-2.5 py-1 rounded-full font-mono flex-shrink-0 flex items-center gap-1.5",
                          edu.status === "in-progress"
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-green-400/10 text-green-400 border border-green-400/20"
                        )}
                      >
                        {edu.status === "in-progress" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{edu.institution}</p>
                    <p className="text-xs text-white/35 font-mono">{edu.location}</p>
                    {edu.grade && (
                      <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-md bg-neon-blue/10 text-neon-blue/80 border border-neon-blue/20 font-mono">
                        {edu.grade}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Certifications */}
          <div className="lg:col-span-2">
            <motion.h3
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-sm font-mono text-white/40 uppercase tracking-widest mb-6"
            >
              <Award className="w-4 h-4 text-neon-blue" />
              Certifications
            </motion.h3>

            <div className="space-y-4">
              {certifications.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.12 }}
                  className="glass-hover rounded-2xl p-5 border border-white/5 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-neon-blue/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-neon-blue transition-colors">
                        {cert.name}
                      </h4>
                      <p className="text-xs text-white/40 mb-2">{cert.issuer}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-mono",
                          cert.status === "in-progress"
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-green-400/10 text-green-400 border border-green-400/20"
                        )}
                      >
                        {cert.status === "in-progress" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {cert.year ?? (cert.status === "in-progress" ? "In Progress" : "Completed")}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MSc highlight card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="mt-6 rounded-2xl p-5 border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue" />
                </span>
                <span className="text-xs font-mono text-neon-blue/70 uppercase tracking-widest">
                  Currently Pursuing
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                MSc AI/ML at{" "}
                <span className="text-neon-blue font-semibold">
                  Liverpool John Moores University
                </span>
                , UK — deepening formal ML theory alongside 10 years of production engineering.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
