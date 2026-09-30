// Print the access hash for a client, to paste into that client's
// `identity.accessHash`. Mirrors accessHash() in src/lib/session.ts.
//
//   node scripts/access.mjs <slug> <access code>
//
// The code itself is never stored anywhere in the repo, only its hash --
// but the hash is, and the repository is public (see below).
// A code whose hash sits in a public repository can be tried offline, at any
// speed, with no rate limit: three words and a number falls in minutes. Say
// so when a code is that short (README, The door).
function warnIfShort(code) {
  const words = code.trim().split(/[\s-]+/).filter(Boolean).length;
  if (code.length < 30 || words < 6)
    console.warn(
      "warning  this code is short enough to be guessed offline from its hash while the repository is public. " +
        "Make the repository private, or use six or more random words (README, The door)."
    );
}
const [slug, ...rest] = process.argv.slice(2);
const code = rest.join(" ");
if (!slug || !code) {
  console.error("usage: node scripts/access.mjs <slug> <access code>");
  process.exit(1);
}
if (!/^[a-z0-9-]{1,64}$/.test(slug)) {
  console.error("slug must be lowercase letters, digits and dashes");
  process.exit(1);
}
warnIfShort(code);
const data = new TextEncoder().encode("tn:" + slug + ":" + code);
const hash = await crypto.subtle.digest("SHA-256", data);
console.log(
  Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
);
