import type { Guide } from "@/content/types";

export const discoverability: Guide = {
  chapter: "publish",
  slug: "discoverability",
  title: "Discoverability",
  kicker: "Creating strong content is the first objective.",
  example: { client: "The Jet Business", handle: "thejetbusiness" },
  poster: "WtFrrO8SvTE",
  intro: [
    "The second is helping the platforms understand what that content is about and who might be interested in it.",
    "This matters because social platforms are increasingly becoming search engines as well as entertainment platforms.",
    "The examples here are from *The Jet Business*, a client whose films are on the showreel. Read them as a worked example: the principle is the same in your field, the specifics are yours.",
  ],
  opener: [
    {
      kind: "typewriter",
      title: "Someone might search",
      queries: [
        "Best private jet for London to Dubai",
        "Gulfstream G700 range",
        "Bombardier Global 7500 interior",
        "How much does private jet maintenance cost",
        "What is an empty leg flight",
      ],
    },
    { kind: "p", text: "You want your content to give the platform enough information to understand when it could be relevant to those people." },
  ],
  sections: [
    {
      n: "01",
      title: "Teach the platform what your video is about",
      blocks: [
        { kind: "p", text: "Platforms can analyse much more than your hashtags." },
        {
          kind: "list",
          title: "TikTok itself explains that it can identify relevance through",
          style: "tag",
          items: ["Captions", "Hashtags", "What is said in the voiceover", "Text appearing within the video"],
        },
        { kind: "p", text: "YouTube also considers how closely the title, description and actual video content match what someone has searched for. This means the subject of your video should be clear across multiple signals." },
        {
          kind: "keyed",
          items: [
            { label: "Imagine your video is answering", lines: ["“What is the difference between the Gulfstream G700 and Bombardier Global 7500?”"] },
            {
              label: "You might",
              lines: [
                "Say both aircraft names naturally in the video",
                "Show them in the opening title",
                "Mention them clearly in the caption",
                "Use a relevant title",
                "Use a small number of relevant hashtags",
              ],
            },
          ],
        },
        { kind: "p", text: "Now the platform receives several signals pointing towards the same subject." },
        {
          kind: "keyed",
          title: "Compare that with a video where",
          items: [
            { label: "The person simply says", lines: ["“These two aircraft are completely different.”"] },
            { label: "And the caption says", lines: ["“Which would you choose?”"] },
          ],
        },
        { kind: "p", text: "A human viewer may understand the context from the footage. The platform has much less information to work with." },
        { kind: "aside", text: "The principle is simple. **Make your subject obvious.**" },
      ],
    },
    {
      n: "02",
      title: "Use the language your audience would actually search",
      blocks: [
        { kind: "p", text: "Think about how someone unfamiliar with your company would search for the information. A private aviation professional may naturally use technical terminology. The audience might not." },
        {
          kind: "swaps",
          title: "For example:",
          fromLabel: "An industry professional might talk about:",
          toLabel: "A potential customer might search:",
          pairs: [{ from: "Ultra long range business aircraft.", to: "Which private jet can fly from London to Los Angeles?" }],
        },
        { kind: "p", text: "Both describe a similar subject. When planning educational content, think about the question the audience would actually type." },
        {
          kind: "swaps",
          fromLabel: "Instead of creating:",
          toLabel: "you could create:",
          pairs: [
            { from: "Aircraft Range Explained", to: "How Far Can A Private Jet Fly Without Stopping?" },
            { from: "Cabin Configuration Differences", to: "Which Private Jet Has The Biggest Cabin?" },
            { from: "Pre Owned Aircraft Acquisition Considerations", to: "What Should You Check Before Buying A Used Private Jet?" },
          ],
        },
        { kind: "p", text: "The expertise stays the same. The language becomes easier for the audience to find and understand." },
      ],
    },
    {
      n: "03",
      title: "Make your keywords natural",
      blocks: [
        { kind: "p", text: "Do not force the same phrase into every sentence. The objective is clarity, not repetition. If you are making a video about empty legs, you can naturally say:" },
        { kind: "lines", mode: "spoken", items: ["An empty leg happens when a private jet needs to reposition without passengers."] },
        { kind: "list", title: "That single sentence clearly establishes", style: "tag", items: ["Empty legs", "Private jets", "Repositioning", "Passengers"] },
        { kind: "p", text: "The platform receives context while the viewer receives useful information." },
        { kind: "aside", text: "The best optimisation should not feel like optimisation. It should simply feel like clear communication." },
      ],
    },
    {
      n: "04",
      title: "Use titles and captions to reinforce the subject",
      blocks: [
        { kind: "p", text: "Your packaging and discoverability should work together." },
        {
          kind: "keyed",
          items: [
            { label: "Imagine the spoken hook is:", lines: ["“This is one of the biggest misconceptions about flying private.”", "Good curiosity. But the platform still needs context."] },
            { label: "Your title could be:", lines: ["Do Private Jets Really Save That Much Time?"] },
          ],
        },
        { kind: "p", text: "Your caption could discuss private aviation, airport access and travel time." },
        { kind: "p", text: "Now you retain the curiosity of the hook while still clearly communicating the subject. You do not need to repeat the exact same sentence everywhere. Different parts of the post can contribute different pieces of information." },
      ],
    },
    {
      n: "05",
      title: "Hashtags should provide context",
      blocks: [
        { kind: "p", text: "Hashtags can help categorise content and connect it with related subjects. But they are not a replacement for strong content." },
        { kind: "p", text: "YouTube explicitly says tags play only a minimal role in discovery in most cases, with one useful role being correcting common misspellings. The same principle should guide how you think about hashtags generally. Do not fill the caption with dozens of unrelated popular hashtags." },
        {
          kind: "list",
          title: "If the video is comparing long range aircraft, relevant hashtags might relate to",
          style: "tag",
          items: ["Private aviation", "Gulfstream", "Bombardier", "Business aviation", "Private jets"],
        },
        { kind: "aside", text: "The hashtags should describe the content. Not simply chase volume." },
      ],
    },
    {
      n: "06",
      title: "Say important terms on camera",
      blocks: [
        { kind: "p", text: "Do not assume the visual alone communicates everything." },
        {
          kind: "pairs",
          // The brief's three sentences, each split where it turns to what to say.
          items: [
            { a: "If you are standing inside a Gulfstream G700, say:", b: "“We are inside the Gulfstream G700.”" },
            { a: "If you are discussing an empty leg, use the phrase:", b: "“empty leg flight.”" },
            { a: "If you are comparing Gulfstream and Bombardier,", b: "name both manufacturers." },
          ],
        },
        { kind: "p", text: "TikTok specifically confirms that voiceover can be used as a relevance signal through automatic speech recognition. This gives you another reason to communicate subjects clearly rather than relying only on captions." },
      ],
    },
    {
      n: "07",
      title: "Use on screen text strategically",
      blocks: [
        { kind: "p", text: "Text shown inside the video can also help communicate the topic." },
        { kind: "lines", mode: "screen", items: ["G700 vs Global 7500", "What is an empty leg?", "London to New York nonstop", "Buying your first private jet"] },
        { kind: "p", text: "TikTok says text within videos can be recognised when determining relevance. The text also helps the viewer understand the subject immediately. This makes it useful for both discoverability and attention." },
      ],
    },
    {
      n: "08",
      title: "Create content around real questions",
      blocks: [
        { kind: "p", text: "Search focused content works best when it answers something people genuinely want to know. Aviation is ideal for this because there are thousands of questions most people cannot answer themselves." },
        {
          kind: "questions",
          items: [
            "Can private jets fly internationally?",
            "How far can a Gulfstream fly?",
            "Can a private jet land at any airport?",
            "What happens if your private jet breaks down?",
            "Why do private jets have different window shapes?",
            "How much luggage can you take on a private jet?",
            "Can you bring pets on a private jet?",
            "What is the difference between chartering and owning?",
          ],
        },
        { kind: "p", text: "Each question is both a content idea and a potential search opportunity. Over time, your social channels can become a library of answers around your area of expertise." },
      ],
    },
    {
      n: "09",
      title: "Review how people are finding you",
      blocks: [
        { kind: "p", text: "Discoverability should improve over time. YouTube Analytics, for example, shows the search terms people used to find your videos. YouTube recommends using this information to understand the topics and words already driving discovery." },
        { kind: "list", title: "If you repeatedly see searches around", style: "tag", items: ["Gulfstream range", "Private jet ownership", "Empty legs", "Aircraft comparisons"] },
        { kind: "p", text: "That tells you something. People are already finding you for those subjects. Create more useful content around them." },
        { kind: "aside", text: "The audience is effectively telling you what they want next." },
      ],
    },
    {
      title: "The discoverability test",
      blocks: [
        {
          kind: "checklist",
          title: "Before publishing, ask",
          items: [
            "Is it obvious what this video is about?",
            "Have we naturally said the main subject?",
            "Does the title communicate the topic?",
            "Does the caption provide useful context?",
            "Does the on screen text help?",
            "Are the hashtags genuinely relevant?",
            "Would the wording make sense to someone searching for this information?",
          ],
        },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "Do not try to trick the algorithm." },
    { kind: "p", text: "Make it extremely easy for both the viewer and the platform to understand exactly what your content is about." },
    // The image the brief sets after this tab's rule (its "![][image1]"; the
    // markdown export dropped it, the client supplied it). Where the brief
    // puts it, with no caption, because the brief gives it none.
    {
      kind: "figure",
      src: "/guides/bad-and-good-profile.webp",
      ratio: "3/2",
      alt: "Two Instagram profiles side by side. Bad example, unclear, unprofessional and doesn't build trust: skyaviation_, with an unclear profile image that doesn't look like a brand, a vague bio that doesn't explain what the business does, no useful contact information, no pinned content and inconsistent content. Good example, clear, professional and easy to take the next step: horizonaviation, with a clear brand image, an informative bio saying what they do and where they operate, relevant contact options, helpful story highlights, strong pinned content and consistent, high quality content.",
    },
  ],
};
