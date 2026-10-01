import { NextResponse, type NextRequest } from "next/server";
import { safeNext } from "@/lib/safe-next";

const WHO = /^[a-z0-9-]{1,64}$/;

/** What every door form carries besides its own fields: where to go after, and whose link it came from. */
export function doorFields(form: FormData | null) {
  const forRaw = form?.get("for");
  return {
    next: safeNext(form?.get("next")),
    who: typeof forRaw === "string" && WHO.test(forRaw) ? forRaw : "",
  };
}

type Back = { error?: string; notice?: string; forgot?: boolean; next?: string; who?: string };

/**
 * Back to the door, saying what happened. 303, so the browser follows with
 * a GET: a 307 would post the form again, to the door.
 */
export function toDoor(request: NextRequest, { error, notice, forgot, next = "/", who = "" }: Back = {}) {
  const url = new URL("/login", request.url);
  if (error) url.searchParams.set("error", error);
  if (notice) url.searchParams.set("notice", notice);
  if (forgot) url.searchParams.set("forgot", "1");
  if (next !== "/") url.searchParams.set("next", next);
  if (who) url.searchParams.set("for", who);
  return NextResponse.redirect(url, 303);
}

/** On into the portal (or wherever `next` points on this site). */
export function onward(request: NextRequest, next: string) {
  return NextResponse.redirect(new URL(next, request.url), 303);
}

/** A form posted from another site. */
export function forbidden() {
  return new NextResponse("Forbidden", { status: 403, headers: { "cache-control": "no-store" } });
}

export async function formOf(request: NextRequest) {
  try {
    return await request.formData();
  } catch {
    return null;
  }
}
