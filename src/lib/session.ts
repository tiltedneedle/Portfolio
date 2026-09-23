/**
 * The door.
 *
 * A session is a signed token in an httpOnly cookie: `slug.expiry.signature`,
 * where the signature is an HMAC-SHA256 of `slug.expiry` under
 * PORTAL_SECRET. The proxy verifies it on every request and rewrites the
 * clean URL to that client's pre-rendered tree. Nothing about a client is
 * inferred from the cookie without the signature checking out.
 *
 * Access codes never leave the client file as anything but a SHA-256 hash of
 * `tn:<slug>:<code>`; logging in hashes what was typed and compares in
 * constant time against every client that has a code.
 *
 * With no PORTAL_SECRET the door is open and every visitor sees the
 * template. That is the preview mode, and it can never expose a real client:
 * the rewrite only ever targets the template when there is no secret.
 *
 * Everything here runs in both the edge runtime (the proxy) and Node (the
 * login action), so it uses Web Crypto only.
 */

export const COOKIE = "tn-room";
/** A second, readable cookie that only says "someone is in": lets the pre-rendered footer show the way out. */
export const PRESENCE = "tn-in";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

function hex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sha256(s: string) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}

/** The value stored in a client's `accessHash`. Mirrored in scripts/access.mjs. */
export async function accessHash(slug: string, code: string) {
  return sha256("tn:" + slug + ":" + code);
}

async function hmac(secret: string, message: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
}

/** Compares two strings without leaking where they differ through timing. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function portalSecret() {
  return process.env.PORTAL_SECRET || "";
}

/** True when no secret is set: the door is open and the template is served. */
export function doorOpen() {
  return !portalSecret();
}

export async function issue(secret: string, slug: string, now = Date.now()) {
  const exp = now + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const body = slug + "." + exp;
  return body + "." + (await hmac(secret, body));
}

const SLUG = /^[a-z0-9-]{1,64}$/;

/** The slug a token vouches for, or null. */
export async function verify(secret: string, token: string | undefined, now = Date.now()): Promise<string | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [slug, expText, sig] = parts;
  const exp = Number(expText);
  if (!SLUG.test(slug) || !Number.isFinite(exp) || exp < now) return null;
  const expected = await hmac(secret, slug + "." + exp);
  return safeEqual(sig, expected) ? slug : null;
}

/** Only ever send a visitor back to a path on this site. */
export function safeNext(next: unknown) {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.startsWith("/login") ? s : "/";
}
