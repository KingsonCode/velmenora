import { NextRequest, NextResponse } from "next/server";

/* ================= TYPES ================= */
type NewsItem = {
    title: string;
    summary: string;
    source: string;
    time: string;
    url: string;
};

/* ================= VALIDATION ================= */
function isValidPair(pair: string) {
    return /^[A-Z]{6,10}$/.test(pair);
}

/* ================= PRIMARY GENERATOR ================= */
function generateNews(pair: string): NewsItem[] {
    return [
        {
            title: `${pair} rallies as traders react to economic data`,
            summary: `${pair} gains momentum following recent macroeconomic developments impacting currency strength.`,
            source: "Velmenora AI",
            time: "2h ago",
            url: `/news/${pair.toLowerCase()}-rally`,
        },
        {
            title: `${pair} approaches key resistance level`,
            summary: `Technical analysts highlight a major resistance zone that could determine the next move for ${pair}.`,
            source: "Market Watch",
            time: "5h ago",
            url: `/news/${pair.toLowerCase()}-resistance`,
        },
        {
            title: `${pair} outlook remains mixed`,
            summary: `Conflicting indicators suggest indecision among traders as ${pair} consolidates.`,
            source: "FX Daily",
            time: "1d ago",
            url: `/news/${pair.toLowerCase()}-outlook`,
        },
    ];
}

/* ================= FALLBACK ================= */
function fallbackNews(pair: string): NewsItem[] {
    return [
        {
            title: `Latest news for ${pair}`,
            summary: "Market moving updates and insights.",
            source: "Velmenora",
            time: new Date().toISOString(),
            url: "#",
        },
    ];
}

/* ================= ROUTE ================= */
export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ pair: string }> }
) {
    try {
        const { pair } = await context.params;

        if (!pair) {
            return NextResponse.json(
                { error: "Pair is required" },
                { status: 400 }
            );
        }

        const normalized = pair.toUpperCase();

        if (!isValidPair(normalized)) {
            return NextResponse.json(
                { error: "Invalid pair format" },
                { status: 400 }
            );
        }

        /* 🔥 MAIN ENGINE */
        const news = generateNews(normalized);

        return NextResponse.json(news, {
            status: 200,
            headers: {
                "Cache-Control":
                    "public, s-maxage=60, stale-while-revalidate=120",
            },
        });
    } catch (error) {
        console.error("❌ Market News Error:", error);

        return NextResponse.json(
            fallbackNews("UNKNOWN"),
            { status: 200 }
        );
    }
}