import type { Block } from "@/content/types";
import { Rich } from "@/components/portal/Rich";
import { ClipRail } from "@/components/portal/ClipRail";
import { ProfileCompare } from "@/components/portal/ProfileCompare";
import { Reveal } from "@/components/portal/Reveal";
import { Cadence, Cycle, Fan, Figure, Flow, Lens, Retention, Shots, Structure } from "@/components/portal/diagrams";
import { Flashcards } from "@/components/portal/Flashcards";
import { Typewriter } from "@/components/portal/Typewriter";

/**
 * One renderer per block kind. Everything here is a server component; the
 * two pieces that need a browser (the clip rail, the profile mocks) are
 * their own files.
 *
 * The furniture is deliberately small: paragraphs at a reading measure,
 * ruled rows with mono indices, pills, spoken lines in the serif italic,
 * on-screen text as chips, and the call sheet. Variety comes from the
 * writing choosing the right kind, not from more kinds.
 */

const pad = (i: number) => String(i + 1).padStart(2, "0");

function Title({ text }: { text?: string }) {
  if (!text) return null;
  return <p className="mono mb-4">{text}</p>;
}

function Paragraph({ text }: { text: string }) {
  return (
    <p className="measure text-[17px] leading-[1.7] text-[color:var(--ink-soft)]">
      <Rich text={text} />
    </p>
  );
}

function Lead({ text }: { text: string }) {
  return (
    <p className="measure text-[21px] leading-[1.5] text-[color:var(--ink)]">
      <Rich text={text} />
    </p>
  );
}

function List({ title, items, style = "rule" }: { title?: string; items: string[]; style?: "rule" | "tag" | "beat" }) {
  if (style === "tag") {
    return (
      <div>
        <Title text={title} />
        <ul className="flex flex-wrap gap-2">
          {items.map((it) => (
            <li key={it} className="tag">
              <Rich text={it} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (style === "beat") {
    return (
      <div>
        <Title text={title} />
        <ul className="border-l border-[color:var(--rule-strong)] pl-6">
          {items.map((it) => (
            <li key={it} className="display text-[clamp(28px,3.6vw,52px)] leading-[1.05] text-[color:var(--ink)]/90">
              {it}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  const twoUp = items.length >= 6 && items.every((it) => it.length <= 36);
  return (
    <div>
      <Title text={title} />
      <ol className={"border-b border-[color:var(--rule)] " + (twoUp ? "md:grid md:grid-cols-2 md:gap-x-10" : "")}>
        {items.map((it, i) => (
          <li key={it} className="grid grid-cols-[3ch_1fr] gap-x-5 border-t border-[color:var(--rule)] py-3.5">
            <span className="mono pt-1">{pad(i)}</span>
            <span className="text-[17px] leading-snug text-[color:var(--ink)]">
              <Rich text={it} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Questions({ title, items }: { title?: string; items: string[] }) {
  return (
    <div>
      <Title text={title} />
      <ul className="border-b border-[color:var(--rule)]">
        {items.map((it) => (
          <li key={it} className="em-serif border-t border-[color:var(--rule)] py-3.5 text-[21px] leading-snug text-[color:var(--ink)] md:text-[23px]">
            <Rich text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Lines({ title, items, mode = "spoken" }: { title?: string; items: string[]; mode?: "spoken" | "screen" | "dim" }) {
  if (mode === "screen") {
    return (
      <div>
        <Title text={title} />
        <ul className="flex flex-wrap gap-3">
          {items.map((it) => (
            <li key={it}>
              <span className="chip">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (mode === "dim") {
    return (
      <div>
        <Title text={title} />
        <ul className="flex flex-col gap-2">
          {items.map((it) => (
            <li key={it} className="flex items-baseline gap-3 text-[17px] text-[color:var(--ink-mid)]">
              <span aria-hidden="true" className="mono text-[color:var(--ink-faint)]">
                &times;
              </span>
              <span className="line-through decoration-[color:var(--ink-faint)]">
                <Rich text={it} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div>
      <Title text={title} />
      <ul className="flex flex-col gap-5">
        {items.map((it) => (
          <li key={it} className="spoken em-serif max-w-[30ch] text-[clamp(22px,2.4vw,30px)] leading-[1.25] text-[color:var(--ink)]">
            <Rich text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Swaps({
  title,
  pairs,
  fromLabel = "Instead of",
  toLabel = "Try",
}: {
  title?: string;
  pairs: { from: string; to: string }[];
  fromLabel?: string;
  toLabel?: string;
}) {
  return (
    <div>
      <Title text={title} />
      <div className="border-b border-[color:var(--rule)]">
        {pairs.map((p) => (
          <div key={p.from} className="grid gap-y-3 border-t border-[color:var(--rule)] py-5 md:grid-cols-[1fr_auto_1fr] md:gap-x-8">
            <div>
              <p className="mono mb-2 text-[color:var(--ink-faint)]">{fromLabel}</p>
              <p className="text-[17px] leading-snug text-[color:var(--ink-mid)]">
                <Rich text={p.from} />
              </p>
            </div>
            <span aria-hidden="true" className="mono hidden self-center text-[color:var(--ink-faint)] md:block">
              &rarr;
            </span>
            <div>
              <p className="mono mb-2">{toLabel}</p>
              <p className="em-serif text-[21px] leading-snug text-[color:var(--ink)] md:text-[23px]">
                <Rich text={p.to} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pairs({
  title,
  items,
  aLabel,
  bLabel,
}: {
  title?: string;
  items: { a: string; b: string }[];
  aLabel?: string;
  bLabel?: string;
}) {
  return (
    <div>
      <Title text={title} />
      {(aLabel || bLabel) && (
        <div className="mono hidden grid-cols-2 gap-x-8 pb-2 md:grid">
          <span>{aLabel}</span>
          <span>{bLabel}</span>
        </div>
      )}
      <div className="border-b border-[color:var(--rule)]">
        {items.map((it) => (
          <div key={it.a} className="grid gap-y-1 border-t border-[color:var(--rule)] py-4 md:grid-cols-2 md:gap-x-8">
            <p className="text-[17px] leading-snug text-[color:var(--ink-soft)]">
              <span className="mono mr-3 text-[color:var(--ink-faint)] md:hidden">{aLabel}</span>
              <Rich text={it.a} />
            </p>
            <p className="text-[17px] leading-snug text-[color:var(--ink)]">
              <span className="mono mr-3 text-[color:var(--ink-faint)] md:hidden">{bLabel}</span>
              <Rich text={it.b} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Keyed({ title, items }: { title?: string; items: { label: string; lines: string[] }[] }) {
  return (
    <div>
      <Title text={title} />
      <div className="border-b border-[color:var(--rule)]">
        {items.map((it, i) => (
          <div key={it.label + i} className="grid gap-y-2 border-t border-[color:var(--rule)] py-4 md:grid-cols-[200px_1fr] md:gap-x-8">
            <p className="mono pt-1">{it.label}</p>
            <div className="flex flex-col gap-2">
              {it.lines.map((l) =>
                l.startsWith("“") ? (
                  <p key={l} className="em-serif text-[21px] leading-snug text-[color:var(--ink)]">
                    <Rich text={l} />
                  </p>
                ) : (
                  <p key={l} className="text-[17px] leading-snug text-[color:var(--ink)]">
                    <Rich text={l} />
                  </p>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Steps({ title, items }: { title?: string; items: { title: string; text?: string }[] }) {
  return (
    <div>
      <Title text={title} />
      <ol className="relative ml-4 border-l border-[color:var(--rule-strong)]">
        {items.map((it, i) => (
          <li key={it.title} className="relative pb-8 pl-8 last:pb-0">
            <span aria-hidden="true" className="absolute -left-[5px] top-[10px] h-[9px] w-[9px] rounded-full bg-[color:var(--ink)]" />
            <p className="mono mb-1">{pad(i)}</p>
            <p className="display text-[clamp(24px,2.6vw,34px)] leading-[0.95] text-[color:var(--ink)]">{it.title}</p>
            {it.text && (
              <p className="measure mt-2 text-[17px] leading-relaxed text-[color:var(--ink-soft)]">
                <Rich text={it.text} />
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Cards({ title, items }: { title?: string; items: { title: string; text: string }[] }) {
  return (
    <div>
      <Title text={title} />
      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.title} className="border-t border-[color:var(--rule-strong)] pt-4">
            <p className="mono mb-3">{pad(i)}</p>
            <p className="display text-[32px] leading-[0.95] text-[color:var(--ink)]">{it.title}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
              <Rich text={it.text} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Column({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="mono mb-3">{label}</p>
      <ul className="border-b border-[color:var(--rule)]">
        {items.map((it) => (
          <li key={it} className="border-t border-[color:var(--rule)] py-3 text-[17px] leading-snug text-[color:var(--ink)]">
            <Rich text={it} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Split({ title, a, b }: { title?: string; a: { label: string; items: string[] }; b: { label: string; items: string[] } }) {
  return (
    <div>
      <Title text={title} />
      <div className="grid gap-10 md:grid-cols-2">
        <Column {...a} />
        <Column {...b} />
      </div>
    </div>
  );
}

function Checklist({ title, items, note }: { title: string; items: string[]; note?: string }) {
  return (
    <div className="border border-[color:var(--rule-strong)] p-6 md:p-8">
      <div className="mb-4 flex items-baseline justify-between gap-6">
        <p className="mono text-[color:var(--ink)]">{title}</p>
        <p className="mono text-[color:var(--ink-faint)]">Call sheet</p>
      </div>
      <ul>
        {items.map((it, i) => (
          <li key={it} className="flex items-start gap-4 border-t border-[color:var(--rule)] py-3.5">
            <span className="box" aria-hidden="true" />
            <span className="mono w-[3ch] pt-1 text-[color:var(--ink-faint)]">{pad(i)}</span>
            <span className="text-[17px] leading-snug text-[color:var(--ink)]">
              <Rich text={it} />
            </span>
          </li>
        ))}
      </ul>
      {note && (
        <p className="em-serif mt-5 text-[19px] text-[color:var(--ink-soft)]">
          <Rich text={note} />
        </p>
      )}
    </div>
  );
}

function Aside({ label, text }: { label?: string; text: string }) {
  return (
    <div className="border-l-2 border-[color:var(--ink)] pl-6 md:pl-8">
      {label && <p className="mono mb-2">{label}</p>}
      <p className="em-serif max-w-[34ch] text-[clamp(21px,2.2vw,27px)] leading-[1.3] text-[color:var(--ink)]">
        <Rich text={text} />
      </p>
    </div>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-9">
      {blocks.map((b, i) => (
        <Reveal key={i}>
          <BlockView block={b} />
        </Reveal>
      ))}
    </div>
  );
}

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case "p":
      return <Paragraph text={block.text} />;
    case "lead":
      return <Lead text={block.text} />;
    case "list":
      return <List title={block.title} items={block.items} style={block.style} />;
    case "questions":
      return <Questions title={block.title} items={block.items} />;
    case "lines":
      return <Lines title={block.title} items={block.items} mode={block.mode} />;
    case "swaps":
      return <Swaps title={block.title} pairs={block.pairs} fromLabel={block.fromLabel} toLabel={block.toLabel} />;
    case "pairs":
      return <Pairs title={block.title} items={block.items} aLabel={block.aLabel} bLabel={block.bLabel} />;
    case "keyed":
      return <Keyed title={block.title} items={block.items} />;
    case "steps":
      return <Steps title={block.title} items={block.items} />;
    case "cards":
      return <Cards title={block.title} items={block.items} />;
    case "split":
      return <Split title={block.title} a={block.a} b={block.b} />;
    case "checklist":
      return <Checklist title={block.title} items={block.items} note={block.note} />;
    case "aside":
      return <Aside label={block.label} text={block.text} />;
    case "sub":
      return (
        <div className="border-t border-[color:var(--rule-strong)] pt-6">
          <h3 className="mono mb-6 text-[color:var(--ink)]">{block.title}</h3>
          <Blocks blocks={block.blocks} />
        </div>
      );
    case "clips":
      return <ClipRail title={block.title} note={block.note} items={block.items} />;
    case "retention":
      return <Retention title={block.title} note={block.note} />;
    case "cadence":
      return <Cadence title={block.title} note={block.note} days={block.days} every={block.every} />;
    case "fan":
      return <Fan title={block.title} from={block.from} fromLabel={block.fromLabel} to={block.to} note={block.note} />;
    case "structure":
      return <Structure title={block.title} parts={block.parts} seconds={block.seconds} note={block.note} />;
    case "shots":
      return <Shots title={block.title} items={block.items} note={block.note} />;
    case "lens":
      return <Lens title={block.title} wide={block.wide} tight={block.tight} note={block.note} />;
    case "flashcards":
      return <Flashcards title={block.title} items={block.items} note={block.note} />;
    case "flow":
      return <Flow title={block.title} steps={block.steps} end={block.end} note={block.note} />;
    case "typewriter":
      return <Typewriter title={block.title} queries={block.queries} />;
    case "cycle":
      return <Cycle title={block.title} items={block.items} note={block.note} />;
    case "figure":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} ratio={block.ratio} />;
    case "profile":
      return <ProfileCompare />;
  }
}
