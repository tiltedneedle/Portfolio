import { NextResponse, type NextRequest } from "next/server";
import { PRESENCE, forgetAccess, isHttps, portalAccess, presenceOptions, sameOrigin, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { forbidden, formOf, onward, toDoor } from "@/lib/door-routes";

/** Supabase hashes passwords with bcrypt, which reads only the first 72 bytes. */
const MAX_BYTES = 72;
const MIN_CHARS = 8;

function again(request: NextRequest, error: string) {
  const url = new URL("/auth/reset", request.url);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, 303);
}

/**
 * Choosing a new password, from /auth/reset, inside the session the
 * emailed link began. Then on into the portal, if the account has one.
 * The password is the person's Tilted Needle password: the account is
 * the same one.
 */
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return forbidden();
  const config = supabaseConfig();
  if (!config) return onward(request, "/");
  const form = await formOf(request);
  const password = String(form?.get("password") ?? "");
  const confirm = String(form?.get("confirm") ?? "");
  if (password.length < MIN_CHARS) return again(request, "short");
  if (new TextEncoder().encode(password).length > MAX_BYTES) return again(request, "long");
  if (password !== confirm) return again(request, "match");

  const { supabase, carry } = supabaseFor(request, config);
  const { data } = await supabase.auth.getClaims();
  const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
  if (!userId) return carry(toDoor(request, { error: "link" }));

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") return carry(again(request, "same"));
    if (error.code === "weak_password") return carry(again(request, "weak"));
    if (error.code === "session_not_found" || error.status === 401 || error.status === 403) return carry(toDoor(request, { error: "link" }));
    return carry(again(request, "unavailable"));
  }

  forgetAccess(userId);
  const access = await portalAccess(supabase, userId, { fresh: true });
  if (access.slug === null) {
    await supabase.auth.signOut({ scope: "local" });
    return carry(toDoor(request, { notice: "changed", error: access.reason === "error" ? "unavailable" : "account" }));
  }
  const res = onward(request, "/");
  res.cookies.set(PRESENCE, "1", presenceOptions(isHttps(request)));
  return carry(res);
}
