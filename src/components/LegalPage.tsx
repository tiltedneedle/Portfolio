"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// Bullets in legal-data carry **bold** lead-ins; render them without a
// markdown dependency.
function Bold({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-medium text-[color:var(--ink)]">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

import type { LegalSection } from "@/lib/legal-data";

type Props = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

function LastWordSerif({ text }: { text: string }) {
  const words = text.split(" ");
  const last = words.pop();
  return (
    <span>
      {words.join(" ")} <span className="em-serif">{last}</span>
    </span>
  );
}

export function LegalPage({ title, lastUpdated, sections }: Props) {
  const reduced = useReducedMotion();

  return (
    <div className="bg-[var(--paper)]">
      <section className="pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="mx-auto max-w-[900px] px-6 md:px-[60px]">
          <motion.h1
            initial={{ opacity: 0, y: reduced ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="font-thin text-[color:var(--ink)] leading-[1.15] text-[10vw] sm:text-[44px] md:text-[56px]"
          >
            <LastWordSerif text={title} />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="eyebrow-serif mt-6"
          >
            last updated {lastUpdated.toLowerCase()}
          </motion.p>
        </div>
      </section>

      <section className="pb-24 md:pb-36">
        <div className="mx-auto max-w-[900px] px-6 md:px-[60px]">
          {sections.map((section, i) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: reduced ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: Math.min(0.03 * i, 0.2), ease: EASE_OUT_EXPO }}
              className="border-t border-[color:var(--rule)] py-10"
            >
              <div className="md:grid md:grid-cols-[auto_1fr] md:gap-x-12">
                <span className="text-[13px] text-[color:var(--ink-mid)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-[21px] md:text-[25px] font-light text-[color:var(--ink)]">
                    {section.heading}
                  </h2>
                  {(section.paragraphs ?? []).map((p) => (
                    <p
                      key={p.slice(0, 40)}
                      className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-mid)]"
                    >
                      {p}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((item) => (
                        <li
                          key={item.slice(0, 40)}
                          className="text-[15px] leading-relaxed text-[color:var(--ink-mid)] pl-5 relative before:content-['—'] before:absolute before:left-0"
                        >
                          <Bold text={item} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-[color:var(--rule)]" />
        </div>
      </section>
    </div>
  );
}
