import type { MetadataRoute } from "next";
import { getAllBrokers } from "@/lib/brokers";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return getAllBrokers().map((broker) => ({
        url: `${BASE_URL}/brokers/${broker.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
    }));
}