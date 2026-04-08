import { NextResponse } from "next/server";

/* ================= TYPES ================= */

type Impact = "high" | "medium" | "low";
type Category = "forex" | "crypto" | "stocks" | "gold";

type NewsItem = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    content?: string;
    image: string;
    category: Category;
    impact: Impact;
    publishedAt: number;
    source: string;
};

/* ================= FALLBACK (FAILSAFE) ================= */

const FALLBACK_NEWS: NewsItem[] = [
    {
        id: "eurusd-rally",
        slug: "eurusd-rally",
        title: "EUR/USD rallies as USD weakens",
        summary: "Euro gains momentum as the US Dollar weakens.",
        content: "Euro strength driven by macroeconomic shifts...",
        image: "https://images.unsplash.com/photo-1642790551116-18e1506b0d62",
        category: "forex",
        impact: "medium",
        publishedAt: Date.now(),
        source: "Reuters",
    },
];

/* ================= API ================= */

export async function GET() {
    try {
        const query =
            "forex OR USD OR EUR OR GBP OR gold OR XAU OR crypto OR bitcoin OR ethereum OR stock OR Nasdaq OR Dow Jones";

        const [newsRes, finnhubRes] = await Promise.allSettled([
            fetch(
                `https://newsapi.org/v2/everything?q=${encodeURIComponent(
                    query
                )}&language=en&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY
                }`,
                { next: { revalidate: 60 } }
            ),
            fetch(
                `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`,
                { next: { revalidate: 60 } }
            ),
        ]);

        const newsData =
            newsRes.status === "fulfilled"
                ? await newsRes.value.json()
                : { articles: [] };

        const finnhubData =
            finnhubRes.status === "fulfilled"
                ? await finnhubRes.value.json()
                : [];

        const combined = [
            ...(newsData.articles || []),
            ...(finnhubData || []),
        ];

        let normalized: NewsItem[] = combined.map((item: any, i: number) => {
            const title = item.title || item.headline || "";
            const content =
                item.description || item.summary || item.headline || "";

            return {
                id: item.url || item.id || String(i),
                slug: generateSlug(title),

                title,
                summary: content,
                content,

                image:
                    item.urlToImage ||
                    item.image ||
                    "/news/default.jpg",

                category: detectCategory(title, content),
                impact: detectImpact(title, content),

                publishedAt: new Date(
                    item.publishedAt || item.datetime || Date.now()
                ).getTime(),

                source:
                    item.source?.name ||
                    item.source ||
                    item.category ||
                    "Unknown",
            };
        });

        /* ================= FILTER ================= */

        normalized = normalized.filter(
            (n) =>
                n.title.length > 20 &&
                !/removed|deleted|\[removed\]/i.test(n.title)
        );

        /* ================= DEDUP ================= */

        const seen = new Set<string>();
        normalized = normalized.filter((n) => {
            const key = n.title.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        /* ================= SORT ================= */

        const impactScore: Record<Impact, number> = {
            high: 3,
            medium: 2,
            low: 1,
        };

        normalized.sort((a, b) => {
            return (
                impactScore[b.impact] - impactScore[a.impact] ||
                b.publishedAt - a.publishedAt
            );
        });

        /* ================= LIMIT ================= */

        normalized = normalized.slice(0, 12);

        /* 🔥 FAILSAFE */
        if (normalized.length === 0) {
            return NextResponse.json(FALLBACK_NEWS);
        }

        return NextResponse.json(normalized, {
            headers: {
                "Cache-Control": "s-maxage=60, stale-while-revalidate=120",
            },
        });
    } catch (error) {
        console.error("❌ NEWS API ERROR:", error);
        return NextResponse.json(FALLBACK_NEWS);
    }
}

/* ================= HELPERS ================= */

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-")
        .slice(0, 80);
}

function detectCategory(title: string, content: string): Category {
    const text = `${title} ${content}`.toLowerCase();

    if (/btc|bitcoin|crypto|eth|ethereum/.test(text)) return "crypto";
    if (/gold|xau|bullion/.test(text)) return "gold";
    if (/nasdaq|dow|s&p|stock|equity/.test(text)) return "stocks";

    return "forex";
}

function detectImpact(title: string, content: string): Impact {
    const text = `${title} ${content}`.toLowerCase();

    if (/fed|interest rate|inflation|cpi|central bank/.test(text))
        return "high";

    if (/gdp|employment|jobs|pmi/.test(text))
        return "medium";

    return "low";
}