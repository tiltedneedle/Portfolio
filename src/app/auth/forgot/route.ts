import type { NextRequest } from "next/server";
import { blocked, clientIp, hit, sameOrigin, supabaseConfig } from "@/lib/auth";
import { supabaseFor } from "@/lib/supabase-server";
import { doorFields, forbidden, formOf, toDoor } from "@/lib/door-routes";

/**
 * "Forgot your password?" Supabase emails a link back to /auth/confirm,
 * which opens /auth/reset to choose a new one. The answer is the same
 * whether or not the address has an account: that is not this form's to
 * say. The link only works in this browser (it carries half of a PKCE pair
 * whose other half is the cookie set here), which /auth/confirm explains
 * when it is opened anywhere else.
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
  const back = new URL("/auth/confirm", request.url);
  back.searchParams.set("next", "/auth/reset");
  await supabase.auth.resetPasswordForEmail(email, { redirectTo: back.toString() });
  return carry(toDoor(request, { notice: "sent", next, who }));
}
