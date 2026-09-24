import type { Competitor, PositionMap as PositionMapT } from "@/content/clients/types";
import { Rich } from "@/components/portal/Rich";

/**
 * The competitor report's two pictures: the board of accounts studied, and
 * where everyone stands on two axes. Both render on the server from the
 * client's data; nothing here is fetched.
 */

const PLATFORM: Record<Competitor["platform"], string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

export function CompetitorBoard({ items }: { items: Competitor[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((c, i) => (
        <li key={c.handle} className="flex flex-col border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-5 md:p-6">
          <p className="mono flex items-center justify-between gap-3">
            <span>
              {String(i + 1).padStart(2, "0")} <span className="text-[color:var(--ink-mid)]">/ {PLATFORM[c.platform]}</span>
            </span>
            <span className="text-[color:var(--ink-mid)]">
              {c.followers}
              {c.followers && c.cadence ? " · " : ""}
              {c.cadence}
            </span>
          </p>
          <p className="display mt-5 text-[28px] leading-[0.95] text-[color:var(--ink)]">{c.name}</p>
          <p className="mono mt-1 text-[color:var(--ink-mid)]">{c.handle}</p>
          <p className="em-serif mt-4 text-[19px] leading-snug text-[color:var(--ink-soft)]">
            <Rich text={c.note} />
          </p>
          <div className="mt-5 border-t border-[color:var(--rule)] pt-4">
            <p className="mono mb-2">Does well</p>
            <ul className="flex flex-wrap gap-1.5">
              {c.strengths.map((s) => (
                <li key={s} className="tag py-1 text-[13px]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="mono mb-2">Misses</p>
            <ul className="flex flex-col gap-1">
              {c.gaps.map((g) => (
                <li key={g} className="flex items-baseline gap-2 text-[15px] leading-snug text-[color:var(--ink-mid)]">
                  <span aria-hidden="true" className="mono">
                    &times;
                  </span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Two axes, every account a point, the client in tally red. */
export function PositionMap({ map }: { map: PositionMapT }) {
  const S = 360;
  const pad = 36;
  const px = (x: number) => pad + x * (S - pad * 2);
  const py = (y: number) => S - pad - y * (S - pad * 2);
  return (
    <figure className="grid gap-6 md:grid-cols-[minmax(0,420px)_1fr] md:items-center md:gap-12">
      <svg
        viewBox={`0 0 ${S} ${S}`}
        className="h-auto w-full max-w-[420px] border border-[color:var(--rule)] bg-[color:var(--stage-2)]"
        role="img"
        aria-label={"Positioning map: " + map.points.map((p) => p.name).join(", ") + ", on " + map.x.join(" to ") + " and " + map.y.join(" to ") + "."}
      >
        {/* quadrants */}
        <line x1={px(0.5)} x2={px(0.5)} y1={py(0)} y2={py(1)} stroke="var(--rule-strong)" strokeWidth="1" strokeDasharray="3 4" />
        <line x1={px(0)} x2={px(1)} y1={py(0.5)} y2={py(0.5)} stroke="var(--rule-strong)" strokeWidth="1" strokeDasharray="3 4" />
        <rect x={px(0)} y={py(1)} width={S - pad * 2} height={S - pad * 2} fill="none" stroke="var(--rule)" strokeWidth="1" />
        {/* axis ends */}
        <text x={px(0)} y={S - 10} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1">
          {map.x[0].toUpperCase()}
        </text>
        <text x={px(1)} y={S - 10} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1" textAnchor="end">
          {map.x[1].toUpperCase()}
        </text>
        <text x={10} y={py(0)} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1" transform={`rotate(-90 10 ${py(0)})`}>
          {map.y[0].toUpperCase()}
        </text>
        <text x={10} y={py(1)} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1" transform={`rotate(-90 10 ${py(1)})`} textAnchor="end">
          {map.y[1].toUpperCase()}
        </text>
        {/* points */}
        {map.points.map((p) => (
          <g key={p.name}>
            {p.you && <circle cx={px(p.x)} cy={py(p.y)} r="11" fill="none" stroke="var(--tally)" strokeWidth="1" opacity="0.6" />}
            <circle cx={px(p.x)} cy={py(p.y)} r="5" fill={p.you ? "var(--tally)" : "var(--stage-3)"} stroke={p.you ? "var(--tally)" : "var(--ink)"} strokeWidth="1.25" />
            <text
              x={px(p.x) + (p.x > 0.7 ? -9 : 9)}
              y={py(p.y) + 4}
              fontSize="10"
              fontFamily="var(--font-mono)"
              fill={p.you ? "var(--ink)" : "var(--ink-soft)"}
              textAnchor={p.x > 0.7 ? "end" : "start"}
            >
              {p.name.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>
        <p className="mono">Where everyone stands</p>
        <p className="em-serif mt-3 max-w-[30ch] text-[clamp(21px,2.2vw,27px)] leading-[1.25] text-[color:var(--ink)]">
          {map.x[0]} to {map.x[1]}, {map.y[0].toLowerCase()} to {map.y[1].toLowerCase()}.
        </p>
        <ul className="mono mt-5 flex flex-col gap-1.5">
          {map.points.map((p) => (
            <li key={p.name} className="flex items-center gap-3">
              <span aria-hidden="true" className={"inline-block h-2 w-2 rounded-full " + (p.you ? "bg-[color:var(--tally)]" : "border border-[color:var(--ink)]")} />
              <span className={p.you ? "text-[color:var(--ink)]" : ""}>{p.name}</span>
              {p.you && <span className="text-[color:var(--ink-mid)]">you, today</span>}
            </li>
          ))}
        </ul>
      </figcaption>
    </figure>
  );
}
