"use client";

import { useEffect } from "react";
import { CutLink } from "@/components/room/CutLink";
import { Rise, delay } from "@/components/portal/Scene";

/**
 * A page inside the portal could not be rendered.
 *
 * Without this, one throw in one client component took the root fault page
 * — and with it the nav, the footer, the palette and every way back into
 * the system. This boundary keeps the fault inside the room's shell, so a
 * reader can simply walk to another room.
 *
 * The error itself goes to the console, where whoever maintains the site
 * will look for it.
 */
export default function PortalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 py-32 md:px-14">
      <p className="mono scene-slate mb-8 flex items-center gap-2">
        <span className="lamp lamp-live" aria-hidden="true" />
        Fault <span className="text-[color:var(--ink-mid)]">/</span> This page broke
      </p>
      <h1 className="display max-w-[12ch] text-[clamp(56px,9vw,148px)]">
        <Rise text="Cut." />{" "}
        <span className="em-serif">
          <Rise text="Going again." from={1} />
        </span>
      </h1>
      <p className="scene-up mt-8 max-w-[46ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
        This page failed to render. The rest of your system is fine, and nothing of yours is lost. Try the page again, or take another room from the
        nav above.
      </p>
      {error.digest && <p className="mono mt-4 text-[color:var(--ink-mid)]">Ref {error.digest}</p>}
      <div className="scene-up mt-10 flex flex-wrap items-center gap-6" style={delay(0.85)}>
        <button type="button" onClick={reset} className="pill pill-solid px-7 py-3 text-[15px]" data-cursor="Play">
          Try again
        </button>
        <CutLink href="/" className="slate-link" data-cursor="Cut">
          Back to the front page &rarr;
        </CutLink>
      </div>
    </div>
  );
}
