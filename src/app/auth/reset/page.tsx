import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DoorBackdrop } from "@/components/room/DoorBackdrop";
import { ClientMark } from "@/components/portal/ClientMark";
import { Rise, delay } from "@/components/portal/Scene";
import { HeroDust } from "@/components/portal/HeroDust";
import { supabaseConfig } from "@/lib/auth";
import { supabaseForPage } from "@/lib/supabase-server";

export const metadata: Metadata = { title: "Choose a password" };

const field =
  "mt-3 w-full rounded-none border-0 border-b border-[color:var(--rule-strong)] bg-transparent px-0 py-3 text-[19px] text-[color:var(--ink)] outline-none transition-colors duration-300 focus:border-[color:var(--ink)]";

const messages: Record<string, string> = {
  short: "Use at least eight characters.",
  long: "That is longer than a password can be. Use a shorter one.",
  match: "The two passwords are not the same.",
  same: "That is the password you have now. Choose a new one.",
  weak: "That password is too easy to guess. Choose a stronger one.",
  unavailable: "The password could not be changed just now. Try again in a minute.",
};

/**
 * Choosing a new password, after an emailed link (/auth/confirm) began a
 * session. Without one there is nothing to change, so the door explains.
 * Posts to /auth/password.
 */
export default async function ResetPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  // Rendered per request, always. Without this the build ran the page once,
  // with no Supabase settings, met the redirect below before anything that
  // reads the request, and kept that redirect as the page for good.
  await connection();
  const config = supabaseConfig();
  if (!config) redirect("/");
  const supabase = await supabaseForPage(config);
  const { data } = await supabase.auth.getClaims();
  if (typeof data?.claims?.sub !== "string") redirect("/login?error=link");
  const sp = await searchParams;
  const error = typeof sp.error === "string" && Object.hasOwn(messages, sp.error) ? messages[sp.error] : null;
  const email = typeof data.claims.email === "string" ? data.claims.email : "";

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[color:var(--stage)] px-6 py-24 md:px-14 md:py-20">
      <DoorBackdrop />
      <HeroDust />
      <form method="post" action="/auth/password" className="relative w-full max-w-[560px]">
        <p className="mono scene-slate">Private screening{email && <span className="text-[color:var(--ink-mid)]"> / {email}</span>}</p>
        <div className="scene-up mt-8" style={delay(0.15)}>
          <ClientMark size={44} identity={null} />
        </div>
        <h1 className="display mt-8 text-[clamp(56px,min(9vw,12svh),128px)]">
          <Rise text="Choose a" />{" "}
          <span className="em-serif">
            <Rise text="password." from={2} />
          </span>
        </h1>
        {/* For password managers: the account this password belongs to. */}
        <input type="email" name="username" value={email} autoComplete="username" readOnly hidden />
        <label htmlFor="password" className="mono scene-up mt-12 block" style={delay(0.5)}>
          New password
        </label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" autoFocus className={field + " door-field"} />
        <label htmlFor="confirm" className="mono scene-up mt-8 block" style={delay(0.6)}>
          The same again
        </label>
        <input id="confirm" name="confirm" type="password" required minLength={8} autoComplete="new-password" className={field + " door-field"} />
        {error && (
          <p className="mono mt-3 flex items-center gap-2 text-[color:var(--ink)]" role="alert">
            <span className="lamp lamp-live" aria-hidden="true" />
            {error}
          </p>
        )}
        <button type="submit" className="pill pill-solid scene-up mt-8 px-8 py-3.5 text-[15px]" style={delay(0.8)}>
          Set password
        </button>
        <p className="mono scene-up mt-12 max-w-[44ch] leading-relaxed text-[color:var(--ink-mid)]" style={delay(0.95)}>
          This is your Tilted Needle password: the same account opens the Tilted Needle app.
        </p>
      </form>
    </main>
  );
}
