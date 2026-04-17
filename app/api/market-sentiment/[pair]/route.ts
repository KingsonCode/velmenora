import { NextResponse } from "next/server";

/* ================= TYPES ================= */
type Params = Promise<{ pair: string }>;

/* ================= SMART BASELINE ================= */
function generateSmartSentiment(pair: string) {
    const base =
        pair.charCodeAt(0) +
        pair.charCodeAt(pair.length - 1);

    const bull = (base % 40) + 30; // 30 → 70
    const bear = 100 - bull;

    const signal =
        bull > 60
            ? "strong_buy"
            : bull > 52
                ? "buy"
                : bull < 40
                    ? "strong_sell"
                    : bull < 48
                        ? "sell"
                        : "neutral";

    return { bull, bear, signal };
}

/* ================= OPTIONAL EXTERNAL ================= */
async function fetchExternalSentiment(pair: string) {
    try {
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

/* ================= VALIDATION ================= */
function isValidPair(pair: string) {
    return /^[A-Z]{6,10}$/.test(pair);
}

/* ================= ROUTE ================= */
export async function GET(
    _req: Request,
    context: { params: Params }
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

        /* 🔥 TRY REAL API FIRST */
        const external = await fetchExternalSentiment(
            normalized
        );

        const sentiment =
            external ?? generateSmartSentiment(normalized);

        return NextResponse.json(
            {
                pair: normalized,
                ...sentiment,
                timestamp: Date.now(),
                source: external ? "external" : "internal",
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
                timestamp: Date.now(),
            },
            { status: 200 }
        );
    }
}