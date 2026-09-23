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

export type AuditSection = {
  title: string;
  /** What this heading covers, shown on the slate until it is written. */
  covers: string;
  body?: string[];
};

export type AuditReport = {
  intro: string;
  sections: AuditSection[];
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
