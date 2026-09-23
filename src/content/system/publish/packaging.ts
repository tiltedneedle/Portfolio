import type { Guide } from "@/content/types";

export const packaging: Guide = {
  chapter: "publish",
  slug: "packaging",
  title: "Content packaging",
  kicker: "You can create an excellent video and still lose the viewer before they ever properly watch it.",
  intro: [
    "Packaging is everything surrounding the content that influences whether someone decides it is worth their attention.",
  ],
  opener: [
    { kind: "list", style: "beat", items: ["The title.", "The cover.", "The opening text.", "The caption.", "The way the idea itself is framed."] },
    { kind: "p", text: "The objective is not to make the content sound more dramatic than it really is. It is to communicate the most interesting reason to watch as quickly as possible." },
  ],
  sections: [
    {
      n: "01",
      title: "Find the most interesting version of the idea",
      blocks: [
        { kind: "p", text: "Before writing a title, identify what is actually interesting about the video. Imagine you have filmed a tour of a Bombardier Global 7500. You could package it as:" },
        {
          kind: "swaps",
          fromLabel: "What the video contains",
          toLabel: "Why someone should care",
          pairs: [{ from: "Bombardier Global 7500 Tour", to: "How can this private jet stay in the air for over 17 hours?" }],
        },
        { kind: "p", text: "The aircraft has not changed. The footage has not changed. You have simply identified a more interesting entry point into the same subject." },
        {
          kind: "questions",
          title: "When packaging content, ask",
          items: [
            "What is surprising here?",
            "What would someone outside aviation find interesting?",
            "What question does this answer?",
            "What makes this aircraft, story or situation different?",
            "What does the audience not already know?",
          ],
        },
        { kind: "p", text: "Find that first. Then build the packaging around it." },
      ],
    },
    {
      n: "02",
      title: "Make the title easy to process",
      blocks: [
        { kind: "p", text: "People do not carefully read everything they see online. Decades of usability research consistently show that people tend to scan digital content, picking out important words and phrases rather than reading every word. That means your title has very little time to communicate the idea. The viewer should understand it almost instantly." },
        {
          kind: "swaps",
          fromLabel: "Compare",
          toLabel: "With",
          pairs: [
            { from: "Some of the important things you should consider before purchasing your first private aircraft", to: "3 Things To Check Before Buying Your First Jet" },
          ],
        },
        { kind: "p", text: "The second version requires less effort to understand. It also uses a number. Eye tracking research has found that numerals can stand out when people are scanning text because their shape is visually different from surrounding words." },
        { kind: "swaps", fromLabel: "Harder to scan", toLabel: "Easier to scan", pairs: [{ from: "Three Aircraft Buying Mistakes", to: "3 Aircraft Buying Mistakes" }] },
        { kind: "p", text: "This does not mean every title needs a number. The principle is simply:" },
        { kind: "aside", text: "Reduce the amount of work required to understand the idea." },
      ],
    },
    {
      n: "03",
      title: "Create an information gap",
      blocks: [
        { kind: "p", text: "One of the strongest reasons people continue consuming information is curiosity. Psychologist George Loewenstein described curiosity as arising when people become aware of a gap between what they know and what they want to know. Good packaging creates that gap." },
        {
          kind: "swaps",
          fromLabel: "Gives the information away",
          toLabel: "Creates a gap",
          pairs: [
            { from: "The Gulfstream G700 has 20 windows", to: "There is a reason Gulfstream windows look completely different" },
            { from: "The Global 7500 has four living spaces", to: "There is one reason some passengers prefer the Global 7500 on ultra long flights" },
          ],
        },
        { kind: "p", text: "The viewer knows there is an explanation. They do not yet know what it is. That question gives them a reason to continue. The key is not to hide everything." },
        { kind: "aside", text: "Give enough information to create interest. Withhold enough information to create curiosity." },
        {
          kind: "clips",
          title: "Titles that open a gap, from the library",
          items: [
            { id: "R0YRf0nWEw4", caption: "Would you fly in a private jet with no windows?" },
            { id: "1JyE72paX1A", caption: "Same look, completely different price tags. Here's why." },
            { id: "vvfyWPtViUY", caption: "What does it really cost to own a $15M private jet?" },
          ],
        },
      ],
    },
    {
      n: "04",
      title: "Let the cover communicate visually",
      blocks: [
        { kind: "p", text: "Your brain can understand visual information extremely quickly. MIT neuroscientists found that people could identify images shown for as little as 13 milliseconds. That is why the cover matters. Before someone has properly read the title, they may already have understood what the image is showing." },
        {
          kind: "pairs",
          aLabel: "If the video is",
          bLabel: "The cover shows",
          items: [
            { a: "Gulfstream G700 versus Global 7500", b: "Both aircraft, immediately." },
            { a: "Why are Gulfstream windows shaped like this?", b: "The window, clearly." },
            { a: "Inside one of the longest range private jets in the world", b: "The aircraft, or an immediately recognisable part of the cabin." },
          ],
        },
        { kind: "p", text: "The image and title should work together. Do not waste the cover showing something unrelated simply because it looks cinematic." },
        {
          kind: "sub",
          title: "Do not duplicate the same information",
          blocks: [
            {
              kind: "keyed",
              items: [
                { label: "If your cover says", lines: ["GULFSTREAM VS BOMBARDIER"] },
                { label: "Your title does not also need to say", lines: ["Gulfstream Versus Bombardier"] },
                { label: "Instead you could write", lines: ["Which would we actually choose?"] },
              ],
            },
            { kind: "p", text: "Now the image, cover text and title each contribute something." },
          ],
        },
      ],
    },
    {
      n: "05",
      title: "Use specificity",
      blocks: [
        { kind: "p", text: "Specific information feels more tangible than vague information." },
        {
          kind: "swaps",
          fromLabel: "Vague",
          toLabel: "Specific",
          pairs: [
            { from: "This jet has incredible range", to: "This jet can fly from London to Los Angeles nonstop" },
            { from: "This is an expensive private jet", to: "What do you actually get inside a £50 million private jet?" },
            { from: "A long flight", to: "A 14 hour flight" },
          ],
        },
        { kind: "p", text: "Numbers, locations, aircraft models, time periods and specific outcomes can make abstract ideas easier to understand. Instead of “a very large cabin”, explain what makes it large. Instead of “a rare aircraft”, explain how rare it is." },
        { kind: "aside", text: "Specificity makes the promise more concrete." },
      ],
    },
    {
      n: "06",
      title: "Use contrast",
      blocks: [
        { kind: "p", text: "The brain naturally notices differences. This makes comparisons one of the simplest ways to package information." },
        {
          kind: "lines",
          title: "In aviation this could be",
          mode: "screen",
          items: ["£10M jet versus £50M jet", "Gulfstream versus Bombardier", "First class versus private aviation", "New jet versus 15 year old jet", "Short range versus ultra long range"],
        },
        { kind: "p", text: "Contrast gives the audience an immediate framework. They know there are two things to compare and they want to understand the difference." },
      ],
    },
    {
      n: "07",
      title: "Make the cover text short",
      blocks: [
        { kind: "p", text: "Your cover is being viewed on a phone. It may appear very small on someone's profile. Do not try to explain the entire concept on it." },
        {
          kind: "swaps",
          fromLabel: "Instead of",
          toLabel: "Use",
          pairs: [
            { from: "WHY THIS PRIVATE JET CAN FLY FOR MORE THAN 14 HOURS WITHOUT STOPPING", to: "14 HOURS NONSTOP" },
            { from: "THE MOST COMMON MISTAKE FIRST TIME PRIVATE JET BUYERS MAKE", to: "BIGGEST BUYING MISTAKE" },
          ],
        },
        { kind: "p", text: "The title or video can provide the rest of the information. The cover only needs to earn the next moment of attention." },
      ],
    },
    {
      n: "08",
      title: "Use the caption to add something",
      blocks: [
        { kind: "p", text: "Do not simply transcribe the video into the caption. The viewer has already watched that information." },
        { kind: "list", title: "Instead, use the caption to add", style: "tag", items: ["Extra context", "An additional fact", "A question", "A clarification", "A relevant call to action"] },
        {
          kind: "keyed",
          items: [
            { label: "If the video compares Gulfstream and Bombardier", lines: ["If range was identical, would you choose your aircraft based on cabin size, comfort or resale value?"] },
            { label: "For an educational video", lines: ["Quoted aircraft range is not always the range you will achieve in real conditions. Passenger load, weather and reserves can all affect it."] },
          ],
        },
        { kind: "p", text: "The caption continues the conversation, or adds value, rather than repeating the video." },
      ],
    },
    {
      n: "09",
      title: "Do not destroy curiosity",
      blocks: [
        { kind: "p", text: "One of the easiest mistakes to make is giving away the entire video before it begins. Imagine the payoff of your video is that a particular Gulfstream feature makes the cabin quieter." },
        {
          kind: "swaps",
          fromLabel: "Do not write",
          toLabel: "Write",
          pairs: [{ from: "This Gulfstream Is Quieter Because Of Its Cabin Insulation", to: "Why does this Gulfstream sound so different inside?" }],
        },
        { kind: "p", text: "The first version means the viewer no longer needs the video. In the second, the title identifies the subject and the video delivers the answer." },
      ],
    },
    {
      n: "10",
      title: "Deliver what you promise",
      blocks: [
        { kind: "p", text: "Curiosity works only when the content rewards it. If the title says “The Biggest Problem With This Aircraft”, there needs to be a genuine problem. If the cover says “£70M MISTAKE”, there needs to be a legitimate reason for that claim." },
        { kind: "p", text: "If someone repeatedly clicks your content and discovers that the title exaggerated what actually happened, trust disappears." },
        { kind: "aside", text: "Strong packaging does not trick someone into watching. It identifies the genuinely interesting part of the content and makes that impossible to ignore." },
      ],
    },
    {
      title: "Before you publish",
      blocks: [
        { kind: "aside", label: "Ask one question", text: "If someone knew nothing about this video, would the title and cover give them a genuine reason to care?" },
        {
          kind: "checklist",
          title: "Then check",
          items: [
            "Is the idea understandable immediately?",
            "Is the title easy to scan?",
            "Is there curiosity?",
            "Is the most interesting part being emphasised?",
            "Does the cover visually communicate the subject?",
            "Are we being specific where possible?",
            "Have we avoided giving away the payoff?",
            "Does the video actually deliver what the packaging promises?",
          ],
        },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "Do not package the video around what it contains." },
    { kind: "p", text: "Package it around *why someone should care about what it contains.*" },
  ],
};
