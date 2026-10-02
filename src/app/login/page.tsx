import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ClientMark } from "@/components/portal/ClientMark";
import { DoorBackdrop } from "@/components/room/DoorBackdrop";
import { getClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { doorOpen, portalAccess, supabaseConfig } from "@/lib/auth";
import { safeNext } from "@/lib/safe-next";
import { supabaseForPage } from "@/lib/supabase-server";
import { Rise, delay } from "@/components/portal/Scene";
import { HeroDust } from "@/components/portal/HeroDust";

export const metadata: Metadata = { title: "Enter" };

const field =
  "mt-3 w-full rounded-none border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0 py-3 text-[19px] text-[color:var(--ink)] outline-none transition-colors duration-300 focus:border-[color:var(--ink)]";

const messages: Record<string, string> = {
  credentials: "That email and password do not match an account.",
  slow: "Too many tries. Wait ten minutes, then try again.",
  account: "This account has no portal here. Sign in with the email your Tilted Needle team invited.",
  invite: "Finish setting up your account first: choose your password from your invitation email.",
  link: "That link has expired, been used, or was opened in another browser. Ask for a new one here.",
  unavailable: "Your account could not be checked just now. Try again in a minute.",
  email: "Enter the email address your account uses.",
  wait: "Too many emails just now. If you asked a moment ago, check your inbox; otherwise try again in a few minutes.",
  unsent: "The link could not be sent just now. Try again in a few minutes, or ask your Tilted Needle team.",
};

const notices: Record<string, string> = {
  sent: "If that address has an account, a link to choose a new password is on its way. Open it in this browser.",
  changed: "Your password has been changed.",
};

/** Only our own keys count: these are plain objects, so a hostile ?error=__proto__ would find Object.prototype, render it and throw. */
function pick(table: Record<string, string>, key: unknown) {
  return typeof key === "string" && Object.hasOwn(table, key) ? table[key] : null;
}

/**
 * The door: a slate, two fields, one button. People sign in with their
 * Tilted Needle account (lib/auth.ts); a client's own link
 * (`/login?for=<slug>`) puts their name on the slate. A second state of the
 * same page asks for an email and sends a link to choose a new password.
 *
 * It opens like every scene inside (Scene.tsx): the slate wipes on, the
 * mark comes up, the title rises word by word, and the fields draw their
 * lines in as the work behind it comes up out of the dark.
 */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; notice?: string; next?: string; for?: string; forgot?: string }> }) {
  const sp = await searchParams;
  const open = doorOpen();
  const error = pick(messages, sp.error);
  const notice = pick(notices, sp.notice);
  // A spent link is answered by the form that asks for a new one.
  const forgot = sp.forgot === "1" || sp.error === "link";
  const named = sp.for && /^[a-z0-9-]{1,64}$/.test(sp.for) ? getClient(sp.for) : undefined;
  const who = named?.identity.opsClientId ? publicIdentity(named.identity) : null;
  const next = safeNext(sp.next);

  // Someone already in goes straight on: the link a client is sent is this
  // page, and they will open it again long after they first signed in. Only
  // the plain door does this. One that has something to say (an error, a
  // notice, the forgotten-password form) says it, which is also what keeps
  // an account with no portal here from being sent round in circles.
  const config = supabaseConfig();
  if (config && !sp.error && !sp.notice && !forgot) {
    const supabase = await supabaseForPage(config);
    const { data } = await supabase.auth.getClaims();
    const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
    if (userId && (await portalAccess(supabase, userId)).slug) redirect(next);
  }

  // The other state of this page, keeping where the visitor was going and whose link it was.
  const other = new URLSearchParams();
  if (!forgot) other.set("forgot", "1");
  if (next !== "/") other.set("next", next);
  if (who) other.set("for", who.slug);
  const otherHref = "/login" + (other.size ? "?" + other.toString() : "");

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[color:var(--stage)] px-6 py-24 md:px-14 md:py-20">
      <DoorBackdrop />
      {/* A private screening: the projector's beam across the room, and the
          dust in it, which a hand through the beam scatters. */}
      <HeroDust />
      <form method="post" action={forgot ? "/auth/forgot" : "/auth/sign-in"} className="relative w-full max-w-[560px]">
        {/* Sanitised here as well as in the route: the field should never
            carry a value we would refuse to redirect to. */}
        <input type="hidden" name="next" value={next} />
        {who && <input type="hidden" name="for" value={who.slug} />}
        <p className="mono scene-slate">Private screening{who && <span className="text-[color:var(--ink-mid)]"> / prepared for {who.name}</span>}</p>
        <div className="scene-up mt-8" style={delay(0.15)}>
          <ClientMark size={44} identity={who} />
        </div>
        <h1 className="display mt-8 text-[clamp(56px,min(9vw,12svh),128px)]">
          {forgot ? (
            <>
              <Rise text="A new" />{" "}
              <span className="em-serif">
                <Rise text="password." from={2} />
              </span>
            </>
          ) : (
            <>
              <Rise text="Enter the" />{" "}
              <span className="em-serif">
                <Rise text="room." from={2} />
              </span>
            </>
          )}
        </h1>
        {notice && (
          <p className="mono mt-10 flex items-center gap-2 text-[color:var(--ink)]" role="status">
            <span className="lamp" aria-hidden="true" />
            {notice}
          </p>
        )}
        <label htmlFor="email" className="mono scene-up mt-12 block" style={delay(0.5)}>
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" autoFocus={!notice} spellCheck={false} className={field + " door-field"} />
        {!forgot && (
          <>
            <label htmlFor="password" className="mono scene-up mt-8 block" style={delay(0.6)}>
              Password
            </label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className={field + " door-field"} />
          </>
        )}
        {error && (
          <p className="mono mt-3 flex items-center gap-2 text-[color:var(--ink)]" role="alert">
            <span className="lamp lamp-live" aria-hidden="true" />
            {error}
          </p>
        )}
        {open && <p className="mono mt-3 text-[color:var(--ink-mid)]">No accounts are connected to this deployment, so the door is open and the template is showing.</p>}
        <div className="scene-up mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" style={delay(0.8)}>
          <button type="submit" className="pill pill-solid px-8 py-3.5 text-[15px]">
            {forgot ? "Send the link" : "Enter"}
          </button>
          <a href={otherHref} className="slate-link">
            {forgot ? "Back to sign in" : "Forgot your password?"}
          </a>
        </div>
        <p className="mono scene-up mt-12 max-w-[44ch] leading-relaxed text-[color:var(--ink-mid)]" style={delay(0.95)}>
          {forgot
            ? "The link lets you choose a new password for your Tilted Needle account. It works once, in this browser."
            : "Use the email and password of your Tilted Needle account. New here? Choose your password from your invitation email first."}
        </p>
      </form>
    </main>
  );
}
