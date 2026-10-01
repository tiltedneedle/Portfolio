import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/safe-next";

describe("safeNext", () => {
  it("keeps paths on this site", () => {
    expect(safeNext("/create/hooks")).toBe("/create/hooks");
    expect(safeNext("/content/scripts/3?x=1")).toBe("/content/scripts/3?x=1");
  });

  it("sends everything else home", () => {
    expect(safeNext("//evil.example")).toBe("/");
    expect(safeNext("https://evil.example/")).toBe("/");
    expect(safeNext("/login?next=/x")).toBe("/");
    expect(safeNext("")).toBe("/");
    expect(safeNext(null)).toBe("/");
    expect(safeNext(42)).toBe("/");
  });

  it("treats a backslash the way a browser does", () => {
    // In a special scheme "\\" is "/", so these leave the site even though
    // none of them starts with "//". This was an open redirect.
    for (const s of ["/\evil.example", "/\\evil.example", "/\/evil.example", "/\	evil.example"]) {
      const out = safeNext(s);
      expect(new URL(out, "https://portal.example/").origin, s + " escaped to " + out).toBe("https://portal.example");
    }
  });

  it("never returns anything that resolves off-origin", () => {
    const nasty = ["/\evil.example", "//evil.example", "/%2F%2Fevil.example", "/\\\\", "/..//evil.example", "/\r\n//evil.example"];
    for (const s of nasty) expect(new URL(safeNext(s), "https://portal.example/").origin).toBe("https://portal.example");
  });
});
