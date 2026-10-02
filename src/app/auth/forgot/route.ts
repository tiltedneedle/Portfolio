import type { NextRequest } from "next/server";
import { blocked, clientIp, hit, sameOrigin, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { doorFields, forbidden, formOf, toDoor } from "@/lib/door-routes";

/**
 * "Forgot your password?" Supabase emails a link back to /auth/confirm,
 * which opens /auth/reset to choose a new one. The link only works in this
 * browser (it carries half of a PKCE pair whose other half is the cookie
 * set here), which /auth/confirm explains when it is opened anywhere else.
 *
 * The address it comes back to is exactly /auth/confirm, with no query of
 * its own: Supabase checks it against the project's list of allowed
 * redirect URLs as a whole string, so a "?next=" on the end would stop it
 * matching the entry the README asks for, and the link would land on the
 * Tilted Needle app instead.
 *
 * For an address with no account Supabase says nothing and sends nothing,
 * and neither does this form. When an email could not be sent, the form
 * says so: a client waiting for a link that is not coming is stuck, and
 * keeping quiet would hide nothing, since Supabase's own endpoint gives the
 * same answer to anyone holding the project's public key.
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return forbidden();
  const form = await formOf(request);
  const { next, who } = doorFields(form);
  const config = supabaseConfig();
  if (!config) return toDoor(request, { next, who });

  const email = String(form?.get("email") ?? "").trim();
  const asks = "forgot:" + clientIp(request.headers);
  if (blocked(asks)) return toDoor(request, { error: "slow", forgot: true, next, who });
  hit(asks);
  if (!email || email.length > 320 || !email.includes("@")) return toDoor(request, { error: "email", forgot: true, next, who });

  const { supabase, carry } = supabaseFor(request, config);
  // This site as the browser knows it: the form's own Origin, which
  // sameOrigin has just checked is ours.
  const site = request.headers.get("origin") || new URL(request.url).origin;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: site + "/auth/confirm" });
  if (error) {
    // For the logs: the reason, never the address.
    console.error("portal: a reset email was not sent (" + (error.code || error.status || "unknown") + ")");
    const tooSoon = error.status === 429 || error.code === "over_email_send_rate_limit";
    // Answered WITHOUT this request's cookies. Supabase's client makes a new
    // key pair before it asks, and keeps the browser's half in a cookie; a
    // request that then fails would replace the half belonging to the link
    // already sent. Someone who asked twice in a minute (the second is
    // refused) then found their one emailed link "opened in another
    // browser". The link in their inbox goes with the cookie they have.
    return toDoor(request, { error: tooSoon ? "wait" : "unsent", forgot: true, next, who });
  }
  return carry(toDoor(request, { notice: "sent", next, who }));
}
