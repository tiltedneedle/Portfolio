// The test double's accounts (scripts/auth-double.mjs), and signing in with
// one, for the scripts that need to be inside: smoke, links, door, a11y,
// safari. None of these exists anywhere but the double.

export const PASSWORD = "horizon-portal-2026";

/** The demo's id in the Tilted Needle app, as src/content/clients/slugs.ts has it. */
export const DEMO_CLIENT = "00000000-0000-4000-8000-00000000de00";

export const ACCOUNTS = {
  /** A client of the demo: gets in. */
  client: "client@horizon.test",
  /** Staff, no client: turned away. */
  owner: "owner@studio.test",
  /** A client this portal does not carry: turned away. */
  elsewhere: "elsewhere@client.test",
  /** The demo's client, membership switched off: turned away. */
  former: "former@horizon.test",
  /** Invited, invitation never taken up: no password yet. */
  invited: "invited@horizon.test",
  /** Invited to the demo's client, kept for the invitation round trip, so `invited` stays as it began. */
  newcomer: "newcomer@horizon.test",
  /** Has a password, but the address was never confirmed. */
  unconfirmed: "unconfirmed@horizon.test",
  /** Their membership lookup fails. */
  broken: "broken@horizon.test",
  /** The demo's client, kept for the forgotten-password round trip, so nobody else's password changes. */
  resetter: "resetter@horizon.test",
  /** The demo's client, whose reset email cannot be sent. */
  unsendable: "unsendable@horizon.test",
};

/** Every Set-Cookie of a response, as name=value pairs (attributes dropped). */
export function cookiePairs(res) {
  const all = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  return all.map((c) => c.split(";")[0]);
}

/**
 * Signs in through the portal's own form handler, as a browser would, and
 * returns the Cookie header the session came back as, and where the door
 * sent us. Every body is read (see smoke.mjs).
 */
export async function signIn(base, email = ACCOUNTS.client, password = PASSWORD, next = "/", headers = {}) {
  const res = await fetch(base + "/auth/sign-in", {
    method: "POST",
    redirect: "manual",
    headers: { origin: new URL(base).origin, "content-type": "application/x-www-form-urlencoded", connection: "close", ...headers },
    body: new URLSearchParams({ email, password, next }).toString(),
  });
  await res.text();
  const jar = new Map();
  for (const pair of cookiePairs(res)) {
    const at = pair.indexOf("=");
    const name = pair.slice(0, at);
    const value = pair.slice(at + 1);
    if (value) jar.set(name, value);
    else jar.delete(name);
  }
  return {
    status: res.status,
    location: (res.headers.get("location") || "").replace(new URL(base).origin, ""),
    cookie: [...jar].map(([k, v]) => k + "=" + v).join("; "),
  };
}
