import type { PaletteItem } from "@/components/portal/Palette";
import { chapters, pageHref, pageNumber } from "@/content/chapters";
import { guides } from "@/content/system";
import { competitorHeadings, diagnosticHeadings, pillars } from "@/content/system/pillars";
import type { ClientSystem } from "@/content/clients/types";
import { liveChapters, writtenPages } from "@/lib/rooms";

const pad = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Everything the palette can jump to, computed on the server once per
 * build: page titles, numbers and section anchors. No guide text.
 *
 * The order is the reading order of the system, which is also the order
 * the [ and ] keys page through: home, then each room's overview followed
 * by its pages. Given a client system, the written ideas and scripts are
 * added as hidden entries: not listed until something is typed, then
 * found by their words.
 */
export function paletteIndex(sys?: ClientSystem): PaletteItem[] {
  const out: PaletteItem[] = [];
  // A personalised page the studio has not written is not in the palette either.
  const rooms = sys ? liveChapters(sys) : chapters;
  const written = sys ? writtenPages(sys) : null;
  for (const c of rooms) {
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
  if (sys && written?.has("/content/ideas")) {
    for (const p of pillars) {
      sys.ideas[p.id].forEach((idea, i) => {
        if (idea.text) out.push({ href: "/content/ideas#" + p.id, title: idea.text, chapter: "Idea · " + p.title + " " + pad(i), n: pageNumber("content", "ideas"), sections: [], hidden: true });
      });
    }
    for (const s of written?.has("/content/scripts") ? sys.scripts : []) {
      if (s.body?.length) out.push({ href: "/content/scripts/" + s.n, title: s.title, chapter: "Script " + String(s.n).padStart(2, "0"), n: pageNumber("content", "scripts"), sections: [], hidden: true });
    }
  }
  return out;
}
