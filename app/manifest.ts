import { SITE_NAME, TAGLINE } from "@/lib/config";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "AI Bug",
    description: `${TAGLINE} A daily find-the-bug game for developers.`,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0d12",
    theme_color: "#0a0d12",
    categories: ["games", "education", "developer"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
