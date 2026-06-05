import type { MetadataRoute } from "next";
import { business } from "@/lib/config";

const routes = ["", "/menu", "/order", "/about", "/reviews", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${business.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/menu" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/order" || route === "/menu" ? 0.9 : 0.7
  }));
}
