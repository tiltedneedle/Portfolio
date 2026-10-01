import { afterEach, describe, expect, it, vi } from "vitest";
import { blocked, cachedAccess, clientIp, doorOpen, forgetAccess, hit, isHttps, rememberAccess, sameOrigin, slugFromRows, supabaseConfig } from "@/lib/auth";
import { DEMO_OPS_CLIENT_ID } from "@/content/clients/slugs";

const ELSEWHERE = "11111111-1111-4111-8111-111111111111";

describe("which portal a person's memberships lead to", () => {
  it("is the first that names a client this deployment carries", () => {
    expect(slugFromRows([{ client_id: DEMO_OPS_CLIENT_ID }])).toBe("demo");
    expect(slugFromRows([{ client_id: ELSEWHERE }, { client_id: DEMO_OPS_CLIENT_ID }])).toBe("demo");
  });

  it("is none for memberships elsewhere, or none at all", () => {
    expect(slugFromRows([{ client_id: ELSEWHERE }])).toBeNull();
    expect(slugFromRows([])).toBeNull();
  });

  it("survives whatever the rows turn out to hold", () => {
    for (const rows of [null, undefined, "demo", 42, {}, [null], [42], [{}], [{ client_id: null }], [{ client_id: "template" }], [{ client_id: "demo" }], [{ client_id: { toString: () => DEMO_OPS_CLIENT_ID } }]]) {
      expect(slugFromRows(rows), JSON.stringify(rows)).toBeNull();
    }
  });
});

describe("remembering who may see what", () => {
  afterEach(() => forgetAccess("u1"));

  it("trusts a portal found for a minute", () => {
    rememberAccess("u1", { slug: "demo" }, 0);
    expect(cachedAccess("u1", 59_000)).toEqual({ slug: "demo" });
    expect(cachedAccess("u1", 60_001)).toBeUndefined();
  });

  it("asks again sooner when none was found, so a client being set up gets in quickly", () => {
    rememberAccess("u1", { slug: null, reason: "none" }, 0);
    expect(cachedAccess("u1", 14_000)).toEqual({ slug: null, reason: "none" });
    expect(cachedAccess("u1", 15_001)).toBeUndefined();
  });

  it("never remembers a lookup that failed", () => {
    rememberAccess("u1", { slug: null, reason: "error" }, 0);
    expect(cachedAccess("u1", 1)).toBeUndefined();
  });

  it("forgets on request (signing in or out)", () => {
    rememberAccess("u1", { slug: "demo" }, 0);
    forgetAccess("u1");
    expect(cachedAccess("u1", 1)).toBeUndefined();
  });
});

describe("the door's settings", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("needs both the project's URL and its key, or the door is open", () => {
    vi.stubEnv("SUPABASE_URL", "https://abc.supabase.co");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "");
    expect(supabaseConfig()).toBeNull();
    expect(doorOpen()).toBe(true);
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", " sb_publishable_x ");
    expect(supabaseConfig()).toEqual({ url: "https://abc.supabase.co", key: "sb_publishable_x" });
    expect(doorOpen()).toBe(false);
  });
});

const post = (url: string, headers: Record<string, string> = {}) => new Request(url, { method: "POST", headers });

describe("a form posted from this site", () => {
  it("passes from here, and with no Origin at all", () => {
    expect(sameOrigin(post("https://portal.example/auth/sign-in", { origin: "https://portal.example" }))).toBe(true);
    expect(sameOrigin(post("https://portal.example/auth/sign-in"))).toBe(true);
  });

  it("is refused from anywhere else", () => {
    for (const origin of ["https://evil.example", "https://portal.example.evil.example", "http://portal.example:8080", "null", "not a url"]) {
      expect(sameOrigin(post("https://portal.example/auth/sign-in", { origin })), origin).toBe(false);
    }
  });
});

describe("whether a request came over https", () => {
  it("believes the proxy in front, then the URL", () => {
    expect(isHttps(post("http://internal/x", { "x-forwarded-proto": "https" }))).toBe(true);
    expect(isHttps(post("https://portal.example/x", { "x-forwarded-proto": "http" }))).toBe(false);
    expect(isHttps(post("https://portal.example/x"))).toBe(true);
    expect(isHttps(post("http://localhost:3401/x"))).toBe(false);
  });
});

describe("slowing guesses", () => {
  it("refuses after a dozen counted in ten minutes, until the oldest ages out", () => {
    const key = "test:" + Math.random();
    for (let i = 0; i < 12; i++) {
      expect(blocked(key, 1000 + i)).toBe(false);
      hit(key, 1000 + i);
    }
    expect(blocked(key, 2000)).toBe(true);
    expect(blocked(key, 1000 + 10 * 60 * 1000)).toBe(false);
  });

  it("is not moved by asking, only by counting", () => {
    const key = "test:" + Math.random();
    for (let i = 0; i < 50; i++) expect(blocked(key, 1000 + i)).toBe(false);
  });

  it("counts the address the nearest proxy saw, not one the caller wrote", () => {
    const h = (o: Record<string, string>) => new Headers(o);
    expect(clientIp(h({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))).toBe("203.0.113.9");
    expect(clientIp(h({ "x-vercel-forwarded-for": "198.51.100.7", "x-forwarded-for": "6.6.6.6" }))).toBe("198.51.100.7");
    expect(clientIp(h({}))).toBe("unknown");
  });
});
