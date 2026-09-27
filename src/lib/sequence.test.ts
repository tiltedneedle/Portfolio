import { describe, expect, it } from "vitest";
import { sequence, total } from "@/lib/sequence";
import { demo } from "@/content/clients/demo";
import { template } from "@/content/clients/template";
import { liveChapters } from "@/lib/rooms";
import { pageHref } from "@/content/chapters";

describe("sequence", () => {
  it("gives a client with nothing written only the universal pages", () => {
    const clips = sequence(template);
    expect(clips).toHaveLength(13);
    expect([...new Set(clips.map((c) => c.chapterN))]).toEqual(["04", "05", "06"]);
  });

  it("leaves home out: its pages are anchors on one page, not clips", () => {
    expect(sequence(demo).some((c) => c.href === "/")).toBe(false);
    expect(sequence(demo).some((c) => c.readKey.startsWith("home/"))).toBe(false);
  });

  it("carries every page of every room this client has, in the system's order", () => {
    const clips = sequence(demo);
    const expected = liveChapters(demo)
      .filter((c) => c.id !== "home")
      .flatMap((c) => c.pages.map((p) => pageHref(c.id, p.slug)));
    expect(clips.map((c) => c.href)).toEqual(expected);
  });

  it("never measures a page below the two-minute floor", () => {
    for (const c of sequence(demo)) expect(c.minutes).toBeGreaterThanOrEqual(2);
    for (const c of sequence(template)) expect(c.minutes).toBeGreaterThanOrEqual(2);
  });

  it("numbers and keys a clip the way the rest of the system does", () => {
    const clips = sequence(template);
    expect(clips[0].n).toBe("04.01");
    expect(clips[0].href).toBe("/create/study-your-niche");
    const hooks = clips.find((c) => c.href === "/create/hooks");
    expect(hooks?.n).toBe("04.04");
    expect(hooks?.readKey).toBe("create/hooks");
    expect(hooks?.chapterTitle).toBe("Create");
    expect(hooks?.title).toBe("Hooks");
  });

  it("measures a written audit by what is written in it, not by its headings", () => {
    const written = sequence(demo).find((c) => c.href === "/audit/content-diagnostic");
    expect(written).toBeDefined();
    expect(written!.minutes).toBeGreaterThanOrEqual(2);
  });

  it("adds up to the reel's running time", () => {
    const clips = sequence(demo);
    expect(total(clips)).toBe(clips.reduce((n, c) => n + c.minutes, 0));
    expect(total(clips)).toBeGreaterThan(total(sequence(template)));
  });

  it("gives a written client more clips than a template one", () => {
    expect(sequence(demo).length).toBeGreaterThan(sequence(template).length);
  });
});
