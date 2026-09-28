import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO } from "@/content/system/pillars";
import type { ChapterId } from "@/content/types";
/**
 * THE HOME PAGE. The same for everyone; only the client name and logo change.
 */
export const home = {
  // No terminal period: no other mono label on this page carries one.
  kicker: "Your content system, in full",
  // The number is spelled out because the showreel spells its own out too,
  // so the two biggest numbers on the page agree in treatment.
  lead: (name: string) => "Five billion organic views taught us what makes someone stop. The whole method is in here, written for " + name + ".",
  intro: [
    "Nothing in here is a summary. These are the pages we work from: how we research a niche, how we write a hook, how we shoot it and how we cut it.",
    "From today the work can happen in your building instead of ours.",
  ],
  objective: {
    label: "The objective",
    // "This week's call sheet" is not a metaphor: ThisWeek renders two
    // sections down on this same page, labelled Call sheet / Week N.
    text: "A shoot stops being an event. It becomes a line on this week's call sheet.",
  },
  access: [
    {
      n: "01",
      title: "Your content audit",
      href: "/audit/content-diagnostic",
      personalised: true,
      text: DIAGNOSTIC_INTRO,
    },
    {
      n: "02",
      title: "Competitor intelligence",
      href: "/audit/competitor-intelligence",
      personalised: true,
      text: COMPETITOR_INTRO,
    },
    {
      n: "03",
      title: "100 viral content ideas",
      href: "/content/ideas",
      personalised: true,
      text: "One hundred content concepts built across four core pillars: authority, education, entertainment and personal. Enough that you never open a blank page.",
    },
    {
      n: "04",
      title: "20 personalised scripts",
      href: "/content/scripts",
      personalised: true,
      text: "Twenty videos, written for your business. Open the script. Film it. Post it.",
    },
    {
      n: "05",
      title: "Create",
      href: "/create",
      personalised: false,
      // Seven imperatives, one per guide in the room, in the room's order.
      text: "Study the niche. Find the idea. Choose the style. Write the hook. Land the message. Film it. Cut it.",
    },
    {
      n: "06",
      title: "Publish",
      href: "/publish",
      personalised: false,
      text: "Where it goes and how often. What it is called and what the cover has to do. How it gets found, and what your profile says when it does.",
    },
    {
      n: "07",
      title: "Analyse",
      href: "/analyse",
      personalised: false,
      text: "Why a video worked, why one failed, and what to do differently on the next. Then the same read, once a month, in order.",
    },
  ],
  how: [
    {
      title: "Understand",
      text: "Read the audit before you film anything. It tells you what to stop doing.",
      href: "/audit",
    },
    {
      title: "Create",
      text: "Pick an idea, or open a script already written for you. Film it.",
      href: "/create",
    },
    {
      title: "Publish",
      text: "The same sequence every time. It is the part everyone skips.",
      href: "/publish",
    },
    {
      title: "Analyse",
      text: "Once a month, ask the numbers what happened.",
      href: "/analyse",
    },
    {
      title: "Repeat",
      text: "The second pass begins where the first one ended: knowing more.",
      href: "/create",
    },
  ],
  approach: {
    title: "The Tilted Needle approach",
    // These set up the beats below them. They no longer restate the
    // objective: the Welcome block states it once, two sections up.
    lines: [
      "One video that works is luck.",
      "The same six steps, every week, is why the next one works too.",
    ],
    beats: ["Research.", "Create.", "Publish.", "Analyse.", "Improve.", "Then repeat."],
  },
  // Where the front page sends you, named by the room you are actually sent to.
  begin: {
    audit: "your audit",
    content: "your content",
    create: "Create",
    publish: "Publish",
    analyse: "Analyse",
    home: "the system",
  } as Record<ChapterId, string>,
  // The one place the site claims permanence. It was claimed in five.
  access_note: "Permanent access. Yours to keep, and we add to it as we learn.",
  films: {
    intro: { title: "Welcome to your system", youtubeId: "KHcTcsDBQyQ" },
    outro: { title: "Where to go from here", youtubeId: "NqJLjtmVOpw" },
  },
};
