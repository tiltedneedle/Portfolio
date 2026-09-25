import { describe, expect, it } from "vitest";
import { mmss, spokenSeconds, wordCount, SPOKEN_WPM, numberWord } from "@/lib/words";

describe("wordCount", () => {
  it("counts words, not punctuation or spacing", () => {
    expect(wordCount("Forty thousand pounds, London to Nice and back.")).toBe(8);
    expect(wordCount("  one   two\n\nthree  ")).toBe(3);
    expect(wordCount("– — ... !")).toBe(0);
    expect(wordCount("")).toBe(0);
  });

  it("counts numbers and hyphenated terms as words", () => {
    expect(wordCount("£40,000 for a 14-hour flight")).toBe(5);
  });
});

describe("spokenSeconds", () => {
  it("uses the presenter's pace", () => {
    expect(SPOKEN_WPM).toBe(150);
    const words = Array.from({ length: 150 }, () => "word").join(" ");
    expect(spokenSeconds(words)).toBe(60);
    expect(spokenSeconds(words, 300)).toBe(30);
  });

  it("is zero for nothing to say", () => {
    expect(spokenSeconds("")).toBe(0);
  });
});

describe("mmss", () => {
  it("prints minutes and two-digit seconds", () => {
    expect(mmss(0)).toBe("0:00");
    expect(mmss(50)).toBe("0:50");
    expect(mmss(80)).toBe("1:20");
    expect(mmss(600)).toBe("10:00");
    expect(mmss(-5)).toBe("0:00");
  });
});

describe("numberWord", () => {
  it("writes the small numbers out and leaves the big ones as numerals", () => {
    expect(numberWord(0)).toBe("zero");
    expect(numberWord(3)).toBe("three");
    expect(numberWord(7)).toBe("seven");
    expect(numberWord(12)).toBe("twelve");
    expect(numberWord(13)).toBe("13");
    expect(numberWord(100)).toBe("100");
  });
});
