import { describe, expect, it } from "vitest";
import { firstMoves, monogram, scriptAsText, shortName, writtenSections } from "@/content/clients/types";
import { demo } from "@/content/clients/demo";

describe("scriptAsText", () => {
  it("prints the parts in filming order, and only the parts that exist", () => {
    const text = scriptAsText({
      n: 4,
      title: "The cost",
      hook: "Forty thousand.",
      body: ["One.", "Two."],
      cta: "Ask.",
      shots: ["Wide", "Tight"],
      location: "Hangar",
      onCamera: "Ren",
    });
    const order = ["THE COST", "HOOK", "Forty thousand.", "SCRIPT", "One.", "Two.", "CALL TO ACTION", "Ask.", "SHOT LIST", "01  Wide", "02  Tight", "LOCATION  Hangar", "ON CAMERA  Ren"];
    let at = -1;
    for (const part of order) {
      const i = text.indexOf(part, at + 1);
      expect(i, part).toBeGreaterThan(at);
      at = i;
    }
    expect(scriptAsText({ n: 1, title: "Bare" })).toBe("BARE");
    expect(scriptAsText({ n: 1, title: "Bare", body: ["A."] })).not.toContain("HOOK");
    expect(scriptAsText({ n: 1, title: "Bare", body: ["A."] })).not.toContain("SHOT LIST");
  });
});

describe("the reports", () => {
  const r = demo.contentDiagnostic;

  it("lists only the written headings", () => {
    const w = writtenSections(r);
    expect(w.length).toBeGreaterThan(0);
    expect(w.every((s) => s.body && s.body.length > 0)).toBe(true);
    expect(writtenSections({ intro: "", sections: [{ title: "A", covers: "a" }] })).toEqual([]);
  });

  it("orders the first moves 1, 2, 3 whatever the heading order, and skips unwritten ones", () => {
    expect(firstMoves(r).map((s) => s.first)).toEqual([1, 2, 3]);
    const made = firstMoves({
      intro: "",
      sections: [
        { title: "Later", covers: "", first: 3, body: ["x"] },
        { title: "Unwritten", covers: "", first: 1 },
        { title: "Sooner", covers: "", first: 2, body: ["y"] },
      ],
    });
    expect(made.map((s) => s.title)).toEqual(["Sooner", "Later"]);
  });
});

describe("names", () => {
  it("prefers the short name and falls back to the full one", () => {
    expect(shortName({ name: "Horizon Aviation", short: "Horizon" })).toBe("Horizon");
    expect(shortName({ name: "Horizon Aviation" })).toBe("Horizon Aviation");
    expect(shortName({ name: "Horizon Aviation", short: "" })).toBe("Horizon Aviation");
  });

  it("takes two initials, or two letters of a one-word name", () => {
    expect(monogram({ name: "Horizon Aviation" })).toBe("HA");
    expect(monogram({ name: "Meridian" })).toBe("ME");
    expect(monogram({ name: "  Company   Name " })).toBe("CN");
  });
});
