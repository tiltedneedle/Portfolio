import { describe, expect, it } from "vitest";
import { groupDigits } from "./digits";

describe("groupDigits", () => {
  it("writes a number as en-US does", () => {
    const values = [0, 7, 7.4, 9.9, 10, 999, 1000, 1234.5, 12.3456, 99999.9995, 1234567.891, 5_000_000_000, -1234.5, -7.25, 0.5, 100000];
    for (const v of values) expect(groupDigits(v), String(v)).toBe(v.toLocaleString("en-US"));
  });

  it("keeps what is not a number as it is", () => {
    expect(groupDigits(Number.NaN)).toBe("NaN");
    expect(groupDigits(Number.POSITIVE_INFINITY)).toBe("Infinity");
  });
});
