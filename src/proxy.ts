import { NextResponse, type NextRequest } from "next/server";
import { PRESENCE, portalAccess, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { TEMPLATE_SLUG } from "@/content/clients/slugs";
import { cleanPath, isRoomPath, roomPath } from "@/lib/room-paths";

/**
 * Every clean URL is served from one client's pre-rendered tree.
 *
 *   /audit/hooks  ->  /c/<slug>/audit/hooks
 *
 * The slug is the signed-in person's: their Tilted Needle account's client
 * membership names it (lib/auth.ts). With no Supabase configured it is the
 * template (the open door). Anyone else is sent to the door: no session, a
 * session whose token does not verify, or a perfectly good account with no
 * portal here (staff, a client this deployment does not carry, a
 * membership switched off). That last goes with ?error=account, so the door
 * can say why instead of asking again for what they just gave it.
 *
 * The session is refreshed here as it nears its end, and whatever Supabase
 * writes is carried onto the response, whichever it turns out to be.
 *
 * The internal tree is never addressed directly: a request to /c/... is
 * bounced back to the clean path, so no one can reach another client's
 * pages by guessing a slug.
 */
export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (isRoomPath(path)) {
    url.pathname = cleanPath(path);
    return NextResponse.redirect(url);
  }

  const config = supabaseConfig();
  if (!config) {
    url.pathname = roomPath(path, TEMPLATE_SLUG);
    return NextResponse.rewrite(url);
  }

  const { supabase, carry } = supabaseFor(request, config);
  // getClaims verifies the token's signature (against the project's public
  // keys, without a round trip once they are cached); getSession alone
  // would trust whatever the cookie says.
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  const access = userId ? await portalAccess(supabase, userId) : null;

  if (access === null || access.slug === null) {
    const wanted = path + url.search;
    const params = new URLSearchParams();
    if (wanted !== "/") params.set("next", wanted);
    const reason = access === null ? null : access.reason;
    if (reason === "none") params.set("error", "account");
    if (reason === "error") params.set("error", "unavailable");
    url.pathname = "/login";
    url.search = params.size ? "?" + params.toString() : "";
    const res = NextResponse.redirect(url);
    // The footer's "someone is in" flag goes with the session it stood for.
    if (!userId && request.cookies.has(PRESENCE)) res.cookies.delete(PRESENCE);
    return carry(res);
  }

  url.pathname = roomPath(path, access.slug);
  return carry(NextResponse.rewrite(url, { request: { headers: request.headers } }));
}

export const config = {
  matcher: [
    // Static files under public/ are served as they are, never rewritten into
    // a client's tree: a folder missing here answers 404 for everything in it
    // (guides/ did, the day the brief's first figure arrived). The door and
    // the auth routes (/login, /auth/...) take care of themselves.
    "/((?!login|auth/|_next/static|_next/image|favicon.ico|white-logo.png|black-logo.png|logos/|clips/|client/|guides/|manifest.webmanifest|robots.txt|opengraph-image).*)",
  ],
};
