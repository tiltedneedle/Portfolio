import { notFound } from "next/navigation";
import type { ClientSystem } from "@/content/clients/types";
import { CLIENT_SLUGS, OPS_CLIENT_IDS, TEMPLATE_SLUG } from "@/content/clients/slugs";
import { template } from "@/content/clients/template";
import { demo } from "@/content/clients/demo";

/**
 * Every client system this deployment can serve. Add a client by adding a
 * folder and one line here; `npm run check` verifies the shape.
 *
 * The template is what an open door (no Supabase configured) shows, and
 * what a new client's folder is copied from. Nobody signs in to it.
 */
const all: ClientSystem[] = [template, demo];

export const clients: Record<string, ClientSystem> = Object.fromEntries(all.map((c) => [c.identity.slug, c]));

export const clientSlugs = all.map((c) => c.identity.slug);

// The proxy cannot import this file (its bundle would carry every client's
// content), so it keeps its own copy of the slugs and of each client's id in
// the Tilted Needle app. They have to agree: a client in the registry but
// not in that list can never be let through the door, one in the list but
// not the registry is rewritten into a tree that does not exist, and an id
// that differs sends a client's people to the door, or to someone else's
// portal. This throws at build time, which is where a mismatch should be
// found.
if (clientSlugs.length !== CLIENT_SLUGS.length || clientSlugs.some((s) => !(CLIENT_SLUGS as readonly string[]).includes(s))) {
  throw new Error("clients/slugs.ts lists [" + CLIENT_SLUGS.join(", ") + "] but the registry has [" + clientSlugs.join(", ") + "]");
}
for (const c of all) {
  const listed = Object.hasOwn(OPS_CLIENT_IDS, c.identity.slug) ? OPS_CLIENT_IDS[c.identity.slug] : "";
  if (listed !== c.identity.opsClientId) {
    throw new Error("clients/slugs.ts gives " + c.identity.slug + " the Tilted Needle id " + JSON.stringify(listed) + " but its folder says " + JSON.stringify(c.identity.opsClientId));
  }
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

export { TEMPLATE_SLUG };
