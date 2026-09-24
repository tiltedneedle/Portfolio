import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CutLink } from "@/components/room/CutLink";
import { CopyScript } from "@/components/portal/CopyScript";
import { Prompter } from "@/components/portal/Prompter";
import { PrintButton } from "@/components/portal/PrintButton";
import { FilmedToggle } from "@/components/portal/FilmedToggle";
import { chapter, pageNumber } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { scriptAsText, shortName } from "@/content/clients/types";
import { mmss, spokenSeconds, wordCount } from "@/lib/words";

const pad = (n: number) => String(n).padStart(2, "0");

// Every client has twenty script slots, so the numbers are the same for all.
export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ n: String(i + 1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ client: string; n: string }> }): Promise<Metadata> {
  const { client, n } = await params;
  const s = requireClient(client).scripts.find((x) => String(x.n) === n);
  return { title: s?.title ? "Script " + pad(s.n) + ": " + s.title : "Script " + n };
}

export default async function ScriptPage({ params }: { params: Promise<{ client: string; n: string }> }) {
  const { client, n } = await params;
  const sys = requireClient(client);
  const s = sys.scripts.find((x) => String(x.n) === n);
  if (!s) notFound();
  const c = chapter("content");
  const prev = sys.scripts.find((x) => x.n === s.n - 1);
  const next = sys.scripts.find((x) => x.n === s.n + 1);
  const written = !!s.body?.length;
  const spokenText = written ? [s.hook, ...s.body!, s.cta].filter(Boolean).join(" ") : "";
  const words = wordCount(spokenText);
  const spoken = spokenSeconds(spokenText);

  return (
    <article className="script-page bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-12 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-mid)]">/</span> {pageNumber("content", "scripts")}{" "}
            <span className="text-[color:var(--ink-mid)]">/</span> Script {pad(s.n)} of {pad(sys.scripts.length)}
          </span>
          {s.example && <span className="text-[color:var(--ink-mid)]">Example</span>}
        </p>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display max-w-[14ch] text-[clamp(48px,7.5vw,120px)]">{s.title || "Script " + pad(s.n)}</h1>
            {(s.location || s.onCamera) && (
              <dl className="mono mt-6 flex flex-wrap gap-x-10 gap-y-2">
                {s.location && (
                  <div className="flex gap-3">
                    <dt className="text-[color:var(--ink-mid)]">Location</dt>
                    <dd className="text-[color:var(--ink)]">{s.location}</dd>
                  </div>
                )}
                {s.onCamera && (
                  <div className="flex gap-3">
                    <dt className="text-[color:var(--ink-mid)]">On camera</dt>
                    <dd className="text-[color:var(--ink)]">{s.onCamera}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
          <div className="no-print flex flex-wrap items-center gap-4">
            <CopyScript text={scriptAsText(s)} disabled={!written} />
            {written && <Prompter title={"Script " + pad(s.n) + " \u2014 " + s.title} hook={s.hook} body={s.body!} cta={s.cta} spoken={spoken} />}
            {written && <PrintButton />}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 pb-24 md:px-14">
        {written ? (
          <div className="grid gap-x-16 border-t border-[color:var(--rule)] pt-12 md:grid-cols-[200px_1fr]">
            <div className="mono flex flex-col gap-2 md:sticky md:top-28 md:self-start">
              <span>Hook</span>
              <span>Script</span>
              {s.cta && <span>Call to action</span>}
              {s.shots?.length ? <span>Shot list</span> : null}
              <span className="mt-4 text-[color:var(--ink-mid)]">{words} words</span>
              <span className="text-[color:var(--ink-mid)]">
                &asymp; {mmss(spoken)} <span className="text-[color:var(--ink-mid)]">spoken</span>
              </span>
            </div>
            <div className="flex max-w-[62ch] flex-col gap-14">
              {s.hook && (
                <section>
                  <p className="mono mb-5">Hook</p>
                  <p className="spoken em-serif text-[clamp(24px,3vw,38px)] leading-[1.25] text-[color:var(--ink)]">{s.hook}</p>
                </section>
              )}
              <section>
                <p className="mono mb-5">Script</p>
                <div className="flex flex-col gap-6">
                  {s.body!.map((p, i) => (
                    <p key={i} className="text-[19px] leading-[1.65] text-[color:var(--ink)] md:text-[21px]">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
              {s.cta && (
                <section className="border-t border-[color:var(--rule)] pt-8">
                  <p className="mono mb-5">Call to action</p>
                  <p className="text-[19px] leading-[1.6] text-[color:var(--ink-soft)]">{s.cta}</p>
                </section>
              )}
              <div className="no-print border-t border-[color:var(--rule)] pt-8">
                <CopyScript text={scriptAsText(s)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-[60ch] border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-6 md:p-8">
            <p className="mono flex items-center gap-2">
              <span className="lamp-off" aria-hidden="true" />
              In production for {shortName(sys.identity)}
            </p>
            <p className="em-serif mt-4 text-[19px] leading-snug text-[color:var(--ink-mid)] md:text-[21px]">
              A title, a hook, the full script and a call to action, written around your business. It will appear here, ready to copy.
            </p>
          </div>
        )}
      </div>

      {written && s.shots?.length ? (
        <section className="mx-auto max-w-[1600px] px-6 pb-24 md:px-14" aria-label="Storyboard">
          <div className="border-t border-[color:var(--rule-strong)] pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="mono">Storyboard</p>
              <p className="mono text-[color:var(--ink-mid)]">
                {s.shots.length} shots <span className="text-[color:var(--ink-mid)]">/</span> in order
              </p>
            </div>
            <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {s.shots.map((shot, i) => (
                <li key={shot} className="relative flex aspect-[9/16] flex-col justify-between overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-4">
                  <span aria-hidden="true" className="numeral pointer-events-none absolute -right-1 top-6 text-[112px] opacity-40" data-n={pad(i + 1)} />
                  <span className="mono relative flex items-center justify-between">
                    <span>{pad(i + 1)}</span>
                    <span className="text-[color:var(--ink-mid)]">{i === 0 ? "Open" : i === s.shots!.length - 1 ? "Close" : "Shot"}</span>
                  </span>
                  <span className="relative text-[15px] leading-snug text-[color:var(--ink)] md:text-[16px]">{shot}</span>
                  {/* frame corners */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-2 border border-[color:var(--rule)] opacity-60" />
                </li>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {written && <FilmedToggle n={s.n} />}
      <nav className="no-print border-t border-[color:var(--rule)] bg-[color:var(--stage-2)]" aria-label="Scripts">
        <div className="mono mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-14">
          <span>
            {prev ? (
              <CutLink href={"/content/scripts/" + prev.n} className="slate-link" data-cursor="Cut">
                &larr; Script {pad(prev.n)}
              </CutLink>
            ) : (
              <span className="text-[color:var(--ink-mid)]">First script</span>
            )}
          </span>
          <CutLink href="/content/scripts" className="slate-link" data-cursor="Cut">
            All scripts &uarr;
          </CutLink>
          <span>
            {next ? (
              <CutLink href={"/content/scripts/" + next.n} className="slate-link text-[color:var(--ink)]" data-cursor="Cut">
                Script {pad(next.n)} &rarr;
              </CutLink>
            ) : (
              <span className="text-[color:var(--ink-mid)]">Last script</span>
            )}
          </span>
        </div>
      </nav>
    </article>
  );
}
