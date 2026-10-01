// Walks every page a reader can reach by following links, from the front
// page, and checks that each page answers, that every #anchor lands on an id
// that exists on its page, and that every image loads. Outbound links are
// listed, not fetched.
//
//   node scripts/links.mjs http://localhost:3400            (open door)
//   node scripts/links.mjs http://localhost:3401 --gated    (accounts: the test double)
//
// Gated, it signs in as the demo's client, through the door's own form
// handler. A YouTube still that YouTube no longer has is not a failure: the
// page hides it. Every body is read (see smoke).
import { signIn } from "./test-accounts.mjs";

const base = process.argv[2] || "http://localhost:3400";
const gated = process.argv.includes("--gated");
let cookie = "";
if (gated) {
  const s = await signIn(base);
  if (s.location !== "/" || !s.cookie) {
    console.error("links: could not sign in as the demo's client (" + s.status + " -> " + s.location + ")");
    process.exit(2);
  }
  cookie = s.cookie;
}
const headers = { connection: "close", ...(cookie ? { cookie } : {}) };
const FILE = /\.(png|jpe?g|webp|avif|gif|svg|mp4|ico|json|txt|webmanifest)$/;

const pages = new Map();
const queue = ["/"];
const queued = new Set(queue);
const problems = [];
const outbound = new Set();
const images = new Set();
const anchors = [];

while (queue.length) {
  const path = queue.shift();
  const res = await fetch(base + path, { headers, redirect: "manual" });
  const html = await res.text();
  pages.set(path, html);
  if (res.status !== 200) {
    problems.push("page " + path + " answered " + res.status + (res.headers.get("location") ? " -> " + res.headers.get("location") : ""));
    continue;
  }
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (/^(https?:)?\/\//.test(href)) outbound.add(href.replace(/^(https?:)?\/\/([^/]+).*/, "$2"));
    if (/^(mailto:|tel:|https?:|\/\/)/.test(href)) continue;
    if (href.startsWith("#")) anchors.push([path, path, href.slice(1)]);
    if (!href.startsWith("/")) continue;
    const [p, hash] = href.split("#");
    const clean = p.split("?")[0] || "/";
    if (hash) anchors.push([path, clean, hash]);
    if (!queued.has(clean) && !FILE.test(clean)) {
      queued.add(clean);
      queue.push(clean);
    }
  }
  for (const m of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) images.add(m[1].replace(/&amp;/g, "&"));
}

let anchorsOk = 0;
for (const [from, target, id] of anchors) {
  const html = pages.get(target);
  if (html === undefined) continue;
  if (html.includes('id="' + decodeURIComponent(id) + '"')) anchorsOk++;
  else problems.push("anchor on " + from + ": " + target + "#" + id + " has no such id");
}

let imagesOk = 0;
let stillsGone = 0;
for (const src of images) {
  const res = await fetch(src.startsWith("http") ? src : base + src, { headers });
  await res.arrayBuffer();
  if (res.status === 200 && /^image\//.test(res.headers.get("content-type") || "")) imagesOk++;
  else if (/ytimg/.test(decodeURIComponent(src))) stillsGone++;
  else problems.push("image " + src.slice(0, 90) + " answered " + res.status);
}

for (const p of problems) console.log("FAIL  " + p);
console.log(
  (problems.length ? "\n" : "") +
    pages.size + " pages, " + anchorsOk + "/" + anchors.length + " anchors, " + imagesOk + "/" + images.size + " images" +
    (stillsGone ? " (" + stillsGone + " YouTube stills gone, hidden by the page)" : "") +
    ". Outbound: " + ([...outbound].sort().join(", ") || "none") + "."
);
console.log(problems.length ? problems.length + " failed" : "every link held");
process.exit(problems.length ? 1 : 0);
