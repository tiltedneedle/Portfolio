// Tries to get past the door of a running portal connected to the test
// double (scripts/auth-double.mjs), the ways someone would: the internal
// tree under another spelling, the image optimizer as a side door, sessions
// forged, expired, signed with the wrong key or with none, accounts with no
// portal here, forms posted from another site, and a real client's session
// reaching for another client's pages.
//
//   node scripts/door.mjs http://localhost:3401 [http://localhost:54321]
//
// Every body is read, even where only the status matters: left unread it
// crashes Node's HTTP client when the server closes the connection.
import crypto from "node:crypto";
import { ACCOUNTS, PASSWORD, signIn } from "./test-accounts.mjs";

const base = process.argv[2] || "http://localhost:3401";
const double = process.argv[3] || "http://localhost:54321";
const SESSION = "sb-" + new URL(double).hostname.split(".")[0] + "-auth-token";
const DEMO = "Horizon Aviation"; // on every one of the demo's pages

let failed = 0;
function check(name, ok, detail) {
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + name.padEnd(58) + " " + detail);
}
async function get(path, { cookie, headers = {}, method = "GET", body } = {}) {
  const res = await fetch(base + path, { method, redirect: "manual", body, headers: { connection: "close", ...(cookie ? { cookie } : {}), ...headers } });
  const text = await res.text();
  return { status: res.status, location: (res.headers.get("location") || "").replace(base, ""), setCookie: res.headers.getSetCookie?.() ?? [], body: text };
}
const shown = (r) => r.status === 200 && r.body.includes(DEMO);

// A session cookie as @supabase/ssr writes one, around whatever token we like.
const b64url = (x) => Buffer.from(x).toString("base64url");
function sessionCookie(accessToken, { refresh = "not-a-real-refresh-token", expiresIn = 3600 } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const s = { access_token: accessToken, token_type: "bearer", expires_in: expiresIn, expires_at: now + expiresIn, refresh_token: refresh, user: { id: "x", aud: "authenticated", email: ACCOUNTS.client } };
  return SESSION + "=base64-" + b64url(JSON.stringify(s));
}
function jwt(header, payload, key) {
  const input = b64url(JSON.stringify(header)) + "." + b64url(JSON.stringify(payload));
  let sig = "";
  if (key === "none") sig = "";
  else if (typeof key === "string") sig = crypto.createHmac("sha256", key).update(input).digest("base64url");
  else sig = b64url(crypto.sign("sha256", Buffer.from(input), { key, dsaEncoding: "ieee-p1363" }));
  return input + "." + sig;
}
async function mint(email, exp) {
  const r = await fetch(double + "/__double/mint", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, exp }) });
  return r.json();
}

// No session: the demo's pages, under any spelling, never answer.
for (const p of ["/", "/audit", "/content/ideas", "/search-index.json", "/audit?_rsc=1", "/c/demo", "/c/demo/audit", "/C/demo/audit", "//c/demo/audit", "/c/demo/audit/", "/%63/demo/audit", "/c%2Fdemo%2Faudit", "/./c/demo/audit", "/c/./demo/audit", "/x/../c/demo/audit", "/c/demo/search-index.json", "/c/template", "/auth/../audit", "/auth/x/../../audit", "/login/../audit"]) {
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

// Sessions that must not open anything.
const real = await mint(ACCOUNTS.client);
const [, realPayload] = real.access_token.split(".");
const claims = JSON.parse(Buffer.from(realPayload, "base64url").toString());
const { kid } = (await (await fetch(double + "/auth/v1/.well-known/jwks.json")).json()).keys[0];
const stranger = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" }).privateKey;
const expired = await mint(ACCOUNTS.client, Math.floor(Date.now() / 1000) - 60);
const tampered = real.access_token.split(".");
tampered[1] = b64url(JSON.stringify({ ...claims, sub: "00000000-0000-0000-0000-000000000000" }));
for (const [name, cookie] of [
  ["a cookie that is not a session", SESSION + "=base64-" + b64url("not a session")],
  ["a session that is not JSON", SESSION + "=base64-" + b64url("{oops")],
  ["the old door's cookie", "tn-room=demo.9999999999999." + "0".repeat(64)],
  ["a token signed with another key", sessionCookie(jwt({ alg: "ES256", typ: "JWT", kid }, claims, stranger))],
  ["a token with no signature (alg none)", sessionCookie(jwt({ alg: "none", typ: "JWT" }, claims, "none"))],
  ["a token signed with the public key as a secret", sessionCookie(jwt({ alg: "HS256", typ: "JWT" }, claims, "sb_publishable_double"))],
  ["a real token with its subject changed", sessionCookie(tampered.join("."))],
  ["a real token, expired, no way to refresh it", sessionCookie(expired.access_token, { expiresIn: -60 })],
  ["empty", SESSION + "="],
]) {
  const r = await get("/audit", { cookie });
  check("session: " + name, !shown(r) && r.location.startsWith("/login"), r.status + " -> " + r.location);
}

// Accounts with no portal here: turned away at the form, with no session
// left behind, and turned away again if a session for one is presented.
for (const who of ["owner", "elsewhere", "former"]) {
  const s = await signIn(base, ACCOUNTS[who], PASSWORD, "/audit");
  check("sign in as " + who + ": turned away, no session kept", s.location.startsWith("/login?error=account") && !s.cookie.includes(SESSION), s.status + " -> " + s.location);
  const minted = await mint(ACCOUNTS[who]);
  const r = await get("/audit", { cookie: sessionCookie(minted.access_token) });
  check("a valid session for " + who + " opens nothing", !shown(r) && r.location.startsWith("/login") && new URLSearchParams(r.location.split("?")[1] || "").get("error") === "account", r.status + " -> " + r.location);
}
{
  const s = await signIn(base, ACCOUNTS.invited);
  check("sign in before the invitation was taken up", s.location.startsWith("/login?error=invite") && !s.cookie.includes(SESSION), s.location);
}
{
  const s = await signIn(base, ACCOUNTS.client, "not-the-password");
  check("a wrong password", s.location.startsWith("/login?error=credentials") && !s.cookie.includes(SESSION), s.location);
}

// Forms posted from another site do nothing.
const real2 = await signIn(base);
for (const path of ["/auth/sign-in", "/auth/sign-out", "/auth/forgot", "/auth/password"]) {
  const r = await get(path, { method: "POST", cookie: real2.cookie, headers: { origin: "https://evil.example", "content-type": "application/x-www-form-urlencoded" }, body: "email=" + encodeURIComponent(ACCOUNTS.client) + "&password=" + PASSWORD + "&confirm=" + PASSWORD });
  check("a form posted to " + path + " from another site", r.status === 403 && !r.setCookie.length, String(r.status));
}
{
  const r = await get("/auth/sign-in", { method: "POST", headers: { origin: "null", "content-type": "application/x-www-form-urlencoded" }, body: "email=a%40b.c&password=x" });
  check("a form posted from an opaque origin", r.status === 403, String(r.status));
}

// A real session opens its own pages, and nobody else's.
{
  const r = await get("/audit", { cookie: real2.cookie });
  check("the client's session opens the demo's /audit", shown(r), String(r.status));
}
{
  const a = await get("/search-index.json?c=demo", { cookie: real2.cookie });
  const b = await get("/search-index.json?c=template", { cookie: real2.cookie });
  check("the search index's ?c= is only a cache key", a.status === 200 && a.body === b.body, a.status + "/" + b.status);
}
{
  const r = await get("/c/template/audit", { cookie: real2.cookie });
  check("the client's session sent to /c/template/audit bounces", r.status >= 300 && r.status < 400 && r.location === "/audit", r.status + " -> " + r.location);
}
{
  const r = await get("/audit", { cookie: real2.cookie, method: "HEAD" });
  check("the client's session, HEAD /audit", r.status === 200, String(r.status));
}
{
  // Sending people on after signing in stays on this site.
  for (const next of ["//evil.example", "/\\evil.example", "https://evil.example/"]) {
    const s = await signIn(base, ACCOUNTS.client, PASSWORD, next);
    check("signing in with next=" + next, s.location === "/", s.location);
  }
}

// Signing out ends this session, and only this one.
{
  const other = await signIn(base);
  const r = await get("/auth/sign-out", { method: "POST", cookie: real2.cookie, headers: { origin: base } });
  const cleared = r.setCookie.some((c) => c.startsWith(SESSION + "=") && /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c));
  check("signing out clears the session", r.status === 303 && r.location === "/login" && cleared, r.status + " -> " + r.location + (cleared ? " (cleared)" : " (NOT cleared)"));
  const still = await get("/audit", { cookie: other.cookie });
  check("another session of the same account stays in", shown(still), String(still.status));
}

console.log(failed ? "\n" + failed + " failed" : "\nthe door held");
process.exit(failed ? 1 : 0);
