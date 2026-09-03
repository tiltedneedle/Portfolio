"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CutLink } from "@/components/room/CutLink";
import { WordStrip } from "@/components/editorial/WordStrip";

// Frozen at build time; the effect corrects it if the visitor's year differs.
const BUILD_YEAR = new Date().getFullYear();

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/tiltedneedle/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/@tiltedneedle" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tilted-needle" },
  { label: "YouTube", href: "https://www.youtube.com/@tiltedneedle" },
];

const navigate = [
  { label: "Work", href: "/#work" },
  { label: "Studio", href: "/services" },
  { label: "Library", href: "/portfolio" },
  { label: "Careers", href: "/careers" },
  { label: "Book a demo", href: "/book-demo" },
  { label: "Contact", href: "/#contact" },
];

const heading = "mono mb-5 block";
const link = "underline-draw w-fit text-[15px] text-[color:var(--ink-soft)] transition-colors duration-300 hover:text-[color:var(--ink)]";

/** The tail leader. Credits in mono, the crawl above it, nothing floating. */
export function Footer() {
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== BUILD_YEAR) setYear(current);
  }, []);

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] text-[color:var(--ink-soft)]">
      <WordStrip />
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-20">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <CutLink href="/" className="inline-flex items-center gap-3">
              <Image src="/white-logo.png" alt="" width={24} height={24} className="object-contain" />
              <span className="display text-[18px] font-bold tracking-[0.08em] text-[color:var(--ink)]">Tilted Needle</span>
            </CutLink>
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
              A short-form production studio. Founders, brands and creators, cut for the scroll
              and measured in what happened next.
            </p>
            <p className="mono mt-6">London &middot; Dubai &middot; Global</p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className={heading}>Navigate</p>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {navigate.map((n) =>
                n.href.startsWith("/#") ? (
                  <a key={n.href} href={n.href} className={link}>
                    {n.label}
                  </a>
                ) : (
                  <CutLink key={n.href} href={n.href} className={link}>
                    {n.label}
                  </CutLink>
                )
              )}
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className={heading}>Get in touch</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@tiltedneedle.com" className={link}>
                info@tiltedneedle.com
              </a>
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                  {s.label} &#8599;
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-[color:var(--rule)] pt-6 mono md:mt-20 md:flex-row md:items-baseline">
          <p>
            &copy; {year} Tilted Needle <span className="text-[color:var(--ink-faint)]">/</span> End of reel
          </p>
          <div className="flex gap-6">
            <CutLink href="/privacy" className="slate-link">
              Privacy
            </CutLink>
            <CutLink href="/terms" className="slate-link">
              Terms
            </CutLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
