import { Rail } from "@/components/portal/Rail";
import { pillars } from "@/content/system/pillars";
import { shortName, type Idea, type Pillar, type PublicIdentity } from "@/content/clients/types";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/** Four pillars, each a rail of twenty-five cards. */
export function IdeasPillars({ ideas, identity }: { ideas: Record<Pillar, Idea[]>; identity: PublicIdentity }) {
  const who = shortName(identity);
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
                  Pillar {pad(pi)} <span className="text-[color:var(--ink-faint)]">/</span> {list.length} ideas
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
                      {idea.example && <span className="text-[color:var(--ink-faint)]">Example</span>}
                    </p>
                    {idea.text ? (
                      <p className="max-w-[18ch] text-[19px] leading-snug text-[color:var(--ink)] md:text-[21px]">{idea.text}</p>
                    ) : (
                      <p className="em-serif max-w-[16ch] text-[19px] leading-snug text-[color:var(--ink-faint)]">Written for {who}.</p>
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
