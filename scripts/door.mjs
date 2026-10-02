// Tries to get past the door of a running portal connected to the test
// double (scripts/auth-double.mjs), the ways someone would: the internal
// tree under another spelling, the image optimizer as a side door, sessions
// forged, expired, signed with the wrong key or with none, accounts with no
// portal here, forms posted from another site, and a real client's session
// reaching for another client's pages. Then what must work: a session that
// has run out is renewed, and a forgotten password is replaced, from asking
// for the link to being inside.
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

// One made-up address a run, so the door's counts of wrong passwords and
// reset requests start afresh each time this is run against the same server.
const FROM = { "x-forwarded-for": "10." + crypto.randomInt(256) + "." + crypto.randomInt(256) + "." + crypto.randomInt(1, 255) };
await fetch(double + "/__double/reset", { method: "POST" });

let failed = 0;
function check(name, ok, detail) {
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + name.padEnd(58) + " " + detail);
}
async function get(path, { cookie, headers = {}, method = "GET", body } = {}) {
  const res = await fetch(base + path, { method, redirect: "manual", body, headers: { connection: "close", ...FROM, ...(cookie ? { cookie } : {}), ...headers } });
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
// A whole session from the double, refresh token and all, as a cookie.
async function mintedSession(email, exp) {
  const r = await fetch(double + "/__double/mint", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, exp, session: true }) });
  return SESSION + "=base64-" + b64url(JSON.stringify(await r.json()));
}
// A browser's cookie jar, as far as these checks need one.
function jarOf(start = "") {
  const jar = new Map(start ? start.split("; ").map((c) => [c.slice(0, c.indexOf("=")), c.slice(c.indexOf("=") + 1)]) : []);
  return {
    header: () => [...jar].map(([k, v]) => k + "=" + v).join("; "),
    take(setCookie) {
      for (const c of setCookie) {
        const pair = c.split(";")[0];
        const at = pair.indexOf("=");
        const value = pair.slice(at + 1);
        if (value && !/Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c)) jar.set(pair.slice(0, at), value);
        else jar.delete(pair.slice(0, at));
      }
    },
    hasSession: () => jar.has(SESSION) || jar.has(SESSION + ".0"),
    has: (name) => jar.has(name),
  };
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
  const s = await signIn(base, ACCOUNTS[who], PASSWORD, "/audit", FROM);
  check("sign in as " + who + ": turned away, no session kept", s.location.startsWith("/login?error=account") && !s.cookie.includes(SESSION), s.status + " -> " + s.location);
  const minted = await mint(ACCOUNTS[who]);
  const r = await get("/audit", { cookie: sessionCookie(minted.access_token) });
  check("a valid session for " + who + " opens nothing", !shown(r) && r.location.startsWith("/login") && new URLSearchParams(r.location.split("?")[1] || "").get("error") === "account", r.status + " -> " + r.location);
}
{
  // No password exists until the invitation is taken up, so any password is wrong.
  const s = await signIn(base, ACCOUNTS.invited, PASSWORD, "/", FROM);
  check("sign in before the invitation was taken up", s.location.startsWith("/login?error=credentials") && !s.cookie.includes(SESSION), s.location);
}
{
  const s = await signIn(base, ACCOUNTS.unconfirmed, PASSWORD, "/", FROM);
  check("sign in with an address never confirmed", s.location.startsWith("/login?error=invite") && !s.cookie.includes(SESSION), s.location);
}
{
  const s = await signIn(base, ACCOUNTS.client, "not-the-password", "/", FROM);
  check("a wrong password", s.location.startsWith("/login?error=credentials") && !s.cookie.includes(SESSION), s.location);
}

// Forms posted from another site do nothing.
const real2 = await signIn(base, ACCOUNTS.client, PASSWORD, "/", FROM);
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
    const s = await signIn(base, ACCOUNTS.client, PASSWORD, next, FROM);
    check("signing in with next=" + next, s.location === "/", s.location);
  }
}

// A session whose token has run out is renewed, where the new one can be
// kept: by the proxy, never by a page.
{
  const past = Math.floor(Date.now() / 1000) - 60;
  const jar = jarOf();
  const r = await get("/audit", { cookie: await mintedSession(ACCOUNTS.client, past) });
  jar.take(r.setCookie);
  check("an expired session with a good refresh token is renewed", shown(r) && jar.hasSession(), r.status + (jar.hasSession() ? " (new session set)" : " (no new session)"));
  const kept = await get("/audit", { cookie: jar.header() });
  check("and the renewed session opens the next page", shown(kept), String(kept.status));

  // A page and its prefetches all arrive carrying the old one.
  const old = await mintedSession(ACCOUNTS.client, past);
  const all = await Promise.all(Array.from({ length: 5 }, () => get("/audit", { cookie: old })));
  check("five requests at once with one expired session all get in", all.every(shown), all.map((x) => x.status).join(" "));

  const door = jarOf();
  const d = await get("/login?forgot=1", { cookie: await mintedSession(ACCOUNTS.client, past) });
  door.take(d.setCookie);
  check("the door's own page renews an expired session too", d.status === 200 && door.hasSession(), d.status + (door.hasSession() ? " (new session set)" : " (no new session)"));
}

// Someone already in is sent straight on from the plain door (the link a
// client is sent is the door), but a door with something to say says it.
{
  const on = await get("/login?next=%2Faudit", { cookie: real2.cookie });
  check("signed in, the plain door goes straight on", on.status === 307 && on.location === "/audit", on.status + " -> " + on.location);
  const out = await get("/login?next=%2F%2Fevil.example", { cookie: real2.cookie });
  check("and never off this site", out.status === 307 && out.location === "/", out.status + " -> " + out.location);
  const stay = await get("/login?error=account", { cookie: real2.cookie });
  check("signed in, a door with something to say still says it", stay.status === 200 && stay.body.includes("no portal here"), String(stay.status));
  const anon = await get("/login");
  check("signed out, the door is the door", anon.status === 200 && anon.body.includes('action="/auth/sign-in"'), String(anon.status));
}

// The way back in: a forgotten password, from asking for the link to being
// inside. Its own account, so nobody else's password changes.
{
  const jar = jarOf();
  const post = async (path, form) => {
    const r = await get(path, { method: "POST", cookie: jar.header(), headers: { origin: base, "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(form).toString() });
    jar.take(r.setCookie);
    return r;
  };
  const open = async (path) => {
    const r = await get(path, { cookie: jar.header() });
    jar.take(r.setCookie);
    return r;
  };
  const fresh = "a-new-password-" + crypto.randomBytes(4).toString("hex");

  const asked = await post("/auth/forgot", { email: ACCOUNTS.resetter });
  check("asking for a link to choose a new password", asked.status === 303 && asked.location === "/login?notice=sent", asked.status + " -> " + asked.location);
  const { link } = await (await fetch(double + "/__double/link?email=" + encodeURIComponent(ACCOUNTS.resetter))).json();
  const at = link ? new URL(link) : null;
  // Supabase matches the address against its allowed list as a whole
  // string, so it must carry nothing of ours: only the code Supabase adds.
  check("the link comes back to exactly /auth/confirm", !!at && at.origin === base && at.pathname === "/auth/confirm" && [...at.searchParams.keys()].join() === "code", String(link).replace(base, ""));
  const path = at ? at.pathname + at.search : "/auth/confirm";

  const again = await post("/auth/forgot", { email: ACCOUNTS.resetter });
  check("asking again within the minute is told to wait", again.location.startsWith("/login?error=wait"), again.location);
  const elsewhere = await get(path);
  check("the link opened in another browser opens nothing", elsewhere.location.startsWith("/login?error=link") && !elsewhere.setCookie.some((c) => c.startsWith(SESSION + "=base64-")), elsewhere.status + " -> " + elsewhere.location);

  const opened = await open(path);
  check("opened in the same browser, it begins a session", opened.status === 303 && opened.location === "/auth/reset" && jar.hasSession(), opened.status + " -> " + opened.location);
  const page = await open("/auth/reset");
  check("and shows the form for a new password", page.status === 200 && page.body.includes('action="/auth/password"') && page.body.includes(ACCOUNTS.resetter), String(page.status));
  for (const [name, form, want] of [
    ["two passwords that differ", { password: fresh, confirm: fresh + "x" }, "match"],
    ["a short one", { password: "short", confirm: "short" }, "short"],
    ["one longer than a password can be", { password: "x".repeat(80), confirm: "x".repeat(80) }, "long"],
    ["the password they have now", { password: PASSWORD, confirm: PASSWORD }, "same"],
  ]) {
    const r = await post("/auth/password", form);
    check("refused: " + name, r.status === 303 && r.location === "/auth/reset?error=" + want, r.status + " -> " + r.location);
  }
  const set = await post("/auth/password", { password: fresh, confirm: fresh });
  const inside = await open("/audit");
  check("a new password is set, and they are inside", set.status === 303 && set.location === "/" && shown(inside), set.status + " -> " + set.location + ", then " + inside.status);
  const spent = await get(path, { cookie: jar.header() });
  check("the link does not work twice", spent.location.startsWith("/login?error=link"), spent.status + " -> " + spent.location);
  const before = await signIn(base, ACCOUNTS.resetter, PASSWORD, "/", FROM);
  const after = await signIn(base, ACCOUNTS.resetter, fresh, "/", FROM);
  check("the old password no longer signs in, the new one does", before.location.startsWith("/login?error=credentials") && after.location === "/", before.location + " / " + after.location);
}
{
  const post = (email) => get("/auth/forgot", { method: "POST", headers: { origin: base, "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ email }).toString() });
  const unsent = await post(ACCOUNTS.unsendable);
  check("an email that could not be sent is said to be unsent", unsent.location.startsWith("/login?error=unsent"), unsent.location);
  const nobody = await post("nobody@nowhere.test");
  check("an address with no account gets the same answer as one with", nobody.location === "/login?notice=sent", nobody.location);
  const junk = await post("not an address");
  check("something that is not an address is asked for one", junk.location.startsWith("/login?error=email"), junk.location);
  const without = await get("/auth/password", { method: "POST", headers: { origin: base, "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ password: "a-long-enough-one", confirm: "a-long-enough-one" }).toString() });
  check("a new password with no session behind it changes nothing", without.location.startsWith("/login?error=link"), without.status + " -> " + without.location);
}

// Signing out ends this session, and only this one.
{
  const other = await signIn(base, ACCOUNTS.client, PASSWORD, "/", FROM);
  const r = await get("/auth/sign-out", { method: "POST", cookie: real2.cookie, headers: { origin: base } });
  const cleared = r.setCookie.some((c) => c.startsWith(SESSION + "=") && /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c));
  check("signing out clears the session", r.status === 303 && r.location === "/login" && cleared, r.status + " -> " + r.location + (cleared ? " (cleared)" : " (NOT cleared)"));
  const still = await get("/audit", { cookie: other.cookie });
  check("another session of the same account stays in", shown(still), String(still.status));
}

console.log(failed ? "\n" + failed + " failed" : "\nthe door held");
process.exit(failed ? 1 : 0);
