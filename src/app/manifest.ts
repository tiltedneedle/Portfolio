import type { MetadataRoute } from "next";
import { client } from "@/content/client/client";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: client.name + " × Tilted Needle",
    short_name: "Tilted Needle",
    description: "Your complete viral content system.",
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
