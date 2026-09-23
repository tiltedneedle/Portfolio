import type { Guide } from "@/content/types";

export const strategy: Guide = {
  chapter: "publish",
  slug: "strategy",
  title: "Publishing strategy",
  kicker: "Do not make a video, post it once and hope.",
  poster: "iMqGv-W5DhY",
  intro: [
    "Once your content has been created, you need a consistent publishing system.",
    "You want to build a bank of strong content, publish it consistently across every relevant platform and give yourself enough data to understand what your audience actually responds to.",
  ],
  sections: [
    {
      n: "01",
      title: "Build your content bank before you start posting",
      blocks: [
        { kind: "p", text: "Do not create one video, post it, then start thinking about what to make next. Build a bank first." },
        { kind: "aside", text: "We recommend having around **15 finished videos** ready before you begin publishing consistently." },
        { kind: "p", text: "This gives you enough content to post every other day for approximately one month without constantly rushing to create the next video. It also allows you to be more strategic." },
        {
          kind: "list",
          title: "Make sure your content bank contains a mixture of",
          style: "tag",
          items: ["Authority", "Education", "Entertainment", "Personal content", "Different video formats", "Different people on camera", "Different aircraft", "Different subjects"],
        },
        { kind: "p", text: "For example, your bank might include an aircraft comparison, a Day In The Life at an FBO, a founder story, a Gulfstream walkaround, an educational video about empty legs and a Q&A about aircraft ownership. You now have variety before the first video even goes live." },
        { kind: "p", text: "Once you begin publishing, continue creating new content so that the bank never reaches zero. The aim is to always stay ahead." },
      ],
    },
    {
      n: "02",
      title: "Post consistently",
      blocks: [
        { kind: "p", text: "Once your initial content bank is ready, start publishing consistently. A strong starting point is:" },
        { kind: "aside", text: "**One video every other day.**" },
        { kind: "cadence", title: "A month, at that pace", note: "Fifteen posts. Enough to see a pattern; not so many that quality slips." },
        { kind: "p", text: "That gives you roughly 15 posts across a month. This is enough volume to begin identifying patterns without sacrificing the quality of the content." },
        { kind: "p", text: "Do not publish all 15 videos in one week. You want to create a consistent flow of content and give each video an opportunity to reach its audience." },
        { kind: "p", text: "After the first month, review what performed and use those results to influence the next content bank. Over time, the process becomes:" },
        {
          kind: "steps",
          items: [
            { title: "Create the bank." },
            { title: "Publish consistently." },
            { title: "Analyse the results." },
            { title: "Create the next bank using what you learned." },
          ],
        },
        { kind: "p", text: "That is how the system improves." },
      ],
    },
    {
      n: "03",
      title: "Publish the same video across every relevant platform",
      blocks: [
        { kind: "p", text: "A strong piece of content should not only have one opportunity to perform." },
        {
          kind: "list",
          title: "For most aviation businesses, short form content should be published across",
          style: "tag",
          items: ["Instagram Reels", "TikTok", "YouTube Shorts", "Facebook Reels", "LinkedIn, where relevant"],
        },
        {
          kind: "fan",
          title: "One video, five chances",
          fromLabel: "The finished video",
          from: "A Gulfstream and a Bombardier, side by side: which one would we buy, and why.",
          to: [
            { label: "YouTube Shorts", text: "Where the educational comparison tends to do its best work." },
            { label: "Instagram Reels", text: "Where the look of the aircraft carries it." },
            { label: "TikTok", text: "Where the opinion in the first line does the work." },
            { label: "Facebook Reels", text: "A broader, older audience; the same video, a plainer caption." },
            { label: "LinkedIn", text: "Where the industry argument becomes a discussion." },
          ],
          note: "The same video, packaged five ways. Judge it after all five, not after the first.",
        },
        { kind: "p", text: "The same video may perform completely differently on each platform. An educational video comparing a Gulfstream with a Bombardier may perform exceptionally well on YouTube Shorts. A visually impressive aircraft tour may perform better on Instagram. An industry opinion may generate stronger discussion on LinkedIn." },
        { kind: "p", text: "Do not decide whether an idea worked based on one platform. Give the content multiple opportunities to find the right audience." },
        { kind: "p", text: "The core video can remain the same. The way it is packaged can change depending on the platform, which the next guide covers." },
      ],
    },
    {
      n: "04",
      title: "Test posting times",
      blocks: [
        { kind: "p", text: "Do not assume there is one perfect posting time for every account. Test different times and use your own analytics to identify when your audience is most responsive." },
        { kind: "aside", text: "From our experience, **early morning or late evening** tends to perform best. Start by testing those windows." },
        { kind: "p", text: "Then look at your own results over time. If your strongest videos repeatedly perform better at a particular time, adjust your schedule accordingly. The goal is to find the posting windows that work best for your specific audience." },
      ],
    },
    {
      n: "05",
      title: "Create a repeatable publishing process",
      blocks: [
        { kind: "p", text: "Publishing should eventually become routine for whoever manages your social media. Once a video is approved, the process should be simple." },
        {
          kind: "steps",
          items: [
            { title: "Final video ready" },
            { title: "Title selected" },
            { title: "Caption written" },
            { title: "Cover image selected" },
            { title: "Video published across all relevant platforms" },
            { title: "Any necessary platform adjustments made" },
            { title: "Performance reviewed after publishing" },
          ],
        },
        { kind: "p", text: "This should happen for every piece of content. The objective is to remove unnecessary decisions from the process. Your team should know exactly what needs to happen whenever a finished video enters the publishing stage." },
      ],
    },
    {
      title: "The monthly system",
      blocks: [
        {
          kind: "keyed",
          items: [
            { label: "Before the month begins", lines: ["Have approximately 15 completed videos ready."] },
            {
              label: "Throughout the month",
              lines: [
                "Publish one video every other day.",
                "Publish each video across every relevant platform.",
                "Test different posting times, starting with early morning and late evening.",
                "Continue creating content to replenish your bank.",
              ],
            },
            {
              label: "At the end of the month",
              lines: [
                "Review the videos that performed strongest.",
                "Identify the topics, hooks and formats that worked.",
                "Use those learnings when creating the next 15 videos.",
              ],
            },
          ],
        },
        { kind: "p", text: "Then repeat the process." },
      ],
    },
  ],
  rule: [
    { kind: "p", text: "Do not operate video by video." },
    { kind: "p", text: "Build a content bank, publish it consistently, learn from the results and use those learnings to build the next one." },
  ],
};
