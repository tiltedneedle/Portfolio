"use client";

import { useState } from "react";
import type { TrainingFilm as Film } from "@/content/types";
import { Still } from "@/components/portal/Still";

/**
 * The training film for a guide, in a 16:9 well. With a YouTube id it shows
 * the film's own frame and plays on click from the privacy-enhanced host.
 * Without one it stands on its slate, so the page reads complete before the
 * film has been uploaded.
 */
export function TrainingFilm({ film, number }: { film: Film; number: string }) {
  const [playing, setPlaying] = useState(false);
  const id = film.youtubeId;

  return (
    <figure className="relative aspect-video w-full overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)]">
      {id && playing ? (
        <iframe
          src={"https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1&playsinline=1&color=white&autoplay=1"}
          title={"Training film: " + film.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <>
          {id && <Still src={"https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg"} eager className="absolute inset-0 h-full w-full object-cover opacity-70" />}
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 mono md:p-6">
            <span className="flex items-center gap-2">
              <span className={id ? "lamp" : "lamp-off"} aria-hidden="true" />
              Training film <span className="text-[color:var(--ink-mid)]">/</span> {number}
            </span>
            {film.minutes ? <span className="tc text-[11px]">{String(film.minutes).padStart(2, "0")}:00</span> : null}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="display text-[clamp(32px,4.5vw,64px)] leading-[0.9] text-[color:var(--ink)]">{film.title}</p>
            {!id && <p className="mono mt-3 text-[color:var(--ink-mid)]">Arrives with your onboarding</p>}
          </div>
          {id && (
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
