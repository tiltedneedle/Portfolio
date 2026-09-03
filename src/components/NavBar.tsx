"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CutLink } from "@/components/room/CutLink";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

/**
 * The nav is a slate: four numbered rooms in mono, the wordmark, and on a
 * phone a single word that opens the list. The numbers are real order: the
 * home page runs work, then the studio, and contact closes it.
 */
const rooms = [
  { n: "01", label: "Work", href: "/#work" },
  { n: "02", label: "Studio", href: "/services" },
  { n: "03", label: "Library", href: "/portfolio" },
  { n: "04", label: "Contact", href: "/#contact" },
];

const more = [
  { label: "Careers", href: "/careers" },
  { label: "Book a demo", href: "/book-demo" },
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/tiltedneedle/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/@tiltedneedle" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tilted-needle" },
  { label: "YouTube", href: "https://www.youtube.com/@tiltedneedle" },
];

function RoomLink({
  href,
  className,
  onClick,
  children,
}: {
  href: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  if (href.startsWith("/#")) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <CutLink href={href} className={className} onClick={onClick}>
      {children}
    </CutLink>
  );
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled((prev) => (prev === y > 24 ? prev : y > 24));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  const isActive = (href: string) => !href.startsWith("/#") && pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          scrolled && !open
            ? "bg-[rgba(11,11,12,0.78)] backdrop-blur-xl border-b border-[color:var(--rule)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="flex h-14 items-center justify-between px-6 md:h-16 md:px-14" aria-label="Primary">
          <CutLink href="/" className="inline-flex items-center gap-3" aria-label="Tilted Needle, home">
            <Image src="/white-logo.png" alt="" width={22} height={22} className="object-contain" />
            <span className="display text-[15px] font-bold tracking-[0.08em] text-[color:var(--ink)]">
              Tilted Needle
            </span>
          </CutLink>

          <div className="hidden items-center gap-8 md:flex">
            {rooms.map((r) => (
              <RoomLink
                key={r.href}
                href={r.href}
                className={cn("slate-link", isActive(r.href) && "text-[color:var(--ink)]")}
              >
                <span aria-hidden="true" className="mr-1.5 text-[color:var(--ink-faint)]">
                  {r.n}
                </span>
                {r.label}
              </RoomLink>
            ))}
            <span aria-hidden="true" className="h-3 w-px bg-[color:var(--rule-strong)]" />
            <CutLink href="/book-demo" className="slate-link text-[color:var(--ink)]">
              Book a demo
            </CutLink>
          </div>

          <button
            type="button"
            className="slate-link text-[color:var(--ink)] md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="room-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="room-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
            className="fixed inset-0 z-40 bg-[color:var(--stage)] md:hidden"
          >
            <nav className="flex h-full flex-col justify-between px-6 pb-10 pt-24" aria-label="Menu">
              <ul className="flex flex-col gap-5">
                {rooms.map((r, i) => (
                  <motion.li
                    key={r.href}
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.5, ease: EASE_OUT_EXPO }}
                  >
                    <RoomLink href={r.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4">
                      <span aria-hidden="true" className="mono">
                        {r.n}
                      </span>
                      <span className="display text-[56px] text-[color:var(--ink)]">{r.label}</span>
                    </RoomLink>
                  </motion.li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-8 border-t border-[color:var(--rule)] pt-6">
                <ul className="flex flex-col gap-3">
                  {more.map((m) => (
                    <li key={m.href}>
                      <CutLink href={m.href} onClick={() => setOpen(false)} className="slate-link text-[color:var(--ink)]">
                        {m.label}
                      </CutLink>
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-3">
                  {socials.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="slate-link">
                        {s.label} &#8599;
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
