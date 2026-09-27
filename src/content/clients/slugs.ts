/**
 * The slugs the proxy needs, kept apart from the registry so the edge
 * bundle never carries every client's content.
 *
 * This list and the registry must agree. They are asserted equal in
 * registry.ts, which runs on the server where both are available, and in
 * `npm run check`, so adding a client in one place and not the other is a
 * build failure rather than a client locked out of their own portal.
 */
export const TEMPLATE_SLUG = "template";

export const CLIENT_SLUGS = ["template", "demo"] as const;

export function isClientSlug(slug: string): boolean {
  return (CLIENT_SLUGS as readonly string[]).includes(slug);
}
