"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Database,
  Mail,
  ShoppingBag,
  Target,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { servicesList, type Service } from "@/lib/services-data";

const EASE = [0.16, 1, 0.3, 1] as const;

const ICONS_LG: Record<string, ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  ShoppingBag: <ShoppingBag className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
};

const ICONS_SM: Record<string, ReactNode> = {
  Zap: <Zap className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Code2: <Code2 className="w-5 h-5" />,
};

const glowColor = (gradient: string) =>
  gradient.split(" ")[0].replace("from-[", "").replace("]", "");

export function ServiceDetailPage({ service }: { service: Service }) {
  const reduced = useReducedMotion();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const otherServices = servicesList.filter((s) => s.id !== service.id);

  return (
    <>
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-black min-h-[80vh] flex items-center"
      >
        <motion.div style={{ y: reduced ? 0 : heroY }} className="absolute inset-0">
          <Image
            src={service.imageUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </motion.div>

        <motion.div
          animate={reduced ? {} : { scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[200px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${glowColor(service.gradient)}30, transparent 70%)`,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {!reduced && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -60 - 10 * i, 0], opacity: [0, 0.4, 0] }}
                transition={{
                  duration: 5 + 0.8 * i,
                  repeat: Infinity,
                  delay: 0.7 * i,
                  ease: "easeInOut",
                }}
                className="absolute w-1 h-1 rounded-full bg-white/60"
                style={{ left: `${10 + 11 * i}%`, top: `${50 + (i % 4) * 12}%` }}
              />
            ))}
          </div>
        )}

        <motion.div
          style={{ opacity: reduced ? 1 : heroOpacity }}
          className="mx-auto max-w-[1200px] px-6 relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-[15px] text-[#86868b] mb-8"
          >
            <Link href="/" className="hover:text-[#f5f5f7] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/services" className="hover:text-[#f5f5f7] transition-colors">
              Services
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#f5f5f7]">{service.shortTitle}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.1, duration: 1, ease: EASE }}
              >
                <motion.div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-8 text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {ICONS_LG[service.iconName]}
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] leading-[1.08] text-[#f5f5f7] mb-4">
                  {service.title}
                </h1>

                <p
                  className={`text-2xl md:text-[28px] font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-6`}
                >
                  {service.tagline}
                </p>

                <p className="text-[17px] md:text-[19px] text-[#86868b] leading-relaxed mb-8">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-4">
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
                  <Link href="/services">
                    <motion.span
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-[#f5f5f7] border border-[rgba(255,255,255,0.3)] rounded-full text-[17px] font-medium transition-all duration-300 hover:border-[rgba(255,255,255,0.5)] hover:bg-white/5"
                    >
                      All Services
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: EASE }}
              className="relative"
            >
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
                <div
                  className={`absolute -inset-[2px] rounded-3xl bg-gradient-to-br ${service.gradient} opacity-60`}
                />
                <div className="absolute inset-[2px] rounded-[22px] overflow-hidden bg-[#1c1c1e]">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="relative py-16 bg-[#0a0a0a] border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02),transparent_70%)]" />
        <div className="mx-auto max-w-[900px] px-6">
          <div className="grid grid-cols-3 gap-8">
            {service.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="text-center"
              >
                <div
                  className={`text-3xl md:text-5xl font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent tracking-[-0.02em]`}
                >
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

      <section className="relative py-28 md:py-40 bg-black overflow-hidden">
        <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[500px] h-[400px] rounded-3xl overflow-hidden opacity-[0.04] rotate-[3deg] pointer-events-none hidden lg:block">
          <Image
            src={service.imageUrl}
            alt=""
            fill
            sizes="500px"
            className="object-cover blur-[2px]"
          />
        </div>

        <div className="mx-auto max-w-[800px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p
              className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
            >
              The Deep Dive
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-[48px] font-semibold text-[#f5f5f7] tracking-[-0.025em] leading-tight mb-8">
              Why it matters.
            </h2>
            <p className="text-[17px] md:text-[19px] text-[#a1a1a6] leading-[1.7]">
              {service.longDescription}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <motion.div
          animate={reduced ? {} : { opacity: [0.02, 0.05, 0.02], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-[200px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${glowColor(service.gradient)}15, transparent 70%)`,
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
            <p
              className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
            >
              What&apos;s Included
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              Everything you need.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.features.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * i, duration: 0.5 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.04] group hover:bg-[#1c1c1e] transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity`}
                >
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="text-[17px] text-[#d1d1d6] group-hover:text-white transition-colors">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 bg-black">
        <div className="mx-auto max-w-[1200px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p
              className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
            >
              Why Choose Us
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              The advantage.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {service.benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6, ease: EASE }}
                className="group p-8 rounded-3xl bg-gradient-to-b from-[#1c1c1e] to-[#161616] hover:from-[#222222] hover:to-[#1a1a1a] transition-colors duration-500 elevate-static"
              >
                <div className="flex items-start gap-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                  >
                    <span className="text-white text-[19px] font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[19px] font-semibold text-[#f5f5f7] mb-2 group-hover:text-white transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-[15px] text-[#86868b] leading-relaxed group-hover:text-[#a1a1a6] transition-colors">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: EASE }}
          className={`absolute left-[calc(50%-240px)] md:left-[calc(50%-280px)] top-[200px] bottom-[120px] w-px bg-gradient-to-b ${service.gradient} opacity-[0.08] origin-top hidden lg:block pointer-events-none`}
        />

        <div className="mx-auto max-w-[1000px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p
              className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
            >
              Our Process
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              How it works.
            </h2>
          </motion.div>

          <div className="space-y-6">
            {service.process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: reduced ? 0 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i, duration: 0.6, ease: EASE }}
                className="group flex items-start gap-6 p-6 md:p-8 rounded-2xl bg-[#1c1c1e]/40 border border-white/[0.04] hover:bg-[#1c1c1e] hover:border-white/[0.08] transition-all duration-500"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-[19px] font-bold">
                    {String(step.step).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-[19px] font-semibold text-[#f5f5f7] mb-2 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-[#86868b] leading-relaxed group-hover:text-[#a1a1a6] transition-colors">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {service.secondaryProcess && (
        <section className="relative py-28 md:py-40 bg-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-[#0a0a0a]" />
          <div className="mx-auto max-w-[1000px] px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <p
                className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
              >
                Going Long
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-[#f5f5f7] tracking-[-0.025em]">
                {service.secondaryProcess.title}
              </h2>
              <p className="mt-6 text-[17px] md:text-[19px] text-[#86868b] max-w-2xl mx-auto">
                {service.secondaryProcess.subtitle}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.secondaryProcess.steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: reduced ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 2) * 0.06, duration: 0.5, ease: EASE }}
                  className="group flex items-start gap-5 p-6 rounded-2xl bg-[#1c1c1e]/40 border border-white/[0.04] hover:bg-[#1c1c1e] hover:border-white/[0.08] transition-all duration-500"
                >
                  <div
                    className={`w-11 h-11 rounded-full bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-white text-[15px] font-bold">
                      {String(step.step).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#f5f5f7] mb-1.5 group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-[15px] text-[#86868b] leading-relaxed group-hover:text-[#a1a1a6] transition-colors">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-28 md:py-40 bg-black">
        <div className="mx-auto max-w-[800px] px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p
              className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
            >
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              Common questions.
            </h2>
          </motion.div>

          <div className="space-y-3">
            {service.faq.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.04] hover:bg-[#1c1c1e] transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-[17px] font-medium text-[#f5f5f7]">{item.question}</h3>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-[#86868b] flex-shrink-0" />
                    </motion.div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === i ? "auto" : 0,
                      opacity: openFaq === i ? 1 : 0,
                      marginTop: openFaq === i ? 12 : 0,
                    }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="text-[15px] text-[#86868b] leading-relaxed">{item.answer}</p>
                  </motion.div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0d0d0d]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-tl-3xl overflow-hidden opacity-[0.025] pointer-events-none hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
            alt=""
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>

        <div className="mx-auto max-w-[1200px] px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[#f5f5f7] tracking-[-0.025em]">
              Explore other services
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherServices.slice(0, 6).map((other, i) => (
              <motion.div
                key={other.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * i, duration: 0.5 }}
              >
                <Link href={`/services/${other.slug}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group p-6 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.04] hover:bg-[#1c1c1e] transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${other.gradient} flex items-center justify-center text-white`}
                      >
                        {ICONS_SM[other.iconName]}
                      </div>
                      <h3 className="text-[17px] font-semibold text-[#f5f5f7] group-hover:text-white transition-colors">
                        {other.shortTitle}
                      </h3>
                    </div>
                    <p className="text-[13px] text-[#86868b] leading-relaxed line-clamp-2">
                      {other.tagline}
                    </p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28 md:py-40 bg-black overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-[0.06]"
          >
            <source
              src="https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black" />
        </div>

        <motion.div
          animate={reduced ? {} : { opacity: [0.03, 0.06, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-t from-white/5 to-transparent blur-[150px] pointer-events-none"
        />

        <div className="mx-auto max-w-[800px] px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p
              className={`text-[17px] font-medium bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent mb-4`}
            >
              Ready to get started?
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em] mb-6 leading-tight">
              Let&apos;s grow your brand.
            </h2>
            <p className="text-xl md:text-[22px] text-[#86868b] leading-relaxed mb-10">
              Book a free strategy session and see how {service.shortTitle} can transform your
              business.
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
