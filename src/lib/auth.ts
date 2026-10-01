/**
 * The door, with accounts.
 *
 * People sign in with the email and password of their Tilted Needle
 * account. The portal uses the same Supabase project as the Tilted Needle
 * app, where sign-up is off: an account exists only because someone there
 * invited it. Who sees which portal is that app's own record. A person
 * whose active membership has the Client role, for a client listed in
 * slugs.ts, sees that client's system; anyone else (staff, a client the
 * portal does not carry, a membership switched off) is turned away at the
 * door, signed in or not.
 *
 * The session is Supabase's: its cookie, refreshed by the proxy, and its
 * token's signature checked on every request (getClaims). This file holds
 * what the proxy and the auth routes share. The portal keeps no secret of
 * its own.
 *
 * With no Supabase configured the door is open and every visitor sees the
 * template. That is the preview mode, and it can never expose a real
 * client: the rewrite only ever targets the template then.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { slugForOpsClient } from "@/content/clients/slugs";

export { PRESENCE } from "@/lib/presence";

/** As long as Supabase's own session cookie lasts. */
const PRESENCE_MAX_AGE = 400 * 24 * 60 * 60;

export type SupabaseConfig = { url: string; key: string };

/**
 * The Tilted Needle app's Supabase project: its URL and publishable key,
 * both public by design (that app ships them to every browser). Read under
 * server-only names, not NEXT_PUBLIC_ ones: the portal never talks to
 * Supabase from the browser, and a NEXT_PUBLIC_ value is fixed at build
 * time, so one build could not serve both an open door and a closed one.
 */
export function supabaseConfig(): SupabaseConfig | null {
  const url = process.env.SUPABASE_URL?.trim() || "";
  const key = process.env.SUPABASE_PUBLISHABLE_KEY?.trim() || "";
  return url && key ? { url, key } : null;
}

/** True when no Supabase is configured: the door is open and the template is served. */
export function doorOpen() {
  return !supabaseConfig();
}

export function presenceOptions(secure: boolean) {
  return { httpOnly: false, secure, sameSite: "lax" as const, path: "/", maxAge: PRESENCE_MAX_AGE };
}

/** Whether a request reached us over https: the session's cookies are Secure exactly then. */
export function isHttps(request: Request) {
  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (forwarded) return forwarded === "https";
  try {
    return new URL(request.url).protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * A form posted from this site, and not from anywhere else. Browsers send
 * Origin on every form post, and one naming another site is someone else's
 * page submitting ours: signing a visitor in to an account of theirs, or
 * out of their own. A request with no Origin at all is not a browser's
 * form post and carries no visitor's cookies but its own, so it may pass.
 */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin === null) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------- the portal

/** The portal a person may see, or why not: none of their memberships leads to one, or the lookup failed. */
export type Access = { slug: string } | { slug: null; reason: "none" | "error" };

/**
 * The portal a person's client memberships lead to: the first, oldest
 * first, that names a client this deployment carries. The rows are the
 * Tilted Needle app's, so anything at all may be in them.
 */
export function slugFromRows(rows: unknown): string | null {
  if (!Array.isArray(rows)) return null;
  for (const row of rows) {
    const slug = slugForOpsClient(row && typeof row === "object" ? (row as { client_id?: unknown }).client_id : undefined);
    if (slug) return slug;
  }
  return null;
}

// The proxy asks on every request, prefetches included, so each server
// instance remembers the answer for a while. A portal found is trusted for a
// minute; none found is asked again sooner, so a client being set up in the
// Tilted Needle app gets in quickly. A failed lookup is never remembered.
// Taking someone's membership away therefore takes up to a minute here.
const HIT_MS = 60_000;
const MISS_MS = 15_000;
const MAX_REMEMBERED = 5000;
const remembered = new Map<string, { access: Access; until: number }>();

export function cachedAccess(userId: string, now = Date.now()): Access | undefined {
  const hit = remembered.get(userId);
  if (!hit) return undefined;
  if (hit.until <= now) {
    remembered.delete(userId);
    return undefined;
  }
  return hit.access;
}

export function rememberAccess(userId: string, access: Access, now = Date.now()) {
  if (access.slug === null && access.reason === "error") return;
  if (remembered.size >= MAX_REMEMBERED) {
    for (const [k, v] of remembered) if (v.until <= now) remembered.delete(k);
    // Still full of live answers: the oldest go (a Map keeps insertion order).
    for (const k of remembered.keys()) {
      if (remembered.size < MAX_REMEMBERED) break;
      remembered.delete(k);
    }
  }
  remembered.set(userId, { access, until: now + (access.slug ? HIT_MS : MISS_MS) });
}

export function forgetAccess(userId: string) {
  remembered.delete(userId);
}

/**
 * Which portal this signed-in person may see. Asked of the Tilted Needle
 * app's database as the person themself: its row-level security shows
 * anyone their own memberships and no one else's.
 */
export async function portalAccess(supabase: SupabaseClient, userId: string, { fresh = false } = {}): Promise<Access> {
  const now = Date.now();
  if (!fresh) {
    const hit = cachedAccess(userId, now);
    if (hit) return hit;
  }
  const { data, error } = await supabase
    .from("memberships")
    .select("client_id")
    .eq("user_id", userId)
    .eq("role", "client")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  if (error) return { slug: null, reason: "error" };
  const slug = slugFromRows(data);
  const access: Access = slug ? { slug } : { slug: null, reason: "none" };
  rememberAccess(userId, access, now);
  return access;
}

// ------------------------------------------------------------ slowing guesses

// Counts per address in a sliding window: a dozen in ten minutes, then
// no more until the oldest ages out. In memory, so per server instance: a
// layer under Supabase's own limits, not instead of them. What is counted
// is the caller's choice: signing in counts wrong passwords only (a right
// one is no guess, and an office of people signing in shares an address),
// asking for a reset link counts every request (each one sends an email).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const counted = new Map<string, number[]>();

function inWindow(key: string, now: number) {
  return (counted.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
}

/** True when this key has been counted a dozen times in the last ten minutes. */
export function blocked(key: string, now = Date.now()) {
  const recent = inWindow(key, now);
  if (recent.length) counted.set(key, recent);
  else counted.delete(key);
  return recent.length >= MAX_PER_WINDOW;
}

/** Counts one against this key. */
export function hit(key: string, now = Date.now()) {
  const recent = inWindow(key, now);
  // Never past the limit: a flood would otherwise cost more per request than
  // the one before, since the whole list is re-filtered each time.
  if (recent.length < MAX_PER_WINDOW) recent.push(now);
  counted.set(key, recent);
  if (counted.size > 5000) {
    for (const [k, v] of counted) if (v.every((t) => now - t >= WINDOW_MS)) counted.delete(k);
  }
}

/**
 * The caller's address, for the limiter. The LEFTMOST x-forwarded-for entry
 * is whatever the caller sent, so rotating it defeated the limit entirely.
 * The rightmost is the one the proxy closest to us appended, and Vercel's
 * own header is better still.
 */
export function clientIp(headers: Headers) {
  const xff = headers.get("x-forwarded-for");
  const rightmost = xff?.split(",").pop()?.trim();
  return headers.get("x-vercel-forwarded-for")?.trim() || rightmost || headers.get("x-real-ip") || "unknown";
}
