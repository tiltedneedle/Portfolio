import { describe, expect, it } from "vitest";
import { isStaleBuild } from "./stale-build";

describe("isStaleBuild", () => {
  it("knows a chunk that is no longer on the server", () => {
    const turbopack = Object.assign(new Error("Failed to load chunk /_next/static/chunks/1_ye5tyw7cvmc.js from module 64893"), { name: "ChunkLoadError" });
    expect(isStaleBuild(turbopack)).toBe(true);
    expect(isStaleBuild(new Error("Loading chunk 123 failed."))).toBe(true);
    expect(isStaleBuild(new TypeError("Failed to fetch dynamically imported module: /_next/x.js"))).toBe(true);
    expect(isStaleBuild(new TypeError("Importing a module script failed."))).toBe(true);
  });

  it("leaves every other fault to the fault screen", () => {
    expect(isStaleBuild(new Error("Cannot read properties of undefined (reading 'map')"))).toBe(false);
    expect(isStaleBuild(new TypeError("Failed to fetch"))).toBe(false);
    expect(isStaleBuild(null)).toBe(false);
    expect(isStaleBuild(undefined)).toBe(false);
    expect(isStaleBuild("ChunkLoadError")).toBe(false);
  });
});
