/**
 * Only ever send a visitor back to a path on this site.
 *
 * Checking for a leading "//" is not enough: in a special scheme a browser
 * reads a backslash as a slash, so a path beginning slash-backslash
 * resolves to another origin entirely and walks straight past a
 * startsWith("//") guard. Resolve it, and insist the origin did not move.
 */
export function safeNext(next: unknown) {
  const s = typeof next === "string" ? next : "";
  if (!s.startsWith("/") || s.startsWith("/login")) return "/";
  const here = "https://x.invalid";
  try {
    const url = new URL(s, here + "/");
    if (url.origin !== here) return "/";
    const out = url.pathname + url.search + url.hash;
    // The resolved path can itself be protocol-relative even when the parse
    // stayed on-origin: "/..//evil.example" normalises to "//evil.example",
    // which leaves the site the moment anything resolves it again. So the
    // answer is checked, not just the question.
    return new URL(out, here + "/").origin === here && !out.startsWith("//") ? out : "/";
  } catch {
    return "/";
  }
}
