import type { Guide } from "@/content/types";

export const monthlyProcess: Guide = {
  chapter: "analyse",
  slug: "monthly-process",
  title: "Monthly analytics process",
  kicker: "The same eight steps, at the end of every month.",
  poster: "UURns7hS2y0",
  intro: [
    "Analytics only becomes useful when it is done the same way, at the same time, every month. Sit down with the numbers from every platform and run the process below in order.",
    "The output is not a report. It is the brief for the next fifteen videos.",
  ],
  sections: [
    {
      title: "The process",
      blocks: [
        {
          kind: "steps",
          items: [
            { title: "Identify your five strongest videos", text: "Across every platform, by the measure that matters most to you this month: views, retention, saves, or enquiries." },
            { title: "Identify what they have in common", text: "The topic, the hook, the format, the person on camera, the aircraft, the access, the title." },
            { title: "Review where viewers dropped off", text: "Early drop-off points to the opening. Mid-video drop-off points to structure and pacing." },
            { title: "Read the comments and save potential ideas", text: "Repeated questions, disagreements, requests for comparisons, aircraft people keep mentioning." },
            { title: "Identify which content generated the most shares, saves, followers and profile visits", text: "Each one tells you something different: worth sending on, worth keeping, worth following, worth knowing more about." },
            { title: "Choose three things that worked and should be repeated", text: "Be specific: a hook structure, a format, a subject, a person." },
            { title: "Choose three things you want to test differently", text: "One change per video, so you know what made the difference." },
            { title: "Use those findings to build your next 15 video content bank", text: "The next bank should look different from the last one because of what you learned." },
          ],
        },
      ],
    },
    {
      title: "The cycle",
      blocks: [
        { kind: "p", text: "This creates a continuous cycle." },
        { kind: "cycle", items: ["Create", "Publish", "Analyse", "Improve"], note: "Create again. The fourth step leads back to the first." },
        { kind: "p", text: "The first month gives you a baseline. The second gives you a comparison. By the third, the patterns are yours, not ours." },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "One result is not enough to change a strategy. A month of results is." },
    { kind: "p", text: "Run the process every month, and the system becomes stronger the more you use it." },
  ],
};
