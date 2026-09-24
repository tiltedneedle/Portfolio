import type { Block } from "@/content/types";
import type { AuditReport, ClientSystem, GuideNote } from "@/content/clients/types";
import { chapter, pageHref, pageNumber } from "@/content/chapters";
import { guides } from "@/content/system";

/**
 * Every sentence in the universal guides, by section, so the palette can
 * find a page by the words inside it. Built once per client at build time
 * (the route handler beside the pages serves it behind the door) and
 * fetched by the palette the first time someone types three letters.
 * Notes written for the client are folded into the sections they sit under.
 * Given the client's system, their own words follow the guides: the two
 * reports by heading (plus the board and the map), and every written script.
 */
export type SearchSection = { id: string; title: string; n?: string; text: string };
export type SearchEntry = { href: string; title: string; chapter: string; n: string; sections: SearchSection[] };

const pad = (i: number) => String(i + 1).padStart(2, "0");
const plain = (s: string) => s.replace(/\*\*?/g, "");

function blockText(b: Block): string[] {
  switch (b.kind) {
    case "p":
    case "lead":
      return [b.text];
    case "list":
    case "questions":
    case "lines":
      return [b.title ?? "", ...b.items];
    case "swaps":
      return [b.title ?? "", ...b.pairs.flatMap((p) => [p.from, p.to])];
    case "pairs":
      return [b.title ?? "", ...b.items.flatMap((p) => [p.a, p.b])];
    case "keyed":
      return [b.title ?? "", ...b.items.flatMap((i) => [i.label, ...i.lines])];
    case "steps":
      return [b.title ?? "", ...b.items.flatMap((i) => [i.title, i.text ?? ""])];
    case "cards":
      return [b.title ?? "", ...b.items.flatMap((i) => [i.title, i.text])];
    case "split":
      return [b.title ?? "", b.a.label, ...b.a.items, b.b.label, ...b.b.items];
    case "checklist":
      return [b.title, ...b.items, b.note ?? ""];
    case "aside":
      return [b.label ?? "", b.text];
    case "sub":
      return [b.title, ...b.blocks.flatMap(blockText)];
    case "clips":
      return [b.title ?? "", b.note ?? "", ...b.items.map((i) => i.caption ?? "")];
    case "fan":
      return [b.title ?? "", b.from, ...b.to.flatMap((t) => [t.label ?? "", t.text]), b.note ?? ""];
    case "structure":
      return [b.title ?? "", ...b.parts.flatMap((p) => [p.label, p.text ?? ""]), b.note ?? ""];
    case "shots":
      return [b.title ?? "", ...b.items.flatMap((i) => [i.label, i.text ?? ""]), b.note ?? ""];
    case "lens":
      return [b.title ?? "", b.wide, b.tight, b.note ?? ""];
    case "flashcards":
      return [b.title ?? "", ...b.items.flatMap((i) => [i.front, i.back]), b.note ?? ""];
    case "flow":
      return [b.title ?? "", ...b.steps.flatMap((s) => [s.q, s.yes]), b.end, b.note ?? ""];
    case "typewriter":
      return [b.title ?? "", ...b.queries];
    case "cycle":
      return [b.title ?? "", ...b.items, b.note ?? ""];
    case "retention":
    case "cadence":
      return [b.title ?? "", b.note ?? ""];
    case "figure":
      return [b.alt, b.caption ?? ""];
    case "profile":
      return [];
  }
}

const join = (parts: string[]) => plain(parts.filter(Boolean).join(" ")).replace(/\s+/g, " ").trim();

export type Searchable = Partial<Pick<ClientSystem, "notes" | "contentDiagnostic" | "competitorIntelligence" | "scripts">>;

export function searchIndex(sys: Searchable = {}): SearchEntry[] {
  const notes: Record<string, GuideNote[]> = sys.notes ?? {};
  const out: SearchEntry[] = guides.map((g) => {
    const key = g.chapter + "/" + g.slug;
    const mine = notes[key] ?? [];
    const noteText = (at?: number) => mine.filter((n) => (at === undefined ? !n.at : n.at === at)).map((n) => n.text);
    const sections: SearchSection[] = [
      { id: "", title: "Introduction", text: join([g.kicker, ...g.intro, ...(g.opener ?? []).flatMap(blockText), ...noteText()]) },
      ...g.sections.map((s, i) => ({ id: "s-" + pad(i), title: s.title, n: s.n, text: join([...s.blocks.flatMap(blockText), ...noteText(i + 1)]) })),
      { id: "rule", title: "The rule", text: join(g.rule.flatMap(blockText)) },
    ];
    return { href: pageHref(g.chapter, g.slug), title: g.title, chapter: chapter(g.chapter).title, n: pageNumber(g.chapter, g.slug), sections };
  });

  // The reports, heading by heading; only what is written can be found.
  const reports: [AuditReport | undefined, string][] = [
    [sys.contentDiagnostic, "content-diagnostic"],
    [sys.competitorIntelligence, "competitor-intelligence"],
  ];
  for (const [r, slug] of reports) {
    if (!r) continue;
    const page = chapter("audit").pages.find((p) => p.slug === slug);
    const sections: SearchSection[] = [{ id: "", title: "Introduction", text: join([r.intro]) }];
    r.sections.forEach((s, i) => {
      if (!s.body?.length) return;
      sections.push({
        id: "a-" + pad(i),
        title: s.title,
        n: pad(i),
        text: join([
          s.covers,
          ...s.body,
          ...(s.working ?? []),
          ...(s.limiting ?? []),
          ...(s.change ?? []),
          ...(s.lists ?? []).flatMap((l) => [l.label, ...l.items]),
          ...(s.evidence ?? []).map((e) => e.caption ?? ""),
        ]),
      });
    });
    if (r.competitors?.length) {
      sections.push({
        id: "board",
        title: "The accounts studied",
        text: join(r.competitors.flatMap((c) => [c.name, c.handle, c.platform, c.followers ?? "", c.cadence ?? "", c.note, ...c.strengths, ...c.gaps])),
      });
    }
    if (r.map) sections.push({ id: "map", title: "Where everyone stands", text: join([...r.map.x, ...r.map.y, ...r.map.points.map((p) => p.name)]) });
    out.push({ href: pageHref("audit", slug), title: page?.title ?? slug, chapter: chapter("audit").title, n: pageNumber("audit", slug), sections });
  }

  // Every written script, as one section: the hook, the words, the call, the shots, the slate.
  for (const s of sys.scripts ?? []) {
    if (!s.body?.length) continue;
    out.push({
      href: "/content/scripts/" + s.n,
      title: "Script " + String(s.n).padStart(2, "0"),
      chapter: chapter("content").title,
      n: pageNumber("content", "scripts"),
      sections: [{ id: "", title: s.title, text: join([s.hook ?? "", ...s.body, s.cta ?? "", ...(s.shots ?? []), s.location ?? "", s.onCamera ?? ""]) }],
    });
  }
  return out;
}

/** A short run of the text around the first hit, for the palette row. */
export function snippet(text: string, word: string, width = 96) {
  const at = text.toLowerCase().indexOf(word.toLowerCase());
  if (at === -1) return text.slice(0, width) + (text.length > width ? "…" : "");
  const start = Math.max(0, at - Math.floor(width / 3));
  const end = Math.min(text.length, start + width);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}
