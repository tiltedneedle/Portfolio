import { describe, expect, it } from "vitest";
import { home } from "@/content/system/home";
import { chapters } from "@/content/chapters";
import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO, IDEAS_INTRO, SCRIPTS_INTRO } from "@/content/system/pillars";

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

});

/**
 * The home page is the brief's "Step 1: Home Page", word for word. An
 * earlier writing pass paraphrased nearly every line of it -- and also wrote
 * the house rules that pass followed into this file (steps capped at sixteen
 * words, the approach forbidden to say "the objective"), which the brief's
 * own copy breaks. The user had to ask whether the brief was being followed.
 * These pin the brief's sentences so a later pass has to fail a test to
 * rewrite them.
 */
describe("the home page says what the brief says", () => {
  it("opens on the brief's tagline and lead", () => {
    expect(home.kicker).toBe("Your complete viral content system");
    expect(home.kicker.split(" ")).toContain(home.accent);
    expect(home.lead("Company Name")).toBe("Everything we have learned from generating over 5 billion organic views, built into one complete system for Company Name.");
  });

  it("welcomes the client in the brief's words, objective last", () => {
    expect(home.intro).toEqual([
      "This portal gives you the exact frameworks, processes and principles we use at Tilted Needle to create high performing social media content.",
      "You now have everything you need to research, create, film, edit, publish and analyse content internally.",
    ]);
    expect(home.objective.label).toBe("The objective is simple");
    expect(home.objective.text).toBe(
      "To give your team the knowledge and infrastructure required to consistently create content that captures attention, builds an audience and generates more opportunities for your business."
    );
  });

  it("describes the seven parts as the brief does", () => {
    const by = (href: string) => home.access.find((a) => a.href === href)!;
    expect(by("/audit/content-diagnostic").text).toBe("A complete analysis of your current social media presence. Understand what is working, what is limiting your growth and what we would change.");
    expect(by("/audit/competitor-intelligence").text).toBe(
      "Understand what is already working within your market. See the topics, formats and content opportunities your competitors are using and where opportunities exist for your brand."
    );
    expect(by("/content/ideas").list).toEqual(["Authority", "Education", "Entertainment", "Personal"]);
    expect(by("/content/scripts").list).toEqual(["Open the script.", "Film it.", "Execute."]);
    expect(by("/create").list).toEqual(["Research your niche.", "Analyse competitors.", "Generate ideas.", "Choose formats.", "Create stronger hooks.", "Deliver your message.", "Film effectively.", "Edit for retention."]);
    expect(by("/publish").text).toContain("how to create covers and how to optimise your profiles.");
    expect(by("/analyse").list).toContain("Understand what to repeat, what to improve and what to change next time.");
  });

  it("gives the five steps and the approach as the brief does", () => {
    expect(home.how.map((h) => h.title)).toEqual(["Understand", "Create", "Publish", "Analyse", "Repeat"]);
    expect(home.how[0].text).toBe("Start with your Content Audit and Competitor Intelligence. Understand your current position and the opportunities available to you.");
    expect(home.how[4].text).toBe("Use those learnings to improve the next piece of content. The system becomes stronger the more you use it.");
    expect(home.approach.lines).toEqual([
      "The objective is not to create one viral video.",
      "The objective is to build a repeatable system capable of producing high performing content consistently.",
    ]);
    expect(home.approach.beats).toEqual(["Research.", "Create.", "Publish.", "Analyse.", "Improve.", "Then repeat."]);
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

describe("a card and the page it opens do not say the same thing either", () => {
  // The scripts page carried its card's old wording through a whole writing
  // pass, because the only no-repeat rule compared cards against chapter
  // blurbs. These two page headers live in content so this can watch them.
  const pageIntros = [
    { name: "content diagnostic", href: "/audit/content-diagnostic", text: DIAGNOSTIC_INTRO },
    { name: "competitor intelligence", href: "/audit/competitor-intelligence", text: COMPETITOR_INTRO },
    { name: "ideas", href: "/content/ideas", text: IDEAS_INTRO },
    { name: "scripts", href: "/content/scripts", text: SCRIPTS_INTRO },
  ];

  it("gives the two content pages a header of their own, not their card's", () => {
    const offenders: string[] = [];
    for (const page of pageIntros) {
      // The two audit pages are the deliberate exception: the card imports
      // the report's own intro so they cannot drift.
      if (page.href.startsWith("/audit/")) continue;
      const card = home.access.find((a) => a.href === page.href);
      if (!card) continue;
      for (const s of sentences(page.text)) if (card.text.includes(s)) offenders.push(page.name + " repeats its card: " + s);
      for (const s of sentences(card.text)) if (page.text.includes(s)) offenders.push(page.name + " repeats its card: " + s);
    }
    expect(offenders, offenders.join("; ")).toEqual([]);
  });

  it("keeps the audit cards importing their report's intro, which is the exception", () => {
    expect(home.access.find((a) => a.href === "/audit/content-diagnostic")?.text).toBe(DIAGNOSTIC_INTRO);
    expect(home.access.find((a) => a.href === "/audit/competitor-intelligence")?.text).toBe(COMPETITOR_INTRO);
  });

  it("says nothing twice across the four page headers", () => {
    const offenders: string[] = [];
    for (const a of pageIntros) {
      for (const s of sentences(a.text)) {
        for (const b of pageIntros) if (b !== a && b.text.includes(s)) offenders.push(a.name + " and " + b.name + ": " + s);
      }
    }
    expect(offenders, offenders.join("; ")).toEqual([]);
  });
});
