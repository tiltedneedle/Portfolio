import type { PaletteItem } from "@/components/portal/Palette";
import { chapters, pageHref, pageNumber } from "@/content/chapters";
import { guides } from "@/content/system";
import { competitorHeadings, diagnosticHeadings } from "@/content/system/pillars";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Everything the palette can jump to, computed on the server once per
 * build: page titles, numbers and section anchors. No guide text.
 */
export function paletteIndex(): PaletteItem[] {
  return chapters.flatMap((c) =>
    c.pages.map((p) => {
      const href = pageHref(c.id, p.slug);
      let sections: PaletteItem["sections"] = [];
      const g = guides.find((x) => x.chapter === c.id && x.slug === p.slug);
      if (g) sections = g.sections.map((s, i) => ({ id: "s-" + pad(i), title: s.title, n: s.n }));
      if (c.id === "audit") {
        const heads = p.slug === "content-diagnostic" ? diagnosticHeadings : competitorHeadings;
        sections = heads.map((h, i) => ({ id: "a-" + pad(i), title: h.title, n: pad(i) }));
      }
      return { href, title: p.title, chapter: c.title, n: c.id === "home" ? c.n : pageNumber(c.id, p.slug), sections };
    })
  );
}
