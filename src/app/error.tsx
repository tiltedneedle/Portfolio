"use client";

import { useEffect } from "react";

/**
 * The page could not be rendered. Said in the room's voice, with the one
 * useful action: try the take again. The error itself goes to the console,
 * where whoever maintains the site will look for it.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center bg-[color:var(--stage)]">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-32 md:px-14">
        <p className="mono mb-8 flex items-center gap-2">
          <span className="lamp" aria-hidden="true" />
          Fault <span className="text-[color:var(--ink-faint)]">/</span> The take broke
        </p>
        <h1 className="display max-w-[10ch] text-[clamp(64px,11vw,176px)]">
          Cut. <span className="em-serif">Going again.</span>
        </h1>
        <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
          Something on this page failed to render. Nothing of yours is lost; try the page again, and if it keeps happening, tell us which page it
          was.
        </p>
        {error.digest && <p className="mono mt-4 text-[color:var(--ink-faint)]">Ref {error.digest}</p>}
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <button type="button" onClick={reset} className="pill pill-solid px-7 py-3 text-[15px]" data-cursor="Play">
            Try again
          </button>
          <a href="/" className="slate-link">
            Back to the system &rarr;
          </a>
        </div>
      </div>
    </main>
  );
}
