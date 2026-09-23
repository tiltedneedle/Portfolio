import { notFound } from "next/navigation";
import type { ClientSystem } from "@/content/clients/types";
import { TEMPLATE_SLUG } from "@/content/clients/slugs";
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
