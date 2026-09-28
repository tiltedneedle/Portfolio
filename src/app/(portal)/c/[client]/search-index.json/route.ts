import { clientSlugs, requireClient } from "@/content/clients/registry";
import { searchIndex } from "@/lib/search-index";

/**
 * The palette's full-text index, one per client, pre-rendered at build
 * time beside the pages and served through the same door: the proxy
 * rewrites /search-index.json into the tree of whoever is logged in, so
 * the guides' words, and the client's own, never leave the room.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return clientSlugs.map((client) => ({ client }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  // `private` keeps it out of shared caches, and the palette asks for it at
  // a URL carrying the client's own slug, so one client's browser cannot
  // serve another's index back from disk. `no-store` would be safer still
  // but costs every visit a fresh 100 KB; the key is what makes the hour
  // of caching safe.
  return Response.json(searchIndex(sys), { headers: { "Cache-Control": "private, max-age=3600", Vary: "Cookie" } });
}
