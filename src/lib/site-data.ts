export type Metric = { label: string; value: string };

export type Testimonial = { quote: string; author: string; role: string };

export type PortfolioItem = {
  id: string;
  title: string;
  client: string;
  year: string;
  categories: string[];
  tags: string[];
  metrics: Metric[];
  summary: string;
  videoUrl: string;
  featured?: boolean;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  testimonial?: Testimonial;
  services?: string[];
  duration?: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: "fw-1",
    title: "The Jet Broker",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Luxury", "Aviation"],
    metrics: [
      { label: "Views", value: "1B+" },
      { label: "Followers", value: "4M+" },
      { label: "Sales", value: "$150M+" },
      { label: "Growth", value: "850%" },
    ],
    summary:
      "Built Steve Varsano into the most recognizable private jet broker on social media, generating over $150M in jet sales through viral content strategy.",
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/selling-19m-jet-8-hours.mp4",
    description:
      "Steve Varsano, founder of The Jet Business, approached us with a bold vision: to become the most recognized private jet broker in the world through social media. With decades of experience in aviation but zero social presence, Steve needed a partner who understood both luxury positioning and viral content mechanics.",
    challenge:
      "The private aviation industry is notoriously traditional and resistant to social media marketing. Steve faced skepticism from peers who believed luxury brands shouldn't pursue mass attention. We needed to position him as an expert authority while creating content engaging enough to go viral without compromising the sophisticated brand image essential to his high-net-worth clientele.",
    solution:
      "We developed a content strategy that humanized the ultra-luxury aviation world. Through behind-the-scenes tours of $50M jets, educational content about aircraft features, and Steve's authentic personality, we created a formula that resonated across demographics. Our production team traveled globally to capture exclusive access, while our editorial approach balanced entertainment with expertise.",
    results:
      "Within 18 months, Steve's social following grew from zero to 4M+ across platforms. His content has generated over 1 billion organic views, establishing him as the most recognized face in private aviation. Most importantly, the exposure has directly contributed to over $150M in documented jet sales, with numerous clients citing his social content as their first touchpoint.",
    testimonial: {
      quote:
        "Tilted Needle didn't just build my social media. They transformed how I connect with clients globally. The results have exceeded every expectation.",
      author: "Steve Varsano",
      role: "Founder, The Jet Business",
    },
    services: ["Content Strategy", "Video Production", "Social Management", "Personal Branding"],
    duration: "18 months",
  },
  {
    id: "fw-2",
    title: "High-End Interior Design",
    client: "Noor Charchafchi",
    year: "2024",
    categories: ["Short-form", "Interiors"],
    tags: ["Luxury", "Interiors"],
    metrics: [
      { label: "Views", value: "6M+" },
      { label: "Followers", value: "200k+" },
      { label: "Sales", value: "$5.6M+" },
      { label: "Time", value: "7 days" },
    ],
    summary:
      "6M organic views and 200k+ new Instagram followers in 7 days for Celine Interior Design, driving $5.6M+ in direct sales over 12 months.",
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/vimana-customer-service.mp4",
    description:
      "Noor Charchafchi, founder of Celine Interior Design, was ready to take her high-end studio from a respected name in design circles to a household one. Despite a portfolio of breathtaking interiors, her digital presence didn't reflect the calibre of her work or the clientele she wanted to attract.",
    challenge:
      "High-end interior design is a visual category that's brutally competitive on social media. Standing out demands more than beautiful rooms. It requires a distinctive voice, consistent storytelling, and the credibility to attract clients commissioning six- and seven-figure projects.",
    solution:
      "We built a content strategy that put Noor's taste and process at the centre, showcasing transformations, design decisions, and the lifestyle her interiors create. Pulling from our database of high-performing formats, we engineered scroll-stopping short-form content tailored to a luxury audience.",
    results:
      "Within the first 7 days, Noor's content accumulated 6M+ organic views and her Instagram grew by 200k+ followers. Over the following 12 months, the content drove more than $5.6M in direct sales, turning her social presence into a primary client-acquisition channel.",
    testimonial: {
      quote:
        "They understood the level my brand needed to operate at. The enquiries that came in were exactly the clients I wanted.",
      author: "Noor Charchafchi",
      role: "Founder, Celine Interior Design",
    },
    services: [
      "Content Strategy",
      "Short-Form Production",
      "On-Camera Coaching",
      "Publishing & Distribution",
    ],
    duration: "12 months",
  },
  {
    id: "fw-3",
    title: "Restaurant Revival",
    client: "Alexis Gauthier",
    year: "2023",
    categories: ["Short-form", "Hospitality"],
    tags: ["Food", "Hospitality"],
    metrics: [
      { label: "Views", value: "14M+" },
      { label: "Revenue", value: "£100k/mo" },
      { label: "Growth", value: "3,233%" },
      { label: "Followers", value: "120k" },
    ],
    summary:
      "Transformed a struggling restaurant from £3k/mo to £100k+/mo through strategic viral content.",
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/food-on-plane.mp4",
    description:
      "Alexis Gauthier, a Michelin-trained chef, was watching his dream restaurant slip away. Despite exceptional food and service, his establishment was generating just £3,000 per month, far below sustainability. He needed a dramatic turnaround, and traditional marketing wasn't delivering.",
    challenge:
      "The restaurant industry's social media landscape is oversaturated with food content. Standing out requires more than beautiful dishes. It demands a compelling narrative and authentic personality. Alexis was camera-shy and unsure how to translate his culinary artistry into engaging content.",
    solution:
      "We developed a content strategy centered on Alexis's unique story: a world-class chef committed to plant-based fine dining. Our team coached him through on-camera presence, capturing the artistry behind each dish while weaving in his journey and philosophy. We optimized for viral formats while maintaining culinary credibility.",
    results:
      "The transformation was remarkable. Alexis's content generated over 14M views, building a community of 120k+ engaged followers. More importantly, monthly revenue exploded from £3k to over £100k, a 3,233% increase. The restaurant now maintains a months-long waitlist.",
    testimonial: {
      quote:
        "They saw something in me I didn't see in myself. They didn't just save my restaurant, they gave me a voice.",
      author: "Alexis Gauthier",
      role: "Chef & Owner",
    },
    services: ["Content Strategy", "On-Camera Coaching", "Video Production", "Social Management"],
    duration: "12 months",
  },
  {
    id: "fw-4",
    title: "Healthcare Performance",
    client: "EuroEyes",
    year: "2024",
    categories: ["Ads", "Healthcare"],
    tags: ["Healthcare", "Performance"],
    metrics: [
      { label: "Views", value: "12M+" },
      { label: "Revenue", value: "£1.893M" },
      { label: "ROAS", value: "8.9x" },
      { label: "Ad Spend", value: "£212k" },
    ],
    summary:
      "Generated £1.893M+ revenue from £212k ad spend in 12 months, achieving exceptional ROAS in healthcare sector.",
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/saving-1-month-a-year-fv.mp4",
    description:
      "EuroEyes, a leading laser eye surgery provider, was struggling to acquire patients cost-effectively through digital channels. With strict healthcare advertising regulations and a service that requires significant trust-building, they needed a performance partner who understood both compliance and conversion.",
    challenge:
      "Healthcare advertising faces unique challenges: strict platform policies, high customer acquisition costs, and the need to build trust for an invasive medical procedure. Previous agencies had delivered underwhelming results at unsustainable costs.",
    solution:
      "We developed a full-funnel TikTok and Meta strategy combining patient testimonials, educational content, and surgeon credibility pieces. Our creative team produced compliant yet compelling ads that addressed common fears while highlighting life-changing outcomes. We implemented rigorous testing protocols to optimize creative performance.",
    results:
      "Over 12 months, our campaigns generated £1.893M in attributed revenue from £212k in ad spend, an exceptional 8.9x ROAS in a challenging vertical. TikTok alone delivered 12M+ views, establishing EuroEyes as the most visible laser eye brand on the platform.",
    testimonial: {
      quote:
        "No other agency understood how to balance compliance with performance. The results speak for themselves.",
      author: "Marketing Director",
      role: "EuroEyes UK",
    },
    services: [
      "Paid Media Strategy",
      "Creative Production",
      "Performance Analytics",
      "Compliance Consultation",
    ],
    duration: "12 months",
  },
  {
    id: "fw-5",
    title: "Luxury Watch Dealer",
    client: "Frankie Mardell",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Luxury", "Watches"],
    metrics: [
      { label: "Views", value: "10M+" },
      { label: "Followers", value: "+130k" },
      { label: "Revenue", value: "+400%" },
      { label: "Time", value: "6 months" },
    ],
    summary:
      "Grew a luxury watch dealer's audience by 130k followers and 10M+ views in 6 months, lifting revenue 400%+ to record quarters.",
    featured: true,
    videoUrl:
      "https://d6lso8oygmnu9.cloudfront.net/videos/wealth-shows-true-character-v6-captioned.mp4",
    description:
      "Frankie Mardell, a luxury watch dealer, had real expertise and an enviable inventory but a following that didn't match. He knew the watch market was moving to social, and he needed a content partner who could translate horological knowledge into content that sells.",
    challenge:
      "The luxury watch space online is dominated by established voices and saturated with product showcases. Breaking through required a distinctive on-camera personality, genuine authority, and content engineered to convert collectors, not just rack up passive views.",
    solution:
      "We coached Frankie into a confident on-camera presence and built a content strategy around storytelling, market insight, and the pieces collectors actually want to see. Using proven short-form formats, we packaged his expertise into content designed for both reach and intent.",
    results:
      "Within 6 months, Frankie gained 130k+ new followers and surpassed 10M organic views. More importantly, revenue grew by over 400%, leading to record-breaking quarters as the audience converted into buyers.",
    testimonial: {
      quote:
        "They turned my knowledge into a sales channel. The growth was huge, but the revenue is what mattered.",
      author: "Frankie Mardell",
      role: "Luxury Watch Dealer",
    },
    services: [
      "Personal Branding",
      "On-Camera Coaching",
      "Short-Form Production",
      "Content Strategy",
    ],
    duration: "6 months",
  },
  {
    id: "fw-6",
    title: "E-commerce Explosion",
    client: "Rastah",
    year: "2024",
    categories: ["Short-form", "E-commerce"],
    tags: ["Fashion", "E-commerce"],
    metrics: [
      { label: "Views", value: "14M+" },
      { label: "Followers", value: "105k" },
      { label: "Sales", value: "+900%" },
      { label: "Timeline", value: "3 months" },
    ],
    summary:
      "Scaled followers from 12k to 105k while achieving 900% online sales growth in just 3 months.",
    featured: true,
    videoUrl:
      "https://d6lso8oygmnu9.cloudfront.net/videos/running-multiple-businesses-v7-captioned.mp4",
    description:
      "Rastah, an emerging streetwear brand with a loyal but small following, was ready to scale. With limited marketing budget and no paid advertising experience, they needed organic growth strategies that would translate directly into sales.",
    challenge:
      "Building e-commerce revenue through organic social requires more than viral content. It demands strategic integration between content, community, and conversion. Previous attempts at scaling had increased followers but failed to move the sales needle.",
    solution:
      "We implemented a content commerce strategy that treated every post as a potential sales driver. Our approach combined viral-format product showcases, user-generated content campaigns, and strategic drops that created urgency. We optimized the entire journey from discovery to purchase.",
    results:
      "The results were explosive: followers grew from 12k to 105k in 3 months, with content generating 14M+ views. More importantly, online sales increased by 900%. The brand went from struggling to keep up with inventory to scaling production to meet demand.",
    testimonial: {
      quote:
        "We thought we needed a big ad budget to grow. Tilted Needle proved that great content strategy can outperform paid media.",
      author: "Founder",
      role: "Rastah",
    },
    services: [
      "Content Commerce Strategy",
      "UGC Campaigns",
      "Community Building",
      "Drop Strategy",
    ],
    duration: "3 months",
  },
  {
    id: "fw-7",
    title: "Luxury Real Estate",
    client: "Private Client",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Real Estate", "Luxury"],
    metrics: [
      { label: "Views", value: "8M+" },
      { label: "Inquiries", value: "+340%" },
    ],
    summary: "Premium property content strategy driving qualified luxury buyer inquiries.",
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/my-future-fv-revised.mp4",
    description:
      "A prestigious real estate developer approached us to transform their digital marketing approach. With $50M+ properties sitting on the market longer than expected, they needed a strategy that reached ultra-high-net-worth individuals where traditional real estate marketing couldn't.",
    challenge:
      "Luxury real estate marketing traditionally relies on static photos and lengthy property descriptions. Reaching qualified buyers of $10M+ homes requires cutting through the noise of mass-market real estate content while maintaining the exclusivity and prestige expected at this price point.",
    solution:
      "We created cinematic property tours designed for social consumption, 60-second experiences that captured the lifestyle and emotion of each property. Our content strategy positioned properties as exclusive opportunities rather than listings, using scarcity messaging and behind-the-scenes access to create urgency among qualified buyers.",
    results:
      "Our campaign generated over 8 million views across platforms, with a 340% increase in qualified buyer inquiries. Three properties valued at over $25M each sold within 90 days of campaign launch, with buyers citing social content as their discovery channel.",
    testimonial: {
      quote:
        "They understood that we weren't selling houses, we were selling dreams. The content they created attracted exactly the right buyers and shortened our sales cycle dramatically.",
      author: "Private Client",
      role: "Real Estate Developer",
    },
    services: ["Cinematic Production", "Social Strategy", "Content Distribution", "Paid Media"],
    duration: "6 months",
  },
  {
    id: "fw-8",
    title: "Tech Launch Campaign",
    client: "Private Client",
    year: "2024",
    categories: ["Ads", "Long-form"],
    tags: ["Technology", "SaaS"],
    metrics: [
      { label: "Views", value: "5M+" },
      { label: "Signups", value: "12k+" },
    ],
    summary:
      "Product launch campaign combining short-form virality with targeted performance ads.",
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/network-sof-v9-revised.mp4",
    description:
      "A stealth-mode tech startup preparing for their public launch needed a campaign that would generate massive awareness and convert that attention into product signups, all within a compressed timeline and limited budget compared to venture-backed competitors.",
    challenge:
      "Launching a SaaS product without substantial VC funding meant competing against companies with 10x our marketing budget. We needed to create organic virality that could match the reach of paid campaigns while maintaining the conversion rates necessary for sustainable growth.",
    solution:
      "We developed a hybrid strategy combining organic short-form content with precision-targeted performance ads. Our creative approach focused on relatable pain points and satisfying product demonstrations that performed well both organically and as paid placements. We built anticipation through a teaser campaign before launch, then executed a coordinated multi-platform release.",
    results:
      "The launch campaign generated over 5 million views across platforms, driving 12,000+ signups in the first month, exceeding targets by 240%. Our cost per acquisition came in at 67% below industry benchmarks, enabling the startup to extend their runway while building a substantial user base.",
    testimonial: {
      quote:
        "Working with Tilted Needle felt like having a growth team, creative agency, and performance marketing department all in one. They turned our limited budget into results that rivaled companies spending millions.",
      author: "Private Client",
      role: "Founder & CEO",
    },
    services: [
      "Launch Strategy",
      "Short-form Content",
      "Performance Ads",
      "Conversion Optimization",
    ],
    duration: "3 months",
  },
  {
    id: "p-9",
    title: "Being Grateful",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Mindset", "Motivation"],
    metrics: [{ label: "Views", value: "2.4M+" }],
    summary: "Steve Varsano on the importance of gratitude in business and life.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/being-grateful-final-captioned.mp4",
  },
  {
    id: "p-10",
    title: "Carrera GT Tour",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Automotive", "Luxury"],
    metrics: [{ label: "Views", value: "6.2M+" }],
    summary: "Exclusive walkthrough of the iconic Porsche Carrera GT.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/carrera-gt-tour-v4-captioned.mp4",
  },
  {
    id: "p-11",
    title: "How I Became Successful",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Business", "Motivation"],
    metrics: [{ label: "Followers", value: "+85k" }],
    summary: "Steve shares his journey to becoming the world's top jet broker.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/how-i-became-successful-v8-captioned.mp4",
  },
  {
    id: "p-12",
    title: "Ruby's Story",
    client: "Steve Varsano",
    year: "2023",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Lifestyle", "Personal"],
    metrics: [{ label: "Views", value: "1.2M+" }],
    summary: "A heartfelt personal story from Steve Varsano.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/ruby-story-final.mp4",
  },
  {
    id: "p-13",
    title: "Week in the Life: Dubai",
    client: "Private Client",
    year: "2024",
    categories: ["Long-form", "Luxury"],
    tags: ["Lifestyle", "Travel"],
    metrics: [{ label: "Views", value: "3.8M+" }],
    summary: "A week in the life vlog from Dubai.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/witl-dubai-fv-rev.mp4",
  },
  {
    id: "p-14",
    title: "Toxic Mindset",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Mindset", "Motivation"],
    metrics: [{ label: "Views", value: "9M+" }],
    summary: "Breaking down the toxic mindsets that hold people back.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/toxic-mindset-fv.mp4",
  },
  {
    id: "p-15",
    title: "Filling Up the Jesko",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Automotive", "Supercar"],
    metrics: [{ label: "Views", value: "5.1M+" }],
    summary: "What it costs to fill up a Koenigsegg Jesko.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/filling-up-jesko-revised-final.mp4",
  },
  {
    id: "p-16",
    title: "Client Schedule",
    client: "Steve Varsano",
    year: "2023",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Business", "Productivity"],
    metrics: [{ label: "Views", value: "1.8M+" }],
    summary: "A look into the daily schedule of a top jet broker.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/client-schedule-v5.mp4",
  },
  {
    id: "p-17",
    title: "GT Racing is Loud",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Motorsport", "Cars"],
    metrics: [{ label: "Views", value: "4.5M+" }],
    summary: "The raw sound and fury of GT racing up close.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/gt-racing-is-loud-fv-captioned.mp4",
  },
  {
    id: "p-18",
    title: "Aubameyang Feature",
    client: "Private Client",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Sport", "Lifestyle"],
    metrics: [{ label: "Views", value: "7.2M+" }],
    summary: "Featured content with Pierre-Emerick Aubameyang.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/aubameyang-final-cta.mp4",
  },
  {
    id: "p-19",
    title: "Best Budget Plane Under $10M",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Aviation", "Luxury"],
    metrics: [{ label: "Views", value: "18M+" }],
    summary: "Steve breaks down the best private jets under $10 million.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/best-budget-plane-10m.mp4",
  },
  {
    id: "p-20",
    title: "Owning a Private Jet",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Aviation", "Luxury"],
    metrics: [{ label: "Views", value: "12M+" }],
    summary: "The reality of owning a private jet explained.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/owning-a-jet.mp4",
  },
  {
    id: "p-21",
    title: "Follow Your Passion",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Motivation", "Business"],
    metrics: [{ label: "Views", value: "3.6M+" }],
    summary: "Steve's advice on pursuing your passion in business.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/follow-your-passion.mp4",
  },
  {
    id: "p-22",
    title: "Buying a Jet with Crypto",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Crypto", "Aviation"],
    metrics: [{ label: "Views", value: "8.4M+" }],
    summary: "Can you buy a private jet with cryptocurrency?",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/buying-jet-crypto.mp4",
  },
  {
    id: "p-23",
    title: "Bugatti Bolide",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Automotive", "Supercar"],
    metrics: [{ label: "Views", value: "5.8M+" }],
    summary: "Up close with the track-only Bugatti Bolide.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/bugatti-bollide-fv-captioned.mp4",
  },
  {
    id: "p-24",
    title: "Fastest Corporate Jet",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Aviation", "Luxury"],
    metrics: [{ label: "Views", value: "6.1M+" }],
    summary: "A look at the fastest corporate jet in the world.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/fastest-corporate-jet.mp4",
  },
  {
    id: "p-25",
    title: "Pagani Hypercar",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Automotive", "Supercar"],
    metrics: [{ label: "Views", value: "4.3M+" }],
    summary: "Exclusive Pagani content for the ultimate car enthusiast.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/pagani-video-captioned.mp4",
  },
  {
    id: "p-26",
    title: "Breakdown of Jet Sizes",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Aviation", "Education"],
    metrics: [{ label: "Views", value: "9.7M+" }],
    summary: "Steve explains the different categories of private jets.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/breakdown-jet-sizes.mp4",
  },
  {
    id: "p-27",
    title: "Aston Martin DB9 Review",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Automotive", "Luxury"],
    metrics: [{ label: "Views", value: "3.2M+" }],
    summary: "Full review of the classic Aston Martin DB9.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/aston-martin-db9-v4-captioned.mp4",
  },
  {
    id: "p-28",
    title: "Never Giving Up",
    client: "Steve Varsano",
    year: "2024",
    categories: ["Short-form", "Personal Brand"],
    tags: ["Motivation", "Business"],
    metrics: [{ label: "Views", value: "4.9M+" }],
    summary: "Steve on the importance of persistence in business.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/never-giving-up.mp4",
  },
  {
    id: "p-29",
    title: "Buying a Bugatti",
    client: "Ameerh",
    year: "2024",
    categories: ["Short-form", "Luxury"],
    tags: ["Automotive", "Supercar"],
    metrics: [{ label: "Views", value: "6.5M+" }],
    summary: "The experience of buying a Bugatti.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/buying-a-buggatti-vf-captioned.mp4",
  },
  {
    id: "p-30",
    title: "Building the Naran",
    client: "Ameerh",
    year: "2024",
    categories: ["Long-form", "Luxury"],
    tags: ["Automotive", "Supercar"],
    metrics: [{ label: "Views", value: "3.2M+" }],
    summary: "Behind the scenes of building the Naran hypercar.",
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/building-the-naran-v4-captioned.mp4",
  },
];

export const stats: Metric[] = [
  { value: "2B+", label: "Organic Views" },
  { value: "$250M+", label: "Revenue Generated" },
  { value: "11+", label: "Flagship Clients" },
];

/** Everything VideoModal needs — satisfied by both portfolio items and case studies. */
export type ModalItem = {
  id: string;
  title: string;
  client: string;
  year: string;
  categories: string[];
  metrics: Metric[];
  summary: string;
  videoUrl?: string;
  description?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  testimonial?: Testimonial;
  services?: string[];
  duration?: string;
};
