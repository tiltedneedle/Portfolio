import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { guides } from "@/content/system";
import type { Guide } from "@/content/types";

/**
 * Every sentence of the brief's guide tabs is on its page, word for word.
 *
 * The brief (Info Product Servicing.md, the client's own document) is the
 * content of these pages, not notes for them. Two writing passes drifted from
 * it -- paraphrased kickers, "Save interesting hooks." cut to "Interesting
 * hooks", "determine" swapped for "decide", aviation examples neutralised,
 * whole sentences merged or dropped -- and nothing noticed until the user
 * compared the doc to the site by hand.
 *
 * The brief lives outside the repository, so this runs only when told where
 * it is, and skips everywhere else (CI included):
 *
 *   BRIEF_PATH="C:/Users/HP/Downloads/Info Product Servicing .md" npx vitest run brief
 *
 * "Word for word" ignores what is not wording: case (the display face sets
 * headings in capitals), curly or straight quotes, dash style, markdown
 * asterisks, and punctuation such as the colon ending a lead-in line.
 */
const BRIEF = process.env.BRIEF_PATH;

// Tab name in the brief (its plain "# NAME" line) -> the pages that carry it.
const TABS: Record<string, string[]> = {
  "STUDY YOUR NICHE": ["study-your-niche"],
  IDEAS: ["ideation"],
  "STYLE OF VIDEO": ["video-style"],
  HOOKS: ["hooks"],
  "DELIVER YOUR CORE MESSAGE QUICKLY": ["core-message"],
  "HOW TO FILM": ["filming"],
  "HOW TO EDIT": ["editing"],
  PUBLISHING: ["strategy"],
  "CONTENT PACKAGING": ["packaging"],
  DISCOVERABILITY: ["discoverability"],
  // The site gives the tab's closing section, the monthly process, its own page.
  "UNDERSTANDING YOUR ANALYTICS": ["understanding-your-analytics", "monthly-process"],
};

// What the brief sets that a page draws rather than writes: the rule's label,
// step numbers, the tab names (each page uses its tab's H1), two sub-headings
// the speed/slow split carries as its column labels, and an image the markdown
// export does not contain.
const DRAWN = new Set(["the rule", "when to speed up", "when to slow down", ...Object.keys(TABS).map((t) => t.toLowerCase())]);
const isDrawn = (s: string) => DRAWN.has(s) || /^(\d{1,2}|angle \d{2})$/.test(s) || s.startsWith("image");

const norm = (s: string) =>
  s
    .replace(/\\/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/^#+\s*/, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
const loose = (s: string) =>
  norm(s)
    .toLowerCase()
    .replace(/[^a-z0-9%$£ ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
const sentences = (t: string) => norm(t).split(/(?<=[.!?])\s+(?=[A-Z0-9"'(])/).filter(Boolean);

function tabs(md: string) {
  const lines = md.split("\n");
  const starts: { name: string; at: number }[] = [];
  lines.forEach((l, i) => {
    const m = /^# ([^*].*)$/.exec(l.trim());
    if (m && m[1].trim()) starts.push({ name: m[1].trim(), at: i });
  });
  const out = new Map<string, string[]>();
  starts.forEach((s, k) => out.set(s.name, lines.slice(s.at, k + 1 < starts.length ? starts[k + 1].at : lines.length)));
  return out;
}

function pageText(g: Guide) {
  const out: string[] = [];
  const skip = new Set(["kind", "id", "src", "style", "mode", "size", "youtubeId", "poster", "href", "handle", "slug", "chapter", "share", "every", "days", "seconds", "ratio", "minutes"]);
  const walk = (v: unknown) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) if (!skip.has(k)) walk(x);
  };
  walk([g.title, g.kicker, g.intro, g.opener ?? [], g.sections, g.rule]);
  return " " + out.flatMap(sentences).map(loose).join(" ") + " ";
}

describe.skipIf(!BRIEF || !existsSync(BRIEF))("the guide pages say what the brief says", () => {
  const all = tabs(BRIEF ? readFileSync(BRIEF, "utf8") : "");
  for (const [tab, slugs] of Object.entries(TABS)) {
    it(tab.toLowerCase() + ", word for word", () => {
      const lines = all.get(tab);
      expect(lines, "no tab called " + tab + " in the brief").toBeDefined();
      const page = slugs.map((slug) => pageText(guides.find((g) => g.slug === slug)!)).join(" ");
      const missing = lines!
        .map((l) => norm(l).replace(/^\d{1,2}\.\s+/, ""))
        .flatMap(sentences)
        .map((s) => [s, loose(s)] as const)
        .filter(([, l]) => l && !isDrawn(l) && !page.includes(" " + l + " "))
        .map(([s]) => s);
      expect(missing, "on the brief's " + tab + " tab but not on its page:\n" + missing.join("\n")).toEqual([]);
    });
  }
});
