import { NextRequest, NextResponse } from "next/server";

/* TYPES */
type NewsItem = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content?: string;
    image?: string;
    source?: string;
    publishedAt?: string | number;
};

/* FALLBACK */
const FALLBACK_NEWS: NewsItem[] = [
    {
        id: "eurusd-rally",
        slug: "eurusd-rally",
        title: "EUR/USD rallies as USD weakens",
        summary: "Euro gains momentum as the US Dollar weakens.",
        content: "Market reacts to macroeconomic changes...",
        image: "https://images.unsplash.com/photo-1642790551116-18e1506b0d62",
        source: "Reuters",
        publishedAt: "2026-04-08T12:00:00Z",
    },
];

/* HELPER */
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

/* FETCH ALL */
async function fetchAllNews(): Promise<NewsItem[]> {
    try {
        const res = await fetch(
            `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/news`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) return FALLBACK_NEWS;

        const data = await res.json();
        return Array.isArray(data) && data.length ? data : FALLBACK_NEWS;
    } catch {
        return FALLBACK_NEWS;
    }
}

/* ✅ CORRECT HANDLER */
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ slug: string }> } // 🔥 FIX HERE
) {
    try {
        const { slug } = await context.params; // 🔥 MUST AWAIT

        const allNews = await fetchAllNews();

        let article = allNews.find((n) => n.slug === slug);

        if (!article) {
            article = allNews.find(
                (n) => generateSlug(n.title) === slug
            );
        }

        if (!article) {
            return NextResponse.json(
                { error: "News not found" },
                { status: 404 }
            );
        }

        const enriched = {
            ...article,
            content:
                article.content ||
                `${article.summary}

This is a developing story. Stay tuned for updates.`,
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