/**
 * The door. One password per client system, set as PORTAL_PASSWORD on the
 * deployment. The cookie holds a digest of it, never the password itself,
 * and the proxy recomputes the digest on every request. When the variable
 * is not set there is no door, so the template can be previewed anywhere.
 */
export const COOKIE = "tn-room";
export const COOKIE_DAYS = 30;

export async function tokenFor(password: string) {
  const data = new TextEncoder().encode("tilted-needle-room:" + password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Only ever send a visitor back to a path on this site. */
export function safeNext(next: unknown) {
  const s = typeof next === "string" ? next : "";
  return s.startsWith("/") && !s.startsWith("//") ? s : "/";
}
