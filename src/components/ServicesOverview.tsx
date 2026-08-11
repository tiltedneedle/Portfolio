"use client";

import {
  useRef,
  type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion,
  useReducedMotion,
  useScroll,
  useTransform } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Target,
  Users,
  Video,
} from "lucide-react";
import { servicesList, type ServiceIconName } from "@/lib/services-data";
import { EASE_OUT_EXPO, SECTION_Y_INNER } from "@/lib/design-tokens";

const ICONS: Record<ServiceIconName, ReactNode> = {
  Video: <Video className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
};

const heroStats = [
  { value: "2B+", label: "Organic Views (12 mo)" },
  { value: "$250M+", label: "Revenue Generated" },
  { value: "Global", label: "London & Dubai" },
];

export function ServicesOverview() {
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <>
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-black min-h-[85vh] flex items-center"
      >
        <motion.div style={{ scale: reduced ? 1 : videoScale }} className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
        </motion.div>

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          animate={reduced ? {} : { x: [0, 30, -20, 0], y: [0, -40, 20, 0], opacity: [0.15, 0.3, 0.2, 0.15] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#2997ff]/20 blur-[150px] pointer-events-none"
        />
        <motion.div
          animate={reduced ? {} : { x: [0, -25, 15, 0], y: [0, 30, -20, 0], opacity: [0.1, 0.2, 0.15, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[5%] w-[350px] h-[350px] rounded-full bg-[#af52de]/15 blur-[130px] pointer-events-none"
        />

        <motion.div
          style={{ opacity: reduced ? 1 : heroOpacity }}
          className="mx-auto max-w-[1200px] px-6 relative w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
            className="text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-[#2997ff] text-[17px] font-medium mb-4"
            >
              Our Services
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.3, duration: 1, ease: EASE_OUT_EXPO }}
              className="text-5xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.03em] leading-[1.05] text-[#f5f5f7] mb-6"
            >
              Everything your brand
              <br />
              <span
                className="bg-gradient-to-r from-[#a1a1a6] via-[#f5f5f7] to-[#a1a1a6] bg-clip-text text-transparent animate-gradient-shift"
                style={{ backgroundSize: "200% 100%" }}
              >
                needs to grow.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl md:text-[22px] text-[#86868b] max-w-2xl mx-auto leading-relaxed mb-10"
            >
              From viral content creation to full-funnel performance marketing. A complete growth
              stack built to scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link href="/book-demo">
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[17px] font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                >
                  Book a Demo
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-16 bg-[#0a0a0a] border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(41,151,255,0.04),transparent_70%)]" />
        <div className="mx-auto max-w-[1000px] px-6 relative">
          <div className="grid grid-cols-3 gap-8">
            {heroStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6, ease: EASE_OUT_EXPO }}
                className="text-center"
              >
                <div className="text-3xl md:text-5xl lg:text-[56px] font-semibold text-[#f5f5f7] tracking-[-0.02em]">
                  {stat.value}
                </div>
                <div className="mt-2 text-[12px] md:text-[15px] text-[#86868b] uppercase tracking-[0.08em]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative ${SECTION_Y_INNER} bg-black overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0d0d0d]" />

        <div className="absolute top-[5%] left-[-5%] w-[350px] h-[250px] rounded-3xl overflow-hidden opacity-[0.04] rotate-[-8deg] pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop"
            alt=""
            fill
            sizes="350px"
            className="object-cover"
          />
        </div>
        <div className="absolute top-[35%] right-[-8%] w-[300px] h-[200px] rounded-3xl overflow-hidden opacity-[0.035] rotate-[6deg] pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
            alt=""
            fill
            sizes="300px"
            className="object-cover"
          />
        </div>
        <div className="absolute bottom-[10%] left-[3%] w-[280px] h-[200px] rounded-3xl overflow-hidden opacity-[0.03] rotate-[4deg] pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop"
            alt=""
            fill
            sizes="280px"
            className="object-cover"
          />
        </div>

        <motion.div
          animate={reduced ? {} : { opacity: [0, 0.15, 0], y: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          className="absolute left-1/2 w-px h-[200px] bg-gradient-to-b from-transparent via-[#2997ff] to-transparent pointer-events-none"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="mx-auto max-w-[1200px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              What we do.
            </h2>
            <p className="mt-6 text-xl md:text-[22px] text-[#86868b] max-w-xl mx-auto">
              Four core capabilities. One integrated growth engine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {servicesList.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: reduced ? 0 : 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.6, ease: EASE_OUT_EXPO }}
              >
                <Link href={`/services/${service.slug}`}>
                  <motion.div
                    whileHover={{ y: -6, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
                    className="group relative p-8 md:p-10 rounded-[28px] bg-gradient-to-b from-[#1c1c1e] to-[#161616] h-full cursor-pointer elevate-static-lg sheen"
                  >
                    <div
                      className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`}
                    />

                    <motion.div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {ICONS[service.iconName]}
                    </motion.div>

                    <h3 className="text-[22px] md:text-[24px] font-semibold text-[#f5f5f7] mb-2 group-hover:text-white transition-colors duration-300">
                      {service.title}
                    </h3>

                    <p
                      className={`text-[15px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
                    >
                      {service.tagline}
                    </p>

                    <p className="text-[15px] text-[#86868b] leading-relaxed mb-6 group-hover:text-[#a1a1a6] transition-colors duration-300">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {service.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 rounded-full bg-white/[0.04] text-[12px] text-[#a1a1a6] font-medium group-hover:bg-white/[0.07] transition-colors duration-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-[15px] text-[#f5f5f7] group-hover:text-white transition-colors">
                      Learn more
                      <motion.span
                        className="inline-block"
                        animate={reduced ? {} : { x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`relative ${SECTION_Y_INNER} bg-[#0a0a0a] overflow-hidden`}>
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.08]"
          >
            <source
              src="https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]" />
        </div>

        <motion.div
          animate={reduced ? {} : { opacity: [0.03, 0.06, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-t from-white/5 to-transparent blur-[150px] pointer-events-none"
        />

        {!reduced && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -80, 0], x: [0, i % 2 ? 20 : -20, 0], opacity: [0, 0.3, 0] }}
                transition={{
                  duration: 6 + 1.5 * i,
                  repeat: Infinity,
                  delay: 1.2 * i,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 rounded-full bg-white"
                style={{ left: `${15 + 14 * i}%`, top: `${60 + (i % 3) * 10}%` }}
              />
            ))}
          </div>
        )}

        <div className="mx-auto max-w-[800px] px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
          >
            <p className="text-[#ff375f] text-[17px] font-medium mb-4">Ready to grow?</p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em] mb-6 leading-tight">
              Let&apos;s build something
              <br />
              extraordinary.
            </h2>
            <p className="text-xl md:text-[22px] text-[#86868b] leading-relaxed mb-10">
              Book a free strategy session and discover how we can accelerate your brand&apos;s
              growth.
            </p>
            <Link href="/book-demo">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-10 py-5 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[17px] font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                Book a Demo
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
