import { describe, expect, it } from "vitest";
import { hhmm, pad2, timecode } from "@/lib/timecode";

describe("pad2", () => {
  it("pads a single digit and leaves two alone", () => {
    expect(pad2(0)).toBe("00");
    expect(pad2(9)).toBe("09");
    expect(pad2(10)).toBe("10");
    expect(pad2(108)).toBe("108");
  });
});

describe("timecode", () => {
  it("reads SMPTE at 25 fps", () => {
    expect(timecode(0)).toBe("00:00:00:00");
    expect(timecode(59)).toBe("00:00:59:00");
    expect(timecode(60)).toBe("00:01:00:00");
    expect(timecode(108)).toBe("00:01:48:00");
    expect(timecode(600)).toBe("00:10:00:00");
    expect(timecode(3661.5)).toBe("01:01:01:12");
  });

  it("never reads a negative time", () => {
    expect(timecode(-5)).toBe("00:00:00:00");
  });
});

describe("hhmm", () => {
  it("reads a reading position as hours and minutes", () => {
    expect(hhmm(0)).toBe("00:00");
    expect(hhmm(59)).toBe("00:59");
    expect(hhmm(60)).toBe("01:00");
    expect(hhmm(108)).toBe("01:48");
    expect(hhmm(600)).toBe("10:00");
  });

  it("rounds to the minute and never goes below zero", () => {
    expect(hhmm(59.4)).toBe("00:59");
    expect(hhmm(59.6)).toBe("01:00");
    expect(hhmm(-3)).toBe("00:00");
  });
});
