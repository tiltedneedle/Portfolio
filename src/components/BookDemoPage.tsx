"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Shield, Star, Video } from "lucide-react";

const stats = [
  { value: "2B+", label: "Organic Views" },
  { value: "$250M+", label: "Revenue Generated" },
  { value: "11+", label: "Flagship Clients" },
];

const expectations = [
  "Deep dive into your brand goals and challenges",
  "Custom strategy recommendations for your business",
  "Platform and channel analysis for your audience",
  "Clear pricing and timeline overview",
  "No obligation, just honest, expert advice",
];

export function BookDemoPage() {
  const reduced = useReducedMotion();
  const [schedulerLoaded, setSchedulerLoaded] = useState(false);

  // Calendly posts a message once its widget paints — use it to drop the spinner.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.data?.event === "calendly.profile_page_viewed" ||
        event.data?.event === "calendly.event_type_viewed"
      ) {
        setSchedulerLoaded(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const reveal = reduced ? {} : { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="bg-black min-h-screen">
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#2997ff]/[0.07] to-transparent blur-[120px] rounded-full" />
        </div>

        <div className="mx-auto max-w-[1200px] px-6 relative">
          <motion.div
            {...reveal}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1c1e] border border-white/[0.06] text-[13px] text-[#86868b] mb-8">
              <Clock className="w-3.5 h-3.5 text-[#2997ff]" />
              Free 30-minute strategy session
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[72px] font-semibold tracking-[-0.03em] leading-[1.05] text-[#f5f5f7] mb-5">
              Let&apos;s build your
              <br />
              <span className="bg-gradient-to-r from-[#2997ff] to-[#af52de] bg-clip-text text-transparent">
                growth strategy
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[#86868b] max-w-xl mx-auto leading-relaxed">
              Book a call with our team. We&apos;ll map out a custom plan to scale your brand. No
              strings attached.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative pb-12 md:pb-16">
        <div className="mx-auto max-w-[720px] px-6">
          <motion.div
            {...reveal}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center py-5 rounded-2xl bg-[#1c1c1e]/50 border border-white/[0.04]"
              >
                <p className="text-2xl md:text-3xl font-semibold text-[#f5f5f7] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[13px] text-[#86868b] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative pb-20 md:pb-28">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-start">
            <div className="relative order-2 lg:order-1" style={{ minHeight: "700px" }}>
              {!schedulerLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1c1c1e] rounded-2xl z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#2997ff] border-t-transparent rounded-full animate-spin" />
                    <p className="text-[13px] text-[#86868b]">Loading scheduler…</p>
                  </div>
                </div>
              )}
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/editor-novasma/30min?hide_event_type_details=1&hide_gdpr_banner=1"
                style={{ minWidth: "320px", height: "700px" }}
              />
            </div>

            <motion.div
              {...reveal}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="order-1 lg:order-2 space-y-6"
            >
              <div className="p-6 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.05]">
                <h2 className="text-[17px] font-semibold text-[#f5f5f7] mb-5 flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-[#2997ff]" />
                  What to expect
                </h2>
                <div className="space-y-3.5">
                  {expectations.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-[18px] h-[18px] text-[#30d158] flex-shrink-0 mt-0.5" />
                      <span className="text-[14px] text-[#a1a1a6] leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#1c1c1e]/60 border border-white/[0.05]">
                <h2 className="text-[17px] font-semibold text-[#f5f5f7] mb-4 flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-[#2997ff]" />
                  Call details
                </h2>
                <div className="space-y-3 text-[14px] text-[#a1a1a6]">
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span>Duration</span>
                    <span className="text-[#f5f5f7] font-medium">30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span>Format</span>
                    <span className="text-[#f5f5f7] font-medium">Video call</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span>Cost</span>
                    <span className="text-[#30d158] font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>Location</span>
                    <span className="text-[#f5f5f7] font-medium">Google Meet</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1c1c1e]/80 to-[#1c1c1e]/40 border border-white/[0.05]">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-[#2997ff] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] text-[#f5f5f7] font-medium mb-1">
                      No commitment required
                    </p>
                    <p className="text-[13px] text-[#86868b] leading-relaxed">
                      This is a free strategy session. Come with questions, leave with a plan. No
                      pressure, no contracts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-[13px] text-[#86868b] mb-1.5">Prefer email instead?</p>
                <a
                  href="mailto:info@tiltedneedle.com"
                  className="text-[15px] text-[#f5f5f7] hover:text-[#2997ff] transition-colors inline-flex items-center gap-2 group"
                >
                  info@tiltedneedle.com
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-28 border-t border-white/[0.04]">
        <div className="mx-auto max-w-[640px] px-6 text-center">
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-[#f5f5f7] tracking-[-0.02em] mb-4">
              Not ready for a call yet?
            </h2>
            <p className="text-[16px] text-[#86868b] leading-relaxed mb-8">
              Explore our work and see how we&apos;ve helped brands generate billions of views.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[15px] font-medium transition-all duration-200 hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
              >
                View Our Work
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-7 py-3.5 text-[#f5f5f7] border border-white/20 rounded-full text-[15px] font-medium transition-all duration-200 hover:border-white/40 hover:bg-white/[0.04] hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
