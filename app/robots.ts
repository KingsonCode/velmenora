import type { MetadataRoute } from "next";

/* =========================================================
   🔥 CONFIG
========================================================= */
const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "https://www.velmenora.com";

const isProd = process.env.NODE_ENV === "production";

/* =========================================================
   🔥 ROBOTS
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

                /* 🔓 ALLOW IMPORTANT CONTENT */
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

        /* 🔥 MULTIPLE SITEMAPS (VERY IMPORTANT) */
        sitemap: [
            `${BASE_URL}/sitemap.xml`,
            `${BASE_URL}/blog/sitemap.xml`,
            `${BASE_URL}/money-pages/sitemap.xml`,
            `${BASE_URL}/programmatic/sitemap/0.xml`,
        ],

        /* 🔥 HOST */
        host: BASE_URL,
    };
}