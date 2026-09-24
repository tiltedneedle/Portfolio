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
  points: { name: string; x: number; y: number; you?: boolean }[];
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
  example?: boolean;
};

export type ClientSystem = {
  identity: ClientIdentity;
  contentDiagnostic: AuditReport;
  competitorIntelligence: AuditReport;
  ideas: Record<Pillar, Idea[]>;
  scripts: Script[];
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
