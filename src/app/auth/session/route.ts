import type { NextRequest } from "next/server";
import { blocked, clientIp, hit, sameOrigin, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { forbidden, formOf, onward, toDoor } from "@/lib/door-routes";

/** An access token is a signed token of a kilobyte or two; nothing real is near this. */
const MAX_CHARS = 8192;

/**
 * The session an invitation link began, handed over by /auth/accept (the
 * only page that can read it out of the address). It is checked with
 * Supabase before it is believed: a made-up or expired pair opens nothing.
 * A good one is kept the way every session here is (httpOnly cookies), and
 * the person goes on to choose their password.
 *
 * It decides nothing about the portal: /auth/password looks up the
 * account's client once the password is set, as signing in does.
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return forbidden();
  const config = supabaseConfig();
  if (!config) return onward(request, "/");
  const form = await formOf(request);
  const access_token = String(form?.get("access_token") ?? "");
  const refresh_token = String(form?.get("refresh_token") ?? "");
  const tries = "session:" + clientIp(request.headers);
  if (blocked(tries)) return toDoor(request, { error: "slow" });
  if (!access_token || !refresh_token || access_token.length > MAX_CHARS || refresh_token.length > MAX_CHARS) return toDoor(request, { error: "invitation" });

  const { supabase, carry } = supabaseFor(request, config);
  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  if (error || !data.session) {
    hit(tries);
    // Answered without anything the failed attempt wrote: someone already
    // signed in here keeps their session, whatever was posted at them.
    return toDoor(request, { error: "invitation" });
  }
  return carry(onward(request, "/auth/reset"));
}
