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
    "Current positioning": {
      verdict: "weak",
      score: 3,
      first: 2,
      body: [
        "Someone landing on the account today sees a charter company. The bio says luxury, lifestyle and travel; the grid is aircraft exteriors, sunsets and cabin shots without people. Nothing tells a visitor who is behind the business, what it is like to work with you, or why a first time flyer should trust you with a £40,000 booking.",
        "The access you actually have is extraordinary: three managed aircraft, a base at Farnborough, a founder who has sold over a hundred jets and a team that handles the strangest requests in the industry every week. None of that is on screen yet.",
      ],
      working: ["The name is short, clean and searchable", "The grid is consistent in colour and tone"],
      limiting: ["No people, no voice, no proof of who is behind the business", "A bio that says lifestyle, not charter, sales and management"],
      change: ["Rewrite the bio to say what you do and where you fly from", "Put James in the profile image or the first pinned video"],
    },
    "Current content": {
      verdict: "mixed",
      score: 4,
      body: [
        "Forty-seven posts in twelve months, almost all photographs. Four videos, three of which are cinematic cabin tours with music and no speech. Average reach of 1,200; the best performing post (a client's dog on the tarmac) reached 9,400. The audience responds when a person or a story appears, and the account rarely gives them one.",
      ],
      working: ["The dog on the tarmac: a person, a story, and eight times the reach"],
      limiting: ["Photographs over video, nine to one", "Music-only tours with nobody speaking"],
      change: ["Fifteen videos before the next photograph", "A person and a sentence in the first second of every video"],
      evidence: [{ id: "kgexit7JaUA", caption: "Stand-in from the studio library: a person and a question in the first second" }],
    },
    Hooks: {
      verdict: "weak",
      score: 2,
      first: 1,
      body: [
        "The four videos open on a logo animation, a slow exterior pan, a drone shot and a title card. In each case the first spoken word arrives after four seconds. On a feed where the decision is made in one, that is the single biggest reason the videos stop at a few hundred views.",
      ],
      working: ["The drone shot is beautiful. It belongs at second eight, not second one"],
      limiting: ["Logo animations and title cards before anything is said", "Four seconds to the first word"],
      change: ["Open on the aircraft door, the tarmac, or James mid-sentence", "Say the most interesting thing first and the company name last"],
    },
    Topics: {
      verdict: "mixed",
      score: 5,
      body: [
        "The subjects are aircraft and destinations, which is what every competitor covers too. The questions clients actually ask on the phone (what a flight costs, what an empty leg is, whether the dog can come) have never been answered on the account, and they are the searches people run before they book.",
      ],
      working: ["Aircraft type content matches a real interest in the audience"],
      limiting: ["No answers to the questions that lead to a booking", "Nothing about ownership, which is half the business"],
      change: ["Start with the ten most asked questions from the enquiry inbox", "Give aircraft sales its own run of videos"],
    },
    "Video formats": {
      verdict: "mixed",
      score: 4,
      body: [
        "Three formats have been tried: the cinematic tour, the drone reel and the caption over a photograph. All three are formats the audience scrolls past because they have seen a hundred of them. The formats the access supports (a walkaround with commentary, a comparison, a day at the FBO, the founder answering one question) have not been tried at all.",
      ],
      working: ["Production quality is already high enough for any format"],
      limiting: ["Formats chosen for how they look, not for what they say"],
      change: ["Walkaround with commentary, comparison, one question, a day in the life", "One format per video, named in the title"],
    },
    Filming: {
      verdict: "strong",
      score: 7,
      body: [
        "The footage is well exposed, steady and composed; whoever shoots it has an eye. The gap is coverage: wide, beautiful shots and almost nothing close. There are no hands, no controls, no faces, and no cutaways to move to when someone is talking.",
      ],
      working: ["Exposure, stability and composition", "Access to the aircraft at any hour"],
      limiting: ["No close-ups or details to cut to", "Nobody has spoken to camera yet, so audio is untested"],
      change: ["Shoot four sizes of every subject", "Test a lapel microphone in the cabin and on the apron before the first talking video"],
    },
    Editing: {
      verdict: "mixed",
      score: 5,
      body: [
        "The edits are slow and elegant, which suits a showreel and not a feed. Cuts arrive every four to six seconds; the best performing videos in this market cut every one to two. There are no captions, so the videos are silent for the majority who scroll with the sound off.",
      ],
      working: ["Colour and music choices are consistent"],
      limiting: ["A pace built for a showreel", "No captions"],
      change: ["Cut on the sentence, not the shot", "Captions on every video, in the brand's type"],
    },
    Posting: {
      verdict: "weak",
      score: 3,
      first: 3,
      body: [
        "Forty-seven posts in a year is one a week on average, but in practice it is four in one week and nothing for a month. Instagram only; the same videos would reach a different audience on YouTube Shorts and TikTok at no extra cost. Posting times cluster around four in the afternoon on weekdays, which your own analytics show is the quietest window for this audience.",
      ],
      working: ["The account has never gone completely dark"],
      limiting: ["Bursts, not a cadence", "One platform", "The quiet window"],
      change: ["One video every other day, from a bank of fifteen", "Instagram, YouTube Shorts and TikTok together", "Test early morning and late evening first"],
    },
    Profile: {
      verdict: "weak",
      score: 3,
      body: [
        "The profile does not say charter, sales or management anywhere in the first line. The link leads to the home page. There is no pinned content and there are no highlight covers, so a new visitor has to scroll to work out what the business does.",
      ],
      working: ["The handle is short and matches the name"],
      limiting: ["A bio that could belong to a travel blogger", "A link to nowhere in particular", "Nothing pinned"],
      change: ["Name field: Horizon Aviation | Private Jet Charter", "Link straight to the enquiry page", "Pin one tour, one explanation, one story"],
    },
    "What is working": {
      verdict: "strong",
      score: 6,
      body: [
        "The access, the founder, the crew, the aircraft and the base. The one post with a person and a story reached eight times the average. The photography is good and the brand looks expensive, which is the right problem to have: the audience already believes the product, they just have not met anyone.",
      ],
      working: ["Access nobody else in the market has", "A founder with a hundred sales' worth of stories", "A look that already reads as premium"],
    },
    "What is holding you back": {
      verdict: "weak",
      score: 3,
      body: ["Three things, in order. Nobody speaks. The first second is wasted. The account posts in bursts to one platform. Fix those and the existing quality of the footage does the rest."],
      limiting: ["No voice on camera", "Four seconds to the first word", "Bursts, not a cadence"],
    },
    "Biggest opportunities": {
      verdict: "strong",
      score: 8,
      body: [
        "The behind-the-scenes lane in private aviation is empty. Every competitor is either polished promotion or plain education. Horizon is the only account with daily access to the operation itself: the handovers, the midnight problems, the requests nobody expects.",
      ],
      change: ["Own the operation: film what happens behind a booking", "Answer the questions people search before they charter", "Make James the face of both"],
    },
    "What we would change": {
      verdict: "strong",
      score: 8,
      body: [
        "Put James on camera. He is the most interesting thing about the business and he has never appeared in a post. Film at the aircraft, not in the office: the hangar at Farnborough, the cabin, the door opening, the terminal at six in the morning.",
        "Lead with the questions clients ask on every call: what does a flight actually cost, what is an empty leg, can you bring the dog. Then build the first content bank of fifteen videos around them before publishing anything.",
      ],
      change: ["James on camera, at the aircraft", "The ten most asked questions first", "A bank of fifteen before anything is published"],
    },
  }),

  competitorIntelligence: report(
    COMPETITOR_INTRO,
    competitorHeadings,
    {
      "Competitors analysed": {
        body: [
          "Six accounts: two charter brokers of a similar size, two aircraft sales houses, one pilot creator with 400,000 followers, and one manufacturer's official channel. Between them they published 340 videos in the last six months.",
        ],
        lists: [
          { label: "Direct", items: ["Skyline Charter, Instagram, 18k", "Meridian Jets, Instagram, 26k", "Altitude Sales, LinkedIn and YouTube, 9k"] },
          { label: "Adjacent", items: ["Captain Ren, TikTok and YouTube, 400k", "A manufacturer's official channel, YouTube, 1.2m", "A luxury travel magazine, Instagram, 210k"] },
        ],
      },
      "Best performing content": {
        body: [
          "The outliers are almost all one format: a person inside an aircraft answering a single question the public cannot answer themselves. “What does it cost to own this?”, “Can you land this anywhere?”, “Why are the windows this shape?”. The pilot creator's top ten are all of this kind and average two million views against a channel average of 80,000.",
        ],
        lists: [
          {
            label: "The top five, all one format",
            items: ["“What does it cost to own this?” 3.1m", "“Can you land this anywhere?” 2.4m", "“Why are the windows this shape?” 1.9m", "“Inside a £60m cabin” 1.6m", "“A pilot's pre-flight in sixty seconds” 1.2m"],
          },
        ],
      },
      "Best topics": {
        body: [
          "Cost, range and access. The market's audience wants to know what things cost, how far aircraft fly and what it is like inside. Every one of the top thirty videos across the six accounts is one of those three subjects.",
        ],
        lists: [{ label: "In order", items: ["What it costs", "How far it flies", "What it is like inside", "How to buy one", "What can go wrong"] }],
      },
      "Best formats": {
        body: [
          "One person, inside the aircraft, answering one question. Then side by side comparisons. Then the walkaround with commentary. The cinematic reel without speech, the format Horizon has used most, is the worst performing format across all six accounts.",
        ],
        lists: [
          {
            label: "By views per video",
            items: ["One question, one answer, inside the aircraft", "Side by side comparison", "Walkaround with commentary", "Day in the life", "Cinematic reel, no speech"],
          },
        ],
      },
      "Best hooks": {
        body: ["The openings that work start with a number, a contradiction or a question the viewer cannot answer. The camera is already inside the aircraft; the person is already mid-sentence."],
        lists: [
          {
            label: "Openings from the top thirty",
            items: [
              "“This flight costs £40,000 and the jet is the cheap part.”",
              "“The biggest jet is not the one that flies furthest.”",
              "“Can you guess which of these costs more to run?”",
              "“Nobody tells you this before you buy a jet.”",
            ],
          },
        ],
      },
      "Common patterns": {
        body: ["A face in the first second. A sentence, not a title card. A subject a stranger would care about. Captions on. Under sixty seconds. Posted at least three times a week, to more than one platform."],
        lists: [{ label: "The pattern", items: ["A person in the first second", "A sentence before a logo", "One question per video", "Captions always on", "Three or more posts a week", "The same video on every platform"] }],
      },
      "Content gaps": {
        body: [
          "Nobody in the market shows the operation. The bookings, the handovers, the crew preparation, the problems that get solved at midnight. Every competitor is either polished promotion or pure education; the behind-the-scenes documentary lane is empty, and Horizon is the only one of the six with daily access to it.",
        ],
        lists: [{ label: "Nobody is doing", items: ["The operation behind a booking", "The crew's side of a flight", "What goes wrong, and how it is fixed", "Aircraft sales explained plainly"] }],
      },
      "Opportunities for you": {
        body: [
          "Horizon can own the documentary lane immediately: it is the only account with the access, and James is the only person across the six who has both sold aircraft and flown clients for twenty years. Combine the market's proven format (one question, one answer, inside the aircraft) with the subject nobody else can film (the operation), and the account is different from every competitor from the first video.",
        ],
        lists: [{ label: "Three lanes, in order", items: ["The operation, filmed as it happens", "The ten questions, answered by James inside the aircraft", "Sales explained plainly, for the buyer who has never bought"] }],
      },
    },
    {
      competitors: [
        {
          name: "Skyline Charter",
          handle: "@skylinecharter",
          platform: "instagram",
          followers: "18k",
          cadence: "2/wk",
          note: "Beautiful and silent. Every video is a reel with music; nobody speaks.",
          strengths: ["Consistent look", "Fast replies in comments"],
          gaps: ["No people on screen", "No answers to buyer questions"],
        },
        {
          name: "Meridian Jets",
          handle: "@meridianjets",
          platform: "instagram",
          followers: "26k",
          cadence: "4/wk",
          note: "The broker who posts most. The founder appears once a month, and those are the top videos.",
          strengths: ["Cadence", "Founder videos travel"],
          gaps: ["Founder appears rarely", "Instagram only"],
        },
        {
          name: "Altitude Sales",
          handle: "@altitudesales",
          platform: "linkedin",
          followers: "9k",
          cadence: "1/wk",
          note: "Sales explained well, in text. The videos are slide decks with a voice over.",
          strengths: ["Knows the buyer", "Detail nobody else offers"],
          gaps: ["No aircraft on screen", "No short form"],
        },
        {
          name: "Captain Ren",
          handle: "@captainren",
          platform: "tiktok",
          followers: "400k",
          cadence: "daily",
          note: "A pilot creator. One question, one answer, inside the cockpit: the format the whole market copies.",
          strengths: ["The format", "Volume", "Hooks"],
          gaps: ["No access to sales or operations", "Cannot show the business side"],
        },
      ],
      map: {
        x: ["Polished promotion", "Plain education"],
        y: ["Posts rarely", "Posts daily"],
        points: [
          { name: "Skyline Charter", x: 0.2, y: 0.35 },
          { name: "Meridian Jets", x: 0.3, y: 0.6 },
          { name: "Altitude Sales", x: 0.78, y: 0.28 },
          { name: "Captain Ren", x: 0.85, y: 0.9 },
          { name: "Manufacturer", x: 0.15, y: 0.72 },
          { name: "Horizon", x: 0.1, y: 0.12, you: true },
        ],
      },
    }
  ),

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
      location: "Farnborough, on the apron beside the Global",
      onCamera: "James",
      from: { pillar: "authority", n: 4 },
      shots: [
        "Open on James walking out of the terminal towards the aircraft, mid-sentence",
        "Cabin door opening, from the inside",
        "Fuel truck pulling up, wide",
        "Close on the catering being loaded",
        "James in the cabin doorway for the last line",
      ],
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
      location: "Inside the Global cabin, dog on the seat if one is available",
      onCamera: "James, or the cabin crew lead",
      from: { pillar: "education", n: 7 },
      shots: [
        "Open on the dog on the leather seat, then pull back to James",
        "Pet passport in hand, close",
        "Cabin floor and seat materials, detail",
        "James at the door: the last line to camera",
      ],
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
      location: "The hangar at night, one work light on",
      onCamera: "James",
      from: { pillar: "personal", n: 1 },
      shots: [
        "James in the dark hangar, work light behind, the first line",
        "Engine cowling, close, slow",
        "A phone lighting a face: the midnight call",
        "Dawn on the apron, wide, for the flight test line",
        "James walking away from camera towards the aircraft for the ending",
      ],
    },
  ]),

  notes: {
    "create/hooks": [
      { text: "Your first second is the aircraft door, the apron at six in the morning, or James mid-sentence. Never the logo, never a drone shot." },
      { at: 3, text: "The verbal hook that will work hardest for you is a number: what a flight costs, how far a jet flies, how long a deal took. Start there." },
    ],
    "create/filming": [
      { at: 12, text: "Your four sizes are: the aircraft on the apron, James at the door, James's face in the cabin, and a detail (the throttle, the leather, the passport). Get all four every time you film." },
      { at: 6, text: "Test the lapel microphone on the apron with an engine running before the first talking video. Wind and turbines will decide where you can speak." },
    ],
    "create/editing": [{ at: 1, text: "Cut every one to two seconds in the first ten. Your tours cut every four to six; that is the difference between a showreel and a feed." }],
    "create/study-your-niche": [{ text: "Your niche is not private aviation. It is people who are about to spend real money on it for the first time: chartering, then owning. Write for them." }],
    "publish/strategy": [{ at: 1, text: "Your first bank of fifteen: the ten questions from the enquiry inbox, three from the operation, two from James's own stories." }],
    "publish/profile": [{ at: 2, text: "Horizon Aviation | Private Jet Charter. That is the name field. Then the link goes to the enquiry page, not the home page." }],
    "analyse/understanding-your-analytics": [{ at: 2, text: "Your first outlier already exists: the dog on the tarmac. A person, a story, eight times the reach. Make more of it before you make anything else." }],
  },
};
