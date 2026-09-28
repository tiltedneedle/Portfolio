import { notFound } from "next/navigation";
import type { ClientSystem } from "@/content/clients/types";
import { CLIENT_SLUGS, TEMPLATE_SLUG } from "@/content/clients/slugs";
import { template } from "@/content/clients/template";
import { demo } from "@/content/clients/demo";

/**
 * Every client system this deployment can serve. Add a client by adding a
 * folder and one line here; `npm run check` verifies the shape.
 *
 * The template is what an open door (no PORTAL_SECRET) shows, and what a
 * new client's folder is copied from. It has no access code.
 */
const all: ClientSystem[] = [template, demo];

export const clients: Record<string, ClientSystem> = Object.fromEntries(all.map((c) => [c.identity.slug, c]));

export const clientSlugs = all.map((c) => c.identity.slug);

// The proxy runs at the edge and cannot import this file, so it keeps its
// own copy of the slugs. They have to agree: a client in the registry but
// not in that list can never be let through the door, and one in the list
// but not the registry is rewritten into a tree that does not exist. This
// throws at build time, which is where a mismatch should be found.
if (clientSlugs.length !== CLIENT_SLUGS.length || clientSlugs.some((s) => !(CLIENT_SLUGS as readonly string[]).includes(s))) {
  throw new Error("clients/slugs.ts lists [" + CLIENT_SLUGS.join(", ") + "] but the registry has [" + clientSlugs.join(", ") + "]");
}

/**
 * A client by slug, or undefined.
 *
 * `hasOwn`, not a bare index: `clients` is a plain object, so
 * `clients["constructor"]` is the Object constructor and
 * `clients["toString"]` is a function, both truthy and neither a client.
 * `/login?for=constructor` answered 500 for exactly that reason, which
 * took the door down for anyone following the link.
 */
export function getClient(slug: string): ClientSystem | undefined {
  return Object.hasOwn(clients, slug) ? clients[slug] : undefined;
}

/** For pages: the system, or a 404 for a slug that is not a client. */
export function requireClient(slug: string): ClientSystem {
  const c = getClient(slug);
  if (!c) notFound();
  return c;
}

/**
 * The systems a visitor can actually log into.
 *
 * The demo is behind a flag. Its code is printed in the README, this repo
 * is public, and `accessHash` is a plain sha256 of "tn:<slug>:<code>" with
 * no PORTAL_SECRET mixed in — so rotating the secret ends sessions but
 * does NOT revoke a code. Without this gate, the moment PORTAL_SECRET is
 * set for the first paying client, the demo door opens to anyone who has
 * read the README. Set PORTAL_DEMO=1 in development and in CI, never in
 * production.
 */
export function clientsWithAccess(): ClientSystem[] {
  const demoOpen = process.env.PORTAL_DEMO === "1";
  return all.filter((c) => c.identity.accessHash && (demoOpen || !c.identity.demo));
}

export { TEMPLATE_SLUG };
