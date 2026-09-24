import { describe, expect, it } from "vitest";
import { searchIndex, snippet } from "@/lib/search-index";
import { guides } from "@/content/system";
import { demo } from "@/content/clients/demo";

describe("searchIndex", () => {
  const index = searchIndex();

  it("carries every guide, with an introduction, its sections and the rule", () => {
    expect(index).toHaveLength(guides.length);
    for (const [i, g] of guides.entries()) {
      const e = index[i];
      expect(e.title).toBe(g.title);
      expect(e.sections[0]).toMatchObject({ id: "", title: "Introduction" });
      expect(e.sections[e.sections.length - 1]).toMatchObject({ id: "rule", title: "The rule" });
      expect(e.sections).toHaveLength(g.sections.length + 2);
      expect(e.sections[1].id).toBe("s-01");
    }
  });

  it("has words in every section and no inline marks", () => {
    for (const e of index) {
      for (const s of e.sections) {
        expect(s.text.length).toBeGreaterThan(20);
        expect(s.text).not.toMatch(/\*\*/);
        expect(s.text).not.toMatch(/\s{2,}/);
      }
    }
  });

  it("finds a sentence that lives only in a paragraph", () => {
    const hooks = index.find((e) => e.href === "/create/hooks")!;
    const hit = hooks.sections.find((s) => s.text.includes("Get into the subject immediately"));
    expect(hit?.title).toBe("Verbal hooks");
  });

  it("folds a client's notes into the sections they sit under", () => {
    const withNotes = searchIndex({ notes: demo.notes });
    const hooks = withNotes.find((e) => e.href === "/create/hooks")!;
    expect(hooks.sections[0].text).toContain("Never the logo, never a drone shot");
    expect(hooks.sections[3].text).toContain("a number");
    expect(index.find((e) => e.href === "/create/hooks")!.sections[0].text).not.toContain("Never the logo");
  });
});

describe("the client's own words", () => {
  const index = searchIndex(demo);

  it("keeps the guides first and adds the reports and the written scripts", () => {
    expect(index.slice(0, guides.length).map((e) => e.href)).toEqual(searchIndex().map((e) => e.href));
    const diag = index.find((e) => e.href === "/audit/content-diagnostic")!;
    expect(diag.chapter).toBe("Your audit");
    expect(diag.title).toBe("Content diagnostic");
    expect(diag.sections[0]).toMatchObject({ id: "", title: "Introduction" });
    const written = demo.contentDiagnostic.sections.filter((s) => s.body?.length).length;
    expect(diag.sections).toHaveLength(written + 1);
    expect(diag.sections[1].id).toMatch(/^a-\d\d$/);
    const scripts = index.filter((e) => e.href.startsWith("/content/scripts/"));
    expect(scripts).toHaveLength(demo.scripts.filter((s) => s.body?.length).length);
  });

  it("finds a finding by a phrase in its body, and a script by its hook", () => {
    const diag = index.find((e) => e.href === "/audit/content-diagnostic")!;
    const dog = diag.sections.find((s) => s.text.includes("a client's dog on the tarmac"));
    expect(dog?.id).toBe("a-02");
    const cost = index.find((e) => e.sections.some((s) => s.text.includes("Here is where every pound goes")));
    expect(cost?.href).toMatch(/^\/content\/scripts\/\d+$/);
    expect(cost?.title).toMatch(/^Script \d\d$/);
    expect(cost?.sections[0].title).toBe(demo.scripts.find((s) => s.n === Number(cost?.href.split("/").pop()))?.title);
  });

  it("gives the competitor report its board and its map", () => {
    const comp = index.find((e) => e.href === "/audit/competitor-intelligence")!;
    const ids = comp.sections.map((s) => s.id);
    expect(ids).toContain("board");
    expect(ids).toContain("map");
    expect(comp.sections.find((s) => s.id === "map")!.text).toContain("Horizon, after the three moves");
    expect(comp.sections.find((s) => s.id === "board")!.text).toContain("Skyline Charter");
  });

  it("indexes nothing of an unwritten system beyond the guides", () => {
    const bare = searchIndex({ scripts: [{ n: 1, title: "Empty" }] });
    expect(bare).toHaveLength(guides.length);
  });
});

describe("snippet", () => {
  it("cuts around the first hit and marks the cut ends", () => {
    const text = "The four videos open on a logo animation, a slow exterior pan, a drone shot and a title card. In each case the first spoken word arrives after four seconds.";
    const s = snippet(text, "drone", 40);
    expect(s).toContain("drone");
    expect(s.startsWith("…")).toBe(true);
    expect(s.endsWith("…")).toBe(true);
    expect(s.length).toBeLessThanOrEqual(44);
  });

  it("falls back to the start when the word is not there", () => {
    expect(snippet("Short text.", "zzz")).toBe("Short text.");
  });
});
