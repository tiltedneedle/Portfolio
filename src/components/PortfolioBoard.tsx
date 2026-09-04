"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Maximize2, Move, X, ZoomIn, ZoomOut } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { CutLink } from "@/components/room/CutLink";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { PLATFORM_LABEL, embedUrl, published, type Published } from "@/lib/published";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";

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

type Frame = Published & { x: number; y: number; w: number; h: number };

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
  // The library is the studio's published index: every clip with a durable
  // still. Long-form 16:9 videos are left out; the board is a 9:16 contact sheet.
  const shuffled = seededShuffle(published.filter((p) => p.vertical));
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

  const passes = Math.ceil(shuffled.length / COLUMNS) + 1;
  for (let pass = 0; pass < passes; pass++) {
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

/* ------------------------------------------------------------------ tiles */

// A still per clip, lazy, with the platform in the corner. The stills are
// durable (YouTube's own, or the studio's cached copy) so a tile is never a
// black hole; the clip itself plays in the lightbox.
function BoardStill({ frame, className }: { frame: Frame; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={frame.thumb}
        alt=""
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={"w-full h-full object-cover pointer-events-none transition-opacity duration-500 " + (loaded ? "opacity-100" : "opacity-0")}
        style={{ background: "var(--stage-2)" }}
        draggable={false}
      />
      <span aria-hidden="true" className="mono pointer-events-none absolute left-2 top-2 text-[9px] text-[color:var(--ink)]/80">
        {frame.platform === "youtube_shorts" ? "YT" : frame.platform === "instagram" ? "IG" : frame.platform === "tiktok" ? "TT" : "YT"}
      </span>
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
  const [size, setSize] = useState({ w: 1200, h: 800 });
  const pinchDist = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useFocusTrap(!!selected, dialogRef, selected?.id);

  // The lightbox had no keyboard dismiss.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  // Viewport size lives in state rather than being read off the ref during
  // render. The virtualisation memo below needs it, and reading a ref while
  // rendering is neither guaranteed populated nor safe under concurrent React.
  // Seeded to the same values on server and client so hydration matches; the
  // real measurement lands in the effect immediately after mount.
  useEffect(() => {
    const measure = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) setSize({ w: rect.width, h: rect.height });
      setIsMobile(window.innerWidth < 768);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Event handlers only — they run outside render, where reading the ref is
  // fine and gives a fresher value than state.
  const getSize = useCallback(() => {
    if (!containerRef.current) return { w: 1200, h: 800 };
    const rect = containerRef.current.getBoundingClientRect();
    return { w: rect.width, h: rect.height };
  }, []);

  // Intro: fit the whole board, then fly in to the brand card and settle.
  //
  // Runs exactly once. `isMobile` used to be a dependency and `measure` updates
  // it on every resize, so rotating a phone or dragging a window across 768px
  // tore the sequence down and replayed all 4.1s of it — mid-session, over
  // whatever the visitor had panned to. The breakpoint is read at run time
  // instead, and the guard makes a replay impossible.
  const introPlayed = useRef(false);
  useEffect(() => {
    if (introPlayed.current) return;
    introPlayed.current = true;

    const { w, h } = getSize();
    const mobile = window.innerWidth < 768;
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
    const target = mobile ? 0.8 : 1.15;
    const targetX = w / 2 - focusX * target;
    const targetY = h / 2 - focusY * target;

    // Skip the four-second fly-in entirely and land on the resting view.
    if (reduced) {
      setPhase("done");
      setScale(target);
      setPos({ x: targetX, y: targetY });
      return;
    }

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
  }, [getSize, reduced]);

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
      const { w, h } = size;
      const cx = w / 2;
      const cy = h / 2;
      const dx = cx - pos.x;
      const dy = cy - pos.y;
      setPos(clampPos(cx - (next / scale) * dx, cy - (next / scale) * dy, next, w, h));
      setScale(next);
    },
    [scale, pos, size]
  );

  // Arrow keys pan, +/- zoom, 0 fits — the board was pointer-only before.
  const onBoardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (phase !== "done" || selected) return;
      // Panning unmounts off-screen tiles. If focus is on one, it would be
      // destroyed mid-keypress and focus would fall back to <body>.
      if ((e.target as HTMLElement).closest("[data-frame]")) return;
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
    const { w, h } = size;
    const ids = new Set<string>();
    for (const frame of frames) {
      const x = frame.x * scale + pos.x;
      const y = frame.y * scale + pos.y;
      const fw = frame.w * scale;
      const fh = frame.h * scale;
      if (x + fw > -250 && x < w + 250 && y + fh > -250 && y < h + 250) ids.add(frame.id);
    }
    return ids;
  }, [scale, pos, size]);

  const transition = intro
    ? phase === "start"
      ? "none"
      : phase === "settle"
        ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
        : "transform 2.5s cubic-bezier(0.16, 1, 0.3, 1)"
    : dragging
      ? "none"
      : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";

  // Reads `size` rather than measuring the ref, so this array — which is built
  // during render — carries no ref access with it.
  const controls = [
    { icon: <ZoomIn className="w-4 h-4" />, action: () => zoomTo(Math.min(1.8, scale * 1.35)), label: "Zoom in" },
    {
      icon: <ZoomOut className="w-4 h-4" />,
      action: () => zoomTo(Math.max(minScaleFor(size.w, size.h), scale / 1.35)),
      label: "Zoom out",
    },
    {
      icon: <Maximize2 className="w-4 h-4" />,
      action: () => {
        const { w, h } = size;
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
        className="fixed inset-0 top-14 md:top-16 overflow-hidden select-none touch-none bg-[color:var(--stage)]"
        style={{ cursor: intro ? "default" : dragging ? "grabbing" : "grab" }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Keyboard surface for the board. role="application" is deliberately
            scoped here rather than on <main>: on the landmark it erased the
            main landmark and put the whole page into forms mode, so screen
            readers lost browse-mode navigation over the heading and controls. */}
        <div
          className="absolute inset-0 z-30 pointer-events-none focus-visible:outline-2 focus-visible:outline-[color:var(--rule-strong)] focus-visible:outline-offset-[-6px] rounded-sm"
          tabIndex={0}
          role="application"
          aria-label="Portfolio board. Use the arrow keys to pan, plus and minus to zoom, and 0 to fit the whole board."
          onKeyDown={onBoardKeyDown}
        />
        <div
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(242,239,233,0.6) 0.5px, transparent 0.5px)",
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
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Image src="/white-logo.png" alt="" width={30} height={30} className="object-contain" />

              <h1 className="display mt-4 text-[40px]">The library</h1>

              <p className="mono mt-3 text-center">
                {frames.length} clips <span className="text-[color:var(--ink-faint)]">/</span>{" "}London &middot; Dubai
              </p>

              <p className="mt-3 max-w-[260px] text-center text-[13px] leading-relaxed text-[color:var(--ink-mid)]">
                The contact sheet. Everything published, laid out on one board.
              </p>

              <CutLink href="/book-demo" className="pill pill-outline mt-6 px-6 py-2.5 text-[13px]">
                Book a demo
              </CutLink>

              <p className="mono mt-4">{isMobile ? "Pinch and drag" : "Scroll to zoom, drag to pan"}</p>
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
                  data-cursor="Play"
                  className="block w-full h-full text-left rounded-[2px] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
                >
                  <div className="h-full overflow-hidden rounded-[2px] border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-[5px] transition-colors duration-500 group-hover:border-[color:var(--rule-strong)]">
                    <BoardStill
                      frame={frame}
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
                  className="w-10 h-10 rounded-full bg-[rgba(20,20,22,0.8)] backdrop-blur-xl border border-[color:var(--rule)] flex items-center justify-center text-[color:var(--ink)] hover:bg-[color:var(--stage-3)] active:scale-95 transition-all"
                  title={control.label}
                  aria-label={control.label}
                >
                  {control.icon}
                </button>
              ))}
            </div>

            <div className="mono absolute bottom-6 left-4 md:left-14 hidden md:flex items-center gap-2 z-20 bg-[rgba(11,11,12,0.7)] backdrop-blur-xl px-3 py-2 border border-[color:var(--rule)]">
              <Move className="w-3.5 h-3.5" />
              Drag to pan &middot; scroll to zoom &middot; click to play
            </div>

            <div className="mono absolute top-16 md:top-6 right-4 md:right-14 z-20 bg-[rgba(11,11,12,0.7)] backdrop-blur-xl px-3 py-2 border border-[color:var(--rule)]">
              {frames.length} clips
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
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[color:var(--stage-2)] border border-[color:var(--rule)] rounded-[2px] overflow-hidden max-w-3xl w-full max-h-[85vh] flex flex-col"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="board-modal-title"
              tabIndex={-1}
            >
              <button
                onClick={() => setSelected(null)}
                aria-label="Close video"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-[color:var(--ink)] flex items-center justify-center hover:bg-black/80 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative mx-auto aspect-[9/16] w-full max-h-[55vh] md:max-h-[60vh] bg-black">
                {selected.videoId ? (
                  <iframe
                    src={embedUrl(selected.videoId)}
                    title={selected.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selected.thumb} alt="" className="absolute inset-0 h-full w-full object-contain" />
                )}
              </div>

              <div className="p-5 md:p-8">
                <p className="mono">
                  {selected.client} <span className="text-[color:var(--ink-faint)]">/</span> {PLATFORM_LABEL[selected.platform]}
                  {selected.posted ? <span className="text-[color:var(--ink-faint)]"> / {selected.posted.slice(0, 7)}</span> : null}
                </p>
                <h2 id="board-modal-title" className="mt-2 text-[17px] leading-snug text-[color:var(--ink)] md:text-[19px]">
                  {selected.title || selected.subject}
                </h2>
                <div className="mt-5 flex flex-wrap items-center gap-6">
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="pill pill-solid px-6 py-2.5 text-[13px] md:text-[15px]">
                    {selected.videoId ? "Open on YouTube" : "Watch on " + PLATFORM_LABEL[selected.platform]}
                  </a>
                  <button onClick={() => setSelected(null)} className="slate-link text-[13px]">
                    Back to the board
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
