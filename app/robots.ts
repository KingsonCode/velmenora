import type { MetadataRoute } from "next";

/* =========================================================
   🔥 CONFIG
========================================================= */
const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

const isProd = process.env.NODE_ENV === "production";

/* =========================================================
   🔥 ROBOTS CONFIG
========================================================= */
export default function robots(): MetadataRoute.Robots {
    /* ❌ BLOCK EVERYTHING IN DEV */
    if (!isProd) {
        return {
            rules: [
                {
                    userAgent: "*",
                    disallow: "/",
                },
            ],
        };
    }

    /* ✅ PRODUCTION CONFIG */
    return {
        rules: [
            {
                userAgent: "*",

                /* 🔓 ALLOW ALL IMPORTANT CONTENT */
                allow: [
                    "/",
                    "/blog/",
                    "/brokers/",
                    "/compare/",
                    "/markets/",
                    "/academy/",
                    "/news/",
                ],

                /* 🔒 BLOCK LOW VALUE / TECH PATHS */
                disallow: [
                    "/api/",
                    "/admin/",
                    "/private/",
                    "/_next/",
                    "/tmp/",
                    "/draft/",
                ],
            },
        ],

        /* 🔥 ROOT SITEMAP ENTRY */
        sitemap: `${BASE_URL}/sitemap.xml`,

        /* 🔥 HOST (OPTIONAL BUT GOOD FOR CLARITY) */
        host: BASE_URL,
    };
}