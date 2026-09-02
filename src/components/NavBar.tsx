"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, SHIFT } from "@/lib/design-tokens";

const serviceLinks = [
  { href: "/services/content-creation", label: "Content Creation" },
  { href: "/services/influencer-marketing", label: "Influencer Marketing" },
  { href: "/services/paid-advertising-performance", label: "Paid & Performance" },
  { href: "/services/app-web-development", label: "App & Web Development" },
];

const navLinks = [
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/#work", label: "Work" },
  { href: "/#results", label: "Results" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Careers" },
  { href: "/#contact", label: "Contact" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // The bar sits on two different grounds: a dark hero at the top of "/", and
  // paper everywhere else — and everywhere once scrolled. One fixed colour
  // cannot serve both, so the ink treatment keys off this.
  const onPaper = scrolled || pathname !== "/careers";

  useEffect(() => {
    let ticking = false;
    const sections = ["work", "services", "results", "contact"];

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled((prev) => (prev === y > 20 ? prev : y > 20));

      if (pathname === "/") {
        let current = "";
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && y >= el.offsetTop - 200) current = `/#${id}`;
        }
        if (current) setActiveSection((prev) => (prev === current ? prev : current));
      }
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
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/services")) setActiveSection("/services");
    else if (pathname === "/careers") setActiveSection("/careers");
    else if (pathname === "/book-demo") setActiveSection("/book-demo");
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-[rgba(244,244,244,0.82)] backdrop-blur-2xl border-b border-black/[0.08]"
            : "bg-transparent"
        )}
      >
        <nav className="mx-auto max-w-[980px] px-6">
          <div className="flex h-12 items-center justify-between">
            <Link href="/">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "inline-flex items-center gap-2 text-[15px] font-medium transition-colors duration-300",
                  onPaper ? "text-[color:var(--ink)]" : "text-white"
                )}
              >
                <Image
                  src="/white-logo.png"
                  alt="Tilted Needle"
                  width={32}
                  height={32}
                  className={cn("object-contain", onPaper && "invert")}
                />
                Tilted Needle
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center gap-8 relative">
              {navLinks.map((link) => {
                const isActive =
                  activeSection === link.href ||
                  (link.href === "/services" && pathname.startsWith("/services"));
                const isHash = link.href.startsWith("/#");

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        setDropdownOpen(true);
                        setHovered(link.href);
                      }}
                      onMouseLeave={() => {
                        closeTimer.current = setTimeout(() => setDropdownOpen(false), 200);
                        setHovered(null);
                      }}
                      // Focus mirrors hover, so the submenu is reachable by keyboard.
                      onFocus={() => {
                        if (closeTimer.current) clearTimeout(closeTimer.current);
                        setDropdownOpen(true);
                      }}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                          setDropdownOpen(false);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Escape" && dropdownOpen) {
                          e.stopPropagation();
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      <Link href={link.href}>
                        <motion.span
                          className={cn(
                            "relative flex text-[12px] transition-all duration-300 py-1 items-center gap-1 cursor-pointer",
                            onPaper
                              ? isActive
                                ? "text-[color:var(--ink)]"
                                : "text-[color:var(--ink-mid)] hover:text-[color:var(--ink)]"
                              : isActive
                                ? "text-white"
                                : "text-white/70 hover:text-white"
                          )}
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 transition-transform duration-300",
                              dropdownOpen ? "rotate-180" : ""
                            )}
                          />
                          <motion.span
                            className={cn(
                          "absolute -bottom-0.5 left-0 right-0 h-px",
                          onPaper ? "bg-[color:var(--ink)]" : "bg-white"
                        )}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: hovered === link.href || isActive ? 1 : 0 }}
                            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                          />
                        </motion.span>
                      </Link>

                      <AnimatePresence>
                        {dropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: SHIFT.sm, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: SHIFT.sm, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[280px] rounded-[2px] bg-[rgba(28,28,30,0.95)] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                          >
                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[rgba(28,28,30,0.95)] border-t border-l border-white/[0.08]" />
                            <div className="p-2 relative">
                              <Link href="/services" onClick={() => setDropdownOpen(false)}>
                                <motion.div
                                  whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                                  className="px-4 py-2.5 rounded-[2px] transition-colors duration-200"
                                >
                                  <span className="text-[13px] font-medium text-[#f5f5f7]">
                                    All Services
                                  </span>
                                  <p className="text-[11px] text-[#86868b] mt-0.5">
                                    View our complete offerings
                                  </p>
                                </motion.div>
                              </Link>
                              <div className="h-px bg-white/[0.06] mx-3 my-1" />
                              {serviceLinks.map((service) => (
                                <Link
                                  key={service.href}
                                  href={service.href}
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  <motion.div
                                    whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                                    className={cn(
                                      "px-4 py-2 rounded-[2px] transition-colors duration-200",
                                      pathname === service.href ? "bg-white/[0.04]" : ""
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "text-[12px] transition-colors duration-200",
                                        pathname === service.href
                                          ? "text-[#f5f5f7] font-medium"
                                          : "text-[#a1a1a6] hover:text-[#f5f5f7]"
                                      )}
                                    >
                                      {service.label}
                                    </span>
                                  </motion.div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                if (isHash) {
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onMouseEnter={() => setHovered(link.href)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        "relative text-[12px] transition-all duration-300 py-1",
                        onPaper
                              ? isActive
                                ? "text-[color:var(--ink)]"
                                : "text-[color:var(--ink-mid)] hover:text-[color:var(--ink)]"
                              : isActive
                                ? "text-white"
                                : "text-white/70 hover:text-white"
                      )}
                    >
                      {link.label}
                      <motion.span
                        className={cn(
                          "absolute -bottom-0.5 left-0 right-0 h-px",
                          onPaper ? "bg-[color:var(--ink)]" : "bg-white"
                        )}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hovered === link.href || isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      />
                    </motion.a>
                  );
                }

                return (
                  <Link key={link.href} href={link.href}>
                    <motion.span
                      onMouseEnter={() => setHovered(link.href)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        // inline-block: as a plain inline span the vertical padding
                        // doesn't expand the box, which left route links (Careers)
                        // 2px shorter and a pixel lower than the hash links.
                        "relative block text-[12px] transition-all duration-300 py-1",
                        onPaper
                              ? isActive
                                ? "text-[color:var(--ink)]"
                                : "text-[color:var(--ink-mid)] hover:text-[color:var(--ink)]"
                              : isActive
                                ? "text-white"
                                : "text-white/70 hover:text-white"
                      )}
                    >
                      {link.label}
                      <motion.span
                        className={cn(
                          "absolute -bottom-0.5 left-0 right-0 h-px",
                          onPaper ? "bg-[color:var(--ink)]" : "bg-white"
                        )}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: hovered === link.href || isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      />
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            <Link href="/book-demo" className="hidden md:flex">
              <motion.span
                className={cn(
                  "flex items-center gap-1 text-[12px] transition-colors duration-300 group",
                  onPaper
                    ? "text-[color:var(--ink-mid)] hover:text-[color:var(--ink)]"
                    : "text-white/70 hover:text-white"
                )}
              >
                Book a Demo
                <motion.span
                  className="inline-block"
                  animate={reduced ? {} : { x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.span>
            </Link>

            <motion.button
              className="md:hidden p-1 text-[#f5f5f7]"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            id="mobile-menu"
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col items-center justify-center h-full gap-10 pt-12">
              {navLinks.map((link, index) => {
                const isHash = link.href.startsWith("/#");

                if (link.hasDropdown) {
                  return (
                    <div key={link.href} className="flex flex-col items-center">
                      <motion.div
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                        transition={{
                          delay: 0.08 * index,
                          duration: 0.5,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="flex flex-col items-center"
                      >
                        <button
                          onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                          className="text-3xl font-extralight text-[#f5f5f7] hover:text-white transition-all duration-300 inline-flex items-center gap-2"
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-300",
                              mobileServicesOpen ? "rotate-180" : ""
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                              className="overflow-hidden mt-4 flex flex-col items-center gap-3"
                            >
                              <Link href="/services" onClick={() => setMobileOpen(false)}>
                                <span className="text-[15px] text-[#2997ff] font-medium">
                                  All Services
                                </span>
                              </Link>
                              {serviceLinks.map((service) => (
                                <Link
                                  key={service.href}
                                  href={service.href}
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <span className="text-[15px] text-[#a1a1a6] hover:text-[#f5f5f7] transition-colors">
                                    {service.label}
                                  </span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  );
                }

                const label = (
                  <motion.span
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                    transition={{
                      delay: 0.08 * index,
                      duration: 0.5,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="text-3xl font-extralight text-[#f5f5f7] hover:text-white transition-all duration-300 hover:scale-105 block"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </motion.span>
                );

                return isHash ? (
                  <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    {label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    {label}
                  </Link>
                );
              })}

              <Link href="/book-demo" onClick={() => setMobileOpen(false)}>
                <motion.span
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT_EXPO }}
                  className="mt-6 px-8 py-4 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[17px] font-medium transition-all duration-300 hover:bg-white hover:scale-105 block"
                >
                  Book a Demo
                </motion.span>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
