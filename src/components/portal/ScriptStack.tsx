import type { CSSProperties } from "react";
import { CutLink } from "@/components/room/CutLink";
import type { Script } from "@/content/clients/types";
import { mmss, spokenSeconds } from "@/lib/words";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The twenty, as the pages they are: the written scripts stacked on the
 * desk beside the title, the top one set the way a script is set -- the
 * slate line, the location as the scene heading, the title, who is on
 * camera as the character cue, the hook as the first line of dialogue and
 * the script running on off the foot of the page. The pages under it are
 * paper: their words peeking out from under the top page read as litter.
 * Dealt onto the desk one after another as the page opens; the top page
 * opens its script, and reaching for it fans the ones under it.
 *
 * One link, named for the script it opens; the page face is decoration
 * over what the rail below says in full. Wide screens only, where the
 * title leaves the room.
 *
 * Nothing written yet, and the stack is blank paper with the first page
 * slated as in production: decoration, not a link, since there is nothing
 * to open. Without it the header's right half stood empty.
 */
export function ScriptStack({ scripts }: { scripts: Script[] }) {
  const written = scripts.filter((s) => s.body?.length);
  const page =
    "stack-page absolute left-[40%] top-4 h-[380px] w-[296px] border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] shadow-[0_22px_48px_rgba(0,0,0,0.6)]";
  if (!written.length) {
    if (!scripts.length) return null;
    return (
      <div aria-hidden="true" className="stack no-print relative hidden h-[420px] w-[400px] shrink-0 xl:block">
        {[0, 1].map((k) => (
          <div key={k} className={page} style={{ "--i": k, "--d": 2 - k } as CSSProperties} />
        ))}
        <div className={page + " flex flex-col px-6 pb-6 pt-5"} style={{ "--i": 2, "--d": 0 } as CSSProperties}>
          <p className="mono flex items-center justify-between text-[10px]">
            <span className="text-[color:var(--ink)]">Script 01</span>
            <span>In production</span>
          </p>
          {/* Ruled lines where the words will go. */}
          <span className="mt-10 flex flex-col gap-4">
            {[92, 76, 84, 60, 88, 70, 80].map((w, i) => (
              <span key={i} className="block h-px bg-[color:var(--rule)]" style={{ width: w + "%" }} />
            ))}
          </span>
          <p className="em-serif mt-auto text-[17px] text-[color:var(--ink-mid)]">Being written for you.</p>
        </div>
      </div>
    );
  }
  const top = written[0];
  const secs = spokenSeconds([top.hook, ...(top.body ?? []), top.cta].filter(Boolean).join(" "));
  // Up to two sheets under it, one per further written script.
  const under = Math.min(2, written.length - 1);
  return (
    <CutLink
      href={"/content/scripts/" + top.n}
      aria-label={"Open script " + pad(top.n) + ": " + top.title}
      data-cursor="Open"
      className="stack no-print relative hidden h-[420px] w-[400px] shrink-0 xl:block"
    >
      {Array.from({ length: under }, (_, k) => (
        <div key={k} aria-hidden="true" className={page} style={{ "--i": k, "--d": under - k } as CSSProperties} />
      ))}
      <div aria-hidden="true" className={page + " flex flex-col overflow-hidden px-6 pb-6 pt-5"} style={{ "--i": under, "--d": 0 } as CSSProperties}>
        <p className="mono flex items-center justify-between text-[10px]">
          <span className="text-[color:var(--ink)]">Script {pad(top.n)}</span>
          <span>{mmss(secs)}</span>
        </p>
        {top.location && <p className="mono mt-5 line-clamp-2 text-[10px] leading-relaxed text-[color:var(--ink)]">{top.location}</p>}
        <p className="display mt-4 line-clamp-3 text-[24px] leading-[0.95]">{top.title}</p>
        {top.onCamera && <p className="mono mt-6 text-center text-[10px] text-[color:var(--ink)]">{top.onCamera}</p>}
        {top.hook && <p className="mx-auto mt-2 line-clamp-4 max-w-[84%] text-center font-mono text-[12px] leading-[1.55] text-[color:var(--ink-soft)]">{top.hook}</p>}
        {top.body?.[0] && (
          <p className="mx-auto mt-4 max-w-[84%] text-center font-mono text-[12px] leading-[1.55] text-[color:var(--ink-mid)]">{top.body[0]}</p>
        )}
        {/* The script runs on past the foot of the page. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[color:var(--stage-2)]" />
      </div>
    </CutLink>
  );
}
