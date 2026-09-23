import type { Guide } from "@/content/types";

export const studyYourNiche: Guide = {
  chapter: "create",
  slug: "study-your-niche",
  title: "Study your niche",
  kicker: "Stop guessing. Start with evidence.",
  poster: "kgexit7JaUA",
  intro: [
    "Before you create content, you need to understand what is already capturing attention within your market.",
    "One of the biggest mistakes brands make is creating content based purely on what they think people want to see. We take a different approach. We study what the audience is already responding to and use that information to make smarter creative decisions.",
    "The objective is not to copy other people. The objective is to understand what is working and why.",
  ],
  film: { title: "Study your niche" },
  sections: [
    {
      n: "01",
      title: "Find the right accounts",
      blocks: [
        { kind: "p", text: "Start by identifying the strongest accounts within your space." },
        {
          kind: "list",
          title: "Look at",
          items: [
            "Direct competitors",
            "Industry leaders",
            "Founders and personalities within your industry",
            "Creators speaking to the same audience",
            "Businesses targeting the same customer",
          ],
        },
        {
          kind: "aside",
          text: "Do not only look at the biggest accounts. A smaller creator consistently generating high views can often teach you more than a large company with millions of followers.",
        },
      ],
    },
    {
      n: "02",
      title: "Find their outlier content",
      blocks: [
        { kind: "p", text: "Do not judge an account based on its average content. Look for the videos that significantly outperform everything else they post." },
        { kind: "p", text: "If someone normally receives 20,000 views and one video receives 500,000 views, pay attention. Something about that video connected with a much larger audience." },
        {
          kind: "list",
          title: "Study",
          style: "tag",
          items: [
            "The topic",
            "The opening line",
            "The format",
            "The question being answered",
            "The story",
            "The visual",
            "The length",
            "The way the information was presented",
            "The comments",
          ],
        },
        { kind: "p", text: "Your job is to work out why people cared." },
        {
          kind: "clips",
          title: "Outliers, from the library",
          note: "Most of this account's clips land between fifty thousand and three hundred thousand views. These three passed a million. Work out why.",
          items: [
            { id: "kgexit7JaUA", caption: "1.8 million views" },
            { id: "BC_ZaHvv01U", caption: "1.3 million views" },
            { id: "RRfOAyW0gAs", caption: "1.3 million views" },
          ],
        },
      ],
    },
    {
      n: "03",
      title: "Look for patterns",
      blocks: [
        { kind: "p", text: "One successful video can be luck. Repeated success usually reveals a pattern." },
        {
          kind: "questions",
          title: "Ask",
          items: [
            "Which topics repeatedly perform?",
            "Which questions keep appearing?",
            "Which formats are generating views?",
            "Which hooks are being used repeatedly?",
            "Which subjects generate the most comments?",
            "Which videos are being shared?",
            "Which videos are attracting people outside the immediate industry?",
          ],
        },
        { kind: "p", text: "These patterns show you what the market is responding to." },
      ],
    },
    {
      n: "04",
      title: "Study the audience",
      blocks: [
        { kind: "p", text: "The comments section is one of the best research tools available to you." },
        {
          kind: "list",
          title: "Look for",
          items: [
            "Questions people repeatedly ask",
            "Things people disagree about",
            "Common misconceptions",
            "Problems people mention",
            "Stories people respond emotionally to",
            "Topics people want explained further",
            "Questions left unanswered by the original video",
          ],
        },
        { kind: "p", text: "Every one of these can become another piece of content." },
      ],
    },
    {
      n: "05",
      title: "Look outside your industry",
      blocks: [
        { kind: "p", text: "Some of the best content ideas will not come from your direct competitors. Study creators in completely different industries." },
        {
          kind: "list",
          title: "Look at how they",
          style: "tag",
          items: [
            "Start videos",
            "Tell stories",
            "Create curiosity",
            "Use different formats",
            "Present information",
            "Build recurring series",
            "Make technical subjects entertaining",
          ],
        },
        { kind: "questions", title: "Then ask", items: ["How could we apply this format to our industry?"] },
        { kind: "aside", text: "You are borrowing the structure, not copying the content." },
      ],
    },
    {
      n: "06",
      title: "Separate the idea from the execution",
      blocks: [
        { kind: "p", text: "A video can perform because of the idea, the execution or both. Learn to separate them." },
        {
          kind: "keyed",
          title: "For example",
          items: [
            { label: "The idea", lines: ["“What is the biggest mistake people make when buying a private jet?”"] },
            {
              label: "The execution",
              lines: ["A direct to camera answer", "An interview", "A reaction", "A story", "A comparison", "A voiceover"],
            },
          ],
        },
        { kind: "p", text: "A completely different execution can be used for the same underlying idea. This is how one strong idea can become multiple pieces of content." },
      ],
    },
    {
      n: "07",
      title: "Build a research habit",
      blocks: [
        { kind: "p", text: "Do not only research when you need something to post. Make studying your niche part of your normal routine." },
        {
          kind: "list",
          title: "Save",
          style: "tag",
          items: [
            "Strong videos",
            "Interesting hooks",
            "Formats you could adapt",
            "Questions from comments",
            "Industry stories",
            "Ideas from completely different markets",
          ],
        },
        { kind: "p", text: "The more information you collect, the easier content creation becomes." },
      ],
    },
  ],
  rule: [
    {
      kind: "swaps",
      fromLabel: "Never ask",
      toLabel: "Ask",
      pairs: [
        {
          from: "What should we post?",
          to: "What is already capturing attention, why is it working and how can we create our own version of the underlying idea?",
        },
      ],
    },
    { kind: "p", text: "That is how you stop guessing and start making content based on evidence." },
  ],
};
