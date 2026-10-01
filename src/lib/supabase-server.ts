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
 * For a page rendered on the server: reads the session and cannot write it
 * (the proxy and the auth routes do that). A refresh it needs is simply
 * not kept; the next request to the proxy or a route makes its own.
 */
export async function supabaseForPage(config: SupabaseConfig) {
  const store = await cookies();
  return createServerClient(config.url, config.key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll() {},
    },
  });
}
