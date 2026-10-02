import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { DoorBackdrop } from "@/components/room/DoorBackdrop";
import { Rise, delay } from "@/components/portal/Scene";
import { supabaseConfig } from "@/lib/auth";
import { AcceptInvitation } from "./AcceptInvitation";

export const metadata: Metadata = { title: "Your invitation" };

const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

/**
 * Where an invitation lands. The Tilted Needle app invites a client's
 * person (Team admin, Clients) and Supabase's email brings them here with
 * a session already begun, so the first thing they see of anything is
 * their own portal: this page for a moment, then choosing a password
 * (/auth/reset), then inside.
 *
 * The session arrives in the address's fragment, which only the browser
 * can read (AcceptInvitation). A project whose emails carry a code or a
 * token hash instead is handed to /auth/confirm, which takes those; a link
 * Supabase refused (expired, already used) comes back with an error, and
 * the door says so.
 */
export default async function AcceptPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Per request, always: see /auth/reset.
  await connection();
  if (!supabaseConfig()) redirect("/");
  const sp = await searchParams;
  const code = one(sp.code);
  const tokenHash = one(sp.token_hash);
  if (code || tokenHash) {
    const q = new URLSearchParams();
    if (code) q.set("code", code);
    if (tokenHash) q.set("token_hash", tokenHash);
    const type = one(sp.type);
    if (type) q.set("type", type);
    redirect("/auth/confirm?" + q.toString());
  }
  if (one(sp.error)) redirect("/login?error=invitation");

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[color:var(--stage)] px-6 py-24 md:px-14 md:py-20">
      <DoorBackdrop />
      <div className="relative w-full max-w-[560px]">
        <p className="mono scene-slate">Private screening</p>
        <h1 className="display mt-8 text-[clamp(56px,min(9vw,12svh),128px)]">
          <Rise text="Your" />{" "}
          <span className="em-serif">
            <Rise text="invitation." from={1} />
          </span>
        </h1>
        <p className="mono scene-up mt-12 flex items-center gap-2 text-[color:var(--ink)]" style={delay(0.5)} role="status">
          <span className="lamp lamp-live" aria-hidden="true" />
          Opening it. Next you choose your password.
        </p>
        <p className="mono scene-up mt-6 max-w-[44ch] leading-relaxed text-[color:var(--ink-mid)]" style={delay(0.8)}>
          If nothing happens, ask your Tilted Needle team to send the invitation again.
        </p>
        <noscript>
          <p className="mono mt-6 max-w-[44ch] leading-relaxed text-[color:var(--ink)]">This link needs JavaScript to open. Turn it on and open the link from your email again.</p>
        </noscript>
        <AcceptInvitation />
      </div>
    </main>
  );
}
