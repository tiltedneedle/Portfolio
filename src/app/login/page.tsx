import type { Metadata } from "next";
import { ClientMark } from "@/components/portal/ClientMark";
import { DoorBackdrop } from "@/components/room/DoorBackdrop";
import { getClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { doorOpen, safeNext } from "@/lib/session";
import { enter } from "./actions";
import { Rise, delay } from "@/components/portal/Scene";
import { HeroDust } from "@/components/portal/HeroDust";

export const metadata: Metadata = { title: "Enter" };

const field =
  "mt-3 w-full rounded-none border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0 py-3 text-[19px] text-[color:var(--ink)] outline-none transition-colors duration-300 focus:border-[color:var(--ink)]";

const messages: Record<string, string> = {
  code: "That is not an access code we recognise.",
  slow: "Too many tries. Wait ten minutes, then try again.",
};

/**
 * The door: a slate, one field, one button. A client's own link
 * (`/login?for=<slug>`) puts their name on the slate; the code is still
 * what opens it.
 *
 * It opens like every scene inside (Scene.tsx): the slate wipes on, the
 * mark comes up, the title rises word by word, and the field draws its
 * line in as the work behind it comes up out of the dark.
 */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; for?: string }> }) {
  const sp = await searchParams;
  const open = doorOpen();
  // `messages` is a plain object, so messages["__proto__"] is
  // Object.prototype: truthy, and rendering it throws. /login?error=__proto__
  // took the whole door down. Only our own keys count.
  const error = typeof sp.error === "string" && Object.hasOwn(messages, sp.error) ? messages[sp.error] : null;
  const named = sp.for && /^[a-z0-9-]{1,64}$/.test(sp.for) ? getClient(sp.for) : undefined;
  const who = named?.identity.accessHash ? publicIdentity(named.identity) : null;
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[color:var(--stage)] px-6 py-24 md:px-14">
      <DoorBackdrop />
      {/* A private screening: the projector's beam across the room, and the
          dust in it, which a hand through the beam scatters. */}
      <HeroDust />
      <form action={enter} className="relative w-full max-w-[560px]">
        {/* Sanitised here as well as in the action: the field should never
            carry a value we would refuse to redirect to. */}
        <input type="hidden" name="next" value={safeNext(sp.next)} />
        {who && <input type="hidden" name="for" value={who.slug} />}
        <p className="mono scene-slate">Private screening{who && <span className="text-[color:var(--ink-mid)]"> / prepared for {who.name}</span>}</p>
        <div className="scene-up mt-8" style={delay(0.15)}>
          <ClientMark size={44} identity={who} />
        </div>
        <h1 className="display mt-8 text-[clamp(56px,9vw,128px)]">
          <Rise text="Enter the" />{" "}
          <span className="em-serif">
            <Rise text="room." from={2} />
          </span>
        </h1>
        <label htmlFor="code" className="mono scene-up mt-12 block" style={delay(0.5)}>
          Access code
        </label>
        <input id="code" name="code" type="password" required autoComplete="current-password" autoFocus className={field + " door-field"} />
        {error && (
          <p className="mono mt-3 flex items-center gap-2 text-[color:var(--ink)]" role="alert">
            <span className="lamp lamp-live" aria-hidden="true" />
            {error}
          </p>
        )}
        {open && <p className="mono mt-3 text-[color:var(--ink-mid)]">No secret is set on this deployment, so the door is open and the template is showing.</p>}
        <button type="submit" className="pill pill-solid scene-up mt-8 px-8 py-3.5 text-[15px]" style={delay(0.8)}>
          Enter
        </button>
        <p className="mono scene-up mt-12 max-w-[40ch] leading-relaxed text-[color:var(--ink-mid)]" style={delay(0.95)}>
          Your access code is in your onboarding email. Lost it? Message your Tilted Needle team.
        </p>
      </form>
    </main>
  );
}
