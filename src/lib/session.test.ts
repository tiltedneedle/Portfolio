import { describe, expect, it } from "vitest";
import { accessHash, issue, safeEqual, safeNext, sha256, verify, SESSION_DAYS } from "@/lib/session";

const SECRET = "a-secret-for-the-tests";

describe("the session token", () => {
  it("round-trips a slug under the same secret", async () => {
    const token = await issue(SECRET, "demo");
    expect(await verify(SECRET, token)).toBe("demo");
  });

  it("has the shape slug.expiry.signature", async () => {
    const now = 1_700_000_000_000;
    const token = await issue(SECRET, "demo", now);
    const [slug, exp, sig] = token.split(".");
    expect(slug).toBe("demo");
    expect(Number(exp)).toBe(now + SESSION_DAYS * 24 * 60 * 60 * 1000);
    expect(sig).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects a token signed under another secret", async () => {
    const token = await issue("some-other-secret", "demo");
    expect(await verify(SECRET, token)).toBeNull();
  });

  it("rejects a token whose slug was changed after signing", async () => {
    const token = await issue(SECRET, "demo");
    const [, exp, sig] = token.split(".");
    expect(await verify(SECRET, "template." + exp + "." + sig)).toBeNull();
  });

  it("rejects a token whose expiry was moved", async () => {
    const token = await issue(SECRET, "demo");
    const [slug, exp, sig] = token.split(".");
    expect(await verify(SECRET, slug + "." + (Number(exp) + 1) + "." + sig)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const issuedAt = Date.now() - (SESSION_DAYS + 1) * 24 * 60 * 60 * 1000;
    const token = await issue(SECRET, "demo", issuedAt);
    expect(await verify(SECRET, token)).toBeNull();
  });

  it("rejects malformed tokens without throwing", async () => {
    for (const bad of [undefined, "", "demo", "demo.123", "demo.123.abc.def", "De mo.123.abc", "demo.notanumber.abc", "../x.123.abc"]) {
      expect(await verify(SECRET, bad)).toBeNull();
    }
  });

  it("refuses slugs outside lowercase letters, digits and dashes", async () => {
    const [, exp] = (await issue(SECRET, "demo")).split(".");
    for (const slug of ["Demo", "de_mo", "de/mo", "a".repeat(65)]) {
      const forged = await issue(SECRET, slug);
      expect(await verify(SECRET, forged)).toBeNull();
      expect(exp).toBeTruthy();
    }
  });
});

describe("the access hash", () => {
  it("is sha256 of tn:slug:code, as scripts/access.mjs computes it", async () => {
    expect(await accessHash("demo", "horizon-2026")).toBe(await sha256("tn:demo:horizon-2026"));
    // The demo client's stored hash, so a change to the formula is caught here.
    expect(await accessHash("demo", "horizon-2026")).toBe("46722c7f0d32372a520855156501ead6fbec3dc8b73b053d7222b0b10a72544b");
  });

  it("differs per client for the same code", async () => {
    expect(await accessHash("demo", "code")).not.toBe(await accessHash("template", "code"));
  });
});

describe("safeEqual", () => {
  it("compares whole strings", () => {
    expect(safeEqual("abc", "abc")).toBe(true);
    expect(safeEqual("abc", "abd")).toBe(false);
    expect(safeEqual("abc", "ab")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

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
});
