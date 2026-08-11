export type ServiceStep = { step: number; title: string; description: string };

export type ServiceBenefit = { title: string; description: string };

export type ServiceFaq = { question: string; answer: string };

/** The lucide glyphs the service pages actually render. Narrowed from `string`
 *  so a stale or misspelled name is a compile error rather than a silently
 *  blank icon — `Record<string, ReactNode>` happily returns undefined. */
export type ServiceIconName = "Video" | "Users" | "Target" | "Code2";

export type Service = {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  longDescription: string;
  features: string[];
  benefits: ServiceBenefit[];
  process: ServiceStep[];
  secondaryProcess?: {
    title: string;
    subtitle: string;
    steps: ServiceStep[];
  };
  stats: { value: string; label: string }[];
  faq: ServiceFaq[];
  iconName: ServiceIconName;
  gradient: string;
  imageUrl: string;
};

export const servicesList: Service[] = [
  {
    id: "content-creation",
    slug: "content-creation",
    title: "Content Creation",
    shortTitle: "Content Creation",
    tagline: "Social-first content, engineered to perform.",
    description: "Short-form and long-form content built around a proven, data-driven formula. We've published and tested thousands of videos over the last 24 months, decoding exactly what drives virality across every major platform.",
    longDescription: "Content is the engine of modern growth, and we treat it like a science. Every concept is pulled from our extensive database of high-performing and viral content, then tailored to your niche, your goals, and the way you want to be perceived online. Our in-house team handles the entire pipeline end to end (strategy, scriptwriting, filming, on-camera coaching, editing, publishing, and analytics) so you can stay focused on your business while we build your presence. We produce two core formats: scroll-stopping short-form content for personal brands and commercial campaigns, and long-form YouTube content engineered for watch time, retention, and subscriber growth. Throughout, we maintain strict data-security protocols so your footage and content stay private, protected, and professionally managed.",
    features: [
      "Short-Form Content for Personal Brands",
      "Short-Form Content for Commercial Content",
      "Long-Form Content for YouTube",
      "Strategic, platform-optimized scriptwriting",
      "Filming & on-camera coaching",
      "In-house editing & post-production",
      "Publishing across Instagram, TikTok, YouTube, Facebook & X",
      "Monthly performance reviews & growth optimization",
    ],
    benefits: [
      {
        title: "A Proven Viral Formula",
        description: "Thousands of published and tested videos over the past 24 months have given us a deep, data-backed understanding of what actually drives reach, engagement, and shares.",
      },
      {
        title: "On-Camera Coaching",
        description: "What sets us apart is our hands-on coaching. We train you to become confident and effective on camera, improving your delivery, communication, and personal brand presence over time.",
      },
      {
        title: "Fully Managed, End to End",
        description: "From the first idea to the final post, we manage the entire process (ideation, scripting, filming, editing, publishing, and reporting) so you never have to touch the production line.",
      },
      {
        title: "Data Security by Default",
        description: "We maintain strict data-security protocols throughout production, ensuring your content and raw footage remain private, protected, and professionally managed at all times.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Onboarding",
        description: "Every client is different. We begin with a detailed onboarding call to understand your brand, goals, target audience, and how you want to be perceived online, then build a content strategy aligned to your vision and business objectives.",
      },
      {
        step: 2,
        title: "Content Ideation",
        description: "Using insights from our extensive database of high-performing and viral content, our in-house creative team develops tailored concepts designed to maximize engagement, reach, and brand awareness, every idea crafted around your niche and goals.",
      },
      {
        step: 3,
        title: "Strategic Scriptwriting",
        description: "Once concepts are approved, our expert scriptwriters create platform-optimized scripts built specifically for social media, written to capture attention, increase watch time, and drive audience action.",
      },
      {
        step: 4,
        title: "Filming & On-Camera Coaching",
        description: "Our production team handles all filming and creative direction. We coach you hands-on to become confident and effective on camera, while our experienced videographers ensure every shoot meets the highest production standards.",
      },
      {
        step: 5,
        title: "Post-Production & Editing",
        description: "Our in-house editing team transforms raw footage into polished, high-performing content tailored for each platform, with strict data-security protocols keeping your footage private and protected throughout.",
      },
      {
        step: 6,
        title: "Publishing & Distribution",
        description: "We handle the entire publishing process, ensuring your content is optimized and posted across all relevant platforms (Instagram, TikTok, YouTube, Facebook, and X) so you can focus on your business while we manage your presence.",
      },
      {
        step: 7,
        title: "Performance Analytics & Growth Optimization",
        description: "At the end of each month we run a comprehensive performance review across all platforms, identify what's working, uncover growth opportunities, and double down on proven winners to compound results over time.",
      },
    ],
    secondaryProcess: {
      title: "Our YouTube Growth Process",
      subtitle: "A dedicated 10-step system for long-form channel growth.",
      steps: [
        {
          step: 1,
          title: "Channel & Audience Analysis",
          description: "We analyze your brand, target audience, competitors, and existing content to identify content opportunities, audience interests, and growth gaps within your niche.",
        },
        {
          step: 2,
          title: "Content Strategy & Research",
          description: "We research trending topics, proven video formats, and high-performing content in your industry, then develop a strategy built to maximize views, retention, and subscriber growth.",
        },
        {
          step: 3,
          title: "Video Ideation",
          description: "Using platform data and audience insights, we generate concepts built to perform, designed around what viewers are actively searching for and engaging with.",
        },
        {
          step: 4,
          title: "Thumbnail & Title Planning",
          description: "Before filming, we develop compelling titles and thumbnail concepts. The click is earned before the video is watched, which is why packaging is a critical part of our process.",
        },
        {
          step: 5,
          title: "Scriptwriting & Story Structure",
          description: "We create detailed scripts and outlines focused on retention by structuring videos with strong hooks, clear storytelling, and strategic pacing to keep viewers engaged throughout.",
        },
        {
          step: 6,
          title: "Filming & On-Camera Coaching",
          description: "We film and direct every video while coaching you on delivery, presentation, and communication, helping you become a stronger on-camera personality over time.",
        },
        {
          step: 7,
          title: "Professional Editing",
          description: "Our editors transform raw footage into engaging content using advanced storytelling, motion graphics, sound design, pacing, and visual enhancements that increase watch time and retention.",
        },
        {
          step: 8,
          title: "YouTube Optimization",
          description: "Every video is optimized with strategic titles, descriptions, keywords, chapters, end screens, and calls to action to maximize discoverability and channel growth.",
        },
        {
          step: 9,
          title: "Publishing & Distribution",
          description: "We publish on a consistent schedule and repurpose content into YouTube Shorts and clips for distribution across multiple platforms.",
        },
        {
          step: 10,
          title: "Analytics & Continuous Improvement",
          description: "We monitor CTR, average view duration, audience retention, watch time, subscriber growth, and conversion metrics, refining future content and doubling down on the formats that perform best.",
        },
      ],
    },
    stats: [
      {
        value: "2B+",
        label: "Organic Views",
      },
      {
        value: "1000s",
        label: "Videos Tested",
      },
      {
        value: "5+",
        label: "Platforms Managed",
      },
    ],
    faq: [
      {
        question: "Do you offer a trial period?",
        answer: "We work on monthly retainers and onboard clients we're confident we can deliver outsized results for. Book a call and we'll talk through the best way to get started together.",
      },
      {
        question: "How many filming days do I get?",
        answer: "Filming days are tailored to your retainer tier and content volume. We design an efficient shoot schedule that captures weeks of content at a time, and our editors and admin team support the workflow seven days a week.",
      },
      {
        question: "Can you travel to film with me?",
        answer: "Yes. We're headquartered in London and Dubai and regularly travel globally for shoots, working with clients from Los Angeles to Hong Kong.",
      },
      {
        question: "How do revisions work?",
        answer: "Every edit goes through a structured review process. You'll have the opportunity to give feedback, and our team refines the content until it's polished and on-brand before anything is published.",
      },
    ],
    iconName: "Video",
    gradient: "from-[#ff9f0a] to-[#ff375f]",
    imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop",
  },
  {
    id: "influencer-marketing",
    slug: "influencer-marketing",
    title: "Influencer Marketing",
    shortTitle: "Influencer Marketing",
    tagline: "Reach through the world's most-watched voices.",
    description: "We actively manage and handle end-to-end content production for some of the largest digital entities in the world, connecting brands with creators whose audiences move markets.",
    longDescription: "Influence is the fastest route to trust at scale. Tilted Needle manages and produces content for a roster of major global creators and personalities, and we use those relationships to put brands in front of millions of highly engaged followers. Whether you're a brand looking for authentic creator partnerships or a personality looking for full end-to-end management, we handle everything: sourcing and vetting the right voices, building the creative brief, negotiating terms, producing the content, and tracking performance from launch to amplification. Our network spans luxury lifestyle, automotive, aviation, beauty, music, and interiors, the categories where attention converts into real commercial outcomes.",
    features: [
      "The European Kid (4.4M+)",
      "Gstaad Guy (2.9M+)",
      "Youmi, @youmi.kh (9.6M+)",
      "Ren & Noni (Youmi's sisters)",
      "Lord Aleem (1.4M+)",
      "AP Dhillon",
      "Ameerh Naran",
      "The Jet Business",
      "Celine Interiors",
    ],
    benefits: [
      {
        title: "Audiences That Convert",
        description: "We don't chase vanity reach. We match brands with creators whose audiences are primed to act, turning attention into measurable commercial results.",
      },
      {
        title: "End-to-End Production",
        description: "We handle full content production for major digital entities, so partnerships are seamless, on-brand, and consistently high-quality.",
      },
      {
        title: "A Global, Vetted Roster",
        description: "From 9.6M-follower creators to category-defining personalities across luxury, automotive, aviation, beauty, and interiors. We have the relationships that get campaigns made.",
      },
      {
        title: "Managed Risk",
        description: "Briefing, contracting, and campaign management are handled in-house, minimizing the risk that comes with creator partnerships and protecting your brand at every step.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Strategy & Sourcing",
        description: "We define campaign goals and curate a shortlist of vetted creators from our roster whose audience, niche, and content style align with your brand.",
      },
      {
        step: 2,
        title: "Briefing & Negotiation",
        description: "We develop the creative brief, negotiate terms, and lock deliverables and timelines, handling the relationship end to end.",
      },
      {
        step: 3,
        title: "Content Production",
        description: "Our team manages the full production process, reviews every asset, and ensures the content is authentic, on-brand, and built to perform.",
      },
      {
        step: 4,
        title: "Amplification & Reporting",
        description: "We boost top-performing content and deliver transparent performance reports, from awareness metrics through to direct attribution.",
      },
    ],
    stats: [
      {
        value: "18M+",
        label: "Combined Reach",
      },
      {
        value: "9.6M+",
        label: "Top Creator",
      },
      {
        value: "A-Z",
        label: "End-to-End",
      },
    ],
    faq: [
      {
        question: "Do you manage creators end to end?",
        answer: "Yes. We actively manage and handle end-to-end content production for major global digital entities, from strategy and filming through to editing, publishing, and reporting.",
      },
      {
        question: "Can you match my brand with the right creator?",
        answer: "Absolutely. We curate from a vetted roster across luxury, automotive, aviation, beauty, music, and interiors, matching you to voices whose audience genuinely aligns with your goals.",
      },
      {
        question: "How do you measure results?",
        answer: "Every campaign includes transparent performance tracking, from reach and engagement through to direct attribution where possible.",
      },
    ],
    iconName: "Users",
    gradient: "from-[#ff375f] to-[#af52de]",
    imageUrl: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=800&h=600&fit=crop",
  },
  {
    id: "paid-advertising-performance",
    slug: "paid-advertising-performance",
    title: "Paid Advertising & Performance Marketing",
    shortTitle: "Paid & Performance",
    tagline: "Every dollar engineered for return.",
    description: "End-to-end management of paid campaigns, ad-ready clipping, and digital PR, built to turn ad spend into predictable, scalable revenue with transparent ROAS tracking.",
    longDescription: "Performance marketing isn't about running ads. It's about building a systematic revenue engine. We manage paid campaigns across Facebook and Instagram with continuous A/B creative testing, precise audience targeting, and daily budget scaling. We transform your existing long-form content into high-velocity short-form clips engineered specifically to capture attention inside paid ad funnels. And we secure premium feature placements in industry-recognized publications to elevate founder authority, build trust, and lift the conversion rates of your active funnels. Creative and media buying live under one roof, which is exactly why our campaigns outperform, our EuroEyes campaign generated £1,893,094 in revenue from £212,535 in ad spend over 12 months.",
    features: [
      "Meta Ads & omnichannel media buying",
      "Continuous A/B creative testing",
      "Precise audience targeting & daily budget scaling",
      "Transparent ROAS tracking",
      "Clipping: long-form turned into high-velocity ad clips",
      "High-impact hooks & rapid-paced captioned edits",
      "Digital PR & magazine feature placements",
      "Press release syndication & media outreach",
    ],
    benefits: [
      {
        title: "Proven ROAS",
        description: "Our EuroEyes campaign generated £1,893,094 in revenue from £212,535 in ad spend over 12 months, an exceptional return in a highly competitive vertical.",
      },
      {
        title: "Creative-Led Performance",
        description: "We produce ad creative in-house and test relentlessly, so the winners that scale are built specifically for the funnel. No stock footage, no templates.",
      },
      {
        title: "Clipping That Converts",
        description: "We turn podcasts, keynotes, and interviews into rapid-paced, captioned, platform-optimized clips engineered to stop the scroll inside paid funnels.",
      },
      {
        title: "Authority Through PR",
        description: "Guaranteed editorial placements in recognized publications build trust and lift the conversion rates of your active paid campaigns.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Audit & Strategy",
        description: "We analyze your current performance, audience, and competitive landscape to build a winning paid and PR strategy across channels.",
      },
      {
        step: 2,
        title: "Creative & Clipping",
        description: "We produce high-converting ad creative and transform your long-form content into high-impact clips with rapid-paced editing and engaging captions.",
      },
      {
        step: 3,
        title: "Launch & Optimize",
        description: "We launch campaigns across Facebook and Instagram with continuous A/B testing, precise targeting, and daily budget scaling.",
      },
      {
        step: 4,
        title: "Digital PR & Placements",
        description: "We secure feature placements in industry publications through press release syndication and media outreach to elevate founder authority.",
      },
      {
        step: 5,
        title: "Scale & Report",
        description: "We scale winning campaigns and deliver transparent ROAS reporting so you always know exactly what your spend is returning.",
      },
    ],
    stats: [
      {
        value: "8.9x",
        label: "Best ROAS Achieved",
      },
      {
        value: "£1.89M",
        label: "Revenue From £212k",
      },
      {
        value: "Daily",
        label: "Budget Scaling",
      },
    ],
    faq: [
      {
        question: "What's included in media buying?",
        answer: "End-to-end management of paid campaigns across Facebook and Instagram, including continuous A/B creative testing, precise audience targeting, daily budget scaling, and transparent ROAS tracking.",
      },
      {
        question: "What is clipping?",
        answer: "We transform your existing long-form content (podcasts, keynotes, interviews) into high-velocity short-form clips optimized specifically to capture attention in paid ad funnels.",
      },
      {
        question: "Can you get me featured in publications?",
        answer: "Yes. Our Digital PR service secures premium feature placements and articles in industry-recognized publications, including press release syndication, media outreach management, and guaranteed editorial placements.",
      },
    ],
    iconName: "Target",
    gradient: "from-[#64d2ff] to-[#2997ff]",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
  {
    id: "app-web-development",
    slug: "app-web-development",
    title: "Application & Web Development",
    shortTitle: "App & Web Dev",
    tagline: "Digital infrastructure built to scale.",
    description: "Full-stack design and development of modern, high-converting websites, scalable storefronts, membership sites, and digital courses, built to handle major traffic while staying fast and premium.",
    longDescription: "Your audience is only as valuable as the infrastructure you convert them on. We design and build modern, high-converting websites and scalable e-commerce storefronts engineered to handle major traffic spikes while maintaining fast load times and a premium user experience. Beyond the storefront, we handle the technical deployment and structural architecture of proprietary digital assets: membership sites and digital courses that help brands productize their knowledge and build recurring revenue. From custom UI/UX and full-stack engineering to secure payment gateways, LMS integration, video hosting, automated onboarding flows, and membership tiering, we build the systems that turn attention into a durable business.",
    features: [
      "Website buildout & e-commerce infrastructure",
      "Custom UI/UX design",
      "Full-stack frontend & backend development",
      "Mobile optimization",
      "Secure payment gateway integration",
      "Educational platform & course creation",
      "LMS integration (Skool, Kajabi)",
      "Secure video hosting & automated onboarding flows",
    ],
    benefits: [
      {
        title: "Built for Traffic Spikes",
        description: "Our storefronts are engineered to handle major traffic surges (like the ones our content drives) without sacrificing speed or experience.",
      },
      {
        title: "Premium by Default",
        description: "Custom UI/UX and full-stack development deliver a fast, polished, on-brand experience that matches the quality of your content and your offer.",
      },
      {
        title: "Recurring Revenue Engines",
        description: "We deploy membership sites and digital courses with LMS integration and tiered access, helping you productize knowledge and build predictable recurring revenue.",
      },
      {
        title: "Secure & Automated",
        description: "Secure payment gateways, protected video hosting, and automated onboarding flows mean your platform runs smoothly and safely from day one.",
      },
    ],
    process: [
      {
        step: 1,
        title: "Discovery & Architecture",
        description: "We map your goals, audience, and technical requirements to design the optimal architecture, whether that's a storefront, a membership site, or a course platform.",
      },
      {
        step: 2,
        title: "UI/UX Design",
        description: "We design a custom, premium, conversion-focused interface optimized for both desktop and mobile.",
      },
      {
        step: 3,
        title: "Full-Stack Build",
        description: "Our engineers build the frontend and backend to handle major traffic spikes while keeping load times fast and the experience premium.",
      },
      {
        step: 4,
        title: "Integrations & Security",
        description: "We integrate secure payment gateways, LMS platforms like Skool and Kajabi, secure video hosting, and automated onboarding flows.",
      },
      {
        step: 5,
        title: "Launch & Optimize",
        description: "We launch, monitor performance, and continuously optimize conversion and reliability as you scale.",
      },
    ],
    stats: [
      {
        value: "Full-Stack",
        label: "Design & Build",
      },
      {
        value: "LMS",
        label: "Skool & Kajabi",
      },
      {
        value: "Secure",
        label: "Payments & Hosting",
      },
    ],
    faq: [
      {
        question: "What kind of websites do you build?",
        answer: "Modern, high-converting websites and scalable e-commerce storefronts built to handle major traffic spikes while maintaining fast load times and a premium user experience, with custom UI/UX, full-stack development, mobile optimization, and secure payment integration.",
      },
      {
        question: "Can you build a course or membership platform?",
        answer: "Yes. We handle the technical deployment and architecture of membership sites and digital courses, including LMS integration (e.g. Skool, Kajabi), secure video hosting, automated onboarding flows, and membership tier scheduling.",
      },
      {
        question: "Do you integrate payments?",
        answer: "Yes. Secure payment gateway integration is part of our standard e-commerce and platform builds.",
      },
    ],
    iconName: "Code2",
    gradient: "from-[#5e5ce6] to-[#af52de]",
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
  },
];
