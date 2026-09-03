"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Frozen at build time; the effect corrects it if the visitor's year differs.
const BUILD_YEAR = new Date().getFullYear();

const socials = [
  { label: "instagram", href: "https://www.instagram.com/tiltedneedle/?hl=en" },
  { label: "tiktok", href: "https://www.tiktok.com/@tiltedneedle" },
  { label: "linkedin", href: "https://www.linkedin.com/company/tilted-needle" },
  { label: "youtube", href: "https://www.youtube.com/@tiltedneedle" },
];

const navigate = [
  { label: "services", href: "/services" },
  { label: "work", href: "/#work" },
  { label: "results", href: "/#results" },
  { label: "portfolio", href: "/portfolio" },
  { label: "careers", href: "/careers" },
  { label: "contact", href: "/#contact" },
  { label: "book a demo", href: "/book-demo" },
];

const label = "block text-[12px] font-medium uppercase tracking-[0.08em] text-white/50 mb-5";
const link = "underline-draw text-[15px] text-white/80 hover:text-white transition-colors duration-300 w-fit";

// The closing slab. Ruled columns, text links, no icon buttons or pills —
// the same furniture as the contact section directly above it.
export function Footer() {
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== BUILD_YEAR) setYear(current);
  }, []);

  return (
    <footer className="bg-[color:var(--slab-deep)] text-white border-t border-white/10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-[60px] py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-10">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/white-logo.png"
                alt=""
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="text-[21px] font-light">Tilted Needle</span>
            </Link>
            <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-white/60">
              Short-form specialists with a full growth stack. Turning brands
              into cultural moments.
            </p>
            <p className="mt-6 text-[15px] text-white/80">London &middot; Dubai &middot; Global</p>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <p className={label}>navigate</p>
            <nav className="flex flex-col gap-3">
              {navigate.map((n) =>
                n.href.startsWith("/#") ? (
                  <a key={n.label} href={n.href} className={link}>
                    {n.label}
                  </a>
                ) : (
                  <Link key={n.label} href={n.href} className={link}>
                    {n.label}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className={label}>get in touch</p>
            <div className="flex flex-col gap-3">
              <a href="mailto:info@tiltedneedle.com" className={link}>
                info@tiltedneedle.com
              </a>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-t border-white/10 pt-6 text-[12px] text-white/45">
          <p>&copy; {year} Tilted Needle. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="underline-draw hover:text-white/80 transition-colors">
              privacy
            </Link>
            <Link href="/terms" className="underline-draw hover:text-white/80 transition-colors">
              terms
            </Link>
            <a href="#top" className="underline-draw hover:text-white/80 transition-colors">
              back to top <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
