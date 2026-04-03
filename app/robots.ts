import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://velmenora.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
            },

            /* 🔥 BLOCK UNNECESSARY PATHS */
            {
                userAgent: "*",
                disallow: [
                    "/api/",
                    "/admin/",
                    "/_next/",
                    "/private/",
                ],
            },
        ],

        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}