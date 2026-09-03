"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { submitForm } from "@/lib/submit-form";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// Underline-only fields: no box, a hairline that brightens on focus. The one
// place the paper system's inputs are inverted, because this is the page's
// single dark slab.
const fieldClass =
  "w-full bg-transparent border-0 border-b border-white/25 rounded-none px-0 py-3 text-[17px] text-white placeholder:text-white/35 outline-none transition-colors duration-300 focus:border-white";

const labelClass =
  "block text-[12px] font-medium uppercase tracking-[0.08em] text-white/55 mb-1";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  // The mailto fallback is a hand-off, not a send — say so rather than claiming delivery.
  const [handedOff, setHandedOff] = useState(false);
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
    if (result.ok) {
      setHandedOff(result.handedOff);
      setSent(true);
    } else setError(result.error);
  };

  const rise = {
    initial: { opacity: 0, y: reduced ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  };

  return (
    <section
      id="contact"
      className="relative bg-[color:var(--slab-deep)] text-white py-24 md:py-36 scroll-mt-16"
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px]">
        <motion.h2
          {...rise}
          className="flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.08em] text-white/55"
        >
          reach out
          <span aria-hidden="true" className="text-[15px] leading-none">&#8600;</span>
        </motion.h2>

        <motion.p
          {...rise}
          className="mt-10 md:mt-14 font-thin leading-[1.14] text-[11vw] sm:text-[56px] md:text-[72px] lg:text-[88px] max-w-[14ch]"
        >
          Let&apos;s create <span className="em-serif">together</span>.
        </motion.p>

        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-x-24 gap-y-16">
          <motion.div {...rise}>
            <div className="border-t border-white/15 py-6">
              <p className={labelClass}>email</p>
              <a
                href="mailto:info@tiltedneedle.com"
                className="underline-draw text-[21px] md:text-[25px] font-light text-white"
              >
                info@tiltedneedle.com
              </a>
            </div>
            <div className="border-t border-white/15 py-6">
              <p className={labelClass}>studios</p>
              <p className="text-[21px] md:text-[25px] font-light">
                London &middot; Dubai &middot; Global
              </p>
            </div>
            <div className="border-t border-b border-white/15 py-6">
              <p className={labelClass}>prefer to talk</p>
              <Link
                href="/book-demo"
                className="underline-draw text-[21px] md:text-[25px] font-light text-white"
              >
                book a 30-minute call <span aria-hidden="true">&#8600;</span>
              </Link>
            </div>
          </motion.div>

          <motion.div {...rise}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  role="status"
                  initial={{ opacity: 0, y: reduced ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="border-t border-white/15 pt-10"
                >
                  <p className="text-[32px] md:text-[44px] font-thin leading-[1.15]">
                    {handedOff ? (
                      <span>
                        Almost <span className="em-serif">there</span>.
                      </span>
                    ) : (
                      <span>
                        Message <span className="em-serif">sent</span>.
                      </span>
                    )}
                  </p>
                  <p className="mt-5 text-[17px] text-white/60 max-w-[48ch] leading-relaxed">
                    {handedOff
                      ? "We've opened your email app with the message ready. Send it and we'll reply within 24-48 hours."
                      : "We'll be in touch within 24-48 hours."}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-9"
                >
                  <div>
                    <label htmlFor="c-name" className={labelClass}>
                      name
                    </label>
                    <input id="c-name" name="name" type="text" required className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={labelClass}>
                      email
                    </label>
                    <input id="c-email" name="email" type="email" required className={fieldClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="c-company" className={labelClass}>
                      company
                    </label>
                    <input id="c-company" name="company" type="text" className={fieldClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="c-message" className={labelClass}>
                      the project
                    </label>
                    <textarea
                      id="c-message"
                      name="message"
                      rows={4}
                      required
                      className={fieldClass + " resize-none"}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="pill bg-white text-black px-8 py-3.5 text-[15px] hover:bg-[color:var(--paper)] disabled:opacity-60"
                    >
                      {submitting ? "Sending…" : "Send message"}
                    </button>
                    <p aria-live="polite" className="text-[13px] text-white/60">
                      {error}
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
