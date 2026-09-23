import { Rich } from "@/components/portal/Rich";
import { timecode } from "@/lib/timecode";

/**
 * Diagrams as blocks. Each one draws a principle the writing states, in the
 * room's own materials: hairline rules, mono labels, the display face, and
 * tally red only where attention is lost. Everything here renders on the
 * server; the two that need a browser (flashcards, the typewriter) are
 * their own files.
 */

const pad = (i: number) => String(i + 1).padStart(2, "0");

function Title({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mono mb-4">{text}</p>;
}

/* ------------------------------------------------------------ retention */

/**
 * Where attention is lost. A watch-time curve with the two places viewers
 * leave marked: the first seconds (the hook) and the middle (the pacing).
 */
export function Retention({ title, note }: { title?: string; note?: string }) {
  const W = 640;
  const H = 240;
  const x0 = 44;
  const y0 = 16;
  const x1 = W - 12;
  const y1 = H - 36;
  // A believable short-form retention curve: a cliff in the first seconds,
  // a slow slide through the middle, a small lift at the payoff.
  const d = [
    `M ${x0} ${y0}`,
    `C ${x0 + 30} ${y0 + 10}, ${x0 + 40} ${y0 + 78}, ${x0 + 90} ${y0 + 92}`,
    `C ${x0 + 200} ${y0 + 122}, ${x0 + 330} ${y0 + 142}, ${x0 + 440} ${y0 + 150}`,
    `C ${x0 + 500} ${y0 + 154}, ${x0 + 540} ${y0 + 150}, ${x1} ${y0 + 140}`,
  ].join(" ");
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <figure>
      <Title text={title} />
      <div className="border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-4 md:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="A retention curve: most viewers who leave do so in the first seconds; the rest drift away through the middle.">
          {/* grid */}
          {ticks.map((t) => (
            <line key={"h" + t} x1={x0} x2={x1} y1={y0 + (y1 - y0) * t} y2={y0 + (y1 - y0) * t} stroke="var(--rule)" strokeWidth="1" />
          ))}
          {ticks.map((t) => (
            <text key={"y" + t} x={x0 - 8} y={y0 + (y1 - y0) * t + 4} textAnchor="end" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)">
              {Math.round((1 - t) * 100)}%
            </text>
          ))}
          {/* the zones */}
          <rect x={x0} y={y0} width={90} height={y1 - y0} fill="var(--tally)" opacity="0.07" />
          <rect x={x0 + 160} y={y0} width={260} height={y1 - y0} fill="var(--ink)" opacity="0.035" />
          {/* the curve */}
          <path d={d} fill="none" stroke="var(--ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <circle cx={x0 + 90} cy={y0 + 92} r="3.5" fill="var(--tally)" />
          <circle cx={x0 + 440} cy={y0 + 150} r="3.5" fill="var(--ink)" />
          {/* x axis */}
          <line x1={x0} x2={x1} y1={y1} y2={y1} stroke="var(--rule-strong)" strokeWidth="1" />
          <text x={x0} y={y1 + 18} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)">
            00:00
          </text>
          <text x={x0 + 90} y={y1 + 18} fontSize="10" fontFamily="var(--font-mono)" fill="var(--tally)" textAnchor="middle">
            00:03
          </text>
          <text x={x1} y={y1 + 18} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" textAnchor="end">
            END
          </text>
          <text x={x0 + 290} y={y0 + 12} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" textAnchor="middle" letterSpacing="1">
            THE MIDDLE
          </text>
          <text x={x0 + 45} y={y0 + 12} fontSize="10" fontFamily="var(--font-mono)" fill="var(--tally)" textAnchor="middle" letterSpacing="1">
            HOOK
          </text>
        </svg>
        <div className="mt-4 grid gap-4 border-t border-[color:var(--rule)] pt-4 md:grid-cols-2 md:gap-8">
          <p className="text-[15px] leading-snug text-[color:var(--ink-soft)]">
            <span className="mono mr-2 text-[color:var(--tally)]">00:03</span>
            Leave here: the hook, the first visual, how fast you get to the point.
          </p>
          <p className="text-[15px] leading-snug text-[color:var(--ink-soft)]">
            <span className="mono mr-2">MIDDLE</span>
            Leave here: the pacing, the explanation, the repetition, the lack of visual change.
          </p>
        </div>
      </div>
      {note && (
        <figcaption className="em-serif mt-4 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* -------------------------------------------------------------- cadence */

/** A month of days, every other one carrying a post. */
export function Cadence({ title, note, days = 30, every = 2 }: { title?: string; note?: string; days?: number; every?: number }) {
  const cells = Array.from({ length: days }, (_, i) => i);
  const posts = cells.filter((i) => i % every === 0).length;
  return (
    <figure>
      <Title text={title} />
      <div className="border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-4 md:p-6">
        <ol className="grid grid-cols-6 gap-1.5 sm:grid-cols-10 md:grid-cols-15 md:gap-2" aria-label={posts + " posts across " + days + " days"}>
          {cells.map((i) => {
            const on = i % every === 0;
            return (
              <li
                key={i}
                className={
                  "relative aspect-square border " +
                  (on ? "border-[color:var(--rule-strong)] bg-[color:var(--stage-3)]" : "border-[color:var(--rule)]")
                }
              >
                <span className="mono absolute left-1 top-0.5 text-[9px] text-[color:var(--ink-mid)]">{pad(i)}</span>
                {on && <span aria-hidden="true" className="lamp absolute bottom-1.5 right-1.5" />}
              </li>
            );
          })}
        </ol>
        <p className="mono mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-[color:var(--rule)] pt-4">
          <span className="text-[color:var(--ink)]">{posts} posts</span>
          <span>{days} days</span>
          <span className="text-[color:var(--ink-mid)]">One every other day</span>
        </p>
      </div>
      {note && (
        <figcaption className="em-serif mt-4 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ fan */

/**
 * One to many: a root on the left, branches on the right, joined by a
 * spine. Pure CSS, so it holds at any width and any row height.
 */
export function Fan({ title, from, fromLabel, to, note }: { title?: string; from: string; fromLabel?: string; to: { label?: string; text: string }[]; note?: string }) {
  return (
    <figure>
      <Title text={title} />
      <div className="grid md:grid-cols-[minmax(0,1fr)_48px_minmax(0,1.5fr)]">
        <div className="fan-root relative flex flex-col justify-center border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] p-5 md:p-6">
          {fromLabel && <p className="mono mb-3">{fromLabel}</p>}
          <p className="em-serif text-[21px] leading-snug text-[color:var(--ink)] md:text-[23px]">
            <Rich text={from} />
          </p>
        </div>
        <div aria-hidden="true" className="fan-gap" />
        <ol className="fan-branches">
          {to.map((b, i) => (
            <li key={b.text} className="fan-branch">
              <div className="border border-[color:var(--rule)] bg-[color:var(--stage-2)] px-4 py-3.5 md:px-5">
                <p className="mono mb-1 text-[color:var(--ink-mid)]">{b.label ?? "Angle " + pad(i)}</p>
                <p className="text-[17px] leading-snug text-[color:var(--ink)]">
                  <Rich text={b.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {note && (
        <figcaption className="em-serif mt-4 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------ structure */

/** Where the seconds go: the shape of a video as a strip with timecodes. */
export function Structure({ title, parts, seconds = 45, note }: { title?: string; parts: { label: string; share: number; text?: string }[]; seconds?: number; note?: string }) {
  const total = parts.reduce((a, p) => a + p.share, 0) || 1;
  const marks = parts.reduce<{ label: string; share: number; text?: string; start: number; end: number }[]>((out, p) => {
    const start = out.length ? out[out.length - 1].end : 0;
    out.push({ ...p, start, end: start + p.share / total });
    return out;
  }, []);
  return (
    <figure>
      <Title text={title} />
      <div className="border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-4 md:p-6">
        <div className="relative">
          <div className="flex h-12 w-full overflow-hidden border border-[color:var(--rule-strong)]" role="img" aria-label={parts.map((p) => p.label + " " + Math.round((p.share / total) * 100) + "%").join(", ")}>
            {marks.map((m, i) => (
              <div
                key={m.label}
                style={{ flexGrow: m.share, flexBasis: 0 }}
                className={"relative flex items-center justify-center border-r border-[color:var(--rule-strong)] last:border-r-0 " + (i === 0 ? "bg-[color:var(--stage-3)]" : i === marks.length - 1 ? "bg-[color:var(--stage-3)]" : "")}
              >
                <span className="mono text-[color:var(--ink-mid)]">{pad(i)}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-1 h-5">
            {marks.map((m, i) => (
              // On a phone the strip is too short for every timecode; the first and the total stay.
              <span
                key={m.label}
                className={"tc absolute -translate-x-1/2 text-[10px] first:translate-x-0 " + (i === 0 ? "" : "hidden sm:inline")}
                style={{ left: (m.start * 100).toFixed(2) + "%" }}
              >
                {timecode(m.start * seconds).slice(3, 8)}
              </span>
            ))}
            <span className="tc absolute right-0 text-[10px]">{timecode(seconds).slice(3, 8)}</span>
          </div>
        </div>
        <ol className="mt-4 grid gap-x-8 gap-y-4 border-t border-[color:var(--rule)] pt-5 sm:grid-cols-2 lg:grid-cols-5">
          {marks.map((m, i) => (
            <li key={m.label}>
              <p className="mono mb-1">
                {pad(i)} <span className="text-[color:var(--ink-mid)]">/ {Math.round((m.share / total) * 100)}%</span>
              </p>
              <p className="display text-[26px] leading-[0.95] text-[color:var(--ink)]">{m.label}</p>
              {m.text && (
                <p className="mt-2 text-[14px] leading-snug text-[color:var(--ink-mid)]">
                  <Rich text={m.text} />
                </p>
              )}
            </li>
          ))}
        </ol>
        <p className="mono mt-5 text-[color:var(--ink-mid)]">Drawn for a {seconds} second video. The proportions matter more than the seconds.</p>
      </div>
      {note && (
        <figcaption className="em-serif mt-4 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* ---------------------------------------------------------------- shots */

type ShotSize = "wide" | "medium" | "close" | "detail";

/** A figure in a 9:16 frame at one of four sizes, with the thirds grid on. */
function Frame({ size }: { size: ShotSize }) {
  const W = 90;
  const H = 160;
  // The figure: head, neck, shoulders, torso, legs, drawn once around (0,0)
  // at the top of the head and scaled into each framing.
  const figure = (
    <g fill="var(--ink-mid)">
      <circle cx="0" cy="12" r="11" />
      <rect x="-4" y="22" width="8" height="8" />
      <path d="M -30 34 Q 0 22 30 34 L 30 96 L -30 96 Z" />
      <rect x="-28" y="96" width="24" height="70" />
      <rect x="4" y="96" width="24" height="70" />
    </g>
  );
  const framing: Record<ShotSize, { s: number; x: number; y: number }> = {
    wide: { s: 0.42, x: 45, y: 62 },
    medium: { s: 0.95, x: 45, y: 36 },
    close: { s: 1.9, x: 45, y: 18 },
    detail: { s: 0, x: 0, y: 0 },
  };
  const f = framing[size];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
      <rect x="0" y="0" width={W} height={H} fill="var(--stage-3)" />
      {size === "wide" && (
        <>
          <line x1="0" x2={W} y1="118" y2="118" stroke="var(--rule-strong)" strokeWidth="1" />
          <path d="M 4 118 L 20 104 L 86 104 L 90 118" fill="var(--stage-2)" stroke="var(--rule-strong)" strokeWidth="0.75" />
        </>
      )}
      {size === "detail" ? (
        <g transform="translate(45 80)">
          <circle r="34" fill="none" stroke="var(--ink-mid)" strokeWidth="2.5" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 26} y1={Math.sin(a) * 26} x2={Math.cos(a) * 31} y2={Math.sin(a) * 31} stroke="var(--ink-mid)" strokeWidth="1.5" />;
          })}
          <line x1="0" y1="0" x2="16" y2="-20" stroke="var(--tally)" strokeWidth="2" />
          <circle r="3" fill="var(--ink)" />
        </g>
      ) : (
        <g transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>{figure}</g>
      )}
      {/* thirds */}
      <g stroke="var(--ink)" strokeOpacity="0.18" strokeWidth="0.5">
        <line x1={W / 3} x2={W / 3} y1="0" y2={H} />
        <line x1={(W * 2) / 3} x2={(W * 2) / 3} y1="0" y2={H} />
        <line x1="0" x2={W} y1={H / 3} y2={H / 3} />
        <line x1="0" x2={W} y1={(H * 2) / 3} y2={(H * 2) / 3} />
      </g>
    </svg>
  );
}

export function Shots({ title, items, note }: { title?: string; items: { label: string; size: ShotSize; text?: string }[]; note?: string }) {
  return (
    <figure>
      <Title text={title} />
      <ol className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {items.map((it, i) => (
          <li key={it.label}>
            <div className="overflow-hidden border border-[color:var(--rule)]">
              <Frame size={it.size} />
            </div>
            <p className="mono mt-3">{pad(i)}</p>
            <p className="display mt-1 text-[24px] leading-[0.95] text-[color:var(--ink)]">{it.label}</p>
            {it.text && (
              <p className="mt-2 text-[14px] leading-snug text-[color:var(--ink-mid)]">
                <Rich text={it.text} />
              </p>
            )}
          </li>
        ))}
      </ol>
      {note && (
        <figcaption className="em-serif mt-5 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* ----------------------------------------------------------------- lens */

/** Two angles of view from one camera: the wide takes the room, the tight takes the detail. */
export function Lens({ title, wide, tight, note }: { title?: string; wide: string; tight: string; note?: string }) {
  const cx = 40;
  const cy = 120;
  const R = 300;
  const wedge = (deg: number) => {
    const a = (deg / 2) * (Math.PI / 180);
    const x = cx + Math.cos(a) * R;
    const y1 = cy - Math.sin(a) * R;
    const y2 = cy + Math.sin(a) * R;
    return `M ${cx} ${cy} L ${x} ${y1} L ${x} ${y2} Z`;
  };
  return (
    <figure>
      <Title text={title} />
      <div className="border border-[color:var(--rule)] bg-[color:var(--stage-2)] p-4 md:p-6">
        <svg viewBox="0 0 340 240" className="h-auto w-full" role="img" aria-label="Two angles of view from one camera position: a wide lens covers the whole space, a tight lens isolates one detail.">
          <path d={wedge(84)} fill="var(--ink)" opacity="0.06" />
          <path d={wedge(84)} fill="none" stroke="var(--rule-strong)" strokeWidth="1" />
          <path d={wedge(22)} fill="var(--tally)" opacity="0.12" />
          <path d={wedge(22)} fill="none" stroke="var(--tally)" strokeWidth="1" />
          {/* the subjects: the cabin as a run of seats, one control as the detail */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={200 + i * 24} y={cy - 74 + i * 4} width="14" height="12" fill="var(--stage-3)" stroke="var(--rule-strong)" strokeWidth="1" />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={"b" + i} x={200 + i * 24} y={cy + 62 - i * 4} width="14" height="12" fill="var(--stage-3)" stroke="var(--rule-strong)" strokeWidth="1" />
          ))}
          <circle cx="300" cy={cy} r="9" fill="var(--stage-3)" stroke="var(--tally)" strokeWidth="1.5" />
          <circle cx="300" cy={cy} r="2" fill="var(--tally)" />
          {/* camera */}
          <rect x={cx - 16} y={cy - 9} width="16" height="18" fill="var(--ink)" />
          <rect x={cx - 24} y={cy - 5} width="8" height="10" fill="var(--ink)" />
          <text x={cx - 12} y={cy + 32} fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1">
            CAMERA
          </text>
          <text x="196" y="26" fontSize="10" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1">
            WIDE · THE SPACE
          </text>
          <text x="196" y="226" fontSize="10" fontFamily="var(--font-mono)" fill="var(--tally)" letterSpacing="1">
            TIGHT · THE DETAIL
          </text>
        </svg>
        <div className="mt-4 grid gap-4 border-t border-[color:var(--rule)] pt-4 md:grid-cols-2 md:gap-8">
          <p className="text-[15px] leading-snug text-[color:var(--ink-soft)]">
            <span className="mono mr-2">WIDE</span>
            <Rich text={wide} />
          </p>
          <p className="text-[15px] leading-snug text-[color:var(--ink-soft)]">
            <span className="mono mr-2 text-[color:var(--tally)]">TIGHT</span>
            <Rich text={tight} />
          </p>
        </div>
      </div>
      {note && (
        <figcaption className="em-serif mt-4 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* ----------------------------------------------------------------- flow */

/** A ladder of questions. Yes turns right to an answer; no drops to the next question. */
export function Flow({ title, steps, end, note }: { title?: string; steps: { q: string; yes: string }[]; end: string; note?: string }) {
  return (
    <figure>
      <Title text={title} />
      <ol className="flow">
        {steps.map((s, i) => (
          <li key={s.q} className="flow-step">
            <div className="flow-q">
              <p className="mono mb-2">{pad(i)}</p>
              <p className="em-serif text-[21px] leading-snug text-[color:var(--ink)] md:text-[23px]">
                <Rich text={s.q} />
              </p>
              <p className="mono mt-3 text-[color:var(--ink-mid)]">
                No <span aria-hidden="true">&darr;</span>
              </p>
            </div>
            <div className="flow-yes">
              <p className="mono mb-2 text-[color:var(--ink)]">
                Yes <span aria-hidden="true">&rarr;</span>
              </p>
              <p className="text-[17px] leading-snug text-[color:var(--ink)]">
                <Rich text={s.yes} />
              </p>
            </div>
          </li>
        ))}
        <li className="flow-end">
          <p className="mono mb-2">Then</p>
          <p className="em-serif text-[21px] leading-snug text-[color:var(--ink)] md:text-[23px]">
            <Rich text={end} />
          </p>
        </li>
      </ol>
      {note && (
        <figcaption className="em-serif mt-5 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* ---------------------------------------------------------------- cycle */

/** A ring of stations, each leading to the next, the last leading back to the first. */
export function Cycle({ title, items, note }: { title?: string; items: string[]; note?: string }) {
  const n = items.length;
  const cx = 160;
  const cy = 160;
  const r = 104;
  const pos = (i: number) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a };
  };
  // arcs between consecutive stations, stopping short so the arrowhead sits on the ring
  const gapDeg = 14;
  const arc = (i: number) => {
    const a1 = -Math.PI / 2 + (i / n) * Math.PI * 2 + (gapDeg * Math.PI) / 180;
    const a2 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2 - (gapDeg * Math.PI) / 180;
    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  };
  return (
    <figure>
      <Title text={title} />
      <div className="grid gap-8 md:grid-cols-[320px_1fr] md:items-center md:gap-12">
        <svg viewBox="0 0 320 320" className="mx-auto h-auto w-full max-w-[320px]" role="img" aria-label={items.join(", then ") + ", then round again."}>
          <defs>
            <marker id="cycle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-mid)" />
            </marker>
          </defs>
          {items.map((_, i) => (
            <path key={i} d={arc(i)} fill="none" stroke="var(--ink-mid)" strokeWidth="1.25" markerEnd="url(#cycle-arrow)" />
          ))}
          {items.map((it, i) => {
            const p = pos(i);
            return (
              <g key={it}>
                <circle cx={p.x} cy={p.y} r="16" fill="var(--stage-2)" stroke="var(--rule-strong)" strokeWidth="1" />
                <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink)">
                  {pad(i)}
                </text>
              </g>
            );
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1.5">
            EVERY
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink-mid)" letterSpacing="1.5">
            MONTH
          </text>
        </svg>
        <ol className="border-b border-[color:var(--rule)]">
          {items.map((it, i) => (
            <li key={it} className="grid grid-cols-[4ch_1fr] items-baseline gap-x-5 border-t border-[color:var(--rule)] py-4">
              <span className="mono">{pad(i)}</span>
              <span className="display text-[clamp(28px,3.2vw,44px)] leading-[0.95] text-[color:var(--ink)]">{it}</span>
            </li>
          ))}
        </ol>
      </div>
      {note && (
        <figcaption className="em-serif mt-5 text-[17px] text-[color:var(--ink-mid)]">
          <Rich text={note} />
        </figcaption>
      )}
    </figure>
  );
}

/* --------------------------------------------------------------- figure */

/** A still from the client or the studio, in a well, with a caption. */
export function Figure({ src, alt, caption, ratio = "16/9" }: { src: string; alt: string; caption?: string; ratio?: "16/9" | "9/16" | "4/5" | "1/1" | "3/2" }) {
  const ratios: Record<string, string> = { "16/9": "16 / 9", "9/16": "9 / 16", "4/5": "4 / 5", "1/1": "1 / 1", "3/2": "3 / 2" };
  const narrow = ratio === "9/16" || ratio === "4/5";
  return (
    <figure className={narrow ? "max-w-[360px]" : ""}>
      <div className="overflow-hidden border border-[color:var(--rule)] bg-[color:var(--stage-2)]" style={{ aspectRatio: ratios[ratio] }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      </div>
      {caption && (
        <figcaption className="mono mt-3 text-[color:var(--ink-mid)]">
          <Rich text={caption} />
        </figcaption>
      )}
    </figure>
  );
}
