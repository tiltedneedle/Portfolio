import type { Metadata } from "next";
import { ClientMark } from "@/components/portal/ClientMark";
import { client } from "@/content/client/client";
import { enter } from "./actions";

export const metadata: Metadata = { title: "Enter" };

const field =
  "mt-3 w-full rounded-none border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0 py-3 text-[19px] text-[color:var(--ink)] outline-none transition-colors duration-300 focus:border-[color:var(--ink)]";

/** The door: a slate, one field, one button. */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const sp = await searchParams;
  const gated = !!process.env.PORTAL_PASSWORD;
  return (
    <main className="flex min-h-screen items-center bg-[color:var(--stage)] px-6 py-24 md:px-14">
      <form action={enter} className="w-full max-w-[560px]">
        <input type="hidden" name="next" value={sp.next ?? "/"} />
        <p className="mono">Private screening</p>
        <div className="mt-8">
          <ClientMark size={48} />
        </div>
        <h1 className="display mt-8 text-[clamp(56px,9vw,128px)]">
          Enter the <span className="em-serif">room.</span>
        </h1>
        <label htmlFor="password" className="mono mt-12 block">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" autoFocus className={field} />
        {sp.error && (
          <p className="mono mt-3 flex items-center gap-2 text-[color:var(--ink)]" role="alert">
            <span className="lamp" aria-hidden="true" />
            That is not the password.
          </p>
        )}
        {!gated && (
          <p className="mono mt-3 text-[color:var(--ink-faint)]">No password is set on this deployment, so the door is open.</p>
        )}
        <button type="submit" className="pill pill-solid mt-8 px-8 py-3.5 text-[15px]">
          Enter
        </button>
        <p className="mono mt-12 max-w-[40ch] leading-relaxed text-[color:var(--ink-faint)]">
          Your password is in your onboarding email. Lost it? Message {client.contact}.
        </p>
      </form>
    </main>
  );
}
