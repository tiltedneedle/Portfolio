import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, PRESENCE, portalSecret, verify } from "@/lib/session";
import { TEMPLATE_SLUG, isClientSlug } from "@/content/clients/slugs";
import { cleanPath, isRoomPath, roomPath } from "@/lib/room-paths";

/**
 * Every clean URL is served from one client's pre-rendered tree.
 *
 *   /audit/hooks  ->  /c/<slug>/audit/hooks
 *
 * The slug comes from the signed session cookie, or is the template when
 * the door is open (no PORTAL_SECRET). A visitor with no valid session is
 * sent to the door, and so is one holding a perfectly valid cookie for a
 * client who has since been taken off the registry: the tree they would be
 * rewritten into no longer exists, and `dynamicParams = false` would serve
 * them the site's own 404 for every path including the front page, with no
 * nav and no way back to the door, for as long as their cookie lasts.
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

  const secret = portalSecret();
  let slug: string | null = TEMPLATE_SLUG;
  if (secret) {
    slug = await verify(secret, request.cookies.get(COOKIE)?.value);
    if (slug && !isClientSlug(slug)) slug = null;
    if (!slug) {
      const wanted = path + url.search;
      url.pathname = "/login";
      url.search = wanted === "/" ? "" : "?next=" + encodeURIComponent(wanted);
      const res = NextResponse.redirect(url);
      // A stale or forged cookie is cleared so the door does not keep bouncing.
      if (request.cookies.has(COOKIE)) res.cookies.delete(COOKIE);
      if (request.cookies.has(PRESENCE)) res.cookies.delete(PRESENCE);
      return res;
    }
  }

  url.pathname = roomPath(path, slug);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|white-logo.png|black-logo.png|logos/|clips/|client/|manifest.webmanifest|robots.txt|opengraph-image).*)",
  ],
};
