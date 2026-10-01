import { NextResponse, type NextRequest } from "next/server";
import { PRESENCE, forgetAccess, sameOrigin, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { forbidden } from "@/lib/door-routes";

/**
 * Leaving the room. Only this browser's session ends: the same account is
 * the person's Tilted Needle account, and may be signed in there, or on
 * another device, which signing out here must not touch. (Supabase's own
 * default is every session everywhere.)
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return forbidden();
  const res = NextResponse.redirect(new URL("/login", request.url), 303);
  res.cookies.delete(PRESENCE);
  const config = supabaseConfig();
  if (!config) return res;
  const { supabase, carry } = supabaseFor(request, config);
  const { data } = await supabase.auth.getClaims();
  if (typeof data?.claims?.sub === "string") forgetAccess(data.claims.sub);
  await supabase.auth.signOut({ scope: "local" });
  return carry(res);
}
