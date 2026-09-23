import type { AuditReport as Report, PublicIdentity } from "@/content/clients/types";
import { shortName } from "@/content/clients/types";
import { chapter, pageNumber } from "@/content/chapters";
import { NextCut } from "@/components/portal/NextCut";
import { Rich } from "@/components/portal/Rich";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * A personalised report: the fixed headings, each with the client's findings
 * under it, or the slate that says they are on their way. The structure is
 * the same for every client; only the findings change.
 */
export function AuditReport({ slug, title, report, identity }: { slug: string; title: string; report: Report; identity: PublicIdentity }) {
  const c = chapter("audit");
  const n = pageNumber("audit", slug);
  const who = shortName(identity);
  const sections = report.sections;
  const written = sections.filter((s) => s.body?.length).length;
  return (
    <article className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-faint)]">/</span> {n}
          </span>
          <span className="flex items-center gap-2 text-[color:var(--ink)]">
            <span className="lamp" aria-hidden="true" />
            Written for {who}
          </span>
        </p>
        <h1 className="display mt-6 max-w-[10ch] text-[clamp(52px,8.5vw,140px)]">{title}</h1>
        <p className="em-serif mt-6 max-w-[40ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">{report.intro}</p>
        <p className="mono mt-10">
          {sections.length} headings <span className="text-[color:var(--ink-faint)]">/</span> {written} written
        </p>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <ol className="grid grid-cols-2 gap-x-6 gap-y-2 border-y border-[color:var(--rule)] py-6 mono sm:grid-cols-3 lg:grid-cols-5">
          {sections.map((s, i) => (
            <li key={s.title}>
              <a href={"#a-" + pad(i)} className={"hover:text-[color:var(--ink)] " + (s.body?.length ? "text-[color:var(--ink-soft)]" : "")}>
                <span className="text-[color:var(--ink-faint)]">{pad(i)}</span> {s.title}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-8 md:px-14 md:pt-12">
        {sections.map((s, i) => (
          <section key={s.title} id={"a-" + pad(i)} className="grid scroll-mt-28 gap-x-8 border-t border-[color:var(--rule)] py-12 md:grid-cols-[96px_1fr] md:py-16">
            <span className="numeral mb-4 text-[56px] md:mb-0 md:text-[72px]">{pad(i)}</span>
            <div>
              <h2 className="display mb-8 max-w-[16ch] text-[clamp(30px,3.6vw,52px)]">{s.title}</h2>
              {s.body?.length ? (
                <div className="flex max-w-[62ch] flex-col gap-5">
                  {s.body.map((p) => (
                    <p key={p} className="text-[17px] leading-[1.7] text-[color:var(--ink-soft)]">
                      <Rich text={p} />
                    </p>
                  ))}
                </div>
              ) : (
                <div className="max-w-[60ch] border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-6 md:p-8">
                  <p className="mono flex items-center gap-2">
                    <span className="lamp-off" aria-hidden="true" />
                    To be written for {who}
                  </p>
                  <p className="em-serif mt-4 text-[19px] leading-snug text-[color:var(--ink-mid)] md:text-[21px]">{s.covers}</p>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <NextCut chapter="audit" slug={slug} />
    </article>
  );
}
