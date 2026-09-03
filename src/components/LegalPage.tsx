"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// legal-data carries **bold** runs and [text](url) links inside plain strings.
// A hand-written scanner rather than a regex: no escaping to get wrong, and
// no markdown dependency for two tokens.
type Token = { kind: "text" | "bold" | "link"; value: string; href?: string };

function tokenize(text: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < text.length) {
    const b = text.indexOf("**", i);
    const l = text.indexOf("[", i);
    const boldFirst = b !== -1 && (l === -1 || b < l);
    const next = boldFirst ? b : l;
    if (next === -1) {
      out.push({ kind: "text", value: text.slice(i) });
      break;
    }
    if (next > i) out.push({ kind: "text", value: text.slice(i, next) });
    if (boldFirst) {
      const close = text.indexOf("**", next + 2);
      if (close === -1) {
        out.push({ kind: "text", value: text.slice(next) });
        break;
      }
      out.push({ kind: "bold", value: text.slice(next + 2, close) });
      i = close + 2;
    } else {
      const mid = text.indexOf("](", next);
      const close = mid === -1 ? -1 : text.indexOf(")", mid + 2);
      if (mid === -1 || close === -1) {
        out.push({ kind: "text", value: "[" });
        i = next + 1;
        continue;
      }
      out.push({ kind: "link", value: text.slice(next + 1, mid), href: text.slice(mid + 2, close) });
      i = close + 1;
    }
  }
  return out;
}

function Rich({ text }: { text: string }) {
  return (
    <>
      {tokenize(text).map((tok, i) => {
        if (tok.kind === "bold") {
          return (
            <strong key={i} className="font-medium text-[color:var(--ink)]">
              {tok.value}
            </strong>
          );
        }
        if (tok.kind === "link") {
          return (
            <a key={i} href={tok.href} className="underline-draw text-[color:var(--ink)]">
              {tok.value}
            </a>
          );
        }
        return <span key={i}>{tok.value}</span>;
      })}
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
                      <Rich text={p} />
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((item) => (
                        <li
                          key={item.slice(0, 40)}
                          className="text-[15px] leading-relaxed text-[color:var(--ink-mid)] pl-5 relative before:content-['—'] before:absolute before:left-0"
                        >
                          <Rich text={item} />
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
