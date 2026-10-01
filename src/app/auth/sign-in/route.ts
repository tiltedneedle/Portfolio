import type { NextRequest } from "next/server";
import { PRESENCE, blocked, clientIp, forgetAccess, hit, isHttps, portalAccess, presenceOptions, sameOrigin, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { doorFields, forbidden, formOf, onward, toDoor } from "@/lib/door-routes";

/**
 * Signing in. The door's form posts here: an email and a password, checked
 * by Supabase against the person's Tilted Needle account, then the
 * account's client membership decides whether there is a portal to enter.
 * A good password for an account with no portal here signs nobody in: the
 * session it began is ended on the spot (this browser's only), so it is
 * never left lying in a cookie.
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return forbidden();
  const form = await formOf(request);
  const { next, who } = doorFields(form);
  const config = supabaseConfig();
  if (!config) return onward(request, next);

  const email = String(form?.get("email") ?? "").trim();
  const password = String(form?.get("password") ?? "");
  const guesses = "sign-in:" + clientIp(request.headers);
  if (blocked(guesses)) return toDoor(request, { error: "slow", next, who });
  if (!email || !password || email.length > 320 || password.length > 1000) return toDoor(request, { error: "credentials", next, who });

  const { supabase, carry } = supabaseFor(request, config);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    // Invited, but the password was never chosen from the invitation.
    if (error?.code === "email_not_confirmed") return carry(toDoor(request, { error: "invite", next, who }));
    if (error?.status === 429 || error?.code === "over_request_rate_limit") return carry(toDoor(request, { error: "slow", next, who }));
    // A wrong password is counted, and costs a moment, so guessing stays
    // slow even where the count does not persist between requests.
    hit(guesses);
    await new Promise((r) => setTimeout(r, 400));
    return carry(toDoor(request, { error: "credentials", next, who }));
  }

  forgetAccess(data.user.id);
  const access = await portalAccess(supabase, data.user.id, { fresh: true });
  if (access.slug === null) {
    await supabase.auth.signOut({ scope: "local" });
    return carry(toDoor(request, { error: access.reason === "error" ? "unavailable" : "account", next, who }));
  }

  const res = onward(request, next);
  res.cookies.set(PRESENCE, "1", presenceOptions(isHttps(request)));
  return carry(res);
}
