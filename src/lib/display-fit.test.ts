import { describe, expect, it } from "vitest";
import { displayEm, longestWordEm, titleFit } from "./display-fit";

// The client's line as the browser set it in the home title at 1440 (144px
// type), in em: the inner span's width over its font size.
const RENDERED: Record<string, number> = {
  "Horizon Aviation": 6.924,
  "Company Name": 6.36,
  "Acme Inc": 4.02,
  "Blue Bottle Co": 6.167,
  Sky: 1.958,
  "Northern Lights Photography Studio": 14.77,
};

describe("titleFit", () => {
  it("lands within 3% of the rendered line, and never meaningfully narrow", () => {
    for (const [name, em] of Object.entries(RENDERED)) {
      const ratio = titleFit(name).line / em;
      // Wide is safe (the line is set a hair small); narrow would overflow.
      expect(ratio, name).toBeGreaterThanOrEqual(0.995);
      expect(ratio, name).toBeLessThanOrEqual(1.03);
    }
  });

  it("measures the longest word, the part that cannot wrap", () => {
    const { word } = titleFit("Northern Lights Photography Studio");
    expect(word).toBeCloseTo(displayEm("Photography"), 3);
  });

  it("does not count stray spaces", () => {
    expect(titleFit("  Acme   Inc ")).toEqual(titleFit("Acme Inc"));
  });
});

describe("displayEm", () => {
  it("sets text in capitals, as the face does", () => {
    expect(displayEm("acme")).toBe(displayEm("ACME"));
  });

  it("gives a character outside the table an average width", () => {
    expect(displayEm("É")).toBeGreaterThan(0.4);
    expect(displayEm("É")).toBeLessThan(0.5);
  });
});

describe("longestWordEm", () => {
  it("measures the widest word, the part of a title that cannot wrap", () => {
    // Rendered: 310px at the guide title's 52px floor.
    const em = longestWordEm("Discoverability");
    expect(em * 52).toBeGreaterThanOrEqual(308);
    expect(em * 52).toBeLessThanOrEqual(316);
    expect(longestWordEm("Understanding your analytics")).toBe(longestWordEm("Understanding"));
  });

  it("is nothing for nothing", () => {
    expect(longestWordEm("   ")).toBe(0);
  });
});
