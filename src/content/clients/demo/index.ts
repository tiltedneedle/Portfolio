import type { ClientSystem } from "@/content/clients/types";
import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO, competitorHeadings, diagnosticHeadings, pillar, report, scripts } from "@/content/system/pillars";

/**
 * A DEMO CLIENT. Horizon Aviation is fictional: a private jet charter and
 * sales house, invented so the finished state of a system can be seen and
 * so the door can be tested. Access code: `horizon-2026` (see README).
 * Delete this folder and its line in the registry before a real deployment
 * if you would rather it did not exist.
 */
export const demo: ClientSystem = {
  identity: {
    slug: "demo",
    name: "Horizon Aviation",
    short: "Horizon",
    logo: "",
    since: "2026",
    contact: "info@tiltedneedle.com",
    accessHash: "46722c7f0d32372a520855156501ead6fbec3dc8b73b053d7222b0b10a72544b",
    demo: true,
  },

  contentDiagnostic: report(DIAGNOSTIC_INTRO, diagnosticHeadings, {
    "Current positioning": [
      "Someone landing on the account today sees a charter company. The bio says luxury, lifestyle and travel; the grid is aircraft exteriors, sunsets and cabin shots without people. Nothing tells a visitor who is behind the business, what it is like to work with you, or why a first time flyer should trust you with a £40,000 booking.",
      "The access you actually have is extraordinary: three managed aircraft, a base at Farnborough, a founder who has sold over a hundred jets and a team that handles the strangest requests in the industry every week. None of that is on screen yet.",
    ],
    "Current content": [
      "Forty-seven posts in twelve months, almost all photographs. Four videos, three of which are cinematic cabin tours with music and no speech. Average reach of 1,200; the best performing post (a client's dog on the tarmac) reached 9,400. The audience responds when a person or a story appears, and the account rarely gives them one.",
    ],
    Hooks: [
      "The four videos open on a logo animation, a slow exterior pan, a drone shot and a title card. In each case the first spoken word arrives after four seconds. On a feed where the decision is made in one, that is the single biggest reason the videos stop at a few hundred views.",
    ],
    "What we would change": [
      "Put James on camera. He is the most interesting thing about the business and he has never appeared in a post. Film at the aircraft, not in the office: the hangar at Farnborough, the cabin, the door opening, the terminal at six in the morning.",
      "Lead with the questions clients ask on every call: what does a flight actually cost, what is an empty leg, can you bring the dog. Then build the first content bank of fifteen videos around them before publishing anything.",
    ],
  }),

  competitorIntelligence: report(COMPETITOR_INTRO, competitorHeadings, {
    "Competitors analysed": [
      "Six accounts: two charter brokers of a similar size, two aircraft sales houses, one pilot creator with 400,000 followers, and one manufacturer's official channel. Between them they published 340 videos in the last six months.",
    ],
    "Best performing content": [
      "The outliers are almost all one format: a person inside an aircraft answering a single question the public cannot answer themselves. “What does it cost to own this?”, “Can you land this anywhere?”, “Why are the windows this shape?”. The pilot creator's top ten are all of this kind and average two million views against a channel average of 80,000.",
    ],
    "Content gaps": [
      "Nobody in the market shows the operation. The bookings, the handovers, the crew preparation, the problems that get solved at midnight. Every competitor is either polished promotion or pure education; the behind-the-scenes documentary lane is empty, and Horizon is the only one of the six with daily access to it.",
    ],
  }),

  ideas: {
    authority: pillar([
      "The mistake first time private jet buyers make most often.",
      "After a hundred jet sales, this is the one thing I always check first.",
      "The quickest charter booking we have ever turned around.",
      "What a £40,000 flight actually pays for, line by line.",
      "Three questions I ask every client before I quote a flight.",
      "Why we turned down a booking last week.",
      "The most expensive part of owning a jet is not the jet.",
      "How a handover at Farnborough actually works.",
      "What I would buy with £10 million, £25 million and £60 million.",
      "The deal that taught me to never skip the pre-purchase inspection.",
      "Why an aircraft's logbooks matter more than its paint.",
      "How we price an empty leg.",
      "The one clause I insist on in every purchase agreement.",
      "What changes when you go from chartering to owning.",
      "Why the same aircraft can cost twice as much to run.",
      "How I inspect an aircraft in the first ten minutes.",
      "The question buyers never ask, and always should.",
      "What twenty years of client requests taught me about service.",
      "How we handle a mechanical problem an hour before departure.",
      "What makes one jet harder to sell than another.",
      "The three aircraft I would recommend to a first time owner.",
      "Why our crews fly the same clients for years.",
      "How we find an aircraft that is not on the market.",
      "The cost of a jet nobody talks about: the crew.",
      "What our best clients have in common.",
    ]),
    education: pillar([
      "How far can a private jet actually fly without stopping?",
      "What is an empty leg, and why does it exist?",
      "Can a private jet land at any airport?",
      "Why do two jets of a similar size have completely different range?",
      "What happens if your jet breaks down abroad?",
      "How much luggage can you actually take?",
      "Can you bring a dog on a private jet?",
      "What is the difference between chartering, fractional and owning?",
    ]),
    entertainment: pillar([
      "Can you identify this aircraft from the window alone?",
      "The different types of private jet passengers.",
      "What charter clients think happens versus what actually happens.",
      "Reacting to the strangest aircraft configuration we have seen this year.",
      "Gulfstream or Bombardier: the team decides in sixty seconds.",
      "Things brokers hear every single day.",
    ]),
    personal: pillar([
      "The deal that nearly collapsed 24 hours before delivery.",
      "The story of my first ever jet sale.",
      "Why I have the best job in the world.",
      "A day in the life of a charter broker, starting at 5am.",
      "The flight that changed how I run this company.",
      "What I got wrong in my first year.",
    ]),
  },

  scripts: scripts([
    {
      n: 1,
      title: "What a £40,000 flight actually pays for",
      hook: "Forty thousand pounds, London to Nice and back. Here is where every pound goes.",
      body: [
        "The aircraft itself is about half. Fuel, crew, and the hours on the airframe: that is the part people expect.",
        "Then the airports. Landing, handling, parking overnight at Nice in summer. That is more than most people's first guess.",
        "Then the parts nobody sees. Catering from a restaurant, not a trolley. A crew hotel. De-icing if it is January. Positioning the aircraft if it is not already where you are.",
        "And a margin for us, which is smaller than you think, because the next booking depends on this one going perfectly.",
      ],
      cta: "If you want to know how an empty leg can take a third off that number, that is the next video.",
    },
    {
      n: 2,
      title: "Can you bring a dog on a private jet?",
      hook: "Yes. And this is what it actually involves.",
      body: [
        "On a commercial flight the dog goes in the hold, if it goes at all. On a private jet the dog sits with you. That is the whole answer for most people.",
        "But there is paperwork. A pet passport, the right vaccinations, and a destination that allows animals to arrive by private aircraft. Nice does. Some islands do not.",
        "And there is the aircraft. A larger cabin with a leather floor is easier for everyone than a light jet with carpet.",
        "So: yes. Tell us early, and we will choose the aircraft and the airport around the dog.",
      ],
      cta: "Ask us the question you think is too small to ask. It is usually the one we get most.",
    },
    {
      n: 3,
      title: "The deal that nearly collapsed 24 hours before delivery",
      hook: "We nearly lost a twelve million pound aircraft deal the day before completion.",
      body: [
        "The aircraft was inspected, the money was in escrow, the crew was booked to fly it to the new owner. Then the pre-delivery flight test threw a warning on one engine.",
        "The buyer's advisor said walk away. The seller said it was a sensor. Nobody could prove either.",
        "So we did the only thing that works in this situation. We flew an engineer out that night, pulled the sensor, replaced it, and ran the test again at seven the next morning.",
        "It was the sensor. The aircraft delivered at noon. The buyer still flies it.",
      ],
      cta: "Every deal has a moment like this. The difference is who is standing next to you when it happens.",
    },
  ]),
};
