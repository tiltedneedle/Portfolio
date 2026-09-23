/**
 * Two profiles, side by side, drawn schematically in the room's own tokens
 * rather than as screenshots: the one that loses the visitor, and the one
 * that turns them into an enquiry. Each note points at the thing it is
 * about.
 */

type Note = { title: string; text: string };

const bad: Note[] = [
  { title: "Unclear profile image", text: "A distant aircraft that reads as a grey smudge at thumbnail size." },
  { title: "Vague bio", text: "Luxury, lifestyle, travel. It does not explain what the business does." },
  { title: "No contact options", text: "Viewers have to message and wait." },
  { title: "No pinned content", text: "The most important videos are not highlighted." },
  { title: "Inconsistent grid", text: "Looks random, not like a brand." },
];

const good: Note[] = [
  { title: "Clear brand image", text: "Recognisable at any size, the same on every platform." },
  { title: "Informative bio", text: "What it does, where it operates, how to get in touch." },
  { title: "Relevant contact options", text: "Website, message and a call option to book." },
  { title: "Helpful highlights", text: "The business explained in one row of covers." },
  { title: "Strong pinned content", text: "The three videos that best explain who you are." },
  { title: "Consistent grid", text: "Every cover looks like it belongs to the same brand." },
];

function Phone({ variant }: { variant: "bad" | "good" }) {
  const good = variant === "good";
  const tiles = good
    ? ["Fly further", "More range", "Global 7500", "A day at the FBO", "Explore the fleet", "First-time flyers"]
    : ["", "", "", "", "", ""];
  return (
    <div className="mx-auto w-[236px] rounded-[22px] border border-[color:var(--rule-strong)] bg-[color:var(--stage)] p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
      <div className="mono mb-3 flex items-center justify-between text-[8px] tracking-normal">
        <span>14:32</span>
        <span className="text-[color:var(--ink-faint)]">{good ? "horizonaviation" : "skyaviation_"}</span>
      </div>
      <div className="flex items-center gap-3">
        <div
          className={
            "flex h-12 w-12 items-center justify-center rounded-full border " +
            (good ? "border-[color:var(--ink)] bg-[color:var(--ink)] text-[color:var(--stage)]" : "border-[color:var(--rule-strong)] bg-[color:var(--stage-3)]")
          }
        >
          {good ? <span className="display text-[16px] font-bold">HA</span> : <span className="h-4 w-6 rounded-sm bg-[color:var(--ink-faint)]/50" />}
        </div>
        <div className="mono grid flex-1 grid-cols-3 text-center text-[7px] tracking-normal">
          <span>
            <b className="block text-[10px] text-[color:var(--ink)]">{good ? "248" : "47"}</b>posts
          </span>
          <span>
            <b className="block text-[10px] text-[color:var(--ink)]">{good ? "24.1K" : "1,253"}</b>followers
          </span>
          <span>
            <b className="block text-[10px] text-[color:var(--ink)]">{good ? "412" : "612"}</b>following
          </span>
        </div>
      </div>
      <p className="mt-3 text-[11px] font-medium text-[color:var(--ink)]">{good ? "Horizon Aviation | Private Jet Charter" : "Sky Aviation"}</p>
      <p className="mt-1 text-[10px] leading-snug text-[color:var(--ink-soft)]">
        {good
          ? "Private jet charter, sales and aircraft management. London · Dubai · New York. Book a flight ↓"
          : "Luxury | Lifestyle | Travel ✈️ Living the dream 🌍 DM for more info. Worldwide."}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <span className="mono rounded-sm bg-[color:var(--ink)] py-1.5 text-center text-[8px] tracking-normal text-[color:var(--stage)]">Follow</span>
        <span className="mono rounded-sm border border-[color:var(--rule-strong)] py-1.5 text-center text-[8px] tracking-normal">Message</span>
        <span className={"mono rounded-sm border py-1.5 text-center text-[8px] tracking-normal " + (good ? "border-[color:var(--rule-strong)]" : "border-transparent text-transparent")}>
          Contact
        </span>
      </div>
      <div className="mt-3 flex justify-between">
        {(good ? ["Aircraft", "Charter", "Sales", "About"] : ["", "", "", ""]).map((h, i) => (
          <span key={i} className="flex w-[46px] flex-col items-center gap-1">
            <span className={"h-8 w-8 rounded-full border " + (good ? "border-[color:var(--rule-strong)] bg-[color:var(--stage-2)]" : "border-transparent")} />
            <span className="mono text-[6px] tracking-normal">{h}</span>
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-[3px]">
        {tiles.map((t, i) => (
          <span
            key={i}
            className={
              "relative flex aspect-[4/5] items-end p-1 " +
              (good ? "bg-[color:var(--stage-2)]" : ["bg-[color:var(--stage-3)]", "bg-[color:var(--stage-2)]", "bg-[color:var(--ink-faint)]/40"][i % 3])
            }
          >
            {good && i < 3 && (
              <span className="mono absolute right-1 top-1 text-[6px] text-[color:var(--ink)]">Pinned</span>
            )}
            {good && <span className="display text-[8px] leading-[1] text-[color:var(--ink)]">{t}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function Notes({ items, tone }: { items: Note[]; tone: "bad" | "good" }) {
  return (
    <ul className="flex flex-col">
      {items.map((n) => (
        <li key={n.title} className="grid grid-cols-[2ch_1fr] gap-x-3 border-t border-[color:var(--rule)] py-3">
          <span aria-hidden="true" className={"mono " + (tone === "good" ? "text-[color:var(--ink)]" : "text-[color:var(--ink-faint)]")}>
            {tone === "good" ? "✓" : "×"}
          </span>
          <span>
            <span className="block text-[15px] text-[color:var(--ink)]">{n.title}</span>
            <span className="block text-[13px] leading-snug text-[color:var(--ink-mid)]">{n.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function ProfileCompare() {
  return (
    <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">
      <div className="min-w-0">
        <p className="mono mb-5 text-[color:var(--ink-mid)]">The profile that loses the visitor</p>
        <div className="grid gap-6 sm:grid-cols-[236px_minmax(0,1fr)] sm:items-start">
          <Phone variant="bad" />
          <Notes items={bad} tone="bad" />
        </div>
      </div>
      <div className="min-w-0">
        <p className="mono mb-5 text-[color:var(--ink)]">The profile that turns them into an enquiry</p>
        <div className="grid gap-6 sm:grid-cols-[236px_minmax(0,1fr)] sm:items-start">
          <Phone variant="good" />
          <Notes items={good} tone="good" />
        </div>
      </div>
    </div>
  );
}
