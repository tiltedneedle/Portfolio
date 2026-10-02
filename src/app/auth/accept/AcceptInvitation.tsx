"use client";

import { useEffect, useRef } from "react";

/**
 * The one piece of the door that has to run in the browser. An invitation
 * link comes back from Supabase with the new session in the address's
 * fragment (#access_token=...&refresh_token=...), and a fragment is never
 * sent to a server: only a script on the page can read it. So this reads
 * it, takes it out of the address bar and the history (a session has no
 * business staying in either), and posts it to /auth/session, which checks
 * it with Supabase and keeps it in the same httpOnly cookies as any other
 * sign-in. Nothing here talks to Supabase or holds on to the tokens.
 */
export function AcceptInvitation() {
  const form = useRef<HTMLFormElement>(null);
  const started = useRef(false);

  useEffect(() => {
    // Once: the fragment is gone after the first run.
    if (started.current) return;
    started.current = true;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    window.history.replaceState(null, "", window.location.pathname);
    const access = hash.get("access_token");
    const refresh = hash.get("refresh_token");
    if (hash.get("error")) {
      window.location.replace("/login?error=invitation");
      return;
    }
    const el = form.current;
    if (!access || !refresh || !el) {
      // Nothing to accept: this page was opened by hand, or come back to.
      window.location.replace("/login");
      return;
    }
    (el.elements.namedItem("access_token") as HTMLInputElement).value = access;
    (el.elements.namedItem("refresh_token") as HTMLInputElement).value = refresh;
    el.submit();
  }, []);

  return (
    <form ref={form} method="post" action="/auth/session" hidden>
      <input type="hidden" name="access_token" />
      <input type="hidden" name="refresh_token" />
    </form>
  );
}
