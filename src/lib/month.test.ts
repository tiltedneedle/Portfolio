import { describe, expect, it } from "vitest";
import { monthSlots } from "@/lib/month";

const idea = (pillar: string, n: number) => ({ pillar, n, text: pillar + " idea " + n, k: pillar.toLowerCase() + ":" + n });
const ideas = [idea("Authority", 1), idea("Authority", 2), idea("Education", 1), idea("Education", 2), idea("Personal", 1)];
const script = (n: number, from?: { pillar: "authority" | "education" | "entertainment" | "personal"; n: number }) => ({ n, title: "Script " + n, body: ["words"], from });

describe("monthSlots", () => {
  it("posts on the odd days: fifteen slots in thirty", () => {
    const slots = monthSlots([], [], [], 30);
    expect(slots).toHaveLength(15);
    expect(slots.map((s) => s.day)).toEqual([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29]);
    expect(slots.every((s) => s.kind === "open")).toBe(true);
  });

  it("puts the written scripts first, in order, then the ideas round-robin across the pillars", () => {
    const slots = monthSlots([script(2), script(1), { n: 3, title: "Empty" }], ideas);
    expect(slots.slice(0, 2).map((s) => s.kind + ":" + (s.kind === "script" ? s.n : ""))).toEqual(["script:2", "script:1"]);
    const titles = slots.filter((s) => s.kind === "idea").map((s) => (s as { title: string }).title);
    expect(titles).toEqual(["Authority idea 1", "Education idea 1", "Personal idea 1", "Authority idea 2", "Education idea 2"]);
    expect(slots.filter((s) => s.kind === "open")).toHaveLength(15 - 2 - 5);
  });

  it("leads with the pinned ideas in the order they were pinned", () => {
    const slots = monthSlots([], ideas, ["education:2", "personal:1"]);
    const first = slots.slice(0, 3).map((s) => (s.kind === "idea" ? s.title + (s.pinned ? " *" : "") : s.kind));
    expect(first).toEqual(["Education idea 2 *", "Personal idea 1 *", "Authority idea 1"]);
  });

  it("skips an idea that already became a script, and a pin it does not know", () => {
    const slots = monthSlots([script(1, { pillar: "authority", n: 1 })], ideas, ["authority:1", "nothing:9"]);
    const titles = slots.filter((s) => s.kind === "idea").map((s) => (s as { title: string }).title);
    expect(titles).not.toContain("Authority idea 1");
    expect(titles[0]).toBe("Education idea 1");
  });
});
