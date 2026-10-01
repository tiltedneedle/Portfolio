/**
 * What the proxy needs to know about clients, kept apart from the registry
 * so its bundle never carries every client's content: the slugs, and which
 * client in the Tilted Needle app each one is.
 *
 * Both must agree with the registry. They are asserted equal in
 * registry.ts, which runs on the server where both are available, and in
 * `npm run check`, so adding a client in one place and not the other is a
 * build failure rather than a client locked out of their own portal.
 */
export const TEMPLATE_SLUG = "template";

export const CLIENT_SLUGS = ["template", "demo"] as const;

/**
 * The demo's id in the Tilted Needle app. Fictional, like the demo: no row
 * in that app has it, so no real account can reach the demo. The test
 * double (scripts/auth-double.mjs) gives its demo account this client.
 */
export const DEMO_OPS_CLIENT_ID = "00000000-0000-4000-8000-00000000de00";

/**
 * Each client's id in the Tilted Needle app, by slug. A signed-in person's
 * client membership names one of these, and that is the portal they see.
 * The template has none: nobody signs in to it.
 */
export const OPS_CLIENT_IDS: Readonly<Record<string, string>> = {
  demo: DEMO_OPS_CLIENT_ID,
};

export function isClientSlug(slug: string): boolean {
  return (CLIENT_SLUGS as readonly string[]).includes(slug);
}

/** The slug of the client with this id in the Tilted Needle app, or null. */
export function slugForOpsClient(id: unknown): string | null {
  if (typeof id !== "string" || !id) return null;
  const want = id.toLowerCase();
  for (const [slug, opsId] of Object.entries(OPS_CLIENT_IDS)) if (opsId.toLowerCase() === want && isClientSlug(slug)) return slug;
  return null;
}
