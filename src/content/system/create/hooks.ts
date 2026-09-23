import type { Guide } from "@/content/types";

export const hooks: Guide = {
  chapter: "create",
  slug: "hooks",
  title: "Hooks",
  kicker: "The first few seconds decide whether someone keeps watching or scrolls past.",
  poster: "R0YRf0nWEw4",
  intro: [
    "A strong hook creates an immediate reason to pay attention.",
    "It can come from what the viewer sees, what they hear, what you say, or ideally a combination of all three.",
  ],
  film: { title: "Hooks" },
  sections: [
    {
      n: "01",
      title: "Visual hooks",
      blocks: [
        { kind: "p", text: "Before someone has even processed what you are saying, they have already seen the first frame of the video. Use something visually interesting to immediately interrupt the feed." },
        {
          kind: "list",
          title: "In aviation, this could be",
          style: "tag",
          items: [
            "Walking onto a Gulfstream",
            "Opening an aircraft door",
            "A close up of an unusual cabin feature",
            "Standing beside a Bombardier Global",
            "Entering a private terminal",
            "An aircraft taking off behind you",
            "Showing two aircraft side by side",
            "Moving through a hangar",
            "Showing something inside the cockpit",
            "Revealing an unusual aircraft configuration",
          ],
        },
        { kind: "p", text: "The visual should make someone think:" },
        { kind: "lines", mode: "spoken", items: ["What am I looking at?", "I want to see more of this."] },
      ],
    },
    {
      n: "02",
      title: "Audio hooks",
      blocks: [
        { kind: "p", text: "Sound can capture attention before the viewer has fully understood the visual." },
        {
          kind: "list",
          title: "This could be",
          items: [
            "An aircraft engine starting",
            "The cabin door closing",
            "A sudden sound change",
            "A recognisable aviation sound",
            "Music beginning at an important moment",
            "A strong first sentence delivered immediately",
          ],
        },
        { kind: "p", text: "The audio should support the content rather than distract from it." },
      ],
    },
    {
      n: "03",
      title: "Verbal hooks",
      blocks: [
        { kind: "p", text: "Your opening sentence needs to immediately give someone a reason to continue watching." },
        { kind: "lines", title: "Avoid slow introductions such as", mode: "dim", items: ["Hi everyone.", "Welcome back.", "Today I wanted to talk about..."] },
        { kind: "p", text: "Start with the interesting part." },
        {
          kind: "swaps",
          fromLabel: "Instead of",
          toLabel: "Try",
          pairs: [
            { from: "Today I am going to explain the Gulfstream G700.", to: "This jet can fly from London to almost anywhere in the world without stopping." },
            { from: "Today we are looking at private jet ownership.", to: "This is the mistake first time private jet buyers make most often." },
          ],
        },
        { kind: "p", text: "Get into the subject immediately." },
      ],
    },
    {
      n: "04",
      title: "Curiosity",
      blocks: [
        { kind: "p", text: "Give the viewer enough information to become interested without immediately revealing everything." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "There is one thing most people never notice inside a private jet.",
            "This aircraft has a feature you will not find on most jets.",
            "There is a reason this Gulfstream looks different from almost every other aircraft.",
          ],
        },
        { kind: "p", text: "The viewer should feel that continuing to watch will give them the answer." },
      ],
    },
    {
      n: "05",
      title: "Fear of missing out",
      blocks: [
        { kind: "p", text: "Show the viewer that there is something important they may not know." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "If you charter private jets regularly, you need to know this.",
            "Most first time buyers only discover this after purchasing the aircraft.",
            "Before you charter your next flight, check this first.",
          ],
        },
        { kind: "aside", text: "This works best when the information genuinely matters. Do not manufacture urgency where none exists." },
      ],
    },
    {
      n: "06",
      title: "Social proof",
      blocks: [
        { kind: "p", text: "People naturally become interested when they know something is already valued by others." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "This is one of the questions private jet buyers ask us most.",
            "There is a reason this aircraft has become so popular with long range travellers.",
            "This is one of the most requested cabin features we see.",
          ],
        },
        { kind: "p", text: "Use real proof and genuine experience wherever possible." },
      ],
    },
    {
      n: "07",
      title: "Surprise",
      blocks: [
        { kind: "p", text: "Challenge what the viewer expects." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "The biggest private jet is not necessarily the one with the longest range.",
            "This aircraft looks smaller, but it can actually fly further.",
            "Flying private does not always save you as much time as you think.",
            "The most expensive part of owning this aircraft might not be what you expect.",
          ],
        },
        { kind: "p", text: "Surprise creates a gap between what the viewer believed and what you are about to explain." },
      ],
    },
    {
      n: "08",
      title: "Authority",
      blocks: [
        { kind: "p", text: "Use your experience to give the viewer a reason to listen." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "After working in private aviation for 20 years, this is the mistake I see buyers make repeatedly.",
            "After seeing hundreds of aircraft transactions, there is one thing I would always check before buying.",
            "I spend every day around private jets, and this is something most passengers never notice.",
          ],
        },
        { kind: "p", text: "Authority works best when it comes from genuine experience rather than simply telling people you are an expert." },
      ],
    },
    {
      n: "09",
      title: "Story",
      blocks: [
        { kind: "p", text: "Start with the most interesting part of what happened. Do not spend the opening explaining all the background." },
        {
          kind: "swaps",
          fromLabel: "Instead of",
          toLabel: "Start with",
          pairs: [
            { from: "Last week we had a client who needed to travel from London to New York...", to: "Twenty minutes before departure, our client's aircraft developed a problem." },
          ],
        },
        {
          kind: "lines",
          title: "Or",
          mode: "spoken",
          items: [
            "We nearly lost this aircraft deal 24 hours before completion.",
            "I flew across Europe to inspect this aircraft and immediately found a problem.",
          ],
        },
        { kind: "p", text: "Give the viewer the situation first. Then explain how you got there." },
      ],
    },
    {
      n: "10",
      title: "Challenge",
      blocks: [
        { kind: "p", text: "Give the viewer something to solve, guess or decide." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "Can you tell which one of these jets costs more to operate?",
            "Can you identify this aircraft from the window alone?",
            "Which would you choose: Gulfstream or Bombardier?",
            "Can you guess how far this aircraft can fly without stopping?",
          ],
        },
        { kind: "p", text: "This turns passive viewing into participation." },
      ],
    },
    {
      n: "11",
      title: "Instant value",
      blocks: [
        { kind: "p", text: "Tell the viewer exactly what they are about to learn." },
        {
          kind: "lines",
          mode: "spoken",
          items: [
            "Here are three things to check before chartering a private jet.",
            "I will explain empty legs in 30 seconds.",
            "Here is the easiest way to understand private jet range.",
            "These are the three questions I would ask before buying an aircraft.",
          ],
        },
        { kind: "p", text: "This works particularly well for educational content." },
      ],
    },
    {
      n: "12",
      title: "Combine your hooks",
      blocks: [
        { kind: "p", text: "The strongest openings often use more than one type of hook." },
        {
          kind: "keyed",
          title: "For example",
          items: [
            { label: "The visual hook", lines: ["A Gulfstream is already taxiing behind you."] },
            { label: "The verbal hook, and curiosity", lines: ["“This aircraft can fly for more than 14 hours, but range is not the reason I would buy it.”"] },
          ],
        },
        { kind: "p", text: "You are giving the viewer several reasons to continue watching at the same time." },
        {
          kind: "clips",
          title: "Four openings, from the library",
          note: "Watch only the first three seconds of each. Name the hook.",
          items: [
            { id: "R0YRf0nWEw4", caption: "Challenge and surprise" },
            { id: "1JyE72paX1A", caption: "Surprise and contrast" },
            { id: "AdBomjIwksA", caption: "Instant value" },
            { id: "kgexit7JaUA", caption: "Curiosity and authority" },
          ],
        },
      ],
    },
    {
      title: "Name the hook",
      blocks: [
        { kind: "p", text: "Twelve openings from this page. Read the line, name the hook, turn the card." },
        {
          kind: "flashcards",
          items: [
            { front: "This jet can fly from London to almost anywhere in the world without stopping.", back: "Verbal, and surprise" },
            { front: "There is one thing most people never notice inside a private jet.", back: "Curiosity" },
            { front: "Before you charter your next flight, check this first.", back: "Fear of missing out" },
            { front: "This is one of the questions private jet buyers ask us most.", back: "Social proof" },
            { front: "This aircraft looks smaller, but it can actually fly further.", back: "Surprise" },
            { front: "After working in private aviation for 20 years, this is the mistake I see buyers make repeatedly.", back: "Authority" },
            { front: "We nearly lost this aircraft deal 24 hours before completion.", back: "Story" },
            { front: "Can you tell which one of these jets costs more to operate?", back: "Challenge" },
            { front: "I will explain empty legs in 30 seconds.", back: "Instant value" },
            { front: "A Gulfstream is already taxiing behind you.", back: "Visual" },
            { front: "The cabin door closes, and the engines start.", back: "Audio" },
            { front: "This aircraft can fly for more than 14 hours, but range is not the reason I would buy it.", back: "Verbal, curiosity and authority" },
          ],
          note: "If you can name it, you can write it. Now write three of your own before you film.",
        },
      ],
    },
    {
      title: "Before you film",
      blocks: [
        {
          kind: "checklist",
          title: "Look at the opening of your video and ask",
          items: [
            "Is the first visual interesting?",
            "Does the first sentence start immediately?",
            "Is there a clear reason to keep watching?",
            "Have we created curiosity?",
            "Are we revealing too much too early?",
            "Does the hook accurately represent what the video delivers?",
            "Could we remove anything before the interesting part begins?",
          ],
        },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "Do not start with context." },
    { kind: "p", text: "Start with the reason someone should care. Then earn their attention for the rest of the video." },
  ],
};
