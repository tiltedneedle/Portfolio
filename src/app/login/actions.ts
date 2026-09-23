"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, COOKIE_DAYS, safeNext, tokenFor } from "@/lib/portal-auth";

export async function enter(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const expected = process.env.PORTAL_PASSWORD;

  if (!expected || password !== expected) {
    redirect("/login?error=1" + (next === "/" ? "" : "&next=" + encodeURIComponent(next)));
  }

  const store = await cookies();
  store.set(COOKIE, await tokenFor(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * COOKIE_DAYS,
  });
  redirect(next);
}
