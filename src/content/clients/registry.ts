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
if (clientSlugs.join(",") !== [...CLIENT_SLUGS].join(",")) {
  throw new Error("clients/slugs.ts lists [" + CLIENT_SLUGS.join(", ") + "] but the registry has [" + clientSlugs.join(", ") + "]");
}

export function getClient(slug: string): ClientSystem | undefined {
  return clients[slug];
}

/** For pages: the system, or a 404 for a slug that is not a client. */
export function requireClient(slug: string): ClientSystem {
  const c = clients[slug];
  if (!c) notFound();
  return c;
}

/** The systems a visitor can actually log into. */
export function clientsWithAccess(): ClientSystem[] {
  return all.filter((c) => c.identity.accessHash);
}

export { TEMPLATE_SLUG };
