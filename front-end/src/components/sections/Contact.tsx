"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, Github, Linkedin, Mail, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { cn, staggerChildren, fadeUpVariant } from "@/lib/utils";
import type { ContactFormData } from "@/types";

const socialLinks = [
  {
    icon: Github,
    label: "GitHub",
    handle: "@maniscodebase",
    href: "https://github.com/maniscodebase",
    color: "hover:text-white",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    handle: "linkedin.com/in/manifordev",
    href: "https://www.linkedin.com/in/manibuildsai/",
    color: "hover:text-blue-400",
  },
  {
    icon: Mail,
    label: "Email",
    handle: "mani.ainml@gmail.com",
    href: "mailto:mani.ainml@gmail.com",
    color: "hover:text-neon-blue",
  },
];

type FormStatus = "idle" | "submitting" | "success" | "error";

const SUBJECT_LABELS: Record<string, string> = {
  consulting: "AI Engineering Consulting",
  fulltime: "Full-time Opportunity",
  collaboration: "Open Source / Collaboration",
  speaking: "Speaking / Workshops",
  other: "General Inquiry",
};

function buildPlainTextMessage(name: string, email: string, subject: string, message: string): string {
  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  return [
    "────────────────────────────────────",
    "  NEW CONTACT — manibuildsai.com",
    "────────────────────────────────────",
    "",
    `  Name    : ${name}`,
    `  Email   : ${email}`,
    `  Topic   : ${subjectLabel}`,
    `  Sent    : ${timestamp}`,
    "",
    "────────────────────────────────────",
    "  MESSAGE",
    "────────────────────────────────────",
    "",
    message,
    "",
    "────────────────────────────────────",
    `  Reply to: ${email}`,
    "  Sent via https://manibuildsai.com",
    "────────────────────────────────────",
  ].join("\n");
}

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    const subjectLabel = SUBJECT_LABELS[formData.subject] ?? formData.subject;

    try {
      if (web3FormsKey) {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: `New message from ${formData.name} — ${subjectLabel}`,
            from_name: formData.name,
            replyto: formData.email,
            message: buildPlainTextMessage(formData.name, formData.email, formData.subject, formData.message),
          }),
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message ?? "Failed to send");
      } else {
        // Fallback: try the local Next.js API route (works in dev / SSR mode)
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
          );
          const subject = encodeURIComponent(`New message from ${formData.name} — ${subjectLabel}`);
          window.open(`mailto:mani.ainml@gmail.com?subject=${subject}&body=${body}`, "_blank");
        }
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  const inputClass = cn(
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white",
    "placeholder:text-white/30 outline-none",
    "focus:border-neon-blue/50 focus:bg-white/8 focus:ring-2 focus:ring-neon-blue/10",
    "transition-all duration-200"
  );

  return (
    <section id="contact" className="py-28 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-neon-blue/50 to-transparent" />

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
            get in touch
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl sm:text-5xl font-bold mb-4">
            Let&apos;s Build Something{" "}
            <span className="gradient-text">Real</span>
          </motion.h2>
          <motion.p variants={fadeUpVariant} className="text-white/50 text-lg max-w-2xl mx-auto">
            Have a project that needs serious AI engineering? I&apos;m selectively available for
            the right opportunities.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Social + Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Direct Contact</h3>
                  <p className="text-xs text-white/40">Typically responds within 24h</p>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Whether it&apos;s a full-time role, consulting engagement, or collaboration on an
                interesting AI problem — I want to hear about it.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-4 glass rounded-xl px-4 py-3 group transition-all duration-200",
                      "border border-white/5 hover:border-white/15"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 text-white/40 transition-colors",
                        social.color
                      )}
                    />
                    <div>
                      <div className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                        {social.label}
                      </div>
                      <div className="text-xs text-white/40 font-mono">{social.handle}</div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-7 border border-white/5 flex flex-col gap-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={cn(inputClass, "cursor-pointer")}
                >
                  <option value="" disabled className="bg-gray-900">
                    Select a topic...
                  </option>
                  <option value="consulting" className="bg-gray-900">
                    AI Engineering Consulting
                  </option>
                  <option value="fulltime" className="bg-gray-900">
                    Full-time Opportunity
                  </option>
                  <option value="collaboration" className="bg-gray-900">
                    Open Source / Collaboration
                  </option>
                  <option value="speaking" className="bg-gray-900">
                    Speaking / Workshops
                  </option>
                  <option value="other" className="bg-gray-900">
                    Other
                  </option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell me about what you're building and how I can help..."
                  className={cn(inputClass, "resize-none")}
                />
              </div>

              {/* Status messages */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-400/10 border border-green-400/20 text-green-400 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Message sent! I&apos;ll get back to you within 24 hours.
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  Something went wrong. Please email me directly at mani.ainml@gmail.com
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className={cn(
                  "btn-primary justify-center py-3.5 shadow-neon",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                )}
                whileHover={{ scale: status === "idle" ? 1.02 : 1 }}
                whileTap={{ scale: status === "idle" ? 0.98 : 1 }}
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
