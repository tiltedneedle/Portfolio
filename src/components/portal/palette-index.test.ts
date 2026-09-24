import { describe, expect, it } from "vitest";
import { paletteIndex } from "@/components/portal/palette-index";
import { chapters } from "@/content/chapters";
import { guides } from "@/content/system";
import { demo } from "@/content/clients/demo";
import { pillars } from "@/content/system/pillars";

describe("the palette index", () => {
  const items = paletteIndex();

  it("starts at home and lists every chapter and page in reading order", () => {
    expect(items[0].href).toBe("/");
    const hrefs = items.map((i) => i.href);
    for (const c of chapters) {
      if (c.id === "home") continue;
      expect(hrefs).toContain(c.href);
      for (const p of c.pages) expect(hrefs).toContain(c.href + "/" + p.slug);
    }
    // reading order: each chapter's overview comes before its pages
    for (const c of chapters) {
      if (c.id === "home") continue;
      const at = hrefs.indexOf(c.href);
      for (const p of c.pages) expect(hrefs.indexOf(c.href + "/" + p.slug)).toBeGreaterThan(at);
    }
  });

  it("has no duplicate hrefs and no duplicate section ids within a page", () => {
    const hrefs = items.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const it of items) {
      const ids = it.sections.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("gives every guide its sections, with ids the guide page renders", () => {
    for (const g of guides) {
      const c = chapters.find((x) => x.id === g.chapter)!;
      const item = items.find((i) => i.href === c.href + "/" + g.slug)!;
      expect(item).toBeTruthy();
      expect(item.sections.map((s) => s.title)).toEqual(g.sections.map((s) => s.title));
      expect(item.sections[0].id).toBe("s-01");
    }
  });

  it("gives the audit reports their fixed headings", () => {
    const diag = items.find((i) => i.href === "/audit/content-diagnostic")!;
    const comp = items.find((i) => i.href === "/audit/competitor-intelligence")!;
    expect(diag.sections).toHaveLength(13);
    expect(comp.sections).toHaveLength(8);
    expect(diag.sections[0].id).toBe("a-01");
  });

  it("adds a client's written ideas and scripts as hidden entries", () => {
    const withClient = paletteIndex(demo);
    const hidden = withClient.filter((i) => i.hidden);
    const ideas = pillars.flatMap((p) => demo.ideas[p.id]).filter((i) => i.text).length;
    const scripts = demo.scripts.filter((s) => s.body?.length).length;
    expect(hidden).toHaveLength(ideas + scripts);
    expect(withClient.filter((i) => !i.hidden)).toHaveLength(items.length);
    expect(hidden.find((h) => h.chapter === "Script 02")?.href).toBe("/content/scripts/2");
    expect(hidden.every((h) => h.href.startsWith("/content/"))).toBe(true);
  });

  it("carries a number and a chapter on every entry", () => {
    for (const it of items) {
      expect(it.n).toMatch(/^\d{2}(\.\d{2})?$/);
      expect(it.title.length).toBeGreaterThan(0);
      expect(it.chapter.length).toBeGreaterThan(0);
    }
  });
});
