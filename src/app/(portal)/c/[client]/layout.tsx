import type { Metadata } from "next";
import { Suspense } from "react";
import { ClientProvider } from "@/components/portal/ClientContext";
import { PortalNav } from "@/components/portal/PortalNav";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { Palette } from "@/components/portal/Palette";
import { paletteIndex } from "@/components/portal/palette-index";
import { clientSlugs, requireClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { changes } from "@/content/system/changes";
import { allRooms, writtenPages } from "@/lib/rooms";
import { sequence } from "@/lib/sequence";
import { LockedModal } from "@/components/portal/LockedModal";
import { personalised } from "@/content/system/personalised";
import { home } from "@/content/system/home";
import { shortName } from "@/content/clients/types";

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
  // Every room in the system. A personalised room the studio has not written
  // yet is shown locked, so the client can see the whole shape of what they
  // have; its door opens the commission, which says how it gets written.
  const rooms = allRooms(sys);
  // The parts still to be written for this client, for the commission. A
  // client with all four written has nothing locked and no modal at all.
  const written = writtenPages(sys);
  const locked = personalised.parts
    .filter((p) => !written.has(p.href))
    .map((p) => {
      const card = home.access.find((a) => a.href === p.href);
      return { n: p.n, anchor: p.anchor, title: card?.title ?? "", text: card?.text ?? "" };
    });
  // The whole system as one measured reel, for the conform at the foot of every page.
  const clips = sequence(sys);
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
      {/* The footer hydrates after the page, at low priority (see the home
          page): it is never on screen as a page opens, and a click on it
          before then is not lost -- React hydrates what was clicked first
          and replays it. The palette and the locked-room card stay in the
          first pass: the menu and the rooms open them by events, which
          would find nothing listening. */}
      <Suspense>
        <PortalFooter rooms={rooms} clips={clips} />
      </Suspense>
      <Palette items={index} />
      {locked.length > 0 && (
        <LockedModal
          parts={locked}
          needs={personalised.needs}
          ask={personalised.ask}
          contact={sys.identity.contact}
          lead={personalised.lead(shortName(sys.identity))}
          kicker={personalised.kicker}
        />
      )}
    </ClientProvider>
  );
}
