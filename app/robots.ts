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
                allow: "/",

                /* 🔥 BLOCK LOW VALUE / SENSITIVE PATHS */
                disallow: [
                    "/api/",
                    "/admin/",
                    "/private/",
                    "/_next/",
                    "/tmp/",
                    "/draft/",
                ],
            },

            /* 🔥 OPTIONAL: BOT-SPECIFIC CONTROL */
            {
                userAgent: "Googlebot",
                allow: "/",
            },
        ],

        /* 🔥 SITEMAP (INDEX FILE) */
        sitemap: `${BASE_URL}/sitemap.xml`,

        /* 🔥 CANONICAL HOST */
        host: BASE_URL,
    };
}