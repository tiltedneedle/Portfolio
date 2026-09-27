import { describe, expect, it } from "vitest";
import { home } from "@/content/system/home";
import { chapters } from "@/content/chapters";
import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO } from "@/content/system/pillars";

/**
 * The front page's access cards and the rooms' blurbs are one copy family.
 * They describe the same seven things, on two surfaces a reader sees in one
 * scroll, so a sentence that appears on both is a sentence read twice.
 *
 * This is a discipline nobody can hold by hand across four files, so it is
 * held here instead. Before this test the Publish card opened with the
 * Publish room's blurb, word for word.
 */
const sentences = (text: string) =>
  text
    .split(". ")
    .map((s) => s.replace(/\.$/, "").trim())
    .filter((s) => s.length > 12);

describe("the two reports are described once", () => {
  it("takes the audit cards' words from the reports themselves", () => {
    expect(home.access[0].text).toBe(DIAGNOSTIC_INTRO);
    expect(home.access[1].text).toBe(COMPETITOR_INTRO);
  });

  it("keeps the two reports distinct from each other", () => {
    for (const s of sentences(DIAGNOSTIC_INTRO)) expect(COMPETITOR_INTRO).not.toContain(s);
  });
});

describe("a card and the room it opens do not say the same thing", () => {
  it("shares no sentence between an access card and a chapter blurb", () => {
    const blurbs = chapters.map((c) => c.blurb);
    const offenders: string[] = [];
    for (const card of home.access) {
      for (const s of sentences(card.text)) {
        for (const b of blurbs) if (b.includes(s)) offenders.push(card.title + " repeats a blurb: " + s);
      }
    }
    for (const b of blurbs) {
      for (const s of sentences(b)) {
        for (const card of home.access) if (card.text.includes(s)) offenders.push(card.title + " repeats a blurb: " + s);
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it("shares no sentence between one access card and another", () => {
    const offenders: string[] = [];
    for (const a of home.access) {
      for (const s of sentences(a.text)) {
        for (const b of home.access) if (b !== a && b.text.includes(s)) offenders.push(a.title + " and " + b.title + ": " + s);
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});

describe("the loop steps do not re-list the cards", () => {
  it("shares no sentence between a loop step and an access card", () => {
    const offenders: string[] = [];
    for (const step of home.how) {
      for (const s of sentences(step.text)) {
        for (const card of home.access) if (card.text.includes(s)) offenders.push(step.title + " repeats " + card.title + ": " + s);
      }
    }
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it("keeps every step short enough to read at a glance", () => {
    for (const step of home.how) expect(step.text.split(/\s+/).length).toBeLessThanOrEqual(16);
  });
});

describe("the mono labels agree with each other", () => {
  it("leaves the kicker without a terminal period, like every other label", () => {
    expect(home.kicker.endsWith(".")).toBe(false);
    expect(home.objective.label.endsWith(".")).toBe(false);
  });
});

describe("permanence is claimed once", () => {
  it("says it in the hero strip and nowhere else in the content", () => {
    const everywhere = [
      home.kicker,
      home.lead("Company Name"),
      ...home.intro,
      home.objective.text,
      ...home.access.map((a) => a.text),
      ...home.how.map((h) => h.text),
      ...home.approach.lines,
    ];
    for (const line of everywhere) expect(line.toLowerCase()).not.toContain("permanent");
    expect(home.access_note.toLowerCase()).toContain("permanent");
  });
});

describe("the objective is stated once", () => {
  it("does not restate the Welcome block's label two sections later", () => {
    for (const line of home.approach.lines) expect(line.toLowerCase()).not.toContain("the objective");
  });

  it("sets up the beats rather than repeating the objective's words", () => {
    const words = new Set(
      home.objective.text
        .toLowerCase()
        .split(/[^a-z']+/)
        .filter((w) => w.length > 5)
    );
    for (const line of home.approach.lines) {
      const shared = line
        .toLowerCase()
        .split(/[^a-z']+/)
        .filter((w) => words.has(w));
      expect(shared, "approach line repeats the objective: " + shared.join(", ")).toEqual([]);
    }
  });
});
