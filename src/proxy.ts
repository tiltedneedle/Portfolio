import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, tokenFor } from "@/lib/portal-auth";

/**
 * Everything on the site is behind the door when PORTAL_PASSWORD is set.
 * The login page, Next's own assets and the few public files are not.
 */
export async function proxy(request: NextRequest) {
  const expected = process.env.PORTAL_PASSWORD;
  if (!expected) return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  if (token && token === (await tokenFor(expected))) return NextResponse.next();

  const url = request.nextUrl.clone();
  const wanted = url.pathname + url.search;
  url.pathname = "/login";
  url.search = wanted === "/" ? "" : "?next=" + encodeURIComponent(wanted);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|white-logo.png|black-logo.png|logos/|client/|manifest.webmanifest|robots.txt).*)"],
};
