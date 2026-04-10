import { NextResponse } from "next/server";

type Params = Promise<{ pair: string }>;

/* ================= MOCK ENGINE (SMART BASELINE) ================= */

function generateSmartSentiment(pair: string) {
    const base = pair.charCodeAt(0) + pair.charCodeAt(pair.length - 1);

    const bull = (base % 40) + 30; // 30 → 70
    const bear = 100 - bull;

    return {
        bull,
        bear,
        signal:
            bull > 60
                ? "strong_buy"
                : bull > 52
                    ? "buy"
                    : bull < 40
                        ? "strong_sell"
                        : bull < 48
                            ? "sell"
                            : "neutral",
    };
}

/* ================= OPTIONAL: REAL API (FUTURE READY) ================= */

async function fetchExternalSentiment(pair: string) {
    try {
        // 🔥 unaweza replace na API yako (Forex, Crypto, etc)
        // mfano: AlphaVantage, TwelveData, au custom ML endpoint

        const res = await fetch(
            `https://api.example.com/sentiment/${pair}`,
            { cache: "no-store" }
        );

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        return {
            bull: data.bull ?? 50,
            bear: data.bear ?? 50,
            signal: data.signal ?? "neutral",
        };
    } catch {
        return null;
    }
}

/* ================= ROUTE ================= */

export async function GET(
    _req: Request,
    { params }: { params: Params }
) {
    try {
        const resolvedParams = await params;

        if (!resolvedParams?.pair) {
            return NextResponse.json(
                { error: "Pair is required" },
                { status: 400 }
            );
        }

        const pair = resolvedParams.pair.toUpperCase();

        /* 🔥 TRY REAL DATA FIRST */
        const external = await fetchExternalSentiment(pair);

        const sentiment =
            external ?? generateSmartSentiment(pair);

        return NextResponse.json(
            {
                pair,
                ...sentiment,
                timestamp: Date.now(),
            },
            {
                status: 200,
                headers: {
                    "Cache-Control":
                        "public, s-maxage=60, stale-while-revalidate=120",
                },
            }
        );
    } catch (error) {
        console.error("❌ Sentiment API Error:", error);

        return NextResponse.json(
            {
                pair: "UNKNOWN",
                bull: 50,
                bear: 50,
                signal: "neutral",
                fallback: true,
            },
            { status: 200 }
        );
    }
}