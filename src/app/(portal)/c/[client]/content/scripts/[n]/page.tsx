import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CutLink } from "@/components/room/CutLink";
import { CopyScript } from "@/components/portal/CopyScript";
import { chapter, pageNumber } from "@/content/chapters";
import { requireClient } from "@/content/clients/registry";
import { scriptAsText, shortName } from "@/content/clients/types";

const pad = (n: number) => String(n).padStart(2, "0");

export const dynamicParams = false;

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

  return (
    <article className="bg-[color:var(--stage)]">
      <header className="mx-auto max-w-[1600px] px-6 pb-12 pt-28 md:px-14 md:pt-36">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span>
            {c.n} &mdash; {c.title} <span className="text-[color:var(--ink-faint)]">/</span> {pageNumber("content", "scripts")}{" "}
            <span className="text-[color:var(--ink-faint)]">/</span> Script {pad(s.n)} of {pad(sys.scripts.length)}
          </span>
          {s.example && <span className="text-[color:var(--ink-faint)]">Example</span>}
        </p>
        <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h1 className="display max-w-[14ch] text-[clamp(48px,7.5vw,120px)]">{s.title || "Script " + pad(s.n)}</h1>
          <div className="flex flex-wrap items-center gap-4">
            <CopyScript text={scriptAsText(s)} disabled={!written} />
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
              <div className="border-t border-[color:var(--rule)] pt-8">
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

      <nav className="border-t border-[color:var(--rule)] bg-[color:var(--stage-2)]" aria-label="Scripts">
        <div className="mono mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-14">
          <span>
            {prev ? (
              <CutLink href={"/content/scripts/" + prev.n} className="slate-link" data-cursor="Cut">
                &larr; Script {pad(prev.n)}
              </CutLink>
            ) : (
              <span className="text-[color:var(--ink-faint)]">First script</span>
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
              <span className="text-[color:var(--ink-faint)]">Last script</span>
            )}
          </span>
        </div>
      </nav>
    </article>
  );
}
