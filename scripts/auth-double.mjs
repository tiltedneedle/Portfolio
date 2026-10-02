// A stand-in for the Tilted Needle app's Supabase project, for CI and local
// runs: the few calls the portal makes to Supabase Auth and to the
// database, answered the way Supabase answers them, so the portal's real
// sign-in code runs against it unchanged. It signs its tokens with its own
// key (ES256, published at the JWKS address, as a real project does), so
// the proxy checks their signatures exactly as it will in production.
//
//   node scripts/auth-double.mjs            (port 54321)
//   PORT=54400 node scripts/auth-double.mjs
//
// Then run the portal with SUPABASE_URL=http://localhost:54321 and
// SUPABASE_PUBLISHABLE_KEY=sb_publishable_double. Nothing here is real:
// the accounts below exist only in this file, which is why their password
// can be printed in it. A production build refuses a localhost SUPABASE_URL.
//
// The accounts (scripts/test-accounts.mjs), one for each case the door
// must handle, all with the same password:
//   client@horizon.test     a client of the demo: gets in
//   owner@studio.test       staff, no client: turned away
//   elsewhere@client.test   a client this portal does not carry: turned away
//   former@horizon.test     the demo's client, membership switched off
//   invited@horizon.test    invited, invitation never taken up (no password)
//   unconfirmed@horizon.test has a password, address never confirmed
//   broken@horizon.test     the membership lookup fails (503)
//   resetter@horizon.test   the demo's client, for the forgotten-password round trip
//   unsendable@horizon.test the demo's client, whose email cannot be sent
//
// Like the real thing: a refresh token is spent once used, except within
// ten seconds, when using it again returns the session it already became
// (several requests at once all refresh with the same token); after that,
// using it again ends the whole session. A second reset email to the same
// address within a minute is refused (429).
//
// Test-only routes, under /__double/: GET /__double/link?email= is the last
// "choose a new password" link sent to an address; POST /__double/mint
// {email, exp?, session?} signs a token for one (with session: a whole
// session, refresh token and all), for probing expired sessions; POST
// /__double/reset puts passwords and send times back as they began.
import crypto from "node:crypto";
import http from "node:http";
import { ACCOUNTS, DEMO_CLIENT, PASSWORD } from "./test-accounts.mjs";

const PORT = Number(process.env.PORT || 54321);
const KEY = process.env.DOUBLE_KEY || "sb_publishable_double";
const ELSEWHERE = "22222222-2222-4222-8222-222222222222";
const base = "http://localhost:" + PORT;

const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" });
const kid = crypto.randomUUID();
const jwk = { ...publicKey.export({ format: "jwk" }), kid, alg: "ES256", use: "sig", key_ops: ["verify"] };

const users = new Map();
function seed(email, { confirmed = true, password = PASSWORD, memberships = [], broken = false, unsendable = false } = {}) {
  const id = crypto.randomUUID();
  users.set(email, { id, email, password, seeded: password, confirmed, memberships, broken, unsendable, lastSent: 0, created: new Date().toISOString() });
}
seed(ACCOUNTS.client, { memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: true }] });
seed(ACCOUNTS.owner, { memberships: [{ role: "owner", client_id: null, is_active: true }] });
seed(ACCOUNTS.elsewhere, { memberships: [{ role: "client", client_id: ELSEWHERE, is_active: true }] });
seed(ACCOUNTS.former, { memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: false }] });
seed(ACCOUNTS.invited, { confirmed: false, password: null, memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: true }] });
seed(ACCOUNTS.unconfirmed, { confirmed: false, memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: true }] });
seed(ACCOUNTS.broken, { broken: true, memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: true }] });
seed(ACCOUNTS.resetter, { memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: true }] });
seed(ACCOUNTS.unsendable, { unsendable: true, memberships: [{ role: "client", client_id: DEMO_CLIENT, is_active: true }] });
const byId = (id) => [...users.values()].find((u) => u.id === id);

const b64url = (b) => Buffer.from(b).toString("base64url");
function sign(user, { exp, sessionId = crypto.randomUUID() } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "ES256", typ: "JWT", kid };
  const payload = {
    iss: base + "/auth/v1",
    sub: user.id,
    aud: "authenticated",
    exp: exp ?? now + 3600,
    iat: now,
    email: user.email,
    phone: "",
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    role: "authenticated",
    aal: "aal1",
    amr: [{ method: "password", timestamp: now }],
    session_id: sessionId,
    is_anonymous: false,
  };
  const input = b64url(JSON.stringify(header)) + "." + b64url(JSON.stringify(payload));
  const sig = crypto.sign("sha256", Buffer.from(input), { key: privateKey, dsaEncoding: "ieee-p1363" });
  return input + "." + b64url(sig);
}
function verify(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  try {
    const ok = crypto.verify("sha256", Buffer.from(parts[0] + "." + parts[1]), { key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(parts[2], "base64url"));
    if (!ok) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function userJson(u) {
  return {
    id: u.id,
    aud: "authenticated",
    role: "authenticated",
    email: u.email,
    email_confirmed_at: u.confirmed ? u.created : null,
    confirmed_at: u.confirmed ? u.created : null,
    phone: "",
    last_sign_in_at: new Date().toISOString(),
    app_metadata: { provider: "email", providers: ["email"] },
    user_metadata: {},
    identities: [],
    created_at: u.created,
    updated_at: new Date().toISOString(),
    is_anonymous: false,
  };
}

const REUSE_MS = 10_000; // Supabase's default refresh token reuse interval
const EMAIL_GAP_MS = 60_000; // and its default minimum between two emails to one address
const refreshTokens = new Map(); // token -> { userId, sessionId, usedAt, child }
function session(u, { sessionId = crypto.randomUUID(), exp, refresh } = {}) {
  if (!refresh) {
    refresh = crypto.randomBytes(16).toString("hex");
    refreshTokens.set(refresh, { userId: u.id, sessionId, usedAt: 0, child: null });
  }
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = exp ?? now + 3600;
  return { access_token: sign(u, { sessionId, exp: expiresAt }), token_type: "bearer", expires_in: expiresAt - now, expires_at: expiresAt, refresh_token: refresh, user: userJson(u) };
}

const codes = new Map(); // auth code -> { userId, challenge, method }
const links = new Map(); // email -> the last recovery link

function send(res, status, body) {
  const json = body === undefined ? "" : JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(json) });
  res.end(json);
}
const fail = (res, status, error_code, msg, extra = {}) => send(res, status, { code: status, error_code, msg, ...extra });
async function bodyOf(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const text = Buffer.concat(chunks).toString();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}
const bearer = (req) => verify((req.headers.authorization || "").replace(/^Bearer\s+/i, ""));

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, base);
  const path = url.pathname;
  const done = (status) => console.log(req.method + " " + path + url.search.slice(0, 60) + " -> " + status);
  try {
    // The test-only routes.
    if (path === "/__double/link") {
      done(200);
      return send(res, 200, { link: links.get(url.searchParams.get("email") || "") || null });
    }
    if (path === "/__double/mint" && req.method === "POST") {
      const { email, exp, session: whole } = await bodyOf(req);
      const u = users.get(email);
      if (!u) return fail(res, 404, "user_not_found", "No such account in the double");
      done(200);
      return send(res, 200, whole ? session(u, { exp }) : { access_token: sign(u, { exp }), user: userJson(u) });
    }
    if (path === "/__double/reset" && req.method === "POST") {
      for (const u of users.values()) {
        u.password = u.seeded;
        u.lastSent = 0;
      }
      codes.clear();
      links.clear();
      done(204);
      res.writeHead(204);
      return res.end();
    }

    // Supabase checks the project key on everything but the key set.
    if (path !== "/auth/v1/.well-known/jwks.json" && req.headers.apikey !== KEY) {
      done(401);
      return fail(res, 401, "no_api_key", "Invalid API key");
    }

    if (path === "/auth/v1/.well-known/jwks.json") {
      done(200);
      return send(res, 200, { keys: [jwk] });
    }

    if (path === "/auth/v1/token" && req.method === "POST") {
      const grant = url.searchParams.get("grant_type");
      const body = await bodyOf(req);
      if (grant === "password") {
        const u = users.get(String(body.email || "").toLowerCase());
        // An invited account has no password until the invitation is taken up.
        if (!u || u.password === null || u.password !== body.password) {
          done(400);
          return fail(res, 400, "invalid_credentials", "Invalid login credentials");
        }
        if (!u.confirmed) {
          done(400);
          return fail(res, 400, "email_not_confirmed", "Email not confirmed");
        }
        done(200);
        return send(res, 200, session(u));
      }
      if (grant === "refresh_token") {
        const known = refreshTokens.get(body.refresh_token);
        const u = known ? byId(known.userId) : null;
        if (!u) {
          done(400);
          return fail(res, 400, "refresh_token_not_found", "Invalid Refresh Token: Refresh Token Not Found");
        }
        if (known.usedAt) {
          // Used again: within the interval, the session it already became;
          // after it, the whole session ends.
          if (Date.now() - known.usedAt < REUSE_MS && known.child && refreshTokens.has(known.child)) {
            done(200);
            return send(res, 200, session(u, { sessionId: known.sessionId, refresh: known.child }));
          }
          for (const [t, v] of refreshTokens) if (v.sessionId === known.sessionId) refreshTokens.delete(t);
          done(400);
          return fail(res, 400, "refresh_token_already_used", "Invalid Refresh Token: Already Used");
        }
        const next = session(u, { sessionId: known.sessionId });
        known.usedAt = Date.now();
        known.child = next.refresh_token;
        done(200);
        return send(res, 200, next);
      }
      if (grant === "pkce") {
        const c = codes.get(body.auth_code);
        codes.delete(body.auth_code);
        const given = String(body.code_verifier || "");
        const expected = c && (c.method === "s256" ? crypto.createHash("sha256").update(given).digest("base64url") : given);
        const u = c && expected === c.challenge ? byId(c.userId) : null;
        if (!u) {
          done(400);
          return fail(res, 400, "flow_state_not_found", "invalid flow state, no valid flow state found");
        }
        done(200);
        return send(res, 200, session(u));
      }
      done(400);
      return fail(res, 400, "unsupported_grant_type", "Unsupported grant type");
    }

    if (path === "/auth/v1/recover" && req.method === "POST") {
      const body = await bodyOf(req);
      const u = users.get(String(body.email || "").toLowerCase());
      if (u?.unsendable) {
        done(400);
        return fail(res, 400, "email_address_not_authorized", "Email address not authorized");
      }
      if (u && Date.now() - u.lastSent < EMAIL_GAP_MS) {
        done(429);
        return fail(res, 429, "over_email_send_rate_limit", "For security purposes, you can only request this after 60 seconds.");
      }
      if (u) {
        u.lastSent = Date.now();
        const code = crypto.randomUUID();
        codes.set(code, { userId: u.id, challenge: body.code_challenge, method: String(body.code_challenge_method || "plain").toLowerCase() });
        const to = url.searchParams.get("redirect_to") || base;
        links.set(u.email, to + (to.includes("?") ? "&" : "?") + "code=" + code);
      }
      done(200);
      return send(res, 200, {});
    }

    if (path === "/auth/v1/user") {
      const claims = bearer(req);
      const u = claims && byId(claims.sub);
      if (!u) {
        done(401);
        return fail(res, 401, "bad_jwt", "invalid JWT: unable to parse or verify signature");
      }
      if (req.method === "PUT") {
        const body = await bodyOf(req);
        if (typeof body.password === "string") {
          if (body.password.length < 6) return fail(res, 422, "weak_password", "Password should be at least 6 characters.", { weak_password: { reasons: ["length"] } });
          if (body.password === u.password) return fail(res, 422, "same_password", "New password should be different from the old password.");
          u.password = body.password;
        }
      }
      done(200);
      return send(res, 200, userJson(u));
    }

    if (path === "/auth/v1/logout" && req.method === "POST") {
      const claims = bearer(req);
      if (claims) {
        const scope = url.searchParams.get("scope") || "global";
        for (const [token, t] of refreshTokens) {
          if (t.userId !== claims.sub) continue;
          if (scope === "global" || (scope === "local" && t.sessionId === claims.session_id) || (scope === "others" && t.sessionId !== claims.session_id)) refreshTokens.delete(token);
        }
      }
      done(204);
      res.writeHead(204);
      return res.end();
    }

    // The database: memberships, under the same rule as the real one (a
    // signed-in person sees their own rows; anyone else, none).
    if (path === "/rest/v1/memberships" && req.method === "GET") {
      const claims = bearer(req);
      const u = claims && byId(claims.sub);
      if (u?.broken) {
        done(503);
        return send(res, 503, { code: "PGRST000", message: "Could not connect to the database" });
      }
      let rows = u ? u.memberships.map((m) => ({ ...m, user_id: u.id, created_at: u.created })) : [];
      for (const [k, v] of url.searchParams) {
        if (["select", "order", "limit", "offset"].includes(k)) continue;
        const m = /^eq\.(.*)$/.exec(v);
        if (!m) continue;
        rows = rows.filter((r) => String(r[k]) === m[1]);
      }
      const cols = (url.searchParams.get("select") || "*").split(",").map((c) => c.trim());
      const out = rows.map((r) => (cols.includes("*") ? r : Object.fromEntries(cols.map((c) => [c, r[c]]))));
      done(200);
      return send(res, 200, out);
    }

    done(404);
    return fail(res, 404, "not_found", "The double does not know " + req.method + " " + path);
  } catch (e) {
    done(500);
    return fail(res, 500, "unexpected_failure", String(e?.message || e));
  }
});

server.listen(PORT, () => console.log("auth double on " + base + " (key " + KEY + ")"));
