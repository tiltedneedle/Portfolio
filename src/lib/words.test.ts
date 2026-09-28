import { describe, expect, it } from "vitest";
import { SPOKEN_WPM, mmss, numberWord, ordinalWord, runningTimes, spokenSeconds, wordCount } from "@/lib/words";

describe("ordinalWord", () => {
  it("spells the first twelve, then sets figures the way numberWord does", () => {
    expect(ordinalWord(1)).toBe("first");
    expect(ordinalWord(9)).toBe("ninth");
    expect(ordinalWord(12)).toBe("twelfth");
    expect(ordinalWord(13)).toBe("13th");
    expect(ordinalWord(21)).toBe("21st");
    expect(ordinalWord(22)).toBe("22nd");
    expect(ordinalWord(23)).toBe("23rd");
    expect(ordinalWord(111)).toBe("111th");
    expect(ordinalWord(112)).toBe("112th");
  });

  it("agrees with numberWord about where words stop", () => {
    expect(numberWord(12)).toBe("twelve");
    expect(numberWord(13)).toBe("13");
  });
});

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

describe("runningTimes", () => {
  it("has nothing to time when there is nothing", () => {
    expect(runningTimes([])).toHaveLength(0);
  });

  it("starts at zero and hands each part on to the next", () => {
    const t = runningTimes(["one two three", "four five six", "seven"]);
    expect(t[0].start).toBe(0);
    expect(t[1].start).toBe(t[0].end);
    expect(t[2].start).toBe(t[1].end);
  });

  it("ends exactly where the whole script ends, so the gutter and the rail agree", () => {
    const parts = ["A hook that stops the scroll.", "Then the body of the script, which runs on for a while and says several things.", "And the call to action."];
    expect(runningTimes(parts).at(-1)!.end).toBe(spokenSeconds(parts.join(" ")));
  });

  it("never sums rounded parts: twenty short beats still total the whole", () => {
    const parts = Array.from({ length: 20 }, (_, i) => "beat " + i + " says a few words here");
    const t = runningTimes(parts);
    expect(t.at(-1)!.end).toBe(spokenSeconds(parts.join(" ")));
    // Summing each rounded part would drift; the cumulative count cannot.
    const drifted = parts.reduce((n, p) => n + spokenSeconds(p), 0);
    expect(t.at(-1)!.end).not.toBe(drifted);
  });

  it("takes a different pace when given one", () => {
    const parts = ["one two three four five six"];
    expect(runningTimes(parts, 60).at(-1)!.end).toBe(6);
  });
});
