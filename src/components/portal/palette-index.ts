import type { PaletteItem } from "@/components/portal/Palette";
import { chapters, pageHref, pageNumber } from "@/content/chapters";
import { guides } from "@/content/system";
import { competitorHeadings, diagnosticHeadings, pillars } from "@/content/system/pillars";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Everything the palette can jump to, computed on the server once per
 * build: page titles, numbers and section anchors. No guide text.
 *
 * The order is the reading order of the system, which is also the order
 * the [ and ] keys page through: home, then each room's overview followed
 * by its pages.
 */
export function paletteIndex(): PaletteItem[] {
  const out: PaletteItem[] = [];
  for (const c of chapters) {
    if (c.id === "home") {
      out.push({
        href: "/",
        title: "Home",
        chapter: "Home",
        n: c.n,
        sections: c.pages.map((p) => ({ id: p.slug.slice(1), title: p.title })),
      });
      continue;
    }
    out.push({ href: c.href, title: c.title, chapter: "Overview", n: c.n, sections: [] });
    for (const p of c.pages) {
      let sections: PaletteItem["sections"] = [];
      const g = guides.find((x) => x.chapter === c.id && x.slug === p.slug);
      if (g) sections = g.sections.map((s, i) => ({ id: "s-" + pad(i), title: s.title, n: s.n }));
      if (c.id === "audit") {
        const heads = p.slug === "content-diagnostic" ? diagnosticHeadings : competitorHeadings;
        sections = heads.map((h, i) => ({ id: "a-" + pad(i), title: h.title, n: pad(i) }));
      }
      if (c.id === "content" && p.slug === "ideas") sections = pillars.map((x, i) => ({ id: x.id, title: x.title, n: pad(i) }));
      out.push({ href: pageHref(c.id, p.slug), title: p.title, chapter: c.title, n: pageNumber(c.id, p.slug), sections });
    }
  }
  return out;
}
