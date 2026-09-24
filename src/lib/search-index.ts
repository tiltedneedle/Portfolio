import type { Block } from "@/content/types";
import type { GuideNote } from "@/content/clients/types";
import { chapter, pageHref, pageNumber } from "@/content/chapters";
import { guides } from "@/content/system";

/**
 * Every sentence in the universal guides, by section, so the palette can
 * find a page by the words inside it. Built once per client at build time
 * (the route handler beside the pages serves it behind the door) and
 * fetched by the palette the first time someone types three letters.
 * Notes written for the client are folded into the sections they sit under.
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

export function searchIndex(notes: Record<string, GuideNote[]> = {}): SearchEntry[] {
  return guides.map((g) => {
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
}

/** A short run of the text around the first hit, for the palette row. */
export function snippet(text: string, word: string, width = 96) {
  const at = text.toLowerCase().indexOf(word.toLowerCase());
  if (at === -1) return text.slice(0, width) + (text.length > width ? "…" : "");
  const start = Math.max(0, at - Math.floor(width / 3));
  const end = Math.min(text.length, start + width);
  return (start > 0 ? "…" : "") + text.slice(start, end).trim() + (end < text.length ? "…" : "");
}
