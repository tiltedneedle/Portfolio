import { CutLink } from "@/components/room/CutLink";
import { Rail } from "@/components/portal/Rail";
import type { Script } from "@/content/clients/types";
import { mmss, spokenSeconds } from "@/lib/words";

const pad = (n: number) => String(n).padStart(2, "0");

const spoken = (s: Script) => (s.body?.length ? spokenSeconds([s.hook, ...s.body, s.cta].filter(Boolean).join(" ")) : 0);

/** Twenty scripts on a rail. A title opens the script; a slot says so. */
export function ScriptsRail({ scripts }: { scripts: Script[] }) {
  const written = scripts.filter((s) => s.body?.length).length;
  return (
    <Rail count={scripts.length} label={written + " of " + scripts.length + " written"}>
      {scripts.map((s) => (
        <li key={s.n} className="w-[min(224px,72vw)] md:w-[256px]">
          <CutLink
            href={"/content/scripts/" + s.n}
            data-cursor="Open"
            className="group relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-5 transition-colors duration-300 hover:border-[color:var(--rule-strong)] md:p-6"
          >
            <span aria-hidden="true" className="numeral pointer-events-none absolute -right-1 top-8 text-[120px] opacity-50">
              {pad(s.n)}
            </span>
            <span className="mono relative flex items-center justify-between">
              <span>Script {pad(s.n)}</span>
              {s.example ? <span className="text-[color:var(--ink-mid)]">Example</span> : spoken(s) ? <span className="text-[color:var(--ink-mid)]">&asymp; {mmss(spoken(s))}</span> : null}
            </span>
            <span className="relative">
              {s.title ? (
                <span className="display block text-[clamp(26px,2.4vw,32px)] leading-[0.95] text-[color:var(--ink)]">{s.title}</span>
              ) : (
                <span className="em-serif block text-[19px] text-[color:var(--ink-mid)]">In production.</span>
              )}
              <span className="mono mt-5 block text-[color:var(--ink-soft)] transition-colors group-hover:text-[color:var(--ink)]">
                Open <span aria-hidden="true">&#8599;</span>
              </span>
            </span>
          </CutLink>
        </li>
      ))}
    </Rail>
  );
}
