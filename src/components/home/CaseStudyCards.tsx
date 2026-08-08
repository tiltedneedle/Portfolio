"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { VideoModal } from "@/components/VideoModal";
import { loadedSrcs, releaseSlot, requestSlot } from "@/lib/video-slots";
import type { CaseStudy } from "@/lib/case-studies-data";
import type { ModalItem } from "@/lib/site-data";

export function CaseStudyCards({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [selected, setSelected] = useState<ModalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});
  const started = useRef(new Set<string>());

  const cardVariants = {
    hidden: { opacity: 0, y: reduced ? 0 : 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // Lazily attach + play each card's video once it nears the viewport, gated by
  // the shared slot limiter so six videos don't fetch at once.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.studyId;
          if (!id || !entry.isIntersecting || started.current.has(id)) return;
          started.current.add(id);

          const video = videoRefs.current[id];
          const study = caseStudies.find((s) => s.id === id);
          if (!video || !study?.videoUrl) return;

          const src = study.videoUrl;
          if (loadedSrcs.has(src)) {
            video.src = src;
            video.play().catch(() => {});
            return;
          }

          let holding = false;
          (async () => {
            await requestSlot();
            holding = true;
            video.src = src;
            video.load();
            video.addEventListener(
              "canplay",
              () => {
                loadedSrcs.add(src);
                video.play().catch(() => {});
              },
              { once: true }
            );
            video.addEventListener("progress", () => {
              if (video.buffered.length > 0 && holding) {
                holding = false;
                releaseSlot();
              }
            });
            setTimeout(() => {
              if (holding) {
                holding = false;
                releaseSlot();
              }
            }, 3000);
          })();
        });
      },
      { rootMargin: "200px" }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [caseStudies]);

  const onEnter = (id: string) => {
    setHovered(id);
    const video = videoRefs.current[id];
    if (video && video.src) video.play().catch(() => {});
  };

  const onLeave = (id: string) => {
    setHovered(null);
    const video = videoRefs.current[id];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const open = (study: CaseStudy) => {
    setSelected(study);
    setModalOpen(true);
  };

  return (
    <section id="results" className="py-16 md:py-20 lg:py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-black to-black pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-20 text-center"
        >
          <p className="text-[#ff9f0a] text-[17px] font-medium mb-4">Case Studies</p>
          <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-semibold text-[#f5f5f7] tracking-[-0.02em] leading-[1.1]">
            Real results. Real brands.
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-6 text-[17px] md:text-[21px] text-[#86868b] leading-[1.4] max-w-2xl mx-auto"
          >
            Deep dives into our most successful campaigns and the strategies behind them.
          </motion.p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: reduced ? 0 : 0.12, delayChildren: 0.1 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
        >
          {caseStudies.slice(0, 6).map((study) => (
            <motion.article
              key={study.id}
              ref={(el) => {
                cardRefs.current[study.id] = el;
              }}
              data-study-id={study.id}
              variants={cardVariants}
              onMouseEnter={() => onEnter(study.id)}
              onMouseLeave={() => onLeave(study.id)}
              className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer bg-[#1c1c1e] shadow-tween"
              style={{
                boxShadow:
                  hovered === study.id
                    ? "var(--elev-4), var(--glow-soft)"
                    : "var(--elev-1)",
              }}
              onClick={() => open(study)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(study);
                }
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <div className="absolute inset-0 skeleton" aria-hidden="true" />
                {study.videoUrl && (
                  <motion.video
                    ref={(el) => {
                      videoRefs.current[study.id] = el;
                    }}
                    muted
                    loop
                    playsInline
                    preload="none"
                    animate={{ scale: hovered === study.id ? 1.08 : 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-transparent to-transparent" />
                <motion.div
                  animate={{ opacity: hovered === study.id ? 0.4 : 0 }}
                  className="absolute inset-0 bg-black/40"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hovered === study.id ? 1 : 0,
                    scale: hovered === study.id ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 text-black ml-0.5" fill="currentColor" />
                  </div>
                </motion.div>

                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-white bg-white/15 backdrop-blur-md rounded-full border border-white/10">
                    {study.highlight}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-semibold text-white mb-1">
                      {study.client}
                    </h3>
                    <p className="text-[14px] text-[#86868b]">{study.title}</p>
                  </div>
                  <motion.div
                    animate={{
                      x: hovered === study.id ? 2 : 0,
                      y: hovered === study.id ? -2 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ArrowUpRight className="w-5 h-5 text-[#86868b] group-hover:text-white transition-colors" />
                  </motion.div>
                </div>

                <div className="flex gap-6">
                  {study.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <div className="text-2xl md:text-3xl font-semibold text-white tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-[11px] text-[#86868b] uppercase tracking-wider mt-0.5">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <VideoModal
        item={selected}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        relatedItems={caseStudies.filter((s) => s.id !== selected?.id).slice(0, 3)}
        onSelectRelated={(item) => setSelected(item)}
      />
    </section>
  );
}
