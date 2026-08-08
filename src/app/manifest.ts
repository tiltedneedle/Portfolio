import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tilted Needle",
    short_name: "Tilted Needle",
    description:
      "A social media production company based in London and Dubai. 2B+ organic views. $250M+ revenue generated for clients.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      { src: "/favicon.ico", sizes: "256x256", type: "image/x-icon" },
      { src: "/white-logo.png", sizes: "any", type: "image/png" },
    ],
  };
}
