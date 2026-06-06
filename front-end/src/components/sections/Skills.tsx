"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { staggerChildren, fadeUpVariant } from "@/lib/utils";
import { skillCategories, topSkillTags } from "@/data/skills";

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-white/75 group-hover:text-white transition-colors">
          {name}
        </span>
        <span className="text-xs font-mono text-neon-blue/60">{level}%</span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-bar-fill"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: level / 100 } : { scaleX: 0 }}
          transition={{ duration: 1, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="skills" className="py-28 relative">
      {/* Background gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />

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
            expertise
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-4">
            My <span className="gradient-text">Technical Stack</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-white/50 text-lg max-w-2xl mx-auto">
            Years of production experience across the full AI and engineering stack.
          </motion.p>
        </motion.div>

        {/* Quick Tag Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mb-16"
        >
          {topSkillTags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.03 }}
              className="tech-badge text-sm px-3 py-1.5 cursor-default hover:scale-105 transition-transform"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Skill categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + catIndex * 0.1, duration: 0.6 }}
              className="glass rounded-2xl p-7 border border-white/5 hover:border-white/10 transition-colors"
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${category.color} bg-opacity-20 flex items-center justify-center text-xl`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{category.name}</h3>
                  <p className="text-xs text-white/40">{category.skills.length} technologies</p>
                </div>
              </div>

              {/* Skill bars */}
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <SkillBar
                    key={skill.name}
                    name={skill.name}
                    level={skill.level}
                    delay={0.4 + catIndex * 0.1 + skillIndex * 0.05}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="text-center text-white/30 text-sm font-mono mt-12"
        >
          {"// skill levels based on production usage, not courses"}
        </motion.p>
      </div>
    </section>
  );
}
