// /app/api/market-news/[pair]/route.ts

import { NextRequest, NextResponse } from "next/server";

/* 🔥 MOCK / AI GENERATOR (replace later with real API) */
function generateNews(pair: string) {
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

/* 🔥 NEXT 15 CORRECT HANDLER */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ pair: string }> }
) {
    const { pair } = await params;

    const news = generateNews(pair.toUpperCase());

    return NextResponse.json(news, {
        headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
    });
}