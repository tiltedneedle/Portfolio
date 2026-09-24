/**
 * What a client system is made of. One folder per client under
 * `src/content/clients/`, each exporting a `ClientSystem`; the registry in
 * `registry.ts` lists them. Everything here is personalised; the universal
 * guides live in `src/content/system/`.
 */

export type ClientIdentity = {
  /** URL-safe, lowercase: the folder name and the internal route segment. */
  slug: string;
  /** As printed everywhere: "Tilted Needle × {name}". */
  name: string;
  /** A shorter form for tight spaces (the nav, the slate). Falls back to `name`. */
  short?: string;
  /** Path under /public. Empty shows the monogram instead. */
  logo?: string;
  /** Printed on the slate and in the footer. */
  since: string;
  /** Where "your Tilted Needle team" links go. */
  contact: string;
  /**
   * sha256("tn:" + slug + ":" + accessCode), from `node scripts/access.mjs`.
   * The access code is what the client types at the door. Empty means the
   * system cannot be logged into (the template).
   */
  accessHash: string;
  /** Marks a fictional system kept in the repo to show the finished state. */
  demo?: boolean;
};

/** The identity without anything the browser has no business holding. */
export type PublicIdentity = Omit<ClientIdentity, "accessHash">;

/** How an area of the client's presence reads today. */
export type Verdict = "strong" | "mixed" | "weak";

/**
 * A written finding under one of the fixed headings. Only `body` is needed;
 * the rest turns a paragraph into a designed finding: a verdict lamp and a
 * score on the heading, the keep / limiting / change columns, any labelled
 * lists, the client's own posts as evidence, and a place in the first three
 * moves.
 */
export type AuditFinding = {
  body: string[];
  verdict?: Verdict;
  /** 0 to 10. */
  score?: number;
  /** What to keep and build on. */
  working?: string[];
  /** What is holding this area back. */
  limiting?: string[];
  /** What we would change. */
  change?: string[];
  /** Any other labelled list (the competitor report uses these). */
  lists?: { label: string; items: string[] }[];
  /** 1, 2 or 3: this heading's change is one of the first three moves. */
  first?: 1 | 2 | 3;
  /** Posts that show the finding, by YouTube id, with a caption. */
  evidence?: { id: string; caption?: string }[];
};

export type AuditSection = {
  title: string;
  /** What this heading covers, shown on the slate until it is written. */
  covers: string;
} & Partial<AuditFinding>;

/** One account studied for the competitor report. */
export type Competitor = {
  name: string;
  handle: string;
  platform: "instagram" | "tiktok" | "youtube" | "linkedin";
  /** The account's address; derived from the handle and platform when left out. */
  url?: string;
  followers?: string;
  /** Posting rate as printed: "4/wk", "daily". */
  cadence?: string;
  /** One line on what the account is. */
  note: string;
  strengths: string[];
  gaps: string[];
};

/** Where everyone stands: two axes, each point between 0 and 1. */
export type PositionMap = {
  /** Left and right ends of the horizontal axis. */
  x: [string, string];
  /** Bottom and top ends of the vertical axis. */
  y: [string, string];
  /** `you` marks the client today; `target` marks where the first moves take them. */
  points: { name: string; x: number; y: number; you?: boolean; target?: boolean }[];
};

export type AuditReport = {
  intro: string;
  sections: AuditSection[];
  /** The competitor report's board of accounts. */
  competitors?: Competitor[];
  /** The competitor report's positioning map. */
  map?: PositionMap;
};

export type Pillar = "authority" | "education" | "entertainment" | "personal";

export type Idea = {
  text: string;
  /** Marks a filled example in the template, to be replaced for a real client. */
  example?: boolean;
};

export type Script = {
  n: number;
  title: string;
  hook?: string;
  body?: string[];
  cta?: string;
  /** Where to film it, as printed on the slate. */
  location?: string;
  /** Who is on camera. */
  onCamera?: string;
  /** The shots to get, in order: the call sheet beside the words. */
  shots?: string[];
  /** The idea this script came from, so the idea card can point here. */
  from?: { pillar: Pillar; n: number };
  example?: boolean;
};

/**
 * A note from the studio inside a universal guide, for this client only.
 * `at` is the 1-based section it sits under; without it the note follows
 * the guide's introduction.
 */
export type GuideNote = { text: string; at?: number };

export type ClientSystem = {
  identity: ClientIdentity;
  contentDiagnostic: AuditReport;
  competitorIntelligence: AuditReport;
  ideas: Record<Pillar, Idea[]>;
  scripts: Script[];
  /** Notes inside the universal guides, keyed "chapter/slug" ("create/hooks"). */
  notes?: Record<string, GuideNote[]>;
};

export function publicIdentity(i: ClientIdentity): PublicIdentity {
  const { accessHash: _omit, ...rest } = i;
  void _omit;
  return rest;
}

export function shortName(i: Pick<PublicIdentity, "name" | "short">) {
  return i.short || i.name;
}

/** Two letters for the monogram when there is no logo yet. */
export function monogram(i: Pick<PublicIdentity, "name">) {
  const words = i.name.split(" ").filter(Boolean);
  const letters = words.length >= 2 ? words[0][0] + words[1][0] : i.name.slice(0, 2);
  return letters.toUpperCase();
}

export function scriptAsText(s: Script) {
  const lines: string[] = [s.title.toUpperCase(), ""];
  if (s.hook) lines.push("HOOK", s.hook, "");
  if (s.body?.length) lines.push("SCRIPT", ...s.body.flatMap((p) => [p, ""]));
  if (s.cta) lines.push("CALL TO ACTION", s.cta, "");
  if (s.shots?.length) lines.push("SHOT LIST", ...s.shots.map((x, i) => String(i + 1).padStart(2, "0") + "  " + x), "");
  if (s.location || s.onCamera) lines.push([s.location ? "LOCATION  " + s.location : "", s.onCamera ? "ON CAMERA  " + s.onCamera : ""].filter(Boolean).join("\n"), "");
  return lines.join("\n").trim();
}

/** The written sections of a report. */
export function writtenSections(r: AuditReport) {
  return r.sections.filter((s) => s.body?.length);
}

/** The first three moves, in order, from the headings that name one. */
export function firstMoves(r: AuditReport) {
  return r.sections
    .filter((s): s is AuditSection & { first: 1 | 2 | 3 } => !!s.first && !!s.body?.length)
    .sort((a, b) => a.first - b.first);
}
