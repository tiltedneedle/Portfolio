import type { Idea, Pillar } from "@/content/clients/types";
import { pillars } from "@/content/system/pillars";

/**
 * The mix: how the written ideas split across the four pillars, as a ring.
 * The brief asks for a balance; the ring shows at a glance whether there
 * is one. Four tones of the same ink, darkest to lightest, in pillar order.
 */
const TONES = ["var(--ink)", "var(--ink-soft)", "var(--ink-mid)", "var(--stage-3)"];

export function PillarMix({ ideas }: { ideas: Record<Pillar, Idea[]> }) {
  const counts = pillars.map((p) => ({ ...p, n: ideas[p.id].filter((i) => i.text).length }));
  const total = counts.reduce((a, c) => a + c.n, 0);
  if (total === 0) return null;
  const r = 44;
  const c = 2 * Math.PI * r;
  // Each arc starts where the last one ended; the offset runs backwards
  // because the dash pattern is drawn from the top, clockwise.
  const arcs = counts.reduce<{ id: Pillar; title: string; n: number; tone: string; dash: string; offset: number }[]>((out, p, i) => {
    const len = (p.n / total) * c;
    const before = out.reduce((a, x) => a + (x.n / total) * c, 0);
    out.push({ id: p.id, title: p.title, n: p.n, tone: TONES[i], dash: len + " " + (c - len), offset: -before });
    return out;
  }, []);
  const lead = counts.reduce((a, b) => (b.n > a.n ? b : a), counts[0]);
  const share = Math.round((lead.n / total) * 100);
  return (
    <div className="flex flex-wrap items-center gap-8 md:gap-12">
      <svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label={counts.map((p) => p.n + " " + p.title.toLowerCase()).join(", ") + " written"}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--rule)" strokeWidth="12" />
        {arcs
          .filter((a) => a.n > 0)
          .map((a) => (
            <circle key={a.id} cx="60" cy="60" r={r} fill="none" stroke={a.tone} strokeWidth="12" strokeDasharray={a.dash} strokeDashoffset={a.offset} transform="rotate(-90 60 60)" />
          ))}
        <text x="60" y="57" textAnchor="middle" fontSize="20" fontFamily="var(--font-display)" fontWeight="800" fill="var(--ink)">
          {total}
        </text>
        <text x="60" y="72" textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1">
          WRITTEN
        </text>
      </svg>
      <div>
        <p className="mono">The mix</p>
        <ul className="mono mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5">
          {arcs.map((a) => (
            <li key={a.id} className="flex items-center gap-2.5">
              <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border border-[color:var(--rule-strong)]" style={{ background: a.tone }} />
              <span className={a.n ? "text-[color:var(--ink)]" : ""}>{a.title}</span>
              <span className="text-[color:var(--ink-mid)]">{a.n}</span>
            </li>
          ))}
        </ul>
        <p className="em-serif mt-4 max-w-[30ch] text-[17px] leading-snug text-[color:var(--ink-mid)]">
          {share >= 50
            ? lead.title + " carries " + share + "% of what is written. The bank should hold all four."
            : "A bank with all four pillars in it. Keep it that way as it grows."}
        </p>
      </div>
    </div>
  );
}
