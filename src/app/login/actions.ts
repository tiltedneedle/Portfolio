"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, PRESENCE, SESSION_DAYS, accessHash, issue, portalSecret, safeEqual, safeNext } from "@/lib/session";
import { clientsWithAccess } from "@/content/clients/registry";

// Attempts per address in a sliding window. In memory, so per server
// instance; enough to make guessing an access code impractical.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const attempts = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  // Stop recording once the window is already over the limit. Pushing every
  // blocked attempt made a flood cost more per request than the one before,
  // since the whole array is re-filtered each time.
  if (recent.length <= MAX_PER_WINDOW) recent.push(now);
  attempts.set(ip, recent);
  if (attempts.size > 5000) {
    for (const [k, v] of attempts) if (v.every((t) => now - t >= WINDOW_MS)) attempts.delete(k);
  }
  return recent.length > MAX_PER_WINDOW;
}

async function clientIp() {
  const h = await headers();
  // The LEFTMOST x-forwarded-for entry is whatever the caller sent, so
  // rotating it defeated the limit entirely. The rightmost is the one the
  // proxy closest to us appended, and Vercel's own header is better still.
  const xff = h.get("x-forwarded-for");
  const rightmost = xff?.split(",").pop()?.trim();
  return h.get("x-vercel-forwarded-for")?.trim() || rightmost || h.get("x-real-ip") || "unknown";
}

function back(error: string, next: string, who = ""): never {
  redirect("/login?error=" + error + (next === "/" ? "" : "&next=" + encodeURIComponent(next)) + (who ? "&for=" + who : ""));
}

/** The door. Finds the client whose access code was typed, and lets them in. */
export async function enter(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim();
  const next = safeNext(formData.get("next"));
  const forRaw = formData.get("for");
  const who = typeof forRaw === "string" && /^[a-z0-9-]{1,64}$/.test(forRaw) ? forRaw : "";
  const secret = portalSecret();

  if (!secret) redirect(next);
  if (limited(await clientIp())) back("slow", next, who);
  if (!code || code.length > 200) back("code", next, who);

  // Every client is checked, whether or not one has already matched, so the
  // time taken says nothing about which code was close.
  let found: string | null = null;
  for (const c of clientsWithAccess()) {
    const got = await accessHash(c.identity.slug, code);
    if (safeEqual(got, c.identity.accessHash)) found = c.identity.slug;
  }
  // A wrong code costs a moment on every instance, so guessing stays slow
  // even where the in-memory limiter does not persist between requests.
  if (!found) {
    await new Promise((r) => setTimeout(r, 400));
    back("code", next, who);
  }

  const store = await cookies();
  store.set(COOKIE, await issue(secret, found), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });
  store.set(PRESENCE, "1", { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * SESSION_DAYS });
  redirect(next);
}

/** Leaving the room: the cookie goes, the door shows. */
export async function leave() {
  const store = await cookies();
  store.delete(COOKIE);
  store.delete(PRESENCE);
  redirect("/login");
}
