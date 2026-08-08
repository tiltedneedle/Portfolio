"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Maximize2, Move, X, ZoomIn, ZoomOut } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { boardVideos, type BoardVideo } from "@/lib/board-videos";

/* ------------------------------------------------------------------ layout */

const FRAME_HEIGHTS = [240, 284, 330];
const FRAME_WIDTH = 160;
const GAP = 16;
const COLUMNS = 15;

// Per-column height pattern, so neighbouring columns never line up.
const HEIGHT_PATTERN = [
  [1, 0, 2, 1, 0, 2, 1, 2, 0],
  [2, 1, 0, 2, 1, 0, 1, 2, 0],
  [0, 2, 1, 0, 2, 1, 2, 0, 1],
  [1, 0, 2, 0, 1, 2, 0, 1, 2],
  [2, 1, 0, 1, 2, 0, 1, 0, 2],
  [0, 2, 1, 2, 0, 1, 2, 1, 0],
  [1, 0, 2, 1, 2, 0, 1, 2, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 0, 1, 2, 1, 0, 2, 0, 1],
  [0, 1, 2, 0, 2, 1, 0, 2, 1],
  [1, 2, 0, 1, 0, 2, 1, 0, 2],
  [2, 0, 1, 2, 1, 0, 2, 1, 0],
  [0, 1, 2, 0, 2, 1, 0, 2, 1],
  [1, 2, 0, 1, 0, 2, 1, 0, 2],
];

const COLUMN_OFFSETS = [0, 20, 8, 28, 4, 24, 12, 0, 0, 8, 28, 4, 24, 12, 0];
const COLUMN_X = Array.from({ length: COLUMNS }, (_, i) => 30 + 176 * i);

const BRAND_W = 320;
const BRAND_H = 380;

type Frame = BoardVideo & { x: number; y: number; w: number; h: number };

// Seeded Lehmer shuffle so server and client lay the board out identically.
function seededShuffle<T>(input: T[]): T[] {
  const out = [...input];
  let seed = 42;
  const rand = () => ((seed = (16807 * seed) % 0x7fffffff) - 1) / 0x7ffffffe;
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function buildBoard() {
  const shuffled = seededShuffle(boardVideos);
  const columnY = COLUMN_OFFSETS.map((o) => 30 + o);
  const patternIndex = Array(COLUMNS).fill(0);

  // Reserve a gap in the two middle columns for the brand card.
  let brandTop = 0;
  for (let col = 7; col <= 8; col++) {
    let y = 30 + COLUMN_OFFSETS[col];
    for (let k = 0; k < 2; k++) {
      y += FRAME_HEIGHTS[HEIGHT_PATTERN[col][k % HEIGHT_PATTERN[col].length]] + GAP;
    }
    brandTop = Math.max(brandTop, y);
  }
  const brandBottom = brandTop + BRAND_H + GAP;
  const brandLeftCol = COLUMN_X[7];
  const brandRightEdge = COLUMN_X[8] + FRAME_WIDTH;

  const frames: Frame[] = [];
  let index = 0;

  for (let pass = 0; pass < 9; pass++) {
    for (let col = 0; col < COLUMNS && index < shuffled.length; col++) {
      const h = FRAME_HEIGHTS[HEIGHT_PATTERN[col][patternIndex[col] % HEIGHT_PATTERN[col].length]];
      let y = columnY[col];

      if (col >= 7 && col <= 8 && y + h > brandTop - 8 && y < brandBottom) {
        y = brandBottom;
        columnY[col] = y;
      }

      const video = shuffled[index];
      frames.push({ ...video, x: COLUMN_X[col], y, w: FRAME_WIDTH, h });
      columnY[col] = y + h + GAP;
      patternIndex[col]++;
      index++;
    }
    if (index >= shuffled.length) break;
  }

  return {
    frames,
    canvasW: COLUMN_X[COLUMNS - 1] + FRAME_WIDTH + 60,
    canvasH: Math.max(...columnY) + 60,
    brandX: brandLeftCol + (brandRightEdge - brandLeftCol - BRAND_W) / 2,
    brandY: brandTop,
  };
}

const { frames, canvasW, canvasH, brandX, brandY } = buildBoard();

const minScaleFor = (w: number, h: number) =>
  Math.max(0.55, Math.min(w / canvasW, h / canvasH));

function clampPos(x: number, y: number, scale: number, w: number, h: number) {
  const sw = canvasW * scale;
  const sh = canvasH * scale;
  return {
    x: sw <= w ? (w - sw) / 2 : Math.min(0, Math.max(w - sw, x)),
    y: sh <= h ? (h - sh) / 2 : Math.min(0, Math.max(h - sh, y)),
  };
}

/* ------------------------------------------------- throttled video loading */

const MAX_CONCURRENT = 4;
let activeLoads = 0;
const waiting: Array<() => void> = [];
const loaded = new Set<string>();

function acquire(): Promise<void> {
  if (activeLoads < MAX_CONCURRENT) {
    activeLoads++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    waiting.push(() => {
      activeLoads++;
      resolve();
    });
  });
}

function release() {
  activeLoads--;
  if (waiting.length > 0) waiting.shift()!();
}

function BoardVideoTile({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const video = ref.current;
    if (!video) return;

    if (loaded.has(src)) {
      video.src = src;
      video.play().catch(() => {});
      return () => {
        cancelled.current = true;
        video.pause();
      };
    }

    let holding = false;
    (async () => {
      await acquire();
      if (cancelled.current) return release();
      holding = true;
      video.src = src;
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          if (!cancelled.current) {
            loaded.add(src);
            video.play().catch(() => {});
          }
        },
        { once: true }
      );
      video.addEventListener("progress", () => {
        if (video.buffered.length > 0 && holding) {
          holding = false;
          release();
        }
      });
      setTimeout(() => {
        if (holding) {
          holding = false;
          release();
        }
      }, 2500);
    })();

    return () => {
      cancelled.current = true;
      video.pause();
      if (holding) release();
    };
  }, [src]);

  return (
    <div className={className}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover pointer-events-none"
        style={{ background: "#0a0a0a" }}
        draggable={false}
      />
    </div>
  );
}

/* ------------------------------------------------------------------- board */

type Phase = "start" | "zoomIn" | "settle" | "done";

export function PortfolioBoard() {
  const containerRef = useRef<HTMLElement>(null);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOrigin, setDragOrigin] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<Frame | null>(null);
  const [phase, setPhase] = useState<Phase>("start");
  const [isMobile, setIsMobile] = useState(false);
  const pinchDist = useRef(0);
  const pinchMid = useRef({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  useFocusTrap(!!selected, dialogRef);

  // The lightbox had no keyboard dismiss.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const getSize = useCallback(() => {
    if (!containerRef.current) return { w: 1200, h: 800 };
    const rect = containerRef.current.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }, []);

  // Intro: fit the whole board, then fly in to the brand card and settle.
  useEffect(() => {
    const { w, h } = getSize();
    const fitScale = Math.max(
      minScaleFor(w, h),
      Math.min(1.8, 0.95 * Math.min(w / canvasW, h / canvasH))
    );
    const fitPos = clampPos(
      (w - canvasW * fitScale) / 2,
      (h - canvasH * fitScale) / 2,
      fitScale,
      w,
      h
    );

    const focusX = brandX + 160;
    const focusY = brandY + 190;
    const target = isMobile ? 0.8 : 1.15;
    const targetX = w / 2 - focusX * target;
    const targetY = h / 2 - focusY * target;

    setScale(fitScale);
    setPos(fitPos);

    const t1 = setTimeout(() => {
      setPhase("zoomIn");
      setScale(target);
      setPos({ x: targetX, y: targetY });
    }, 600);
    const t2 = setTimeout(() => {
      setPhase("settle");
      const s = target * 1.012;
      setScale(s);
      setPos({ x: w / 2 - focusX * s, y: h / 2 - focusY * s });
    }, 3200);
    const t3 = setTimeout(() => {
      setScale(target);
      setPos({ x: targetX, y: targetY });
    }, 3700);
    const t4 = setTimeout(() => {
      setPhase("done");
      setScale(target);
      setPos({ x: targetX, y: targetY });
    }, 4100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [getSize, isMobile]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (phase !== "done") return;
      e.preventDefault();

      const { w, h } = getSize();
      const min = minScaleFor(w, h);
      const atMin = scale <= min + 0.01;

      // Fully zoomed out and scrolling down: pan instead of zooming further.
      if (atMin && e.deltaY > 0) {
        setPos(clampPos(pos.x - 1.2 * e.deltaX, pos.y - 1.2 * e.deltaY, scale, w, h));
        return;
      }

      const rect = containerRef.current!.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const next = Math.max(min, Math.min(1.8, scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1)));
      const dx = px - pos.x;
      const dy = py - pos.y;

      setPos(clampPos(px - (next / scale) * dx, py - (next / scale) * dy, next, w, h));
      setScale(next);
    },
    [scale, pos, getSize, phase]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (phase !== "done" || e.pointerType === "touch") return;
      if ((e.target as HTMLElement).closest("[data-frame]")) return;
      setDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setDragOrigin(pos);
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [pos, phase]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || e.pointerType === "touch") return;
      const { w, h } = getSize();
      setPos(
        clampPos(
          dragOrigin.x + (e.clientX - dragStart.x),
          dragOrigin.y + (e.clientY - dragStart.y),
          scale,
          w,
          h
        )
      );
    },
    [dragging, dragStart, dragOrigin, scale, getSize]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (e.pointerType !== "touch") setDragging(false);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (phase !== "done") return;
      if ((e.target as HTMLElement).closest("[data-frame]")) return;

      if (e.touches.length === 1) {
        setDragging(true);
        setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        setDragOrigin(pos);
      } else if (e.touches.length === 2) {
        pinchDist.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchMid.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      }
    },
    [pos, phase]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (phase !== "done") return;
      e.preventDefault();
      const { w, h } = getSize();

      if (e.touches.length === 1 && dragging) {
        const dx = e.touches[0].clientX - dragStart.x;
        const dy = e.touches[0].clientY - dragStart.y;
        setPos(clampPos(dragOrigin.x + dx, dragOrigin.y + dy, scale, w, h));
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const mid = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };

        if (pinchDist.current > 0) {
          const next = Math.max(
            minScaleFor(w, h),
            Math.min(1.8, scale * (dist / pinchDist.current))
          );
          const rect = containerRef.current!.getBoundingClientRect();
          const px = mid.x - rect.left;
          const py = mid.y - rect.top;
          const dx = px - pos.x;
          const dy = py - pos.y;
          setPos(clampPos(px - (next / scale) * dx, py - (next / scale) * dy, next, w, h));
          setScale(next);
        }
        pinchDist.current = dist;
        pinchMid.current = mid;
      }
    },
    [dragging, dragStart, dragOrigin, scale, pos, getSize, phase]
  );

  const onTouchEnd = useCallback(() => {
    setDragging(false);
    pinchDist.current = 0;
  }, []);

  const zoomTo = useCallback(
    (next: number) => {
      const { w, h } = getSize();
      const cx = w / 2;
      const cy = h / 2;
      const dx = cx - pos.x;
      const dy = cy - pos.y;
      setPos(clampPos(cx - (next / scale) * dx, cy - (next / scale) * dy, next, w, h));
      setScale(next);
    },
    [scale, pos, getSize]
  );

  // Arrow keys pan, +/- zoom, 0 fits — the board was pointer-only before.
  const onBoardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (phase !== "done" || selected) return;
      const { w, h } = getSize();
      const step = e.shiftKey ? 240 : 80;
      const min = minScaleFor(w, h);

      const pan = (dx: number, dy: number) => {
        e.preventDefault();
        setPos(clampPos(pos.x + dx, pos.y + dy, scale, w, h));
      };

      switch (e.key) {
        case "ArrowLeft": return pan(step, 0);
        case "ArrowRight": return pan(-step, 0);
        case "ArrowUp": return pan(0, step);
        case "ArrowDown": return pan(0, -step);
        case "+":
        case "=":
          e.preventDefault();
          return zoomTo(Math.min(1.8, scale * 1.2));
        case "-":
        case "_":
          e.preventDefault();
          return zoomTo(Math.max(min, scale / 1.2));
        case "0": {
          e.preventDefault();
          const next = Math.max(min, Math.min(1.8, 0.95 * Math.min(w / canvasW, h / canvasH)));
          setPos(clampPos((w - canvasW * next) / 2, (h - canvasH * next) / 2, next, w, h));
          setScale(next);
          return;
        }
      }
    },
    [phase, selected, getSize, pos, scale, zoomTo]
  );

  const intro = phase !== "done";

  // Only mount frames near the viewport.
  const visible = useMemo(() => {
    const { w, h } = getSize();
    const ids = new Set<number>();
    for (const frame of frames) {
      const x = frame.x * scale + pos.x;
      const y = frame.y * scale + pos.y;
      const fw = frame.w * scale;
      const fh = frame.h * scale;
      if (x + fw > -250 && x < w + 250 && y + fh > -250 && y < h + 250) ids.add(frame.id);
    }
    return ids;
  }, [scale, pos, getSize]);

  const transition = intro
    ? phase === "start"
      ? "none"
      : phase === "settle"
        ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
        : "transform 2.5s cubic-bezier(0.16, 1, 0.3, 1)"
    : dragging
      ? "none"
      : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";

  const controls = [
    { icon: <ZoomIn className="w-4 h-4" />, action: () => zoomTo(Math.min(1.8, scale * 1.35)), label: "Zoom in" },
    {
      icon: <ZoomOut className="w-4 h-4" />,
      action: () => {
        const { w, h } = getSize();
        zoomTo(Math.max(minScaleFor(w, h), scale / 1.35));
      },
      label: "Zoom out",
    },
    {
      icon: <Maximize2 className="w-4 h-4" />,
      action: () => {
        const { w, h } = getSize();
        const next = Math.max(
          minScaleFor(w, h),
          Math.min(1.8, 0.95 * Math.min(w / canvasW, h / canvasH))
        );
        setPos(clampPos((w - canvasW * next) / 2, (h - canvasH * next) / 2, next, w, h));
        setScale(next);
      },
      label: "Fit all",
    },
  ];

  return (
    <>
      <NavBar />

      <main
        ref={containerRef}
        className="fixed inset-0 top-12 overflow-hidden select-none touch-none"
        style={{
          background: "linear-gradient(145deg, #fafafa 0%, #f5f5f5 50%, #f8f8f8 100%)",
          cursor: intro ? "default" : dragging ? "grabbing" : "grab",
        }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onKeyDown={onBoardKeyDown}
        tabIndex={0}
        role="application"
        aria-label="Portfolio board. Use the arrow keys to pan, plus and minus to zoom, and 0 to fit the whole board."
      >
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #000 0.4px, transparent 0.4px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div
          className="absolute top-0 left-0 origin-top-left will-change-transform"
          style={{
            width: canvasW,
            height: canvasH,
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`,
            transition,
          }}
        >
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{ left: brandX, top: brandY, width: BRAND_W, height: BRAND_H }}
          >
            <div
              className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: "transparent" }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(0,0,0,0.06)",
                  boxShadow:
                    "inset 0 2px 4px rgba(0,0,0,0.08), 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                <Image
                  src="/black-logo.png"
                  alt="Tilted Needle"
                  width={30}
                  height={30}
                  className="object-contain"
                />
              </div>

              <h1
                className="text-[28px] font-semibold leading-tight tracking-[-0.03em] mt-4"
                style={{
                  color: "#c8c8ca",
                  textShadow:
                    "0 -1px 1px rgba(255,255,255,0.8), 0 1px 2px rgba(0,0,0,0.12)",
                }}
              >
                Tilted Needle
              </h1>

              <p
                className="text-[13px] mt-2 max-w-[280px] leading-relaxed text-center"
                style={{ color: "#b8b8bc" }}
              >
                Built to make brands go viral. 2B+ views. $250M+ revenue generated.
              </p>

              <div
                className="flex items-center gap-3 mt-2 text-[11px] uppercase tracking-[0.15em]"
                style={{ color: "#c4c4c8" }}
              >
                <span>London</span>
                <span className="w-1 h-1 rounded-full bg-[#d4d4d8]" />
                <span>Dubai</span>
              </div>

              <Link
                href="/book-demo"
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-semibold transition-colors"
                style={{
                  background: "rgba(0,0,0,0.05)",
                  color: "#b0b0b4",
                  boxShadow:
                    "inset 0 2px 4px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.7)",
                }}
              >
                Book a Demo
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <p className="mt-3 text-[11px]" style={{ color: "#c4c4c8" }}>
                {frames.length} projects · {isMobile ? "Pinch & drag" : "Scroll to explore"}
              </p>
            </div>
          </div>

          {frames
            .filter((frame) => visible.has(frame.id))
            .map((frame) => (
              <div
                key={frame.id}
                data-frame
                className="absolute group"
                style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(frame);
                  }}
                  aria-label={`Play ${frame.title}`}
                  // Light board, so the global white focus ring would be invisible.
                  className="block w-full h-full text-left rounded-[3px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2997ff]"
                >
                  <div
                    className="bg-white rounded-[3px] overflow-hidden p-[8px] transition-shadow duration-500 group-hover:shadow-[var(--elev-light-3)]"
                    style={{
                      boxShadow: "var(--elev-light-1)",
                      height: "100%",
                    }}
                  >
                    <BoardVideoTile
                      src={frame.src}
                      className="w-full h-full relative overflow-hidden rounded-[2px] transition-transform duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                </button>
              </div>
            ))}
        </div>

        {!intro && (
          <>
            <div className="absolute bottom-24 right-4 md:right-6 flex flex-col gap-1.5 z-20">
              {controls.map((control) => (
                <button
                  key={control.label}
                  onClick={control.action}
                  className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-xl border border-black/[0.06] flex items-center justify-center text-[#1c1c1e] hover:bg-white active:scale-95 transition-all shadow-sm"
                  title={control.label}
                >
                  {control.icon}
                </button>
              ))}
            </div>

            <div className="absolute bottom-6 left-4 md:left-6 hidden md:flex items-center gap-2 text-[12px] text-[#86868b] z-20 bg-white/60 backdrop-blur-xl rounded-full px-4 py-2 border border-black/[0.04]">
              <Move className="w-3.5 h-3.5" />
              Drag to pan · Scroll to zoom · Click to explore
            </div>

            <div className="absolute top-16 md:top-6 right-4 md:right-6 z-20 text-[11px] text-[#86868b] bg-white/50 backdrop-blur-xl rounded-full px-3 py-1.5 border border-black/[0.04]">
              {frames.length} projects
            </div>
          </>
        )}
      </main>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="board-modal-title"
              tabIndex={-1}
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close video"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative aspect-[9/16] max-h-[55vh] md:max-h-[60vh] bg-black">
                <video
                  src={selected.src}
                  autoPlay
                  controls
                  playsInline
                  loop
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-5 md:p-8">
                <h2
                  id="board-modal-title"
                  className="text-[clamp(1.1rem,3vw,1.8rem)] font-semibold text-[#1c1c1e] leading-tight tracking-[-0.02em]"
                >
                  {selected.title}
                </h2>
                <p className="text-[15px] md:text-[15px] text-[#6e6e73] leading-relaxed mt-2">
                  A case study in bold storytelling and measurable growth.
                </p>
                <div className="mt-4 md:mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/book-demo"
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-[#1c1c1e] text-white rounded-full text-[13px] md:text-[15px] font-semibold hover:bg-black active:scale-[0.97] transition-all"
                  >
                    Book a Demo
                  </Link>
                  <button
                    onClick={() => setSelected(null)}
                    className="inline-flex items-center px-5 md:px-6 py-2.5 md:py-3 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[13px] md:text-[15px] font-medium hover:bg-[#e8e8ed] active:scale-[0.97] transition-all"
                  >
                    Back to Gallery
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
