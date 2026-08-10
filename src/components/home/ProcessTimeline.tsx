"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Camera,
  Code2,
  Layers,
  Lightbulb,
  Megaphone,
  PenLine,
  Scissors,
  Search,
  Send,
  Settings2,
  TrendingUp,
  Users,
} from "lucide-react";
import { servicesList } from "@/lib/services-data";
import { SECTION_Y, SHIFT } from "@/lib/design-tokens";

const EASE = [0.16, 1, 0.3, 1] as const;

const FALLBACK_ICONS = [Search, Lightbulb, PenLine, Camera, Scissors, Send, TrendingUp];

// Picks a glyph from the step title so each track reads at a glance.
function stepIcon(title: string, index: number): ReactNode {
  const t = title.toLowerCase();
  const cls = "w-6 h-6";

  if (/sourc|brief|negoti/.test(t)) return <Users className={cls} />;
  if (/discover|onboard|analysis|audit|channel/.test(t)) return <Search className={cls} />;
  if (/ideation/.test(t)) return <Lightbulb className={cls} />;
  if (/script|writing|structure/.test(t)) return <PenLine className={cls} />;
  if (/research|strateg/.test(t)) return <BarChart3 className={cls} />;
  if (/edit|post-production|clipping|creative/.test(t)) return <Scissors className={cls} />;
  if (/film|coaching|production/.test(t)) return <Camera className={cls} />;
  if (/publish|distribut|launch/.test(t)) return <Send className={cls} />;
  if (/analytic|optimi|improv|scale|report|growth|perform/.test(t))
    return <TrendingUp className={cls} />;
  if (/design|ui\/ux/.test(t)) return <Layers className={cls} />;
  if (/build|develop|full-stack/.test(t)) return <Code2 className={cls} />;
  if (/integrat|secur/.test(t)) return <Settings2 className={cls} />;
  if (/placement|press|digital pr/.test(t)) return <Megaphone className={cls} />;

  const Fallback = FALLBACK_ICONS[index % FALLBACK_ICONS.length];
  return <Fallback className={cls} />;
}

const tracks = servicesList.map((service) => ({
  id: service.slug,
  label: service.shortTitle,
  subtitle: service.tagline,
  steps: service.process,
}));

export function ProcessTimeline() {
  const reduced = useReducedMotion();
  const [activeTrack, setActiveTrack] = useState(tracks[0].id);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const track = tracks.find((t) => t.id === activeTrack) ?? tracks[0];
  const stepCount = track.steps.length;
  const openStepData = track.steps.find((s) => s.step === openStep);

  const gridCols =
    stepCount === 5 || stepCount === 10
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 max-w-[1100px]"
      : stepCount <= 4
        ? "grid-cols-2 sm:grid-cols-4 max-w-[900px]"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-[920px]";

  return (
    <section id="process" className={`${SECTION_Y} relative overflow-hidden bg-[#0a0a0a]`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0d0d0d]" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div ref={containerRef} className="mx-auto max-w-[1200px] px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-10"
        >
          <p className="text-[#30d158] text-[17px] font-medium mb-4">Our Process</p>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#f5f5f7] tracking-[-0.025em] leading-[1.1]">
            Tailored to every service.
          </h2>
          <p className="mt-6 text-xl md:text-[22px] text-[#86868b] max-w-2xl mx-auto leading-relaxed">
            Each service runs on its own proven, end-to-end process. Choose one to see exactly
            how we work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex flex-wrap justify-center p-1 rounded-[20px] md:rounded-full bg-[#1c1c1e] border border-white/[0.06] max-w-full gap-1">
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTrack(t.id);
                  setOpenStep(null);
                }}
                className={`relative px-4 md:px-6 py-2.5 rounded-full text-[12px] md:text-[15px] font-medium transition-colors duration-300 whitespace-nowrap ${
                  activeTrack === t.id ? "text-black" : "text-[#86868b] hover:text-white"
                }`}
              >
                {activeTrack === t.id && (
                  <motion.span
                    layoutId="process-tab-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="text-center mb-14 min-h-[24px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={track.id}
              initial={{ opacity: 0, y: SHIFT.sm }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[15px] text-[#86868b]"
            >
              {track.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: reduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -16 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className={`grid ${gridCols} gap-x-4 gap-y-12 justify-items-center mx-auto`}>
              {track.steps.map((step, i) => {
                const isOpen = openStep === step.step;
                const isHovered = hoveredStep === step.step;

                return (
                  <motion.div
                    key={`${track.id}-${step.step}`}
                    initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.04 * i, ease: EASE }}
                    onMouseEnter={() => setHoveredStep(step.step)}
                    onMouseLeave={() => setHoveredStep(null)}
                    onClick={() => setOpenStep(isOpen ? null : step.step)}
                    className="relative cursor-pointer group flex flex-col items-center w-full max-w-[180px]"
                  >
                    <div className="relative w-[64px] h-[64px] mb-5">
                      <motion.div
                        animate={
                          isHovered && !reduced
                            ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }
                            : { opacity: 0 }
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[#30d158]/30 blur-xl"
                      />
                      <div
                        className={`relative w-full h-full rounded-full flex items-center justify-center transition-all duration-500 ${
                          isHovered || isOpen
                            ? "bg-gradient-to-br from-[#30d158] to-[#2997ff] text-white"
                            : "bg-[#1c1c1e] border border-[#3c3c3e] text-[#86868b]"
                        }`}
                      >
                        {stepIcon(step.title, i)}
                      </div>
                      <div className="absolute -top-1 right-0 translate-x-1">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors duration-300 ${
                            isHovered || isOpen
                              ? "bg-[#30d158] text-black"
                              : "bg-[#2c2c2e] text-[#a1a1a6]"
                          }`}
                        >
                          {String(step.step).padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <h3
                      className={`text-[15px] font-semibold text-center leading-snug transition-colors duration-300 ${
                        isHovered || isOpen ? "text-white" : "text-[#f5f5f7]"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={false}
              animate={{
                height: openStepData ? "auto" : 0,
                opacity: openStepData ? 1 : 0,
                marginTop: openStepData ? 48 : 0,
              }}
              transition={{ duration: 0.5, ease: EASE }}
              className="overflow-hidden"
            >
              {openStepData && (
                <motion.div
                  key={`${track.id}-${openStep}-panel`}
                  initial={{ opacity: 0, y: SHIFT.md }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-6 p-7 md:p-8 rounded-3xl bg-[#1c1c1e] border border-white/5 max-w-3xl mx-auto"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#30d158] to-[#2997ff] flex items-center justify-center flex-shrink-0 text-white">
                    {stepIcon(openStepData.title, openStep ? openStep - 1 : 0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#30d158] text-black text-[12px] font-semibold">
                        Step {String(openStep).padStart(2, "0")}
                      </span>
                      <h4 className="text-xl md:text-2xl font-semibold text-white">
                        {openStepData.title}
                      </h4>
                    </div>
                    <p className="text-[17px] text-[#a1a1a6] leading-relaxed">
                      {openStepData.description}
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-[13px] text-[#86868b] flex items-center justify-center gap-1.5"
        >
          Tap any step to learn more <ArrowRight className="w-3.5 h-3.5" />
        </motion.p>
      </div>
    </section>
  );
}
