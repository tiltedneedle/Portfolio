import { Rail } from "@/components/portal/Rail";
import { CopyIdea } from "@/components/portal/CopyIdea";
import { pillars } from "@/content/system/pillars";
import { shortName, type Idea, type Pillar, type PublicIdentity, type Script } from "@/content/clients/types";
import { CutLink } from "@/components/room/CutLink";
import { askHref } from "@/lib/ask";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Four pillars, each a rail of twenty-five cards. */
export function IdeasPillars({ ideas, identity, scripts = [] }: { ideas: Record<Pillar, Idea[]>; identity: PublicIdentity; scripts?: Script[] }) {
  const who = shortName(identity);
  // The script an idea became, if a written script names it.
  const became = new Map(scripts.filter((s) => s.from && s.body?.length).map((s) => [s.from!.pillar + ":" + s.from!.n, s.n]));
  return (
    <div className="flex flex-col gap-24">
      {pillars.map((p, pi) => {
        const list = ideas[p.id];
        const written = list.filter((i) => i.text).length;
        return (
          <section key={p.id} id={p.id} className="scroll-mt-28">
            <div className="mb-8 grid gap-6 md:grid-cols-[1fr_minmax(0,44ch)] md:items-end">
              <div>
                <p className="mono">
                  Pillar {pad(pi)} <span className="text-[color:var(--ink-mid)]">/</span> {list.length} ideas
                </p>
                <h2 className="display mt-3 text-[clamp(48px,7vw,120px)]">{p.title}</h2>
              </div>
              <p className="em-serif text-[19px] leading-snug text-[color:var(--ink-soft)] md:text-[21px]">{p.definition}</p>
            </div>
            <Rail count={list.length} label={written + " of " + list.length + " written"}>
              {list.map((idea, i) => (
                <li
                  key={i}
                  className="relative aspect-[4/5] w-[min(248px,78vw)] overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-5 md:w-[292px] md:p-6"
                >
                  <span aria-hidden="true" className="numeral pointer-events-none absolute -right-1 bottom-2 text-[120px] opacity-50">
                    {pad(i)}
                  </span>
                  <div className="relative flex h-full flex-col justify-between">
                    <p className="mono flex items-center justify-between">
                      <span>
                        {p.title} {pad(i)}
                      </span>
                      {idea.example ? <span className="text-[color:var(--ink-mid)]">Example</span> : idea.text ? <CopyIdea text={idea.text} /> : null}
                    </p>
                    {idea.text ? (
                      <span>
                        <p className="max-w-[18ch] text-[19px] leading-snug text-[color:var(--ink)] md:text-[21px]">{idea.text}</p>
                        {became.has(p.id + ":" + (i + 1)) ? (
                          <CutLink href={"/content/scripts/" + became.get(p.id + ":" + (i + 1))} className="slate-link mt-4 inline-flex items-center gap-2 text-[color:var(--ink)]" data-cursor="Open">
                            <span className="lamp" aria-hidden="true" />
                            Script {String(became.get(p.id + ":" + (i + 1))).padStart(2, "0")} &#8599;
                          </CutLink>
                        ) : (
                          <a href={askHref(identity, p.title + " " + pad(i), idea.text)} className="slate-link mt-4 inline-flex text-[11px]" data-cursor="Ask">
                            Ask for this as a script &#8599;
                          </a>
                        )}
                      </span>
                    ) : (
                      <p className="em-serif max-w-[16ch] text-[19px] leading-snug text-[color:var(--ink-mid)]">Written for {who}.</p>
                    )}
                  </div>
                </li>
              ))}
            </Rail>
          </section>
        );
      })}
    </div>
  );
}
