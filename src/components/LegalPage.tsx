"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LegalSection } from "@/lib/legal-data";

// Minimal inline markdown: **bold** and [label](href).
function renderInline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g)
    .filter(Boolean)
    .map((part, i) => {
      const bold = part.match(/^\*\*([^*]+)\*\*$/);
      if (bold) {
        return (
          <strong key={i} className="font-semibold text-[#f5f5f7]">
            {bold[1]}
          </strong>
        );
      }

      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const [, label, href] = link;
        const external = href.startsWith("http");
        return (
          <a
            key={i}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="text-[#2997ff] underline-offset-4 hover:underline transition-colors duration-300"
          >
            {label}
          </a>
        );
      }

      return <span key={i}>{part}</span>;
    });
}

type Props = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export function LegalPage({ title, lastUpdated, sections }: Props) {
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden bg-black pt-32 pb-16 md:pt-44 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(41,151,255,0.06),transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="relative mx-auto max-w-[760px] px-6">
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.p
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-[#2997ff] text-[15px] font-medium mb-4"
            >
              Legal
            </motion.p>

            <motion.h1
              initial={{
                opacity: 0,
                y: reduced ? 0 : 20,
                filter: reduced ? "blur(0px)" : "blur(8px)",
              }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-[64px] font-semibold tracking-[-0.03em] leading-[1.05] text-[#f5f5f7]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-6 text-[15px] text-[#86868b]"
            >
              Last updated: {lastUpdated}
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-black pb-28 md:pb-40">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#0a0a0a] pointer-events-none" />

        <div className="relative mx-auto max-w-[760px] px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent mb-14 md:mb-16" />

          <div className="space-y-12 md:space-y-16">
            {sections.map((section, i) => (
              <motion.div
                key={section.heading}
                initial={{ opacity: 0, y: reduced ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.6,
                  delay: reduced ? 0 : Math.min(0.04 * i, 0.2),
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <h2 className="text-[24px] md:text-[28px] font-semibold tracking-[-0.02em] text-[#f5f5f7] mb-5">
                  {section.heading}
                </h2>

                {section.paragraphs?.map((paragraph, p) => (
                  <p
                    key={p}
                    className="text-[16px] md:text-[17px] leading-[1.7] text-[#a1a1a6] mb-4 last:mb-0"
                  >
                    {renderInline(paragraph)}
                  </p>
                ))}

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {section.bullets.map((bullet, b) => (
                      <li
                        key={b}
                        className="relative pl-6 text-[16px] md:text-[17px] leading-[1.7] text-[#a1a1a6]"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute left-0 top-[0.6em] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#2997ff]"
                        />
                        {renderInline(bullet)}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
