/**
 * The showreel: the studio's clients' own videos, with the views they took.
 * Stills are cached under public/clips (signed TikTok and Instagram CDN
 * stills expire); the films play in the platform's own embedded player.
 * Home shows the reel, the backdrop drifts through its stills, and a guide
 * can put any entry on a clip rail by its id.
 *
 * `views` is a count; `viewsLabel` prints it the way a platform would.
 */
export type Reel = {
  id: string;
  client: string;
  handle: string;
  platform: "tiktok" | "instagram";
  /** The video's id on the platform: TikTok's number, Instagram's reel code. */
  videoId: string;
  url: string;
  title: string;
  /** A still under public/. */
  thumb: string;
  views: number;
};

export const PLATFORM: Record<Reel["platform"], string> = { tiktok: "TikTok", instagram: "Instagram" };

export const reel: Reel[] = [
  {
    id: "tjb-19-year-old",
    client: "The Jet Business",
    handle: "thejetbusiness",
    platform: "tiktok",
    videoId: "7283257299626511649",
    url: "https://www.tiktok.com/@thejetbusiness/video/7283257299626511649",
    title: "19 year old buys a private jet",
    thumb: "/clips/tiktok-7283257299626511649.jpg",
    views: 36_200_000,
  },
  {
    id: "tjb-next-aircraft",
    client: "The Jet Business",
    handle: "thejetbusiness",
    platform: "tiktok",
    videoId: "7243195703277800731",
    url: "https://www.tiktok.com/@thejetbusiness/video/7243195703277800731",
    title: "A young client of ours choosing his next aircraft",
    thumb: "/clips/tiktok-7243195703277800731.jpg",
    views: 34_700_000,
  },
  {
    id: "tjb-day-in-the-life",
    client: "The Jet Business",
    handle: "thejetbusiness",
    platform: "tiktok",
    videoId: "7258611035152616731",
    url: "https://www.tiktok.com/@thejetbusiness/video/7258611035152616731",
    title: "A day in the life of Steve Varsano",
    thumb: "/clips/tiktok-7258611035152616731.jpg",
    views: 21_400_000,
  },
  // Laser Eye Clinic London (16M, tiktok 7276573223955729696) is not here:
  // TikTok answers "video currently unavailable" for it, from this side of
  // the world at least, and its oEmbed comes back empty. Add it once a link
  // that plays, or a still, arrives.
  {
    id: "rastah-bieber",
    client: "Rastah",
    handle: "zainoo_95",
    platform: "instagram",
    videoId: "C8XMXK-snX8",
    url: "https://www.instagram.com/reel/C8XMXK-snX8/",
    title: "The inside story with Justin Bieber",
    thumb: "/clips/instagram-C8XMXK-snX8.jpg",
    views: 7_100_000,
  },
  {
    id: "gauthier-caviar",
    client: "Gauthier Soho",
    handle: "gauthierinsoho",
    platform: "instagram",
    videoId: "DCHF6xSMJoC",
    url: "https://www.instagram.com/reel/DCHF6xSMJoC/",
    title: "My caviar is the future",
    thumb: "/clips/instagram-DCHF6xSMJoC.jpg",
    views: 6_400_000,
  },
  {
    id: "trilogy-this-or-that",
    client: "Trilogy Jewellers",
    handle: "trilogyjewellers",
    platform: "tiktok",
    videoId: "7404537833739898144",
    url: "https://www.tiktok.com/@trilogyjewellers/video/7404537833739898144",
    title: "This or that?",
    thumb: "/clips/tiktok-7404537833739898144.jpg",
    views: 5_900_000,
  },
  {
    id: "ameerh-tri-fold",
    client: "Ameerh Naran",
    handle: "ameerhnaran",
    platform: "tiktok",
    videoId: "7499157205451672854",
    url: "https://www.tiktok.com/@ameerhnaran/video/7499157205451672854",
    title: "The story behind my Huawei tri-folding phone",
    thumb: "/clips/tiktok-7499157205451672854.jpg",
    views: 3_900_000,
  },
  {
    id: "celine-how-it-started",
    client: "Celine Interior Design",
    handle: "celineinteriordesign",
    platform: "instagram",
    videoId: "DOaaaC-CHY0",
    url: "https://www.instagram.com/reel/DOaaaC-CHY0/",
    title: "Now a fully fledged client: how it started",
    thumb: "/clips/instagram-DOaaaC-CHY0.jpg",
    views: 2_500_000,
  },
];

export function reelById(id: string) {
  return reel.find((r) => r.id === id);
}

/**
 * Where the film plays: the platform's own player, inside our lightbox.
 * TikTok's embed/v2 is the page its embed script would build; the newer
 * player/v1 answers "video currently unavailable" for these films.
 */
export function embedFor(r: Reel) {
  return r.platform === "tiktok" ? "https://www.tiktok.com/embed/v2/" + r.videoId + "?lang=en-US" : "https://www.instagram.com/reel/" + r.videoId + "/embed/";
}

/** 36.2M, 16M, 134.1M: the way a platform counts. */
export function viewsLabel(n: number) {
  if (n >= 1_000_000) return (Math.round(n / 100_000) / 10).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return String(n);
}

/** "134 million", for a sentence. */
export function viewsInWords(n: number) {
  return n >= 1_000_000 ? Math.round(n / 1_000_000) + " million" : n >= 1_000 ? Math.round(n / 1_000) + " thousand" : String(n);
}

export function reelTotal() {
  return reel.reduce((a, r) => a + r.views, 0);
}
