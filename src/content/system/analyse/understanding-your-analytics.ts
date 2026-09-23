import type { Guide } from "@/content/types";

export const understandingYourAnalytics: Guide = {
  chapter: "analyse",
  slug: "understanding-your-analytics",
  title: "Understanding your analytics",
  kicker: "Analytics should answer one question.",
  poster: "BC_ZaHvv01U",
  intro: ["What should we do differently in the next video?"],
  opener: [
    {
      kind: "p",
      text: "The objective is not to look backwards and decide whether a video was good or bad. It is to understand what happened, identify patterns and use those findings to improve the next content bank.",
    },
  ],
  sections: [
    {
      n: "01",
      title: "Look at retention first",
      blocks: [
        { kind: "p", text: "Retention helps you understand where attention was lost." },
        {
          kind: "split",
          a: {
            label: "If viewers leave immediately, look at",
            items: ["The hook", "The first visual", "How quickly you get to the point", "Whether the subject is immediately clear"],
          },
          b: {
            label: "If they stay through the opening but leave later, look at",
            items: ["Slow pacing", "Too much explanation", "Repetition", "Not enough visual change", "The answer becoming obvious too early", "The story drifting away from the original hook"],
          },
        },
        { kind: "retention", title: "Where attention is lost", note: "Every retention graph has the same two exits. Read yours for which one is open." },
        {
          kind: "aside",
          label: "Action point",
          text: "If viewers leave early, improve the opening. If they leave halfway through, improve the structure and pacing. If retention remains strong, reuse that structure with another aviation topic.",
        },
      ],
    },
    {
      n: "02",
      title: "Identify your outliers",
      blocks: [
        { kind: "p", text: "Pay close attention when a video performs significantly better than your usual content. Do not simply celebrate the views and move on. Ask what changed." },
        {
          kind: "list",
          title: "Was it",
          style: "tag",
          items: ["The topic", "The aircraft", "The hook", "The person on camera", "The format", "The story", "The access", "The title"],
        },
        { kind: "p", text: "For example, if Gulfstream versus Bombardier videos repeatedly outperform standard aircraft tours, the lesson may be that your audience responds strongly to comparisons." },
        {
          kind: "aside",
          label: "Action point",
          text: "Take the strongest element from the video and test it again. Create another comparison. Use the same hook structure on another topic. Use the same person on camera. Test another aircraft using the same format. The goal is to discover whether the success can be repeated.",
        },
      ],
    },
    {
      n: "03",
      title: "Study shares and saves",
      blocks: [
        { kind: "p", text: "Shares and saves show that the content created value beyond simply being watched." },
        {
          kind: "keyed",
          items: [
            { label: "A high number of shares often means", lines: ["“Someone else needs to see this.”"] },
            { label: "A high number of saves often means", lines: ["“I want to come back to this.”"] },
          ],
        },
        { kind: "p", text: "An unusual aircraft feature may generate shares. A guide explaining what to check before purchasing an aircraft may generate saves." },
        {
          kind: "aside",
          label: "Action point",
          text: "If something gets shared heavily, create more surprising or conversation worthy angles around that subject. If something gets saved heavily, create more useful educational content around it. Do not abandon a strong subject after one video. Build around it.",
        },
      ],
    },
    {
      n: "04",
      title: "Use comments as content research",
      blocks: [
        { kind: "p", text: "Do not simply count comments. Read them." },
        {
          kind: "list",
          title: "Look for",
          items: ["Repeated questions", "Disagreements", "Misconceptions", "Requests for comparisons", "Aircraft people repeatedly mention", "Subjects people want explained further"],
        },
        { kind: "p", text: "If you publish a Gulfstream versus Bombardier comparison and the comments repeatedly ask about Dassault Falcon, your audience has already given you another idea." },
        {
          kind: "aside",
          label: "Action point",
          text: "Save repeated questions. Turn strong comments into videos. Use disagreements as discussion topics. Look for themes that could become recurring content series.",
        },
      ],
    },
    {
      n: "05",
      title: "Look at followers and profile visits",
      blocks: [
        { kind: "p", text: "Some videos get attention. Other videos make people want to know more about you. That difference matters." },
        { kind: "p", text: "You may find that cinematic aircraft content generates the largest reach while educational aviation videos generate more followers and profile visits. One attracts attention. The other builds the audience." },
        {
          kind: "aside",
          label: "Action point",
          text: "Identify which topics and formats repeatedly generate followers and profile visits. Create more of them. Do not judge the value of a video purely by total views.",
        },
      ],
    },
    {
      n: "06",
      title: "Diagnose underperforming content",
      blocks: [
        { kind: "p", text: "When a video performs badly, do not immediately assume the idea was bad. Work through the video in order." },
        {
          kind: "questions",
          title: "Ask",
          items: [
            "Did the idea give people a reason to care?",
            "Was the hook strong enough?",
            "Did the opening visual support the hook?",
            "Did we get to the point quickly?",
            "Did the middle maintain interest?",
            "Were there enough visual changes?",
            "Did we reveal the answer too early?",
            "Did the ending deliver the promised payoff?",
            "Was the title and cover strong enough?",
          ],
        },
        {
          kind: "flow",
          title: "Diagnose a video",
          steps: [
            { q: "Did they leave in the first three seconds?", yes: "The hook and the first visual. Nothing else yet." },
            { q: "Did they leave before the point was made?", yes: "Get to the point sooner. Cut the introduction." },
            { q: "Did they drift away through the middle?", yes: "Pacing: more visual change, less repetition, hold the answer back." },
            { q: "Did they watch to the end and do nothing?", yes: "The payoff, or the call to action." },
            { q: "Did few people start it at all?", yes: "The title and the cover, not the video." },
          ],
          end: "Then, and only then, the idea.",
        },
        {
          kind: "aside",
          label: "Action point",
          text: "Identify the most likely weakness. Change that element in the next video. Do not change everything at once or you will not know what actually made the difference.",
        },
      ],
    },
    {
      n: "07",
      title: "Look for patterns across multiple videos",
      blocks: [
        { kind: "p", text: "One result is not enough to completely change your strategy. Look across multiple videos." },
        {
          kind: "questions",
          items: [
            "Do aircraft comparisons repeatedly outperform tours?",
            "Do founder stories hold attention longer?",
            "Do Q&A videos generate more saves?",
            "Does one person consistently perform better on camera?",
            "Do videos filmed inside aircraft outperform office based content?",
            "Do certain manufacturers create significantly more interest?",
          ],
        },
        { kind: "p", text: "This is where analytics becomes genuinely useful. You stop reacting to individual videos and start understanding your audience." },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "Do not use analytics to decide whether a video was simply successful or unsuccessful." },
    { kind: "p", text: "Use analytics to understand *why it performed the way it did* and what that teaches you about what to create next." },
  ],
};
