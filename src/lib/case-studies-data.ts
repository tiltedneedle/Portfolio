export type CaseStudyMetric = { label: string; value: string };

export type CaseStudyFullMetric = {
  label: string;
  value: string;
  description: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  year: string;
  categories: string[];
  tags: string[];
  metrics: CaseStudyMetric[];
  summary: string;
  highlight: string;
  fullMetrics: CaseStudyFullMetric[];
  featured: boolean;
  videoUrl: string;
};

export const caseStudies: CaseStudy[] = [
  {
    id: "cs-1",
    title: "The Jet Broker",
    client: "Steve Varsano",
    year: "2024",
    categories: [
      "Short-form",
      "Personal Brand",
    ],
    tags: [
      "Luxury",
      "Aviation",
    ],
    metrics: [
      {
        label: "Views",
        value: "1B+",
      },
      {
        label: "Followers",
        value: "4M+",
      },
    ],
    summary: "Grew The Jet Business founder from 0 to 4M+ followers and 1B+ organic views in 12 months.",
    highlight: "$150M+ in corporate jets sold",
    fullMetrics: [
      {
        label: "Total Views",
        value: "1B+",
        description: "In 12 months",
      },
      {
        label: "Followers",
        value: "4M+",
        description: "From zero",
      },
      {
        label: "Jet Sales",
        value: "$150M+",
        description: "Multiple jets sold",
      },
      {
        label: "Timeframe",
        value: "12 mo",
        description: "0 to global authority",
      },
    ],
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/expanding-tjb.mp4",
  },
  {
    id: "cs-2",
    title: "High-End Interior Design",
    client: "Noor Charchafchi",
    year: "2024",
    categories: [
      "Short-form",
      "Interiors",
    ],
    tags: [
      "Luxury",
      "Interiors",
    ],
    metrics: [
      {
        label: "Views",
        value: "6M+",
      },
      {
        label: "Followers",
        value: "200k+",
      },
    ],
    summary: "6M organic views and 200k+ new Instagram followers in the first 7 days for Celine Interior Design.",
    highlight: "6M views in 7 days",
    fullMetrics: [
      {
        label: "Views",
        value: "6M+",
        description: "First 7 days",
      },
      {
        label: "Followers",
        value: "200k+",
        description: "7-day growth",
      },
      {
        label: "Direct Sales",
        value: "$5.6M+",
        description: "From video, 12 months",
      },
      {
        label: "Time to Viral",
        value: "7 days",
        description: "From launch",
      },
    ],
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/week-in-the-life-vf3-captioned.mp4",
  },
  {
    id: "cs-3",
    title: "Restaurant Revival",
    client: "Alexis Gauthier",
    year: "2023",
    categories: [
      "Short-form",
      "Hospitality",
    ],
    tags: [
      "Food",
      "Hospitality",
    ],
    metrics: [
      {
        label: "Views",
        value: "14M+",
      },
      {
        label: "Followers",
        value: "120k",
      },
    ],
    summary: "Transformed revenue from £3k/mo to £100k+/mo through viral content strategy.",
    highlight: "3,233% revenue growth",
    fullMetrics: [
      {
        label: "Views",
        value: "14M+",
        description: "Total reach",
      },
      {
        label: "Followers",
        value: "120k",
        description: "Built from scratch",
      },
      {
        label: "Revenue Before",
        value: "£3k/mo",
        description: "Starting point",
      },
      {
        label: "Revenue After",
        value: "£100k+/mo",
        description: "Current monthly",
      },
    ],
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/food-on-plane.mp4",
  },
  {
    id: "cs-4",
    title: "Healthcare Performance",
    client: "EuroEyes",
    year: "2024",
    categories: [
      "Ads",
      "Healthcare",
    ],
    tags: [
      "Healthcare",
      "Performance",
    ],
    metrics: [
      {
        label: "TikTok Views",
        value: "12M+",
      },
      {
        label: "Revenue",
        value: "£1.893M",
      },
    ],
    summary: "Achieved exceptional ROAS in highly regulated healthcare advertising.",
    highlight: "9x ROAS on ad spend",
    fullMetrics: [
      {
        label: "TikTok Views",
        value: "12M+",
        description: "4-week campaign",
      },
      {
        label: "Ad Spend",
        value: "£212k",
        description: "12-month investment",
      },
      {
        label: "Revenue",
        value: "£1.893M+",
        description: "Attributed revenue",
      },
      {
        label: "ROAS",
        value: "8.9x",
        description: "Return on ad spend",
      },
    ],
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/time-efficiency-v10-captioned.mp4",
  },
  {
    id: "cs-5",
    title: "Luxury Watch Dealer",
    client: "Frankie Mardell",
    year: "2024",
    categories: [
      "Short-form",
      "Personal Brand",
    ],
    tags: [
      "Luxury",
      "Watches",
    ],
    metrics: [
      {
        label: "Views",
        value: "10M+",
      },
      {
        label: "Followers",
        value: "+130k",
      },
    ],
    summary: "Grew a luxury watch dealer by 130k followers and 10M+ views in 6 months, lifting revenue 400%+.",
    highlight: "+400% revenue in 6 months",
    fullMetrics: [
      {
        label: "Views",
        value: "10M+",
        description: "In 6 months",
      },
      {
        label: "New Followers",
        value: "+130k",
        description: "6-month growth",
      },
      {
        label: "Revenue Growth",
        value: "+400%",
        description: "Record quarters",
      },
      {
        label: "Timeframe",
        value: "6 mo",
        description: "To record revenue",
      },
    ],
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/putting-yourself-out-there.mp4",
  },
  {
    id: "cs-6",
    title: "E-commerce Scale",
    client: "Rastah",
    year: "2024",
    categories: [
      "Short-form",
      "E-commerce",
    ],
    tags: [
      "Fashion",
      "E-commerce",
    ],
    metrics: [
      {
        label: "Views",
        value: "14M+",
      },
      {
        label: "Followers",
        value: "105k",
      },
    ],
    summary: "Scaled from 12k to 105k followers while achieving 900% sales growth.",
    highlight: "+900% online sales in 3 months",
    fullMetrics: [
      {
        label: "Views",
        value: "14M+",
        description: "Total reach",
      },
      {
        label: "Followers Before",
        value: "12k",
        description: "Starting point",
      },
      {
        label: "Followers After",
        value: "105k",
        description: "3 months later",
      },
      {
        label: "Sales Growth",
        value: "+900%",
        description: "Online revenue",
      },
    ],
    featured: true,
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/my-business-philosophy-fv.mp4",
  },
];
