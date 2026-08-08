"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Clock, Play, Quote, X } from "lucide-react";
import { useFocusTrap } from "@/lib/use-focus-trap";
import type { ModalItem } from "@/lib/site-data";

const CATEGORY_COLORS = ["#2997ff", "#30d158", "#ff9f0a", "#af52de", "#ff375f", "#64d2ff"];
const METRIC_COLORS = ["#2997ff", "#30d158", "#ff9f0a", "#af52de"];

type Props = {
  item: ModalItem | null;
  isOpen: boolean;
  onClose: () => void;
  relatedItems?: ModalItem[];
  onSelectRelated?: (item: ModalItem) => void;
};

export function VideoModal({
  item,
  isOpen,
  onClose,
  relatedItems = [],
  onSelectRelated,
}: Props) {
  const reduced = useReducedMotion();
  // Entrance offsets are motion; the opacity fade is not.
  const rise = reduced ? {} : { y: 20 };
  const riseTo = reduced ? {} : { y: 0 };

  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useFocusTrap(isOpen && !!item, scrollRef);

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const onBackdrop = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      close();
    },
    [close]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen && videoRef.current) videoRef.current.play().catch(() => {});
    if (isOpen && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [isOpen, item]);

  if (!item) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={onBackdrop}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl cursor-pointer"
            aria-label="Close modal"
          />

          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, ...(reduced ? {} : { scale: 0.95 }), ...rise }}
            animate={{ opacity: 1, scale: 1, ...riseTo }}
            exit={{ opacity: 0, ...(reduced ? {} : { scale: 0.95 }), ...rise }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-[101] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            tabIndex={-1}
          >
            <div className="min-h-full flex items-start justify-center p-4 md:p-8 py-12 md:py-16">
              <div
                className="relative w-full max-w-5xl bg-[#1c1c1e] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  initial={{ opacity: 0, ...(reduced ? {} : { scale: 0.8 }) }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={close}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors duration-200 group"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </motion.button>

                <div className="relative aspect-video bg-black">
                  {item.videoUrl ? (
                    <video
                      ref={videoRef}
                      src={item.videoUrl}
                      controls
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-contain"
                      aria-label={`Video: ${item.title}`}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e] flex items-center justify-center">
                      <Play className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                </div>

                <div className="p-6 md:p-8 lg:p-10">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.categories.map((category, i) => {
                          const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
                          return (
                            <span
                              key={category}
                              style={{
                                color,
                                backgroundColor: `${color}15`,
                                borderColor: `${color}30`,
                              }}
                              className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border"
                            >
                              {category}
                            </span>
                          );
                        })}
                      </div>

                      <p className="text-[13px] font-semibold text-[#2997ff] uppercase tracking-wider mb-2">
                        Featured Work
                      </p>
                      <h2
                        id="video-modal-title"
                        className="text-3xl md:text-4xl lg:text-[48px] font-semibold text-[#f5f5f7] tracking-[-0.02em] leading-[1.1]"
                      >
                        {item.title}
                      </h2>
                      <div className="flex items-center gap-3 mt-3 text-[15px] text-[#86868b]">
                        <span className="font-medium text-[#a1a1a6]">{item.client}</span>
                        <span className="w-1 h-1 rounded-full bg-[#424245]" />
                        <span>{item.year}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[19px] md:text-[19px] text-[#a1a1a6] leading-relaxed mb-10 max-w-3xl">
                    {item.summary}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
                    {item.metrics.map((metric, i) => {
                      const color = METRIC_COLORS[i % METRIC_COLORS.length];
                      return (
                        <motion.div
                          key={metric.label}
                          initial={{ opacity: 0, ...rise }}
                          animate={{ opacity: 1, ...riseTo }}
                          transition={{
                            delay: 0.1 + 0.05 * i,
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="p-5 md:p-6 rounded-2xl bg-[#2c2c2e] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                        >
                          <div
                            style={{ color }}
                            className="text-3xl md:text-4xl font-semibold tracking-tight tabular-nums"
                          >
                            {metric.value}
                          </div>
                          <div className="text-[11px] md:text-[12px] text-[#a1a1a6] uppercase tracking-wider mt-2 font-medium">
                            {metric.label}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {item.description && (
                    <div className="mb-10">
                      <p className="text-[17px] text-[#d1d1d6] leading-[1.7]">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {(item.services || item.duration) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 md:p-8 rounded-2xl bg-[#2c2c2e]/50 border border-white/[0.06]">
                      {item.services && item.services.length > 0 && (
                        <div>
                          <h3 className="text-[12px] text-[#30d158] uppercase tracking-wider font-semibold mb-4">
                            Services Provided
                          </h3>
                          <ul className="space-y-3">
                            {item.services.map((service, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 text-[15px] text-[#d1d1d6]"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#30d158] flex-shrink-0" />
                                {service}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.duration && (
                        <div>
                          <h3 className="text-[12px] text-[#ff9f0a] uppercase tracking-wider font-semibold mb-4">
                            Project Duration
                          </h3>
                          <div className="flex items-center gap-3 text-[15px] text-[#d1d1d6]">
                            <Clock className="w-4 h-4 text-[#ff9f0a]" />
                            {item.duration}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(item.challenge || item.solution) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      {item.challenge && (
                        <motion.div
                          initial={{ opacity: 0, ...rise }}
                          animate={{ opacity: 1, ...riseTo }}
                          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#ff453a]/10 to-transparent border border-[#ff453a]/20"
                        >
                          <h3 className="text-[12px] text-[#ff453a] uppercase tracking-wider font-semibold mb-4">
                            The Challenge
                          </h3>
                          <p className="text-[15px] text-[#d1d1d6] leading-relaxed">
                            {item.challenge}
                          </p>
                        </motion.div>
                      )}

                      {item.solution && (
                        <motion.div
                          initial={{ opacity: 0, ...rise }}
                          animate={{ opacity: 1, ...riseTo }}
                          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#30d158]/10 to-transparent border border-[#30d158]/20"
                        >
                          <h3 className="text-[12px] text-[#30d158] uppercase tracking-wider font-semibold mb-4">
                            Our Solution
                          </h3>
                          <p className="text-[15px] text-[#d1d1d6] leading-relaxed">
                            {item.solution}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {item.results && (
                    <motion.div
                      initial={{ opacity: 0, ...rise }}
                      animate={{ opacity: 1, ...riseTo }}
                      transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#2997ff]/10 to-transparent border border-[#2997ff]/20"
                    >
                      <h3 className="text-[12px] text-[#2997ff] uppercase tracking-wider font-semibold mb-4">
                        The Results
                      </h3>
                      <p className="text-[15px] text-[#d1d1d6] leading-relaxed">{item.results}</p>
                    </motion.div>
                  )}

                  {item.testimonial && (
                    <motion.div
                      initial={{ opacity: 0, ...rise }}
                      animate={{ opacity: 1, ...riseTo }}
                      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="mb-10 p-8 md:p-10 rounded-2xl bg-[#2c2c2e] border border-white/[0.06] relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2997ff] via-[#30d158] to-[#af52de]" />
                      <Quote className="absolute top-8 left-8 w-10 h-10 text-[#2997ff]/20" />
                      <blockquote className="pl-12">
                        <p className="text-[20px] md:text-[22px] text-[#f5f5f7] leading-[1.6] font-medium italic mb-6">
                          “{item.testimonial.quote}”
                        </p>
                        <footer className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2997ff] to-[#30d158] flex items-center justify-center">
                            <span className="text-white font-semibold text-[17px]">
                              {item.testimonial.author.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <cite className="text-[15px] text-[#f5f5f7] not-italic font-semibold">
                              {item.testimonial.author}
                            </cite>
                            <p className="text-[13px] text-[#a1a1a6] mt-0.5">
                              {item.testimonial.role}
                            </p>
                          </div>
                        </footer>
                      </blockquote>
                    </motion.div>
                  )}

                  {relatedItems.length > 0 && (
                    <div className="pt-8 border-t border-white/[0.06]">
                      <p className="text-[12px] text-[#af52de] uppercase tracking-wider font-semibold mb-2">
                        Related
                      </p>
                      <h3 className="text-[20px] text-[#f5f5f7] font-semibold mb-6">
                        More like this
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {relatedItems.slice(0, 3).map((related) => (
                          <motion.button
                            key={related.id}
                            onClick={() => onSelectRelated?.(related)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group relative aspect-video rounded-xl overflow-hidden bg-[#2c2c2e] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300"
                          >
                            <div className="w-full h-full bg-gradient-to-br from-[#3c3c3e] to-[#2c2c2e]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center backdrop-blur-sm">
                                <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                              </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <p className="text-[13px] font-semibold text-[#f5f5f7] line-clamp-1">
                                {related.title}
                              </p>
                              <p className="text-[11px] text-[#a1a1a6] mt-1">{related.client}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
