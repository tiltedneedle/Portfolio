// Tries to get past the door of a running gated server, the ways someone
// would: the internal tree under another spelling, the image optimizer as a
// side door, cookies forged, expired, cross-signed or empty, and a real
// client's session reaching for another client's pages. Needs the server's
// PORTAL_SECRET in the environment, to sign sessions as the server would,
// and PORTAL_DEMO=1 on the server (the demo is the client used here).
//
//   PORTAL_SECRET=... node scripts/door.mjs http://localhost:3401
//
// Every body is read, even where only the status matters: left unread it
// crashes Node's HTTP client when the server closes the connection.
import crypto from "node:crypto";

const base = process.argv[2] || "http://localhost:3401";
const secret = process.env.PORTAL_SECRET;
if (!secret) {
  console.error("door: PORTAL_SECRET must be set to the server's secret");
  process.exit(2);
}
const DEMO = "Horizon Aviation"; // on every one of the demo's pages
const sign = (m) => crypto.createHmac("sha256", secret).update(m).digest("hex");
const session = (slug, exp = Date.now() + 3600e3) => "tn-room=" + slug + "." + exp + "." + sign(slug + "." + exp);

let failed = 0;
function check(name, ok, detail) {
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + name.padEnd(56) + " " + detail);
}
async function get(path, { cookie, headers = {}, method = "GET" } = {}) {
  const res = await fetch(base + path, { method, redirect: "manual", headers: { connection: "close", ...(cookie ? { cookie } : {}), ...headers } });
  const body = await res.text();
  return { status: res.status, location: (res.headers.get("location") || "").replace(base, ""), setCookie: res.headers.get("set-cookie") || "", body };
}
const shown = (r) => r.status === 200 && r.body.includes(DEMO);

// No session: the demo's pages, under any spelling, never answer.
for (const p of ["/", "/audit", "/content/ideas", "/search-index.json", "/audit?_rsc=1", "/c/demo", "/c/demo/audit", "/C/demo/audit", "//c/demo/audit", "/c/demo/audit/", "/%63/demo/audit", "/c%2Fdemo%2Faudit", "/./c/demo/audit", "/c/./demo/audit", "/x/../c/demo/audit", "/c/demo/search-index.json", "/c/template"]) {
  const r = await get(p);
  check("no session " + p, !shown(r) && !(p.includes("search-index") && r.status === 200), r.status + (r.location ? " -> " + r.location : ""));
}
{
  const r = await get("/audit", { headers: { rsc: "1" } });
  check("no session, a client-side request for /audit", !shown(r) && !r.body.includes(DEMO), String(r.status));
}
{
  const r = await get("/audit", { method: "HEAD" });
  check("no session, HEAD /audit", r.status !== 200, r.status + " -> " + r.location);
}
// The image optimizer pointed at a page.
for (const u of ["/audit", "/c/demo/audit", "/c/demo/search-index.json"]) {
  const r = await get("/_next/image?w=640&q=75&url=" + encodeURIComponent(u));
  check("image optimizer on " + u, !r.body.includes(DEMO) && !r.body.includes('"sections"'), String(r.status));
}

// Sessions that must not open anything, and are cleared on the way out.
const exp = Date.now() + 3600e3;
for (const [name, cookie] of [
  ["wrong signature", "tn-room=demo." + exp + "." + "0".repeat(64)],
  ["expired", session("demo", Date.now() - 1000)],
  ["no such client, correctly signed", session("nobody")],
  ["another client's signature", "tn-room=demo." + exp + "." + sign("template." + exp)],
  ["an extra part", "tn-room=demo.x." + exp + "." + sign("demo.x." + exp)],
  ["empty", "tn-room="],
]) {
  const r = await get("/audit", { cookie });
  const cleared = /tn-room=;|tn-room=[^;]*;[^,]*(Max-Age=0|Expires=Thu, 01 Jan 1970)/i.test(r.setCookie);
  check("session: " + name, !shown(r) && r.location.startsWith("/login") && cleared, r.status + " -> " + r.location + (cleared ? " (cleared)" : " (NOT cleared)"));
}

// A real session opens its own pages, and nobody else's.
const demo = session("demo");
{
  const r = await get("/audit", { cookie: demo });
  check("demo session opens the demo's /audit", shown(r), String(r.status));
}
{
  const a = await get("/search-index.json?c=demo", { cookie: demo });
  const b = await get("/search-index.json?c=template", { cookie: demo });
  check("the search index's ?c= is only a cache key", a.status === 200 && a.body === b.body, a.status + "/" + b.status);
}
{
  const r = await get("/c/template/audit", { cookie: demo });
  check("demo session sent to /c/template/audit bounces", r.status >= 300 && r.status < 400 && r.location === "/audit", r.status + " -> " + r.location);
}
{
  const r = await get("/audit", { cookie: demo, method: "HEAD" });
  check("demo session, HEAD /audit", r.status === 200, String(r.status));
}

console.log(failed ? "\n" + failed + " failed" : "\nthe door held");
process.exit(failed ? 1 : 0);
