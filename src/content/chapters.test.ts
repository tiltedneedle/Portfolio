import { describe, expect, it } from "vitest";
import { chapterOfPath, chapters, pageHref, pageNumber } from "@/content/chapters";

describe("chapterOfPath", () => {
  it("puts the front page in home", () => {
    expect(chapterOfPath("/")?.id).toBe("home");
    expect(chapterOfPath("")?.id).toBe("home");
  });

  it("finds the room a room page belongs to", () => {
    expect(chapterOfPath("/create")?.id).toBe("create");
    expect(chapterOfPath("/create/hooks")?.id).toBe("create");
    expect(chapterOfPath("/audit/content-diagnostic")?.id).toBe("audit");
    expect(chapterOfPath("/content/scripts/7")?.id).toBe("content");
  });

  it("ignores a query or a hash", () => {
    expect(chapterOfPath("/create/hooks#s-02")?.id).toBe("create");
    expect(chapterOfPath("/publish?from=palette")?.id).toBe("publish");
    expect(chapterOfPath("/#objective")?.id).toBe("home");
  });

  it("ignores a trailing slash", () => {
    expect(chapterOfPath("/create/")?.id).toBe("create");
    expect(chapterOfPath("/create/hooks/")?.id).toBe("create");
  });

  it("matches whole segments, never a bare prefix", () => {
    // The trap this function exists to avoid: /content must not claim these,
    // and home's "/" must not claim everything.
    expect(chapterOfPath("/contentious")).toBeNull();
    expect(chapterOfPath("/creative-writing")).toBeNull();
  });

  it("gives the door and a 404 no room at all", () => {
    expect(chapterOfPath("/login")).toBeNull();
    expect(chapterOfPath("/nothing-on-this-slate")).toBeNull();
  });

  it("agrees with the hrefs the rest of the system builds", () => {
    for (const c of chapters) {
      if (c.id === "home") continue;
      expect(chapterOfPath(c.href)?.id).toBe(c.id);
      for (const p of c.pages) {
        const href = pageHref(c.id, p.slug);
        // Home's pages are hash anchors on the front page.
        expect(chapterOfPath(href)?.id).toBe(c.id);
      }
    }
  });

  it("numbers a page inside the room it belongs to", () => {
    expect(pageNumber("create", "hooks")).toBe("04.04");
    expect(chapterOfPath(pageHref("create", "hooks"))?.n).toBe("04");
  });
});
