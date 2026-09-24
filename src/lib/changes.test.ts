import { describe, expect, it } from "vitest";
import { mergeChanges } from "@/lib/changes";

describe("mergeChanges", () => {
  const system = [
    { date: "2026-09-24", text: "S1" },
    { date: "2026-09-20", text: "S2" },
    { date: "2026-09-10", text: "S3" },
  ];

  it("orders by date, newest first, with the client's own first on the same day", () => {
    const mine = [
      { date: "2026-09-24", text: "M1", href: "/x" },
      { date: "2026-09-15", text: "M2" },
    ];
    expect(mergeChanges(mine, system).map((c) => c.text)).toEqual(["M1", "S1", "S2", "M2", "S3"]);
    expect(mergeChanges(mine, system).map((c) => !!c.own)).toEqual([true, false, false, true, false]);
  });

  it("shows only the first few and copes with nothing of the client's", () => {
    expect(mergeChanges([], system, 2).map((c) => c.text)).toEqual(["S1", "S2"]);
    expect(mergeChanges([], [])).toEqual([]);
  });

  it("does not mutate what it is given", () => {
    const mine = [{ date: "2026-09-01", text: "M" }];
    mergeChanges(mine, system);
    expect(mine).toEqual([{ date: "2026-09-01", text: "M" }]);
    expect(system[0]).toEqual({ date: "2026-09-24", text: "S1" });
  });
});
