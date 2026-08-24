import type { MetadataRoute } from "next";

/* =========================================================
   🔥 CONFIG
========================================================= */
const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "https://velmenora.com";

const isProductionDeployment =
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview" &&
    process.env.VERCEL_ENV !== "development";

/* =========================================================
   🔥 ROBOTS
========================================================= */
export default function robots(): MetadataRoute.Robots {
    /* ❌ BLOCK EVERYTHING IN DEV */
    if (!isProductionDeployment) {
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
            `${BASE_URL}/brokers/sitemap.xml`,
            `${BASE_URL}/compare/sitemap.xml`,
            `${BASE_URL}/academy/sitemap.xml`,
            `${BASE_URL}/programmatic/sitemap/0.xml`,
        ],

        /* 🔥 HOST */
        host: BASE_URL,
    };
}