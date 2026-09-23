import type { Guide } from "@/content/types";

/**
 * Written from the outline in the brief (profile image, name, bio, links,
 * pinned content, highlights, calls to action, turning attention into
 * business) and the good-profile / bad-profile comparison it included.
 */
export const profile: Guide = {
  chapter: "publish",
  slug: "profile",
  title: "Profile optimisation",
  kicker: "The profile is where attention becomes a decision.",
  poster: "DEuqrU7q9Rc",
  intro: [
    "Someone has just watched a video, liked it, and tapped your name. In the next few seconds they decide whether to follow, message, or leave.",
    "Every element of the profile should make that decision easy. This is the part most businesses ignore, and it is the part that turns views into enquiries.",
  ],
  opener: [{ kind: "profile" }],
  sections: [
    {
      n: "01",
      title: "Profile image",
      blocks: [
        { kind: "p", text: "The image is seen at the size of a fingernail, next to every comment and in every feed. It has one job: to be recognisable." },
        {
          kind: "swaps",
          fromLabel: "Weak",
          toLabel: "Strong",
          pairs: [
            { from: "A distant photograph of an aircraft, with sky and tarmac, that reads as a grey smudge when small.", to: "A clear brand mark, or a clean, well lit photograph of the person the audience will see on camera." },
          ],
        },
        { kind: "p", text: "Use the same image on every platform so the account is recognised wherever the content is found." },
      ],
    },
    {
      n: "02",
      title: "Name",
      blocks: [
        { kind: "p", text: "The name field is searchable. Use the name people would type, and where there is room, what you do." },
        {
          kind: "swaps",
          fromLabel: "Instead of",
          toLabel: "Try",
          pairs: [{ from: "skyaviation_", to: "Horizon Aviation | Private Jet Charter" }],
        },
        { kind: "p", text: "Someone searching for private jet charter can now find the account by what it does, not only by a name they do not yet know." },
      ],
    },
    {
      n: "03",
      title: "Bio",
      blocks: [
        { kind: "p", text: "Three lines. What you do, who it is for, where you operate. Then a reason to follow or a reason to get in touch." },
        {
          kind: "swaps",
          fromLabel: "Vague",
          toLabel: "Specific",
          pairs: [
            {
              from: "Luxury | Lifestyle | Travel. Living the dream. DM for more info. Worldwide.",
              to: "Private jet charter, sales and aircraft management. London · Dubai · New York. Book a flight below.",
            },
          ],
        },
        { kind: "p", text: "Specific beats clever. The bio is read by people who have never heard of you; it should answer their first question before they ask it." },
      ],
    },
    {
      n: "04",
      title: "Links and contact options",
      blocks: [
        { kind: "p", text: "One clear destination. The link should lead to the page that continues what the content promised: a booking page, an enquiry page, a page about the aircraft the video was about." },
        {
          kind: "list",
          title: "Turn on every contact option the platform offers",
          style: "tag",
          items: ["Email", "Message", "Call, where appropriate", "Website"],
        },
        { kind: "p", text: "Then open the profile on a phone and test every one of them. A link that leads to a slow, unrelated or broken page ends the journey exactly where it was about to become business." },
      ],
    },
    {
      n: "05",
      title: "Pinned content",
      blocks: [
        { kind: "p", text: "The three pinned videos are the first thing a new visitor watches. Choose them deliberately." },
        {
          kind: "steps",
          items: [
            { title: "One video that shows what you do", text: "The clearest demonstration of the service, the aircraft, the access." },
            { title: "One video that shows what you know", text: "Your strongest educational or authority piece." },
            { title: "One video that generated enquiries", text: "Whatever made people get in touch, keep it in front of the next person." },
          ],
        },
        { kind: "p", text: "Review the pins every month. When a stronger video arrives, promote it." },
      ],
    },
    {
      n: "06",
      title: "Highlights",
      blocks: [
        { kind: "p", text: "On Instagram, story highlights are a menu. A new visitor should be able to understand the whole business from the row of covers alone." },
        { kind: "list", title: "For an aviation business, that might be", style: "tag", items: ["Aircraft", "Charter", "Sales", "Clients", "About", "Contact"] },
        { kind: "p", text: "Use consistent covers, in the brand's colours, with one word each. Refresh them when the content behind them goes stale." },
      ],
    },
    {
      n: "07",
      title: "Calls to action",
      blocks: [
        { kind: "p", text: "The profile should tell people what to do next, and it should say it once. One primary action, in the bio, matched by the link and the pinned content." },
        { kind: "lines", mode: "screen", items: ["Book a flight", "Send an enquiry", "Request a quote", "Watch the latest tour"] },
        { kind: "p", text: "Two competing actions halve the result of both." },
      ],
    },
    {
      n: "08",
      title: "Turning attention into business",
      blocks: [
        { kind: "p", text: "The journey from a viewer to a customer has a fixed shape. Every step should match the one before it." },
        {
          kind: "steps",
          items: [
            { title: "The video", text: "Creates interest in a subject." },
            { title: "The profile", text: "Confirms who you are and what you do." },
            { title: "The link", text: "Leads to a page about that subject, not the home page." },
            { title: "The page", text: "Continues the promise and makes the enquiry easy." },
            { title: "The reply", text: "Comes quickly, and sounds like the person in the video." },
          ],
        },
        { kind: "p", text: "Reply to comments and messages; they are conversations with people who are already interested. Ask new customers where they found you, and write it down. Over time you will know which videos, and which subjects, actually turn into work." },
        { kind: "aside", text: "The aim is to move viewers towards becoming customers without ever breaking the experience that brought them." },
      ],
    },
    {
      title: "Before you publish your profile",
      blocks: [
        {
          kind: "checklist",
          title: "Open it on a phone and ask",
          items: [
            "Is it obvious what you do within three seconds?",
            "Would someone know where you operate?",
            "Is there one clear next step?",
            "Do the pinned videos represent the business you want to be known for?",
            "Does the link lead somewhere that matches the content?",
            "Is the profile image recognisable at the size of a thumbnail?",
            "Do all the contact options work?",
          ],
        },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "A viewer arrives with interest. The profile should turn that into a decision." },
    { kind: "p", text: "Make it obvious what you do, who it is for and what to do next." },
  ],
};
