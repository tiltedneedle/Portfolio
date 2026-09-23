"use client";

import { useState } from "react";
import { EmbedModal } from "@/components/room/EmbedModal";

type Clip = { id: string; title: string; caption?: string; thumb: string; handle: string };

export function ClipRailClient({ title, note, clips }: { title?: string; note?: string; clips: Clip[] }) {
  const [open, setOpen] = useState<Clip | null>(null);

  return (
    <div className="border-t border-[color:var(--rule-strong)] pt-6">
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <p className="mono text-[color:var(--ink)]">{title ?? "From the library"}</p>
        {note && <p className="em-serif max-w-[44ch] text-[17px] text-[color:var(--ink-soft)]">{note}</p>}
      </div>
      <ul className="rail -mx-6 gap-4 px-6 md:mx-0 md:px-0">
        {clips.map((c) => (
          <li key={c.id} className="w-[168px] md:w-[196px]">
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="group block w-full text-left"
              aria-label={"Play " + c.title}
              data-cursor="Play"
            >
              <span className="well block border border-[color:var(--rule)] transition-colors duration-300 group-hover:border-[color:var(--rule-strong)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.thumb} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent" />
                <span className="mono absolute bottom-3 left-3 flex items-center gap-2 text-[color:var(--ink)]">
                  <span className="lamp-off" aria-hidden="true" />
                  Play
                </span>
              </span>
              <span className="mt-3 block text-[13px] leading-snug text-[color:var(--ink)]">{c.caption ?? c.title}</span>
              {c.handle && <span className="mono mt-1 block text-[10px]">@{c.handle}</span>}
            </button>
          </li>
        ))}
      </ul>
      <EmbedModal videoId={open?.id ?? null} title={open?.title ?? ""} open={!!open} onClose={() => setOpen(null)} />
    </div>
  );
}
