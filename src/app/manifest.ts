import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tilted Needle",
    short_name: "Tilted Needle",
    description:
      "A short-form production studio in London and Dubai. Six films, 2B+ views, $250M+ in revenue for the people in them.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    icons: [
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
      { src: "/white-logo.png", sizes: "any", type: "image/png" },
    ],
  };
}
