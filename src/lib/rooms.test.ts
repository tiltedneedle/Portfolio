import { describe, expect, it } from "vitest";
import { firstRoom, liveChapters, livePaths, roomAfter, writtenPages } from "@/lib/rooms";
import { chapters } from "@/content/chapters";
import { demo } from "@/content/clients/demo";
import { template } from "@/content/clients/template";
import { pillar, report, scripts } from "@/content/system/pillars";
import { competitorHeadings, diagnosticHeadings } from "@/content/system/pillars";
import type { ClientSystem } from "@/content/clients/types";

const bare = (over: Partial<ClientSystem> = {}): ClientSystem => ({
  identity: template.identity,
  contentDiagnostic: report("", diagnosticHeadings),
  competitorIntelligence: report("", competitorHeadings),
  ideas: { authority: pillar(), education: pillar(), entertainment: pillar(), personal: pillar() },
  scripts: scripts(),
  ...over,
});

describe("writtenPages", () => {
  it("finds nothing in the template", () => {
    expect([...writtenPages(template)]).toEqual([]);
  });

  it("finds every personalised page in the demo", () => {
    expect([...writtenPages(demo)].sort()).toEqual(["/audit/competitor-intelligence", "/audit/content-diagnostic", "/content/ideas", "/content/scripts"]);
  });

  it("does not count examples: they show the shape, they are not the client's", () => {
    const examples = bare({
      ideas: { authority: pillar([{ text: "An example idea.", example: true }]), education: pillar(), entertainment: pillar(), personal: pillar() },
      scripts: scripts([{ n: 1, title: "An example script", body: ["Words."], example: true }]),
    });
    expect([...writtenPages(examples)]).toEqual([]);
  });

  it("takes one written heading as enough for that report", () => {
    const one = bare({ contentDiagnostic: report("", diagnosticHeadings, { [diagnosticHeadings[2].title]: ["Written."] }) });
    expect([...writtenPages(one)]).toEqual(["/audit/content-diagnostic"]);
  });
});

describe("liveChapters", () => {
  it("leaves a client with nothing written the universal rooms only", () => {
    const live = liveChapters(template);
    expect(live.map((c) => c.id)).toEqual(["home", "create", "publish", "analyse"]);
  });

  it("gives a written client every room, in the system's order", () => {
    expect(liveChapters(demo).map((c) => c.id)).toEqual(chapters.map((c) => c.id));
    expect(liveChapters(demo).find((c) => c.id === "audit")?.pages).toHaveLength(2);
  });

  it("carries only the pages of a half written room, and never edits the chapter list", () => {
    const half = bare({ scripts: scripts([{ n: 1, title: "Written", body: ["Words."] }]) });
    const live = liveChapters(half);
    const content = live.find((c) => c.id === "content");
    expect(content?.pages.map((p) => p.slug)).toEqual(["scripts"]);
    expect(live.find((c) => c.id === "audit")).toBeUndefined();
    // The source list is untouched: the filter copies.
    expect(chapters.find((c) => c.id === "content")?.pages).toHaveLength(2);
  });
});

describe("livePaths", () => {
  it("lists home, every live room and its pages", () => {
    const paths = livePaths(liveChapters(template));
    expect(paths.has("/")).toBe(true);
    expect(paths.has("/create")).toBe(true);
    expect(paths.has("/create/hooks")).toBe(true);
    expect(paths.has("/content/ideas")).toBe(false);
    expect(paths.has("/audit")).toBe(false);
  });
});

describe("roomAfter", () => {
  it("steps through the rooms in the system's order", () => {
    expect(roomAfter("audit")?.title).toBe("Your content");
    expect(roomAfter("content")?.title).toBe("Create");
    expect(roomAfter("create")?.title).toBe("Publish");
    expect(roomAfter("publish")?.title).toBe("Analyse");
  });

  it("gives the last room nothing to cut to", () => {
    expect(roomAfter("analyse")).toBeUndefined();
  });

  it("steps over the rooms this client has not got", () => {
    expect(roomAfter("audit", template)).toBeUndefined();
    expect(roomAfter("create", template)?.title).toBe("Publish");
    expect(roomAfter("audit", demo)?.title).toBe("Your content");
  });

  it("gives the number and the name apart, so a cut can use each once", () => {
    expect(roomAfter("create")).toEqual({ href: "/publish", n: "05", title: "Publish", blurb: chapters.find((c) => c.id === "publish")!.blurb });
  });

  it("never folds the name into the number", () => {
    for (const id of ["audit", "content", "create", "publish"] as const) {
      const after = roomAfter(id);
      if (after) expect(after.n).not.toContain(after.title);
    }
  });
});

describe("firstRoom", () => {
  it("starts a client with nothing written in the first universal room", () => {
    expect(firstRoom(template).id).toBe("create");
  });

  it("starts a written client in their own audit", () => {
    expect(firstRoom(demo).id).toBe("audit");
  });

  it("starts a client with only scripts in their content", () => {
    expect(firstRoom(bare({ scripts: scripts([{ n: 1, title: "Written", body: ["Words."] }]) })).id).toBe("content");
  });
});
