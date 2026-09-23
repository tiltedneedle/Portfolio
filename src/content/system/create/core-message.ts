import type { Guide } from "@/content/types";

export const coreMessage: Guide = {
  chapter: "create",
  slug: "core-message",
  title: "Deliver your core message",
  kicker: "Once you have captured attention, you need to earn it.",
  intro: [
    "The viewer should quickly understand what the video is about and feel that every sentence is taking them closer to the answer, result or payoff.",
    "Do not make people work to understand your point.",
  ],
  film: { title: "Deliver your core message" },
  sections: [
    {
      n: "01",
      title: "Get to the point quickly",
      blocks: [
        { kind: "p", text: "Remove unnecessary introductions and background information." },
        {
          kind: "list",
          items: [
            "If you are explaining why two private jets have different ranges, start explaining the difference.",
            "If you are telling the story of an aircraft deal that nearly collapsed, get into what went wrong.",
            "If you are comparing a Gulfstream with a Bombardier, start with the comparison.",
          ],
        },
        { kind: "aside", text: "Every sentence should move the video forward." },
      ],
    },
    {
      n: "02",
      title: "One video, one core message",
      blocks: [
        { kind: "p", text: "Do not try to explain everything you know in one video. Choose one clear takeaway." },
        {
          kind: "list",
          title: "For example",
          items: [
            "Why aircraft range changes depending on how many passengers are onboard.",
            "Why two jets with similar cabin sizes can have very different operating capabilities.",
            "What buyers should check before purchasing a pre owned aircraft.",
            "Why an empty leg exists.",
          ],
        },
        { kind: "p", text: "You can always make another video. A clear message is easier to understand, remember and share." },
      ],
    },
    {
      n: "03",
      title: "Give information in the right order",
      blocks: [
        { kind: "p", text: "Think about what the viewer needs to know first. Then what they need to know next. Then what they need to understand the conclusion. Avoid jumping between different points." },
        {
          kind: "steps",
          title: "A simple structure",
          items: [
            { title: "Hook", text: "Give them a reason to watch." },
            { title: "Context", text: "Give them only the information required to understand the subject." },
            { title: "Core message", text: "Deliver the main information, explanation or story." },
            { title: "Payoff", text: "Answer the question or complete the story." },
            { title: "Action", text: "Where relevant, tell the viewer what to do next." },
          ],
        },
      ],
    },
    {
      n: "04",
      title: "Keep creating reasons to watch",
      blocks: [
        { kind: "p", text: "Do not rely entirely on the opening hook. Throughout the video, continue creating curiosity." },
        {
          kind: "lines",
          title: "For example",
          mode: "spoken",
          items: [
            "But range is only part of the reason.",
            "This is where it becomes interesting.",
            "There is one major difference most passengers will never notice.",
            "But that creates another problem.",
          ],
        },
        { kind: "p", text: "Each section should naturally lead into the next." },
      ],
    },
    {
      n: "05",
      title: "Show, do not just explain",
      blocks: [
        { kind: "p", text: "Aviation gives you a major advantage because many of the subjects you discuss can be shown visually." },
        {
          kind: "pairs",
          aLabel: "If you are talking about",
          bLabel: "Show",
          items: [
            { a: "Cabin space", b: "The cabin." },
            { a: "Window size", b: "The windows." },
            { a: "Luggage capacity", b: "The compartment." },
            { a: "Two aircraft", b: "Both aircraft, where possible." },
            { a: "A process at an FBO", b: "The process." },
          ],
        },
        { kind: "p", text: "Let the visuals carry part of the explanation." },
      ],
    },
    {
      n: "06",
      title: "Make complex information simple",
      blocks: [
        { kind: "p", text: "Aviation can become technical very quickly. Your job is not to prove how much you know. Your job is to make what you know easy to understand." },
        { kind: "p", text: "Avoid unnecessary terminology when simpler language will work. If technical terminology is important, explain what it means." },
        { kind: "aside", text: "Someone should be able to understand the video even if they have never worked in aviation." },
      ],
    },
    {
      n: "07",
      title: "Use specific details",
      blocks: [
        { kind: "p", text: "Specific information makes content more credible and interesting." },
        {
          kind: "swaps",
          fromLabel: "Instead of",
          toLabel: "Say",
          pairs: [
            { from: "This jet has a very long range.", to: "What that range allows someone to do." },
            { from: "This cabin is very large.", to: "What makes it different." },
            { from: "Buying an aircraft is complicated.", to: "The specific part buyers often underestimate." },
          ],
        },
        { kind: "p", text: "Specificity makes the information feel real." },
      ],
    },
    {
      n: "08",
      title: "Remove everything that does not add value",
      blocks: [
        { kind: "p", text: "Once the script is written, go through it again." },
        {
          kind: "questions",
          title: "For every sentence, ask",
          items: [
            "Does this sentence teach something?",
            "Does it progress the story?",
            "Does it create curiosity?",
            "Does it add context the viewer actually needs?",
          ],
        },
        { kind: "p", text: "If not, remove it. Short form content rewards clarity." },
      ],
    },
    {
      n: "09",
      title: "End with the payoff",
      blocks: [
        { kind: "p", text: "The viewer watched because the opening created an expectation. Deliver on it." },
        {
          kind: "list",
          items: [
            "If you asked a question, answer it.",
            "If you started a story, complete it.",
            "If you promised a comparison, give the conclusion.",
            "If you created curiosity around an aircraft feature, show it.",
          ],
        },
        { kind: "aside", text: "Never make the audience feel that the video wasted their time." },
      ],
    },
    {
      n: "10",
      title: "Use calls to action when they make sense",
      blocks: [
        { kind: "p", text: "Not every video needs to end with “Follow for more.” The call to action should fit the content." },
        {
          kind: "list",
          title: "You might ask people to",
          style: "tag",
          items: [
            "Follow for more aviation content",
            "Comment which aircraft they would choose",
            "Ask another aviation question",
            "Visit your website",
            "Send an enquiry",
            "Watch the next part",
          ],
        },
        { kind: "p", text: "Or sometimes simply end the video once the value has been delivered." },
      ],
    },
    {
      title: "Before you film",
      blocks: [
        {
          kind: "checklist",
          title: "Read the script and ask",
          items: [
            "Is there one clear message?",
            "Does the video move quickly?",
            "Is there unnecessary background information?",
            "Does every sentence add something?",
            "Could anything be explained more simply?",
            "Are we showing what we are talking about wherever possible?",
            "Does the ending deliver on the opening?",
          ],
        },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "Capture attention with the hook." },
    { kind: "p", text: "Then reward that attention by getting to the point and delivering exactly what you promised." },
  ],
};
