"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Zap, ArrowUp } from "lucide-react";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, href: "https://github.com/maniscodebase", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/manibuildsai/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:mani.ainml@gmail.com", label: "Email" },
];

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/5 py-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      <div className="glow-orb w-64 h-64 bg-neon-blue -bottom-32 left-1/4 opacity-10" />

      <div className="section-container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-mono font-bold text-base">
                <span className="gradient-text">mani</span>
                <span className="text-white/30">builds</span>
                <span className="gradient-text">ai</span>
              </span>
            </div>
            <p className="text-xs text-white/30 font-mono text-center md:text-left max-w-xs">
              Building production-grade AI systems that ship and scale.
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm text-white/40 hover:text-white/80 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25 font-mono">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Mani N. Built with Next.js &amp; Azure.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 animate-pulse" />
              All systems operational
            </span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white/25 hover:text-white/60 transition-colors"
            >
              <ArrowUp className="w-3 h-3" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
