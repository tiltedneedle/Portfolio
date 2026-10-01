import type { NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { onward, toDoor } from "@/lib/door-routes";
import { safeNext } from "@/lib/safe-next";

const TYPES: readonly EmailOtpType[] = ["recovery", "invite", "email"];

/**
 * Where an emailed link lands. It carries either a code (the PKCE flow
 * this portal starts, which needs the cookie /auth/forgot set in this same
 * browser) or a token hash (an email template written for it), and turns
 * either into a session, then goes on to choose a password. A link that is
 * spent, expired, or opened in another browser goes back to the door,
 * which says so.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const config = supabaseConfig();
  if (!config) return onward(request, "/");
  const { supabase, carry } = supabaseFor(request, config);

  const code = sp.get("code");
  const tokenHash = sp.get("token_hash");
  const type = sp.get("type") as EmailOtpType | null;
  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type && TYPES.includes(type)) {
    ok = !(await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error;
  }
  if (!ok) return carry(toDoor(request, { error: "link" }));
  return carry(onward(request, safeNext(sp.get("next") ?? "/auth/reset")));
}
