import { CutLink } from "@/components/room/CutLink";
import { changes } from "@/content/system/changes";

const show = 5;

function printed(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** The latest additions to the system, so a return visit sees it growing. */
export function RecentChanges() {
  const latest = changes.slice(0, show);
  if (latest.length === 0) return null;
  return (
    <section className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-20 md:py-28" aria-label="Recently added">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,64ch)] md:gap-20">
          <div>
            <p className="mono">Recently added</p>
            <h2 className="display mt-3 max-w-[10ch] text-[clamp(36px,4.6vw,72px)]">
              The system <span className="em-serif">keeps growing.</span>
            </h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">Permanent access means this: what we learn is added here, for you, as we learn it.</p>
          </div>
          <ol className="border-b border-[color:var(--rule)]">
            {latest.map((c) => (
              <li key={c.date + c.text} className="grid gap-x-8 gap-y-2 border-t border-[color:var(--rule)] py-5 md:grid-cols-[14ch_1fr_auto] md:items-baseline">
                <span className="mono text-[color:var(--ink-mid)]">{printed(c.date)}</span>
                <span className="text-[17px] leading-snug text-[color:var(--ink)]">{c.text}</span>
                {c.href ? (
                  <CutLink href={c.href} className="slate-link" data-cursor="Cut">
                    Open &#8599;
                  </CutLink>
                ) : (
                  <span />
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
