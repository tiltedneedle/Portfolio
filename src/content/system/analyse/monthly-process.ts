import type { Guide } from "@/content/types";

/**
 * The brief's "YOUR MONTHLY ANALYTICS PROCESS": the closing section of its
 * Understanding Your Analytics tab, which the site gives a page of its own.
 * Every word here is the brief's. An earlier build wrote this page itself --
 * an intro, a sentence under every step, a closing thought, a rule -- none of
 * which the brief says; they are gone.
 *
 * The line under the title is the tab's own question, which this process is
 * how to answer; the rule is the tab's rule, which covers both pages.
 */
export const monthlyProcess: Guide = {
  chapter: "analyse",
  slug: "monthly-process",
  title: "Monthly analytics process",
  kicker: "What should we do differently in the next video?",
  poster: "UURns7hS2y0",
  intro: ["At the end of every month:"],
  sections: [
    {
      title: "Your monthly analytics process",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Identify your five strongest videos." },
            { title: "Identify what they have in common." },
            { title: "Review where viewers dropped off." },
            { title: "Read the comments and save potential ideas." },
            { title: "Identify which content generated the most shares, saves, followers and profile visits." },
            { title: "Choose three things that worked and should be repeated." },
            { title: "Choose three things you want to test differently." },
            { title: "Use those findings to build your next 15 video content bank." },
          ],
        },
      ],
    },
    {
      title: "This creates a continuous cycle",
      blocks: [{ kind: "cycle", items: ["Create.", "Publish.", "Analyse.", "Improve."], note: "Create again." }],
    },
  ],
  rule: [
    { kind: "p", text: "Do not use analytics to decide whether a video was simply successful or unsuccessful." },
    { kind: "p", text: "Use analytics to understand *why it performed the way it did* and what that teaches you about what to create next." },
  ],
};
