"use client";

import { useState } from "react";
import type { TrainingFilm as Film } from "@/content/types";
import { Still } from "@/components/portal/Still";

/**
 * The training film for a guide. With a YouTube id it fills a 16:9 well,
 * showing the film's own frame and playing on click from the privacy-enhanced
 * host.
 *
 * Without one it is not an empty 16:9 box. A suite represents a film nobody
 * has shot as a slot on the timeline with the playhead parked at zero: the
 * title, the state, and a strip of frame marks with nothing on them. The
 * page reads finished, and the slot is waiting rather than broken.
 */
export function TrainingFilm({ film, number }: { film: Film; number: string }) {
  const [playing, setPlaying] = useState(false);
  const id = film.youtubeId;

  if (!id)
    return (
      <figure className="no-print relative w-full overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)] px-5 py-5 md:px-6 md:py-6">
        <p className="mono flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="lamp-off" aria-hidden="true" />
            Training film <span className="text-[color:var(--ink-mid)]">/</span> {number}
          </span>
          <span className="text-[color:var(--ink-mid)]">Not yet shot</span>
        </p>
        <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 md:mt-10">
          <p className="display text-[clamp(28px,3.4vw,52px)] leading-[0.95] text-[color:var(--ink)]">{film.title}</p>
          <p className="mono text-[color:var(--ink-mid)]">Arrives with your onboarding</p>
        </div>
        <div aria-hidden="true" className="film-track mt-7 md:mt-9" />
      </figure>
    );

  return (
    <figure className="relative aspect-video w-full overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)]">
      {playing ? (
        <iframe
          src={"https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1&playsinline=1&color=white&autoplay=1"}
          title={"Training film: " + film.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <>
          <Still src={"https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg"} eager sizes="(min-width:1600px) 1600px, 100vw" className="object-cover opacity-70" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 mono md:p-6">
            <span className="flex items-center gap-2">
              <span className="lamp" aria-hidden="true" />
              Training film <span className="text-[color:var(--ink-mid)]">/</span> {number}
            </span>
            {film.minutes ? <span className="tc text-[11px]">{String(film.minutes).padStart(2, "0")}:00</span> : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="display text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-[color:var(--ink)]">{film.title}</p>
          </div>
          {(
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={"Play the training film: " + film.title}
              data-cursor="Play"
            >
              <span className="pill pill-outline px-6 py-3 text-[13px] backdrop-blur-md">Play &#9654;</span>
            </button>
          )}
        </>
      )}
    </figure>
  );
}
