import { describe, expect, it } from "vitest";
import { weekOf } from "@/lib/week";

const at = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12);

describe("weekOf", () => {
  it("numbers ISO weeks", () => {
    expect(weekOf(at(2026, 9, 24)).key).toBe("2026-W39");
    expect(weekOf(at(2026, 1, 1)).key).toBe("2026-W01"); // a Thursday: week 1
    expect(weekOf(at(2027, 1, 1)).key).toBe("2026-W53"); // a Friday: still 2026's last week
    expect(weekOf(at(2024, 12, 30)).key).toBe("2025-W01"); // a Monday: already 2025's first week
    expect(weekOf(at(2021, 1, 3)).key).toBe("2020-W53"); // a Sunday
  });

  it("gives the whole week the same key and index", () => {
    const keys = new Set([21, 22, 23, 24, 25, 26, 27].map((d) => weekOf(at(2026, 9, d)).key));
    expect(keys.size).toBe(1);
    const idx = new Set([21, 22, 23, 24, 25, 26, 27].map((d) => weekOf(at(2026, 9, d)).index));
    expect(idx.size).toBe(1);
    expect(weekOf(at(2026, 9, 28)).index).toBe(weekOf(at(2026, 9, 21)).index + 1);
  });

  it("prints the range", () => {
    expect(weekOf(at(2026, 9, 24)).range).toBe("21–27 Sept");
    expect(weekOf(at(2026, 9, 30)).range).toBe("28 Sept – 4 Oct");
  });

  it("knows the month is ending", () => {
    expect(weekOf(at(2026, 9, 24)).monthEnd).toBe(true);
    expect(weekOf(at(2026, 9, 23)).monthEnd).toBe(false);
    expect(weekOf(at(2026, 2, 22)).monthEnd).toBe(true);
    expect(weekOf(at(2026, 2, 21)).monthEnd).toBe(false);
  });

  it("is steady across a clock change", () => {
    // British Summer Time ends on the last Sunday of October; the week after must still count as one week later.
    const before = weekOf(at(2026, 10, 22));
    const after = weekOf(at(2026, 10, 29));
    expect(after.index).toBe(before.index + 1);
    expect(after.week).toBe(before.week + 1);
  });
});
