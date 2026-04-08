import { NextResponse } from "next/server";

/* ================= TYPES ================= */

type Impact = "high" | "medium" | "low";
type Category = "forex" | "crypto" | "stocks" | "gold";

/* ================= API ================= */

export async function GET() {
    try {
        const query =
            "forex OR USD OR EUR OR GBP OR gold OR XAU OR crypto OR bitcoin OR ethereum OR stock OR Nasdaq OR Dow Jones OR S&P 500";

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

        /* ================= NORMALIZATION ================= */

        let normalized = combined.map((item: any, i: number) => {
            const title = item.title || "";
            const content =
                item.description || item.summary || item.headline || "";

            return {
                id: item.url || item.id || i,
                slug: generateSlug(title),

                title,
                excerpt: content,
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

        /* ================= FILTER LOW QUALITY ================= */

        normalized = normalized.filter(
            (n) =>
                n.title.length > 20 &&
                !/removed|deleted|\[removed\]/i.test(n.title)
        );

        /* ================= REMOVE DUPLICATES ================= */

        const seen = new Set<string>();

        normalized = normalized.filter((n) => {
            const key = n.title.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });

        /* ================= SORTING ================= */

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

        return NextResponse.json(normalized);
    } catch (error) {
        return NextResponse.json(
            { error: "API failed" },
            { status: 500 }
        );
    }
}

/* ================= HELPERS ================= */

function generateSlug(title: string) {
    return title
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}

/* 🔥 SMART CATEGORY DETECTION */
function detectCategory(title: string, content: string): Category {
    const text = `${title} ${content}`.toLowerCase();

    if (/btc|bitcoin|crypto|eth|ethereum|altcoin/.test(text)) return "crypto";

    if (/gold|xau|bullion/.test(text)) return "gold";

    if (
        /nasdaq|dow|s&p|stock|equity|shares|wall street|index/.test(text)
    )
        return "stocks";

    return "forex";
}

/* 🔥 SMART IMPACT DETECTION */
function detectImpact(title: string, content: string): Impact {
    const text = `${title} ${content}`.toLowerCase();

    if (
        /fed|fomc|interest rate|inflation|cpi|central bank|rate decision/.test(
            text
        )
    )
        return "high";

    if (/gdp|employment|jobs|unemployment|pmi/.test(text))
        return "medium";

    return "low";
}