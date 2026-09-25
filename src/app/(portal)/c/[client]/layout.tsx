import type { Metadata } from "next";
import { ClientProvider } from "@/components/portal/ClientContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { Palette } from "@/components/portal/Palette";
import { paletteIndex } from "@/components/portal/palette-index";
import { clientSlugs, requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { changes } from "@/content/system/changes";
import { liveChapters } from "@/lib/rooms";

/**
 * One tree per client, pre-rendered. The proxy rewrites every clean URL
 * into the tree of whoever is logged in, so nothing under here is ever
 * addressed by its /c/ path from outside.
 */
// Unknown clients, numbers and slugs are routed 404s: nothing renders. (A
// segment-level not-found.tsx cannot help here: for a path outside
// generateStaticParams Next serves the site's 404 whatever the page throws, so
// the room's own 404 would only ever exist as dead code.)
export const dynamicParams = false;

export function generateStaticParams() {
  return clientSlugs.map((client) => ({ client }));
}

export async function generateMetadata({ params }: { params: Promise<{ client: string }> }): Promise<Metadata> {
  const { client } = await params;
  const sys = requireClient(client);
  const name = sys.identity.name + " × Tilted Needle";
  return { title: { absolute: name, template: "%s · " + name } };
}

export default async function ClientLayout({ children, params }: { children: React.ReactNode; params: Promise<{ client: string }> }) {
  const { client } = await params;
  const sys = requireClient(client);
  // The rooms this client has: a personalised room appears when the studio
  // has written a page in it, and until then it is nowhere on the website.
  const rooms = liveChapters(sys);
  // The palette's index carries this client's written ideas and scripts as hidden, searchable entries.
  const index = paletteIndex(sys);
  // The newest addition, the system's or this client's own, for the nav's lamp.
  const latest = [changes[0]?.date, sys.changes?.[0]?.date].filter((d): d is string => !!d).sort().pop();
  return (
    <ClientProvider identity={publicIdentity(sys.identity)}>
      <a href="#main" className="skip">
        Skip to content
      </a>
      <PortalNav latest={latest} rooms={rooms} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <PortalFooter rooms={rooms} />
      <Palette items={index} />
    </ClientProvider>
  );
}
