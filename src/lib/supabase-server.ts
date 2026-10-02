import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { isHttps, type SupabaseConfig } from "@/lib/auth";

type Pending = { name: string; value: string; options: CookieOptions };

/**
 * A Supabase client over one request's cookies, for the proxy and the auth
 * routes. What it writes (a session begun, refreshed or ended) is held and
 * then put on whichever response is finally sent, with the no-store headers
 * Supabase asks for, so no cache ever hands one person's session to
 * another. The cookies are httpOnly: nothing in the browser reads them,
 * since the portal never talks to Supabase from there, so nothing a page
 * runs can lift a session.
 */
export function supabaseFor(request: NextRequest, config: SupabaseConfig) {
  const pending: Pending[] = [];
  const pendingHeaders: Record<string, string> = {};
  const supabase = createServerClient(config.url, config.key, {
    cookieOptions: { httpOnly: true, secure: isHttps(request), sameSite: "lax", path: "/" },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        for (const c of cookiesToSet) {
          // The rest of this request sees the new session too.
          request.cookies.set(c.name, c.value);
          pending.push(c);
        }
        Object.assign(pendingHeaders, headers);
      },
    },
  });
  function carry<T extends NextResponse>(response: T): T {
    for (const c of pending) response.cookies.set(c.name, c.value, c.options);
    for (const [k, v] of Object.entries(pendingHeaders)) response.headers.set(k, v);
    return response;
  }
  return { supabase, carry };
}

/**
 * A page must never refresh a session. It cannot keep the new one (a page
 * cannot write cookies), and the old refresh token is spent the moment it
 * is used: ten seconds later it opens nothing, and using it again ends the
 * session everywhere. So a refresh from here is answered with a refusal
 * before it leaves (a 400, which the client does not retry), and the page
 * sees no session. The proxy refreshes before a page renders, where the
 * new session can be kept, so this is the guard behind that, not the plan.
 */
const noRefresh: typeof fetch = (input, init) => {
  const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
  if (url.includes("/auth/v1/token") && url.includes("grant_type=refresh_token")) {
    return Promise.resolve(Response.json({ code: 400, error_code: "refresh_not_here", msg: "A page does not refresh a session" }, { status: 400 }));
  }
  return fetch(input, init);
};

/**
 * For a page rendered on the server: reads the session, and can neither
 * write it nor refresh it (the proxy and the auth routes do both).
 */
export async function supabaseForPage(config: SupabaseConfig) {
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    global: { fetch: noRefresh },
    cookies: {
      getAll: () => store.getAll(),
      setAll() {},
    },
  });
}
