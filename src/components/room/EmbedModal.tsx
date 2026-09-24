"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { embedUrl } from "@/lib/published";

/**
 * A lightbox for a published cut. The film plays in a 9:16 well from
 * YouTube's privacy-enhanced host, or from TikTok's or Instagram's own
 * player when `src` names one; nothing loads until it opens. Escape and
 * the backdrop close it; focus is trapped while it is up.
 */
export function EmbedModal({
  videoId = null,
  src = null,
  platform = "youtube",
  title,
  open,
  onClose,
}: {
  videoId?: string | null;
  /** A player URL of its own; without one, the YouTube id plays. */
  src?: string | null;
  platform?: "youtube" | "tiktok" | "instagram";
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const url = src ?? (videoId ? embedUrl(videoId) : null);
  const box = useRef<HTMLDivElement>(null);
  useFocusTrap(open && !!url, box, url ?? undefined);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <div
            ref={box}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className={"relative flex w-full flex-col " + (platform === "instagram" ? "max-w-[360px]" : platform === "tiktok" ? "max-w-[400px]" : "max-w-[420px]")}
          >
            <div className="mb-3 flex items-center justify-between mono">
              <span className="flex items-center gap-2">
                <span className="lamp" aria-hidden="true" />
                Playing
              </span>
              <button type="button" onClick={onClose} className="slate-link text-[color:var(--ink)]" data-cursor="Cut">
                Close
              </button>
            </div>
            {/* TikTok's and Instagram's players carry their own chrome around the reel, so they get taller boxes that scroll inside. */}
            <div
              className={
                platform === "youtube"
                  ? "well w-full border border-[color:var(--rule)]"
                  : "relative " + (platform === "instagram" ? "aspect-[9/19]" : "aspect-[9/17]") + " max-h-[82vh] w-full overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)]"
              }
            >
              <iframe
                src={url}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mono mt-3 text-[color:var(--ink-mid)]">{title}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
