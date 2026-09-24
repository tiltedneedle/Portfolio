import { clientSlugs, requireClient } from "@/content/clients/registry";
import { searchIndex } from "@/lib/search-index";

/**
 * The palette's full-text index, one per client, pre-rendered at build
 * time beside the pages and served through the same door: the proxy
 * rewrites /search-index.json into the tree of whoever is logged in, so
 * the guides' words never leave the room.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return clientSlugs.map((client) => ({ client }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  return Response.json(searchIndex(sys.notes), { headers: { "Cache-Control": "private, max-age=3600" } });
}
