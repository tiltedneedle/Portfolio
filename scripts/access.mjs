// Print the access hash for a client, to paste into that client's
// `identity.accessHash`. Mirrors accessHash() in src/lib/session.ts.
//
//   node scripts/access.mjs <slug> <access code>
//
// Choose a code the client can type from an email: three words and a
// number is plenty. The code itself is never stored anywhere in the repo.
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
const data = new TextEncoder().encode("tn:" + slug + ":" + code);
const hash = await crypto.subtle.digest("SHA-256", data);
console.log(
  Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
);
