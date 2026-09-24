import type { Metadata } from "next";
import { ClientMark } from "@/components/portal/ClientMark";
import { getClient } from "@/content/clients/registry";
import { publicIdentity } from "@/content/clients/types";
import { doorOpen } from "@/lib/session";
import { enter } from "./actions";

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
 */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string; for?: string }> }) {
  const sp = await searchParams;
  const open = doorOpen();
  const error = sp.error ? messages[sp.error] : null;
  const named = sp.for && /^[a-z0-9-]{1,64}$/.test(sp.for) ? getClient(sp.for) : undefined;
  const who = named?.identity.accessHash ? publicIdentity(named.identity) : null;
  return (
    <main className="flex min-h-screen items-center bg-[color:var(--stage)] px-6 py-24 md:px-14">
      <form action={enter} className="w-full max-w-[560px]">
        <input type="hidden" name="next" value={sp.next ?? "/"} />
        {who && <input type="hidden" name="for" value={who.slug} />}
        <p className="mono">Private screening{who && <span className="text-[color:var(--ink-mid)]"> / prepared for {who.name}</span>}</p>
        <div className="mt-8">
          <ClientMark size={44} identity={who} />
        </div>
        <h1 className="display mt-8 text-[clamp(56px,9vw,128px)]">
          Enter the <span className="em-serif">room.</span>
        </h1>
        <label htmlFor="code" className="mono mt-12 block">
          Access code
        </label>
        <input id="code" name="code" type="password" required autoComplete="current-password" autoFocus className={field} />
        {error && (
          <p className="mono mt-3 flex items-center gap-2 text-[color:var(--ink)]" role="alert">
            <span className="lamp" aria-hidden="true" />
            {error}
          </p>
        )}
        {open && <p className="mono mt-3 text-[color:var(--ink-mid)]">No secret is set on this deployment, so the door is open and the template is showing.</p>}
        <button type="submit" className="pill pill-solid mt-8 px-8 py-3.5 text-[15px]">
          Enter
        </button>
        <p className="mono mt-12 max-w-[40ch] leading-relaxed text-[color:var(--ink-mid)]">
          Your access code is in your onboarding email. Lost it? Message your Tilted Needle team.
        </p>
      </form>
    </main>
  );
}
