"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { submitForm } from "@/lib/submit-form";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const result = await submitForm({
      type: "contact",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      message: String(data.get("message") || ""),
    });

    setSubmitting(false);
    if (result.ok) setSent(true);
    else setError(result.error);
  };

  const labelClass = (field: string) =>
    `block text-[12px] uppercase tracking-[0.08em] mb-3 transition-colors duration-300 ${
      focused === field ? "text-[#f5f5f7]" : "text-[#86868b]"
    }`;

  const fieldClass =
    "transition-all duration-300 focus:shadow-[0_0_0_4px_rgba(255,255,255,0.05)]";

  return (
    <section id="contact" className="py-16 md:py-20 relative overflow-hidden bg-black">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-t from-white/5 to-transparent blur-[150px] pointer-events-none animate-[ambient-glow_8s_ease-in-out_infinite]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto max-w-[1000px] px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduced ? 0.01 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <p className="text-[#ff375f] text-[17px] font-medium mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
            Let&apos;s create together.
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-xl md:text-[22px] text-[#86868b] leading-relaxed"
          >
            Ready to make your brand go viral? Let&apos;s talk.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          <motion.div
            initial={{ opacity: 0, x: reduced ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0.01 : 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <motion.div
              whileHover={{ y: -4, transition: { duration: 0.3 } }}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#161616] group cursor-pointer elevate-static-lg sheen"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center mb-5 group-hover:bg-[rgba(255,255,255,0.1)] transition-colors duration-300">
                <ArrowUpRight className="w-5 h-5 text-[#f5f5f7]" />
              </div>
              <h3 className="text-[19px] font-semibold text-[#f5f5f7] mb-2 group-hover:text-white transition-colors duration-300">
                Book a Demo
              </h3>
              <p className="text-[15px] text-[#86868b] mb-5 leading-relaxed group-hover:text-[#a1a1a6] transition-colors duration-300">
                Schedule a 30-minute discovery call to discuss your project.
              </p>
              <Link
                href="/book-demo"
                className="inline-flex items-center gap-2 text-[15px] text-[#f5f5f7] hover:text-white transition-all duration-300 group-hover:gap-3"
              >
                Book a Demo
                <motion.span
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="group"
            >
              <h3 className="text-[12px] text-[#86868b] uppercase tracking-[0.08em] mb-3">
                Email
              </h3>
              <a
                href="mailto:info@tiltedneedle.com"
                className="text-[19px] text-[#f5f5f7] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
              >
                info@tiltedneedle.com
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="text-[#86868b]"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-[12px] text-[#86868b] uppercase tracking-[0.08em] mb-3">
                Locations
              </h3>
              <p className="text-[17px] text-[#f5f5f7]">London · Dubai · Global</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reduced ? 0 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: reduced ? 0.01 : 0.8,
              delay: reduced ? 0 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-b from-[#2c2c2e] to-[#1c1c1e] flex items-center justify-center"
                      style={{ boxShadow: "var(--glow-medium)" }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-[#f5f5f7]" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-semibold text-[#f5f5f7] mb-2"
                    >
                      Message sent
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-[17px] text-[#86868b]"
                    >
                      We&apos;ll be in touch within 24-48 hours.
                    </motion.p>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <label htmlFor="name" className={labelClass("name")}>
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused(null)}
                        className={fieldClass}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 }}
                    >
                      <label htmlFor="email" className={labelClass("email")}>
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@company.com"
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused(null)}
                        className={fieldClass}
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    <label htmlFor="company" className={labelClass("company")}>
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your company"
                      onFocus={() => setFocused("company")}
                      onBlur={() => setFocused(null)}
                      className={fieldClass}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.45 }}
                  >
                    <label htmlFor="message" className={labelClass("message")}>
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell us about your project..."
                      rows={4}
                      onFocus={() => setFocused("message")}
                      onBlur={() => setFocused(null)}
                      className={fieldClass}
                    />
                  </motion.div>

                  {error && (
                    <p className="text-[15px] text-[#ff453a]" role="alert">
                      {error}
                    </p>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 bg-[#f5f5f7] text-[#1c1c1e] rounded-2xl text-[17px] font-medium transition-all duration-500 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-[#1c1c1e] border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
