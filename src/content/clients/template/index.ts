import type { ClientSystem } from "@/content/clients/types";
import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO, competitorHeadings, diagnosticHeadings, pillar, report, scripts } from "@/content/system/pillars";

/**
 * THE TEMPLATE. What an open door shows, and what a new client's folder is
 * copied from. Every personalised slot is empty except a few marked
 * examples, so the design of the finished state can be seen.
 *
 * To set up a client: copy this folder to `src/content/clients/<slug>/`,
 * fill the four parts below, generate an access hash with
 * `node scripts/access.mjs <slug> <access code>`, add the client to
 * `registry.ts`, run `npm run check`.
 */
export const template: ClientSystem = {
  identity: {
    slug: "template",
    name: "Company Name",
    short: "",
    logo: "",
    since: "2026",
    contact: "info@tiltedneedle.com",
    accessHash: "",
  },

  contentDiagnostic: report(DIAGNOSTIC_INTRO, diagnosticHeadings),

  competitorIntelligence: report(COMPETITOR_INTRO, competitorHeadings),

  ideas: {
    authority: pillar([
      { text: "The biggest mistake people make when buying a private jet.", example: true },
      { text: "After 20 years in private aviation, this is what I would always check before buying.", example: true },
      { text: "The quickest corporate jet deal we have ever closed.", example: true },
    ]),
    education: pillar([
      { text: "How far can a private jet actually fly without stopping?", example: true },
      { text: "What is an empty leg, and why does it exist?", example: true },
      { text: "Why do two jets of a similar size have completely different range?", example: true },
    ]),
    entertainment: pillar([
      { text: "Can you identify this aircraft from the window alone?", example: true },
      { text: "The different types of private jet passengers.", example: true },
      { text: "Reacting to the strangest aircraft configuration we have seen this year.", example: true },
    ]),
    personal: pillar([
      { text: "The deal that nearly collapsed 24 hours before delivery.", example: true },
      { text: "The story of my first ever jet sale.", example: true },
      { text: "Why I have the best job in the world.", example: true },
    ]),
  },

  scripts: scripts([
    {
      n: 1,
      title: "Why this jet can stay in the air for 17 hours",
      hook: "This aircraft can fly from London to Los Angeles without stopping. But range is not the reason most owners choose it.",
      body: [
        "The Global 7500 is one of the longest range business jets ever built. Seven thousand seven hundred nautical miles. That is London to Los Angeles, or Dubai to New York, with no fuel stop.",
        "Most people assume that is the reason it sells. It is not.",
        "Walk through the cabin and you find four separate living areas. A place to eat. A place to work. A place to sleep. A place for the crew to rest. On a fourteen hour flight, that is the difference between arriving and arriving ready.",
        "So when someone tells you they bought this aircraft for the range, ask them where they slept.",
      ],
      cta: "If you want to know what a flight like that actually costs, that is the next video.",
      example: true,
    },
  ]),
};
