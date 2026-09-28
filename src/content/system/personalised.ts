/**
 * THE COMMISSION. What a locked part says when someone opens it.
 *
 * Four parts of the system are written by the studio for one business. Until
 * they are written for this client they are shown locked, and a locked part
 * opens a modal (LockedModal) built from the words below.
 *
 * The same for everyone, like the rest of the system: it describes the four
 * parts and what it takes to have them written. It never shows anything of
 * anyone's, because there is nothing of theirs to show -- that is the whole
 * reason someone is reading it.
 */
export const personalised = {
  kicker: "Not yours yet",
  // True whether none of the four has been written or three have: the modal
  // lists only the ones that are still to come.
  lead: (name: string) => "Four parts of this system are researched and written for one business. The ones below have not been written for " + name + " yet.",
  // The four, in the order they are written and in the order they appear on
  // the strip. `anchor` is how a locked card names the part it was.
  parts: [
    {
      n: "01",
      anchor: "audit",
      title: "Your content audit",
      href: "/audit/content-diagnostic",
      text: "Thirteen headings on where your content stands today: how the brand reads to someone landing on it cold, what is already working, what is holding it back, and what we would change first.",
      takes: "We read everything you have published, score it, and write the diagnosis.",
    },
    {
      n: "02",
      anchor: "competitors",
      title: "Competitor intelligence",
      href: "/audit/competitor-intelligence",
      text: "Eight headings on your market: who is already winning attention in it, the formats and topics carrying them, and the gap nobody has taken.",
      takes: "We study the accounts you compete with for attention, not the ones you compete with for sales.",
    },
    {
      n: "03",
      anchor: "ideas",
      title: "100 viral content ideas",
      href: "/content/ideas",
      text: "One hundred concepts across four pillars — authority, education, entertainment and personal — written from your business, not from a category.",
      takes: "Built on the audit and the competitor read, so the hundred are yours and nobody else's.",
    },
    {
      n: "04",
      anchor: "scripts",
      title: "20 personalised scripts",
      href: "/content/scripts",
      text: "Twenty of those ideas taken all the way: a hook, a script, a call to action, and the shots and location each one needs.",
      takes: "Chosen from the hundred, so the twenty are the ones most likely to work first.",
    },
  ],
  // What the studio needs before any of it can start. Short, and all of it
  // things a client already has -- nothing here asks them to make something.
  needs: {
    title: "What we need from you",
    items: [
      "The accounts you post from, and the ones you wish were yours.",
      "What you sell, and who actually signs it off.",
      "Anything you have already published, however little.",
      "The three or four competitors you watch.",
    ],
  },
  ask: {
    title: "Ask for it",
    text: "One line to your team is enough. Say which part you want first, or say all of them and we will work in the order above.",
    // Said once, here, so nobody has to guess what comes back when.
    time: "The audit and the competitor read come back first; the hundred ideas and the twenty scripts are built on them.",
  },
};
