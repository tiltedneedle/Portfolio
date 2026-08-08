"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { stats } from "@/lib/site-data";

// Deterministic particle offsets — avoids a hydration mismatch that random
// positions would cause.
const DESKTOP_PARTICLES = [0.23, 0.67, 0.45, 0.91, 0.02, 0.84, 0.38, 0.71];
const MOBILE_PARTICLES = [0.23, 0.67, 0.91];

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 40,
      filter: reduced ? "none" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0.01 : 1, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const particles = isMobile ? MOBILE_PARTICLES : DESKTOP_PARTICLES;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ scale: reduced ? 1 : videoScale }} className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source
            src="https://cdn.pixabay.com/video/2019/02/19/21536-318978190_small.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </motion.div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-[100px] animate-[pulse-orb_8s_ease-in-out_infinite]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-white/8 to-transparent blur-[80px] animate-[pulse-orb_10s_ease-in-out_2s_infinite]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted &&
          !reduced &&
          particles.map((p, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                x: p * window.innerWidth,
                y: window.innerHeight + 50,
              }}
              animate={{ opacity: [0, 0.4, 0.4, 0], y: -100 }}
              transition={{
                duration: 12 + 8 * p,
                repeat: Infinity,
                delay: 0.8 * i,
                ease: "linear",
              }}
              className="absolute w-1 h-1 rounded-full bg-white/60"
            />
          ))}
      </div>

      <motion.div
        style={{
          opacity: reduced ? 1 : opacity,
          scale: reduced ? 1 : scale,
          y: reduced ? 0 : y,
        }}
        className="relative z-10 mx-auto max-w-[1000px] px-6 py-32 text-center"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: reduced ? 0 : 0.12,
                delayChildren: reduced ? 0 : 0.3,
              },
            },
          }}
          initial="hidden"
          animate={mounted ? "visible" : "hidden"}
          className="space-y-8"
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : 60, scale: 0.97 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  duration: reduced ? 0.01 : 1.2,
                  ease: [0.16, 1, 0.3, 1] as const,
                },
              },
            }}
            className="text-5xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.03em] leading-[1.02]"
          >
            <motion.span
              className="block text-[#f5f5f7] animate-text-glow"
              style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
            >
              Built to make brands
            </motion.span>
            <motion.span
              variants={fadeUp}
              className="block bg-gradient-to-r from-[#a1a1a6] via-[#f5f5f7] to-[#a1a1a6] bg-clip-text text-transparent animate-gradient-shift"
              style={{ backgroundSize: "200% 100%" }}
            >
              go viral.
            </motion.span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto max-w-xl text-xl md:text-[22px] text-[#a1a1a6] font-normal leading-[1.5] pt-2"
          >
            Short-form specialists with a full growth stack.
            <br />
            <span className="text-[#f5f5f7]/80">London. Dubai. Global.</span>
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-5 pt-6">
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden rounded-full text-[17px] font-medium transition-all duration-500"
              >
                <span className="absolute inset-0 bg-[#f5f5f7] transition-all duration-300 group-hover:bg-white" />
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white via-[#f5f5f7] to-white animate-shimmer"
                  style={{ backgroundSize: "200% 100%" }}
                />
                <span className="relative text-[#1c1c1e]">Book a Demo</span>
              </motion.span>
            </Link>

            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-transparent text-[#f5f5f7] border border-[rgba(255,255,255,0.3)] rounded-full text-[17px] font-medium transition-all duration-500 hover:border-[rgba(255,255,255,0.5)] backdrop-blur-sm"
            >
              View Work
            </motion.a>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-12 md:pt-16">
            <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: reduced ? 0 : 1 + 0.15 * i,
                    duration: reduced ? 0.01 : 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="text-center group"
                >
                  <motion.div
                    className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#f5f5f7] tracking-[-0.02em] transition-all duration-500 group-hover:scale-105"
                    whileHover={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="mt-2 text-[11px] md:text-[15px] text-[#86868b] uppercase tracking-[0.08em] transition-colors duration-300 group-hover:text-[#a1a1a6]">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[11px] text-[#86868b] uppercase tracking-[0.15em]">Scroll</span>
          <div className="w-6 h-10 border-2 border-[#86868b]/50 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
            <motion.div
              animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0], scale: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-2.5 bg-[#f5f5f7] rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
