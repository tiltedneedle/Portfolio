"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PublicIdentity } from "@/content/clients/types";

/**
 * Who is in the room. Provided once by the per-client layout, read by the
 * client components that print the name (nav, footer, slate, cards).
 */
const Ctx = createContext<PublicIdentity | null>(null);

export function ClientProvider({ identity, children }: { identity: PublicIdentity; children: ReactNode }) {
  return <Ctx.Provider value={identity}>{children}</Ctx.Provider>;
}

export function useClient(): PublicIdentity {
  const v = useContext(Ctx);
  if (!v) throw new Error("useClient() called outside a client system");
  return v;
}

/** The same, but tolerant: null outside the door (the login page). */
export function useClientOptional(): PublicIdentity | null {
  return useContext(Ctx);
}
