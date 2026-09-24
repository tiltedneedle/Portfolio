import type { AuditReport as Report, AuditSection, PublicIdentity, Verdict } from "@/content/clients/types";
import { firstMoves, shortName, writtenSections } from "@/content/clients/types";
import { chapter, pageNumber } from "@/content/chapters";
import { NextCut } from "@/components/portal/NextCut";
import { Rich } from "@/components/portal/Rich";
import { ReadingProgress } from "@/components/portal/ReadingProgress";
import { ReadToggle } from "@/components/portal/ReadToggle";
import { ClipRail } from "@/components/portal/ClipRail";
import { CompetitorBoard, PositionMap } from "@/components/portal/competitors";
import { Reveal } from "@/components/portal/Reveal";
import { PrintButton } from "@/components/portal/PrintButton";
import { Anchor } from "@/components/portal/Anchor";

const pad = (i: number) => String(i + 1).padStart(2, "0");

const VERDICT: Record<Verdict, string> = { strong: "Strong", mixed: "Mixed", weak: "Weak" };

/** The lamp for a heading: tally when weak, a ring when mixed, solid ink when strong, off until written. */
function Lamp({ verdict, written }: { verdict?: Verdict; written: boolean }) {
  if (!written) return <span className="lamp-off" aria-hidden="true" />;
  if (verdict === "weak") return <span className="lamp" aria-hidden="true" />;
  if (verdict === "mixed") return <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full border border-[color:var(--ink-mid)]" />;
  return <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-[color:var(--ink)]" />;
}

/** A score out of ten as a small arc. */
function Dial({ score, verdict }: { score: number; verdict?: Verdict }) {
  const r = 17;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(10, score));
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" role="img" aria-label={v + " out of 10"} className="shrink-0">
      <circle cx="22" cy="22" r={r} fill="none" stroke="var(--rule-strong)" strokeWidth="2" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={verdict === "weak" ? "var(--tally)" : "var(--ink)"}
        strokeWidth="2"
        strokeDasharray={(c * v) / 10 + " " + c}
        transform="rotate(-90 22 22)"
        strokeLinecap="butt"
      />
      <text x="22" y="26" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink)">
        {v}
      </text>
    </svg>
  );
}

function Column({ label, items, tone }: { label: string; items: string[]; tone: "keep" | "limit" | "change" }) {
  return (
    <div>
      <p className={"mono mb-3 flex items-center gap-2 " + (tone === "change" ? "text-[color:var(--ink)]" : "")}>
        {tone === "limit" && <span className="lamp" aria-hidden="true" />}
        {label}
      </p>
      <ul className="border-b border-[color:var(--rule)]">
        {items.map((it) => (
          <li
            key={it}
            className={
              "border-t border-[color:var(--rule)] py-3 text-[15px] leading-snug " +
              (tone === "change" ? "em-serif text-[19px] text-[color:var(--ink)]" : tone === "limit" ? "text-[color:var(--ink-mid)]" : "text-[color:var(--ink-soft)]")
            }
          >
            <Rich text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Finding({ s, i, who }: { s: AuditSection; i: number; who: string }) {
  const written = !!s.body?.length;
  const columns = [
    s.working?.length ? { label: "Keep", items: s.working, tone: "keep" as const } : null,
    s.limiting?.length ? { label: "Holding you back", items: s.limiting, tone: "limit" as const } : null,
    s.change?.length ? { label: "We would change", items: s.change, tone: "change" as const } : null,
  ].filter((c): c is NonNullable<typeof c> => !!c);
  return (
    <section id={"a-" + pad(i)} className="group/section grid scroll-mt-28 gap-x-8 border-t border-[color:var(--rule)] py-12 md:grid-cols-[96px_1fr] md:py-16">
      <span className="numeral mb-4 text-[56px] md:mb-0 md:text-[72px]" data-n={pad(i)} aria-hidden="true" />
      <span className="sr-only">Heading {pad(i)}</span>
      <div className="min-w-0">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <h2 className="display max-w-[16ch] text-[clamp(30px,3.6vw,52px)]">{s.title}</h2>
            <Anchor id={"a-" + pad(i)} label={s.title} />
          </div>
          {written && (s.verdict || typeof s.score === "number") && (
            <p className="mono flex items-center gap-3 pt-2">
              {typeof s.score === "number" && <Dial score={s.score} verdict={s.verdict} />}
              {s.verdict && (
                <span className="flex items-center gap-2">
                  <Lamp verdict={s.verdict} written />
                  {VERDICT[s.verdict]}
                </span>
              )}
              {s.first && <span className="text-[color:var(--ink)]">Move {s.first}</span>}
            </p>
          )}
        </div>

        {written ? (
          <>
            <div className="flex max-w-[62ch] flex-col gap-5">
              {s.body!.map((p) => (
                <p key={p} className="text-[17px] leading-[1.7] text-[color:var(--ink-soft)]">
                  <Rich text={p} />
                </p>
              ))}
            </div>
            {columns.length > 0 && (
              <div className={"mt-10 grid gap-8 " + (columns.length === 3 ? "lg:grid-cols-3" : columns.length === 2 ? "md:grid-cols-2" : "")}>
                {columns.map((c) => (
                  <Column key={c.label} {...c} />
                ))}
              </div>
            )}
            {s.lists?.map((l) => (
              <div key={l.label} className="mt-10">
                <p className="mono mb-3">{l.label}</p>
                <ol className="border-b border-[color:var(--rule)]">
                  {l.items.map((it, k) => (
                    <li key={it} className="grid grid-cols-[3ch_1fr] gap-x-5 border-t border-[color:var(--rule)] py-3">
                      <span className="mono pt-1">{pad(k)}</span>
                      <span className="text-[17px] leading-snug text-[color:var(--ink)]">
                        <Rich text={it} />
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            {s.evidence?.length ? (
              <div className="mt-10">
                <ClipRail title="From the feed" items={s.evidence} />
              </div>
            ) : null}
          </>
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
  );
}

/**
 * A personalised report: the fixed headings, each with the client's
 * findings under it, or the slate that says they are on their way. The
 * structure is the same for every client; only the findings change.
 *
 * The header scans the whole report in one row of lamps; the first three
 * moves come before the detail; the competitor report adds its board and
 * its map.
 */
export function AuditReport({ slug, title, report, identity }: { slug: string; title: string; report: Report; identity: PublicIdentity }) {
  const c = chapter("audit");
  const n = pageNumber("audit", slug);
  const who = shortName(identity);
  const sections = report.sections;
  const written = writtenSections(report);
  const scored = written.filter((s) => typeof s.score === "number");
  const average = scored.length ? Math.round((scored.reduce((a, s) => a + (s.score ?? 0), 0) / scored.length) * 10) / 10 : null;
  const moves = firstMoves(report);

  return (
    <article className="audit-page bg-[color:var(--stage)]">
      <ReadingProgress />
      <header className="mx-auto max-w-[1600px] px-6 pb-14 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-mid)]">/</span> {n}
          </span>
          <span className="flex items-center gap-2 text-[color:var(--ink)]">
            <span className="lamp" aria-hidden="true" />
            Written for {who}
          </span>
          {written.length > 0 && (
            <span className="no-print ml-auto">
              <PrintButton />
            </span>
          )}
        </p>
        <h1 className="display mt-6 max-w-[10ch] text-[clamp(52px,8.5vw,140px)]">{title}</h1>
        <p className="em-serif mt-6 max-w-[40ch] text-[clamp(22px,2.6vw,34px)] leading-[1.25] text-[color:var(--ink-soft)]">{report.intro}</p>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div className="min-w-0">
            <p className="mono">
              {sections.length} headings <span className="text-[color:var(--ink-mid)]">/</span> {written.length} written
            </p>
            {/* the scan: one lamp per heading */}
            <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Every heading, and how it reads">
              {sections.map((s, i) => {
                const isWritten = !!s.body?.length;
                return (
                  <li key={s.title} className="desk-tile" style={{ ["--i" as string]: i }}>
                    <a
                      href={"#a-" + pad(i)}
                      title={s.title + (isWritten && s.verdict ? ": " + VERDICT[s.verdict] : isWritten ? "" : ": to be written")}
                      className={
                        "flex h-11 w-11 flex-col items-center justify-center gap-1.5 border transition-colors hover:border-[color:var(--rule-strong)] " +
                        (isWritten ? "border-[color:var(--rule-strong)] bg-[color:var(--stage-2)]" : "border-[color:var(--rule)]")
                      }
                    >
                      <span className="mono text-[10px] leading-none">{pad(i)}</span>
                      <Lamp verdict={s.verdict} written={isWritten} />
                    </a>
                  </li>
                );
              })}
            </ol>
            {scored.length > 1 && (
              // The shape of the account: one bar per scored heading, in order.
              <ol className="mt-4 flex h-10 max-w-full items-end gap-1.5" aria-label="Scores by heading">
                {sections.map((s, i) => {
                  const v = typeof s.score === "number" && s.body?.length ? s.score : null;
                  return (
                    <li key={s.title} className="flex h-full min-w-0 flex-1 items-end md:flex-none md:w-11" title={s.title + (v === null ? ": not scored" : ": " + v + " of 10")}>
                      <span
                        aria-hidden="true"
                        className={"desk-bar block w-full " + (v === null ? "border-t border-dashed border-[color:var(--rule-strong)]" : s.verdict === "weak" ? "bg-[color:var(--tally)]" : s.verdict === "strong" ? "bg-[color:var(--ink)]" : "bg-[color:var(--ink-mid)]")}
                        style={{ height: v === null ? 1 : Math.max(2, (v / 10) * 40), ["--i" as string]: i }}
                      />
                      <span className="sr-only">
                        {pad(i)} {s.title}: {v === null ? "not scored" : v + " of 10"}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
          {average !== null && (
            <div className="desk-avg flex items-end gap-4">
              <span className="display text-[clamp(56px,7vw,96px)] leading-none text-[color:var(--ink)]">{average}</span>
              <span className="mono pb-2 leading-relaxed">
                out of 10 today
                <br />
                <span className="text-[color:var(--ink-mid)]">
                  across {scored.length} scored heading{scored.length === 1 ? "" : "s"}
                </span>
              </span>
            </div>
          )}
        </div>
      </header>

      {moves.length > 0 && (
        <section className="border-y border-[color:var(--rule)] bg-[color:var(--stage-2)]" aria-label="What to do first">
          <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-14 md:py-20">
            <p className="mono">What to do first</p>
            <h2 className="display mt-3 text-[clamp(36px,4.6vw,72px)]">
              {moves.length === 1 ? "One move" : moves.length === 2 ? "Two moves" : "Three moves"}, <span className="em-serif">in order.</span>
            </h2>
            <Reveal>
              <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
                {moves.map((m, i) => (
                  <li key={m.title} className="beat border-t border-[color:var(--rule-strong)] pt-5" style={{ ["--i" as string]: i }}>
                  <p className="mono flex items-center justify-between">
                    <span>Move {m.first}</span>
                    <a href={"#a-" + pad(sections.indexOf(m))} className="slate-link text-[12px]">
                      {pad(sections.indexOf(m))} &darr;
                    </a>
                  </p>
                  <p className="display mt-3 text-[clamp(26px,2.6vw,36px)] leading-[0.95] text-[color:var(--ink)]">{m.title}</p>
                  <ul className="mt-4 flex flex-col gap-2">
                    {(m.change ?? []).slice(0, 2).map((ch) => (
                      <li key={ch} className="em-serif text-[19px] leading-snug text-[color:var(--ink-soft)]">
                        <Rich text={ch} />
                      </li>
                    ))}
                  </ul>
                  {i === moves.length - 1 && <p className="mono mt-5 text-[color:var(--ink-mid)]">Everything else can wait.</p>}
                </li>
              ))}
              </ol>
            </Reveal>
          </div>
        </section>
      )}

      {report.competitors?.length ? (
        <section id="board" className="mx-auto max-w-[1600px] scroll-mt-28 px-6 pt-14 md:px-14 md:pt-20" aria-label="The accounts studied">
          <p className="mono">The field</p>
          <h2 className="display mt-3 text-[clamp(36px,4.6vw,72px)]">
            {report.competitors.length} accounts, <span className="em-serif">studied.</span>
          </h2>
          <div className="mt-8">
            <CompetitorBoard items={report.competitors} />
          </div>
        </section>
      ) : null}

      {report.map ? (
        <section id="map" className="mx-auto max-w-[1600px] scroll-mt-28 px-6 pt-14 md:px-14 md:pt-20" aria-label="Where everyone stands">
          <Reveal>
            <PositionMap map={report.map} />
          </Reveal>
        </section>
      ) : null}

      <div className="mx-auto max-w-[1600px] px-6 pb-24 pt-8 md:px-14 md:pt-12">
        {sections.map((s, i) => (
          <Finding key={s.title} s={s} i={i} who={who} />
        ))}
      </div>

      <ReadToggle k={"audit/" + slug} />
      <NextCut chapter="audit" slug={slug} />
    </article>
  );
}
