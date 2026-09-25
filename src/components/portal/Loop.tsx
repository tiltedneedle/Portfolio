import { CutLink } from "@/components/room/CutLink";
import { home } from "@/content/system/home";

/**
 * How to use the system: five stations on one rail, and a dashed return
 * from the last back to the first that keeps travelling, because the last
 * step is to go round again. Frozen under reduced motion.
 *
 * A step whose room this client does not have yet keeps its words and loses
 * its link: the method is the same for everyone, the rooms are not.
 */
export function Loop({ paths }: { paths?: Set<string> }) {
  const steps = home.how;
  const n = steps.length;
  return (
    <div>
      {/* wide: the rail */}
      <div className="relative hidden md:block">
        <svg aria-hidden="true" viewBox="0 0 1000 72" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-[72px] w-full">
          <path d="M 900 72 C 900 0 100 0 100 72" fill="none" stroke="var(--rule-strong)" strokeWidth="1" className="loop-dash" vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="grid grid-cols-5 border-t border-[color:var(--rule-strong)]" style={{ marginTop: 72 }}>
          {steps.map((s, i) => (
            <li key={s.title} className="relative px-4 pt-8 first:pl-0 last:pr-0">
              <span aria-hidden="true" className="absolute -top-[5px] left-1/2 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-[color:var(--ink)]" />
              <p className="mono mb-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display text-[clamp(28px,3vw,44px)] leading-[0.95] text-[color:var(--ink)]">{s.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-mid)]">{s.text}</p>
              {i < n - 1 && (!paths || paths.has(s.href)) && (
                <CutLink href={s.href} className="slate-link mt-5 inline-block" data-cursor="Cut">
                  Open &#8599;
                </CutLink>
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* narrow: a column */}
      <ol className="ml-4 border-l border-[color:var(--rule-strong)] md:hidden">
        {steps.map((s, i) => (
          <li key={s.title} className="relative pb-10 pl-8 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-[10px] h-[9px] w-[9px] rounded-full bg-[color:var(--ink)]" />
            <p className="mono mb-2">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="display text-[36px] leading-[0.95] text-[color:var(--ink)]">{s.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-mid)]">{s.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
