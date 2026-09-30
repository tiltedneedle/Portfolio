"use client";

import { Still } from "@/components/portal/Still";
import { useState, type CSSProperties } from "react";
import { EmbedModal } from "@/components/room/EmbedModal";
import { Reveal } from "@/components/portal/Reveal";

type Clip = { id: string; title: string; caption?: string; thumb: string; handle: string; src?: string; platform?: "youtube" | "tiktok" | "instagram" };

export function ClipRailClient({ title, note, clips }: { title?: string; note?: string; clips: Clip[] }) {
  const [open, setOpen] = useState<Clip | null>(null);

  return (
    <div className="border-t border-[color:var(--rule-strong)] pt-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <p className="mono text-[color:var(--ink)]">{title ?? "From the library"}</p>
        {note && <p className="em-serif max-w-[44ch] text-[17px] text-[color:var(--ink-soft)]">{note}</p>}
      </div>
      {/* The clips power on like monitors as the rail comes on (.reel-on).
          The snap lands a clip on the gutter, not the screen's edge
          (scroll-px): without it a phone opened the rail 24px along, the
          first clip flush against the edge. */}
      <Reveal>
      <ul className="rail -mx-6 gap-4 px-6 scroll-px-6 md:mx-0 md:px-0 md:scroll-px-0">
        {clips.map((c, i) => (
          <li key={c.id} className="w-[168px] md:w-[196px]">
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="group block w-full text-left"
              aria-label={"Play " + c.title}
              data-cursor="Play"
            >
              <span className="reel-on well block border border-[color:var(--rule)] transition-colors duration-300 group-hover:border-[color:var(--rule-strong)]" style={{ "--i": i } as CSSProperties}>
                <Still src={c.thumb} sizes="196px" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent" />
                <span className="mono absolute bottom-3 left-3 flex items-center gap-2 text-[color:var(--ink)]">
                  <span className="lamp-off" aria-hidden="true" />
                  Play
                </span>
              </span>
              <span className="mt-3 block text-[13px] leading-snug text-[color:var(--ink)]">{c.caption ?? c.title}</span>
              {c.handle && <span className="mono mt-1 block">@{c.handle}</span>}
            </button>
          </li>
        ))}
      </ul>
      </Reveal>
      <EmbedModal videoId={open?.id ?? null} src={open?.src ?? null} platform={open?.platform ?? "youtube"} title={open?.title ?? ""} open={!!open} onClose={() => setOpen(null)} />
    </div>
  );
}
