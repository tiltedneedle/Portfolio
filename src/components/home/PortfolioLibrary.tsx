"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { VideoModal } from "@/components/VideoModal";
import { loadedSrcs, releaseSlot, requestSlot } from "@/lib/video-slots";
import { portfolioItems, type ModalItem, type PortfolioItem } from "@/lib/site-data";
import { SECTION_Y } from "@/lib/design-tokens";

function PortfolioCard({ item, onClick }: { item: PortfolioItem; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !item.videoUrl) return;
    const video = videoRef.current;
    if (!video) return;

    const cancelled = { current: false };

    if (loadedSrcs.has(item.videoUrl)) {
      if (!video.src) video.src = item.videoUrl;
      video.play().catch(() => {});
      return () => {
        cancelled.current = true;
        video.pause();
      };
    }

    let holding = false;
    const src = item.videoUrl;

    (async () => {
      await requestSlot();
      if (cancelled.current) return releaseSlot();
      holding = true;
      video.src = src;
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          if (!cancelled.current) {
            loadedSrcs.add(src);
            video.play().catch(() => {});
          }
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

    return () => {
      cancelled.current = true;
      video.pause();
      if (holding) releaseSlot();
    };
  }, [inView, item.videoUrl]);

  return (
    <motion.article
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: reduced ? 0 : 40, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className="group relative cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${item.title} project`}
    >
      <motion.div
        animate={{
          scale: hovered && !reduced ? 1.02 : 1,
          y: hovered && !reduced ? -4 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative aspect-[9/16] rounded-2xl md:rounded-[20px] overflow-hidden bg-[#1c1c1e] shadow-tween"
        style={{
          boxShadow: hovered ? "var(--elev-3), var(--glow-soft)" : "var(--elev-1)",
        }}
      >
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
        {item.videoUrl ? (
          <motion.video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            animate={{ scale: hovered && !reduced ? 1.08 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2e] via-[#1c1c1e] to-[#0a0a0a]" />
        )}

        <motion.div
          animate={{ opacity: hovered ? 0.85 : 0.5 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"
        />

        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-3 left-3"
        >
          <span className="px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90 bg-white/15 backdrop-blur-md rounded-full border border-white/10">
            {item.categories[0]}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="relative">
            {hovered && !reduced && (
              <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
            )}
            <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <motion.div
            animate={{ y: hovered && !reduced ? -4 : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="text-[15px] md:text-[17px] font-semibold text-white leading-tight line-clamp-2">
              {item.title}
            </h3>
            <p className="mt-1 text-[13px] text-white/60 line-clamp-1">{item.client}</p>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/10">
                {item.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label} className="flex flex-col">
                    <span className="text-[15px] font-semibold text-white tabular-nums">
                      {metric.value}
                    </span>
                    <span className="text-[11px] text-white/50 uppercase tracking-wider">
                      {metric.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function PortfolioLibrary() {
  const [selected, setSelected] = useState<ModalItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const reduced = useReducedMotion();

  const items = portfolioItems.slice(0, 12);

  const related = useMemo(
    () =>
      selected
        ? portfolioItems
            .filter(
              (item) =>
                item.id !== selected.id &&
                item.categories.some((c) => selected.categories.includes(c))
            )
            .slice(0, 3)
        : [],
    [selected]
  );

  return (
    <section
      id="portfolio"
      className={`relative ${SECTION_Y} bg-[#0a0a0a] overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
      <div className="absolute top-[30%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#64d2ff]/10 blur-[160px] pointer-events-none opacity-[0.03]" />
      <div className="absolute bottom-[20%] right-[-3%] w-[350px] h-[350px] rounded-full bg-[#af52de]/8 blur-[140px] pointer-events-none opacity-[0.03]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.01) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16 text-center"
        >
          <p className="text-[#64d2ff] text-[17px] font-medium mb-4">Explore</p>
          <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-semibold text-[#f5f5f7] tracking-[-0.02em] leading-[1.1]">
            Portfolio Library
          </h2>
          <p className="mt-6 text-[17px] md:text-[22px] text-[#86868b] leading-[1.4]">
            1,000+ projects delivered across industries.
          </p>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: reduced ? 0 : 0.05, delayChildren: 0.1 },
            },
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
        >
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              onClick={() => {
                setSelected(item);
                setModalOpen(true);
              }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 md:mt-16 text-center"
        >
          <Link href="/portfolio">
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1c1c1e] hover:bg-[#2c2c2e] text-white text-[15px] font-medium rounded-full border border-white/10 transition-colors duration-300"
            >
              View More
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <VideoModal
        item={selected}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        relatedItems={related}
        onSelectRelated={(item) => setSelected(item)}
      />
    </section>
  );
}
