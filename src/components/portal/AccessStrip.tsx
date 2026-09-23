"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { home } from "@/content/system/home";
import { useClient } from "@/components/portal/ClientContext";
import { shortName } from "@/content/clients/types";

/**
 * What you have access to: the seven parts of the system racked on a strip.
 * On desktop the section pins and vertical scroll shuttles the strip
 * sideways, with a ruler underneath reading where you are. On a phone the
 * cards stack. Lifted from the studio site's film sequence, which is the
 * move the client liked most.
 */
const items = home.access;
const n = items.length;

export function AccessStrip() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(0);
  const who = shortName(useClient());

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const isMobile = !window.matchMedia("(min-width: 768px)").matches;
      setMobile(isMobile);
      setRange(isMobile ? 0 : Math.max(0, el.scrollWidth - window.innerWidth));
    };
    measure();
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) measure();
    });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      live = false;
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);
  const playhead = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))));
    setActive((prev) => (prev === i ? prev : i));
  });

  const focusCard = (i: number) => {
    const el = section.current;
    if (!el || mobile || range === 0) return;
    requestAnimationFrame(() => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + (range * i) / (n - 1), behavior: "auto" });
    });
  };

  return (
    <section
      id="access"
      ref={section}
      className="relative scroll-mt-16 bg-[color:var(--stage)]"
      style={{ height: range > 0 ? "calc(100svh + " + range + "px)" : undefined }}
    >
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:flex-col md:justify-center md:overflow-clip">
        <motion.div
          ref={track}
          style={mobile ? undefined : { x }}
          className="flex flex-col md:w-max md:flex-row md:items-stretch md:gap-5 md:px-[8vw]"
        >
          <div className="w-full shrink-0 px-6 py-20 md:flex md:w-[34vw] md:flex-col md:justify-center md:py-0 md:pr-14">
            <p className="mono">02 &mdash; What you have access to</p>
            <h2 className="display mt-4 text-[clamp(52px,6.5vw,110px)]">
              Seven <span className="em-serif">parts.</span>
            </h2>
            <p className="mt-6 max-w-[34ch] text-[17px] leading-relaxed text-[color:var(--ink-soft)]">
              Four written for {who}. Three the same for everyone. All of it yours, for as long as you want it.
            </p>
            <p className="mono mt-8 max-md:hidden">Scroll to shuttle &middot; click to open</p>
          </div>

          {items.map((it, i) => (
            <div key={it.n} className="w-full shrink-0 px-6 py-3 md:w-auto md:px-0 md:py-0">
              <CutLink
                href={it.href}
                onFocus={() => focusCard(i)}
                data-cursor="Open"
                className={
                  "group relative flex min-h-[380px] w-full flex-col justify-between overflow-hidden border bg-[color:var(--stage-2)] p-6 transition-colors duration-500 md:h-[66svh] md:w-[calc(66svh*0.72)] md:p-8 " +
                  (active === i && !mobile ? "border-[color:var(--rule-strong)]" : "border-[color:var(--rule)] hover:border-[color:var(--rule-strong)]")
                }
              >
                <span aria-hidden="true" className="numeral pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 text-[200px] opacity-50 md:text-[240px]">
                  {it.n}
                </span>
                <span className="mono relative flex items-center justify-between">
                  <span>{it.n}</span>
                  {it.personalised ? (
                    <span className="flex items-center gap-2 text-[color:var(--ink)]">
                      <span className="lamp" aria-hidden="true" />
                      For {who}
                    </span>
                  ) : (
                    <span className="text-[color:var(--ink-faint)]">Same for everyone</span>
                  )}
                </span>
                <span className="relative">
                  <span className="display block max-w-[10ch] text-[clamp(34px,3.4vw,54px)] leading-[0.92] text-[color:var(--ink)]">{it.title}</span>
                  <span className="mt-4 block max-w-[32ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">{it.text}</span>
                  <span className="mono mt-6 block text-[color:var(--ink-soft)] transition-colors group-hover:text-[color:var(--ink)]">
                    Open <span aria-hidden="true">&#8599;</span>
                  </span>
                </span>
              </CutLink>
            </div>
          ))}
        </motion.div>

        <div className="mx-[8vw] mt-8 max-md:hidden">
          <div className="relative h-6 border-t border-[color:var(--rule-strong)]">
            {items.map((it, i) => (
              <span
                key={it.n}
                aria-hidden="true"
                className="absolute top-0 mono text-[10px]"
                style={{ left: (i / (n - 1)) * 100 + "%", transform: "translateX(-50%)" }}
              >
                <span className="mx-auto block h-2 w-px bg-[color:var(--rule-strong)]" />
                <span className="mt-1 block">{it.n}</span>
              </span>
            ))}
            <motion.span
              aria-hidden="true"
              style={{ left: playhead }}
              className="absolute -top-px h-4 w-[2px] -translate-x-1/2 bg-[color:var(--tally)] shadow-[0_0_8px_var(--tally-glow)]"
            />
          </div>
          <div className="mono mt-3 flex items-center justify-between">
            <span>
              Part {items[active].n} / {String(n).padStart(2, "0")}
            </span>
            <span className="text-[color:var(--ink-soft)]">{items[active].title}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
