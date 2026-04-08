import { NextResponse } from "next/server";

/* ================= TYPES ================= */

type NewsItem = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content?: string;
    image?: string;
    source?: string;
    publishedAt?: number | string;
};

/* ================= FALLBACK DB ================= */

const FALLBACK_NEWS: NewsItem[] = [
    {
        id: "eurusd-rally",
        slug: "eurusd-rally",
        title: "EUR/USD rallies as USD weakens",
        summary:
            "Euro gains momentum as the US Dollar weakens amid economic uncertainty.",
        content: `
The EUR/USD pair surged today as the US Dollar weakened across major currencies.

Analysts point to softer inflation data in the US, reducing expectations of aggressive Fed rate hikes.

Meanwhile, the Euro gains support from improved Eurozone outlook.
    `,
        image: "https://images.unsplash.com/photo-1642790551116-18e1506b0d62",
        source: "Reuters",
        publishedAt: "2026-04-08T12:00:00Z",
    },
];

/* ================= HELPERS ================= */

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-")
        .slice(0, 80);
}

/* ================= FETCH ALL (REUSABLE CORE) ================= */

async function fetchAllNews(): Promise<NewsItem[]> {
    try {
        const res = await fetch(
            `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/news`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) return FALLBACK_NEWS;

        const data = await res.json();

        return Array.isArray(data) && data.length > 0
            ? data
            : FALLBACK_NEWS;
    } catch {
        return FALLBACK_NEWS;
    }
}

/* ================= MAIN ================= */

export async function GET(
    _req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        /* 🔥 GET ALL NEWS (REAL OR FALLBACK) */
        const allNews = await fetchAllNews();

        /* 🔍 FIND MATCH */
        let article = allNews.find((n) => n.slug === slug);

        /* 🔥 FALLBACK MATCH (IF SLUG DIFFERENT) */
        if (!article) {
            article = allNews.find((n) =>
                generateSlug(n.title) === slug
            );
        }

        if (!article) {
            return NextResponse.json(
                { error: "News not found" },
                { status: 404 }
            );
        }

        /* 🔥 ENRICH CONTENT (IF MISSING) */
        const enriched = {
            ...article,
            content:
                article.content ||
                `${article.summary}

This is a developing story. Stay tuned for more updates as market conditions evolve.`,
        };

        return NextResponse.json(enriched, {
            status: 200,
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
            },
        });
    } catch (error) {
        console.error("❌ NEWS DETAIL ERROR:", error);

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}