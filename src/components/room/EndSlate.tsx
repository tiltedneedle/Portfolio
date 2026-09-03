"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { submitForm } from "@/lib/submit-form";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The end slate. Contact, set as the last card of the reel: a claim about
 * the visitor's own film, the three ways to reach the room, and a form with
 * underline-only fields. The lamp comes on while a message is in flight.
 */
const fieldClass =
  "w-full rounded-none border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0 py-3 text-[17px] text-[color:var(--ink)] outline-none transition-colors duration-300 placeholder:text-[color:var(--ink-faint)] focus:border-[color:var(--ink)]";

const labelClass = "mono mb-1 block";

export function EndSlate() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  // The mailto fallback is a hand-off, not a send. Say so rather than claiming delivery.
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
    <section id="contact" className="relative scroll-mt-16 bg-black py-24 text-[color:var(--ink)] md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <motion.p {...rise} className="mono">
          05 &mdash; End slate
        </motion.p>

        <motion.h2 {...rise} className="display mt-8 max-w-[10ch] text-[clamp(64px,11vw,176px)] md:mt-12">
          Your film <span className="em-serif">next.</span>
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-x-24 gap-y-16 md:mt-24 lg:grid-cols-[minmax(0,420px)_1fr]">
          <motion.div {...rise}>
            <div className="border-t border-[color:var(--rule)] py-6">
              <p className={labelClass}>Email</p>
              <a href="mailto:info@tiltedneedle.com" className="underline-draw text-[21px] text-[color:var(--ink)] md:text-[25px]">
                info@tiltedneedle.com
              </a>
            </div>
            <div className="border-t border-[color:var(--rule)] py-6">
              <p className={labelClass}>Studios</p>
              <p className="text-[21px] text-[color:var(--ink-soft)] md:text-[25px]">London &middot; Dubai &middot; Global</p>
            </div>
            <div className="border-y border-[color:var(--rule)] py-6">
              <p className={labelClass}>Prefer to talk</p>
              <CutLink href="/book-demo" className="underline-draw text-[21px] text-[color:var(--ink)] md:text-[25px]" data-cursor="Cut">
                Book a 30-minute call &#8599;
              </CutLink>
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
                  className="border-t border-[color:var(--rule)] pt-10"
                >
                  <p className="display text-[clamp(40px,5vw,72px)]">
                    {handedOff ? (
                      <span>
                        Almost <span className="em-serif">there.</span>
                      </span>
                    ) : (
                      <span>
                        Message <span className="em-serif">sent.</span>
                      </span>
                    )}
                  </p>
                  <p className="mt-5 max-w-[48ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
                    {handedOff
                      ? "Your email app has opened with the message ready. Send it and we reply within 48 hours."
                      : "We reply within 48 hours."}
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} className="grid grid-cols-1 gap-x-12 gap-y-9 md:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className={labelClass}>
                      Name
                    </label>
                    <input id="c-name" name="name" type="text" required autoComplete="name" className={fieldClass} />
                  </div>
                  <div>
                    <label htmlFor="c-email" className={labelClass}>
                      Email
                    </label>
                    <input id="c-email" name="email" type="email" required autoComplete="email" className={fieldClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="c-company" className={labelClass}>
                      Company
                    </label>
                    <input id="c-company" name="company" type="text" autoComplete="organization" className={fieldClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="c-message" className={labelClass}>
                      The film
                    </label>
                    <textarea id="c-message" name="message" rows={4} required className={fieldClass + " resize-none"} />
                  </div>
                  <div className="flex flex-wrap items-center gap-6 pt-2 md:col-span-2">
                    <button type="submit" disabled={submitting} className="pill pill-solid px-8 py-3.5 text-[15px] disabled:opacity-60">
                      {submitting ? "Sending" : "Send"}
                    </button>
                    <span className={submitting ? "lamp" : "hidden"} aria-hidden="true" />
                    <p aria-live="polite" className="text-[13px] text-[color:var(--ink-mid)]">
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
