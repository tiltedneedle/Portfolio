import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO } from "@/content/system/pillars";
import type { ChapterId } from "@/content/types";
/**
 * THE HOME PAGE. The same for everyone; only the client name and logo change.
 *
 * THE WORDS ARE THE BRIEF'S, verbatim: "Step 1: Home Page" in the client's
 * brief (Info Product Servicing.md). An earlier writing pass paraphrased
 * nearly every line of it, and the user had to ask whether the brief was
 * being followed at all. It is content to put on the website, not notes to
 * rewrite. Change a line here only when the brief changes; the copy test
 * pins the brief's sentences so a future pass cannot drift them again.
 *
 * Where the brief sets a list under a line (the eight Create steps, the
 * four pillars), it stays a list: `list` holds it, `after` holds a line the
 * brief sets below the list.
 *
 * `frame` is the published video whose still fronts a room's card, chosen by
 * eye from a contact sheet of every poster in the room. Left to "the room's
 * first poster", Create and Publish both opened on the same presenter in the
 * same jet cabin. These three are three different places: a conversation in
 * a lobby, an office of framed photographs, the sky over an airfield.
 */
export const home = {
  // "YOUR COMPLETE VIRAL CONTENT SYSTEM", with VIRAL set in red in the
  // brief. `accent` is the word that takes the colour.
  kicker: "Your complete viral content system",
  accent: "viral",
  lead: (name: string) => "Everything we have learned from generating over 5 billion organic views, built into one complete system for " + name + ".",
  intro: [
    "This portal gives you the exact frameworks, processes and principles we use at Tilted Needle to create high performing social media content.",
    "You now have everything you need to research, create, film, edit, publish and analyse content internally.",
  ],
  objective: {
    label: "The objective is simple",
    text: "To give your team the knowledge and infrastructure required to consistently create content that captures attention, builds an audience and generates more opportunities for your business.",
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
      text: "100 content concepts built across four core content pillars.",
      list: ["Authority", "Education", "Entertainment", "Personal"],
      after: "Use these ideas as the foundation of your content output.",
    },
    {
      n: "04",
      // The Home Page tab's own heading. The STRUCTURE tab calls the page
      // itself "20 Personalised Scripts", which is what the nav says.
      title: "20 personalized for you scripts",
      href: "/content/scripts",
      personalised: true,
      text: "20 complete videos written specifically for your business.",
      list: ["Open the script.", "Film it.", "Execute."],
    },
    {
      n: "05",
      title: "Create",
      href: "/create",
      personalised: false,
      frame: "qj-bCVEaxko",
      text: "Learn the exact process we use to create content.",
      list: ["Research your niche.", "Analyse competitors.", "Generate ideas.", "Choose formats.", "Create stronger hooks.", "Deliver your message.", "Film effectively.", "Edit for retention."],
    },
    {
      n: "06",
      title: "Publish",
      href: "/publish",
      personalised: false,
      frame: "WtFrrO8SvTE",
      text: "Learn how to maximise the potential of every piece of content after it has been created. Understand where to post, how often to post, when to post, how to write titles and captions, how to create covers and how to optimise your profiles.",
    },
    {
      n: "07",
      title: "Analyse",
      href: "/analyse",
      personalised: false,
      frame: "BC_ZaHvv01U",
      text: "Learn how to understand what your content performance is actually telling you.",
      list: ["Identify why a video worked.", "Identify why a video failed.", "Understand what to repeat, what to improve and what to change next time."],
    },
  ] as { n: string; title: string; href: string; personalised: boolean; text: string; list?: string[]; after?: string; frame?: string }[],
  how: [
    {
      title: "Understand",
      text: "Start with your Content Audit and Competitor Intelligence. Understand your current position and the opportunities available to you.",
      href: "/audit",
    },
    {
      title: "Create",
      text: "Use your 100 content ideas and 20 scripts to begin producing content immediately. Then use the Create section whenever you need to generate new ideas, improve your hooks, film better content or improve your editing.",
      href: "/create",
    },
    {
      title: "Publish",
      text: "Follow the publishing system every time a piece of content is ready to go live.",
      href: "/publish",
    },
    {
      title: "Analyse",
      text: "Review the performance of your content and understand what the data is telling you.",
      href: "/analyse",
    },
    {
      title: "Repeat",
      text: "Use those learnings to improve the next piece of content. The system becomes stronger the more you use it.",
      href: "/create",
    },
  ],
  approach: {
    title: "The Tilted Needle approach",
    lines: [
      "The objective is not to create one viral video.",
      "The objective is to build a repeatable system capable of producing high performing content consistently.",
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
  // The brief's planning asks for a "permanent access message"; this is it,
  // and the only place the site claims permanence.
  access_note: "Permanent access. Yours to keep, and we add to it as we learn.",
  films: {
    intro: { title: "Welcome to your system", youtubeId: "KHcTcsDBQyQ" },
    outro: { title: "Where to go from here", youtubeId: "NqJLjtmVOpw" },
  },
};
