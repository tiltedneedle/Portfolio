"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

// Frozen at build time; the Footer effect corrects it if the visitor's year differs.
const BUILD_YEAR = new Date().getFullYear();

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/tiltedneedle/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/@tiltedneedle" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/tilted-needle" },
  { label: "YouTube", href: "https://www.youtube.com/@tiltedneedle" },
];

const footerLinks = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
  { label: "Results", href: "/#results" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/#contact" },
  { label: "Book a Demo", href: "/book-demo" },
];

const socialPaths: Record<string, string> = {
  Instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  TikTok:
    "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
  LinkedIn:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
};

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // These pages are statically prerendered, so `new Date()` during render baked
  // the build year into the HTML — stale from every 1 January until the next
  // deploy, and a hydration mismatch the moment the client disagreed. The first
  // client render deliberately matches the server, then the effect corrects it.
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== BUILD_YEAR) setYear(current);
  }, []);

  return (
    <footer className="relative py-20 md:py-24 bg-[#0a0a0a]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.1)] to-transparent" />

      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <Link href="/">
              <motion.span
                className="inline-flex items-center gap-2.5 text-2xl font-semibold text-[#f5f5f7] transition-all duration-300 hover:text-white mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  src="/white-logo.png"
                  alt="Tilted Needle"
                  width={28}
                  height={28}
                  className="object-contain"
                />
                Tilted Needle
              </motion.span>
            </Link>

            <p className="text-[15px] text-[#86868b] leading-relaxed max-w-sm mb-6">
              Short-form specialists with a full growth stack. Turning brands into cultural
              moments.
            </p>

            <div className="flex gap-4 mb-8">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-[#1c1c1e] flex items-center justify-center text-[#86868b] hover:text-white hover:bg-[#2c2c2e] transition-colors duration-300"
                  aria-label={social.label}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={socialPaths[social.label]} />
                  </svg>
                </motion.a>
              ))}
            </div>

            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[15px] font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Book a Demo
                <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </div>

          <div>
            <h3 className="text-[12px] text-[#86868b] uppercase tracking-[0.08em] font-medium mb-4">
              Navigate
            </h3>
            <nav className="flex flex-col gap-3">
              {footerLinks.map((link) => {
                const isHash = link.href.startsWith("/#");
                const content = (
                  <motion.span
                    onMouseEnter={() => setHoveredLink(link.label)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="relative text-[15px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors duration-300 w-fit block"
                  >
                    {link.label}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#f5f5f7]"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: hoveredLink === link.label ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                    />
                  </motion.span>
                );

                return isHash ? (
                  <a key={link.label} href={link.href}>
                    {content}
                  </a>
                ) : (
                  <Link key={link.label} href={link.href}>
                    {content}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <h3 className="text-[12px] text-[#86868b] uppercase tracking-[0.08em] font-medium mb-4">
              Get in touch
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:info@tiltedneedle.com"
                className="block text-[15px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors duration-300"
              >
                info@tiltedneedle.com
              </a>
              <p className="text-[15px] text-[#a1a1a6]">London · Dubai · Global</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE_OUT_EXPO }}
          className="h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.08)] to-transparent mb-10"
          style={{ transformOrigin: "center" }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <p className="text-[12px] text-[#86868b]">
            © {year} Tilted Needle. All rights reserved.
          </p>
          <div className="flex gap-6">
            <motion.a
              href="/privacy"
              whileHover={{ color: "#a1a1a6" }}
              className="text-[12px] text-[#86868b] transition-colors duration-300"
            >
              Privacy Policy
            </motion.a>
            <motion.a
              href="/terms"
              whileHover={{ color: "#a1a1a6" }}
              className="text-[12px] text-[#86868b] transition-colors duration-300"
            >
              Terms of Service
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 text-[13px] text-[#86868b] hover:text-[#f5f5f7] transition-colors duration-300"
          >
            <motion.span
              animate={reduced ? {} : { y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              ↑
            </motion.span>
            Back to top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
