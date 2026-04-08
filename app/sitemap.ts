/* =========================================================
   🔥 CONFIG
========================================================= */
const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://velmenora.com";

/* =========================================================
   🔥 MAIN SITEMAP INDEX
========================================================= */
export default function sitemap() {
    return [
        {
            url: `${BASE_URL}/sitemap-blog-1.xml`,
            lastModified: new Date(),
        },
        {
            url: `${BASE_URL}/sitemap-blog-2.xml`,
            lastModified: new Date(),
        },
    ];
}