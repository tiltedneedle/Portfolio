/**
 * THE HOME PAGE. The same for everyone; only the client name and logo change.
 */
export const home = {
  kicker: "Your complete viral content system",
  lead: (name: string) =>
    "Everything we have learned from generating over 5 billion organic views, built into one complete system for " + name + ".",
  intro: [
    "This portal gives you the exact frameworks, processes and principles we use at Tilted Needle to create high performing social media content.",
    "You now have everything you need to research, create, film, edit, publish and analyse content internally.",
  ],
  objective: {
    label: "The objective is simple",
    text: "To give your team the knowledge and infrastructure required to consistently create content that captures attention, builds an audience and generates more opportunities for your business.",
  },
  access: [
    {
      n: "01",
      title: "Your content audit",
      href: "/audit/content-diagnostic",
      personalised: true,
      text: "A complete analysis of your current social media presence. Understand what is working, what is limiting your growth and what we would change.",
    },
    {
      n: "02",
      title: "Competitor intelligence",
      href: "/audit/competitor-intelligence",
      personalised: true,
      text: "Understand what is already working within your market. See the topics, formats and content opportunities your competitors are using, and where opportunities exist for your brand.",
    },
    {
      n: "03",
      title: "100 viral content ideas",
      href: "/content/ideas",
      personalised: true,
      text: "One hundred content concepts built across four core pillars: authority, education, entertainment and personal. Use them as the foundation of your content output.",
    },
    {
      n: "04",
      title: "20 personalised scripts",
      href: "/content/scripts",
      personalised: true,
      text: "Twenty complete videos written specifically for your business. Open the script. Film it. Execute.",
    },
    {
      n: "05",
      title: "Create",
      href: "/create",
      personalised: false,
      text: "The exact process we use to create content. Research your niche, generate ideas, choose formats, write stronger hooks, deliver your message, film effectively and edit for retention.",
    },
    {
      n: "06",
      title: "Publish",
      href: "/publish",
      personalised: false,
      text: "How to maximise the potential of every piece of content after it has been created. Where to post, how often, when, how to write titles and captions, how to create covers and how to optimise your profiles.",
    },
    {
      n: "07",
      title: "Analyse",
      href: "/analyse",
      personalised: false,
      text: "How to understand what your content performance is actually telling you. Why a video worked, why a video failed, and what to repeat, improve and change next time.",
    },
  ],
  how: [
    {
      title: "Understand",
      text: "Start with your content audit and competitor intelligence. Understand your current position and the opportunities available to you.",
      href: "/audit",
    },
    {
      title: "Create",
      text: "Use your 100 content ideas and 20 scripts to begin producing content immediately. Then use the Create section whenever you need to generate new ideas, improve your hooks, film better content or improve your editing.",
      href: "/create",
    },
    {
      title: "Publish",
      text: "Follow the publishing system every time a piece of content is ready to go live.",
      href: "/publish",
    },
    {
      title: "Analyse",
      text: "Review the performance of your content and understand what the data is telling you.",
      href: "/analyse",
    },
    {
      title: "Repeat",
      text: "Use those learnings to improve the next piece of content. The system becomes stronger the more you use it.",
      href: "/create",
    },
  ],
  approach: {
    title: "The Tilted Needle approach",
    lines: [
      "The objective is not to create one viral video.",
      "The objective is to build a repeatable system capable of producing high performing content consistently.",
    ],
    beats: ["Research.", "Create.", "Publish.", "Analyse.", "Improve.", "Then repeat."],
  },
  access_note: "Permanent access. This system is yours to keep, and it is updated as we learn more.",
  films: {
    intro: { title: "Welcome to your system" },
    outro: { title: "Where to go from here" },
  },
};
