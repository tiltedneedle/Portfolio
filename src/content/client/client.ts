/**
 * THE CLIENT. This is the file that changes for every new system.
 *
 * Everything under `src/content/client/` is personalised: this identity, the
 * audit, the hundred ideas and the twenty scripts. Everything under
 * `src/content/system/` is the same for everyone. To set up a new client:
 * duplicate the repo (or branch it), replace the four files in this folder,
 * drop the logo into `public/client/`, set the portal password, deploy to
 * the client's own URL.
 */
export const client = {
  /** As printed everywhere: "Tilted Needle × {name}". */
  name: "Company Name",
  /** A shorter form for tight spaces (the nav, the slate). Falls back to `name`. */
  short: "",
  /** Path under /public. Leave empty to show the monogram instead. */
  logo: "",
  /** Used on the slate and in the footer. */
  since: "2026",
  /** Where "your Tilted Needle team" links go. */
  contact: "info@tiltedneedle.com",
};

export function clientShort() {
  return client.short || client.name;
}

/** Two letters for the monogram when there is no logo yet. */
export function clientMonogram() {
  const words = client.name.split(" ").filter(Boolean);
  const letters = words.length >= 2 ? words[0][0] + words[1][0] : client.name.slice(0, 2);
  return letters.toUpperCase();
}
