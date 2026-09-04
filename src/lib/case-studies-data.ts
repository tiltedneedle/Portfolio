export type CaseStudyMetric = { label: string; value: string };

export type CaseStudy = {
  id: string;
  title: string;
  client: string;
  year: string;
  categories: string[];
  metrics: CaseStudyMetric[];
  summary: string;
  highlight: string;
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
    videoUrl: "https://d6lso8oygmnu9.cloudfront.net/videos/my-business-philosophy-fv.mp4",
  },
  {
    id: "cs-7",
    title: "Aviation & Hypercars",
    client: "Ameerh Naran",
    year: "2024",
    categories: [
      "Short-form",
      "Private Aviation",
    ],
    metrics: [
      {
        label: "Views",
        value: "25M+",
      },
      {
        label: "Followers",
        value: "500k+",
      },
    ],
    summary: "Grew Vimana Private Jets founder through high-net-worth storytelling & aviation content.",
    highlight: "$500M+ jet charter empire",
    videoUrl: "",
  },
  {
    id: "cs-8",
    title: "Luxury Beauty & Brand",
    client: "Youmi Khoury",
    year: "2024",
    categories: [
      "Short-form",
      "Beauty & Luxury",
    ],
    metrics: [
      {
        label: "Views",
        value: "50M+",
      },
      {
        label: "Followers",
        value: "2M+",
      },
    ],
    summary: "Scaled Dubai luxury beauty entrepreneur with viral lifestyle & cosmetics video content.",
    highlight: "50M+ organic views",
    videoUrl: "",
  },
];
