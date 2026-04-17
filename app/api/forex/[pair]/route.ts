import { NextResponse } from "next/server";

/* ================= TYPES ================= */
type Params = Promise<{ pair: string }>;

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
                { error: "Pair required" },
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

        /* 🔥 FORMAT SYMBOL */
        const symbol = `${normalized.slice(0, 3)}/${normalized.slice(3)}`;

        /* 🔥 FETCH REAL DATA */
        const res = await fetch(
            `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${process.env.TWELVE_API_KEY}`,
            {
                next: { revalidate: 10 }, // cache 10s
            }
        );

        const data = await res.json();

        if (!data?.price) {
            throw new Error("No price returned");
        }

        return NextResponse.json({
            pair: normalized,
            price: Number(data.price),
            timestamp: Date.now(),
            source: "twelvedata",
        });

    } catch (error) {
        console.error("❌ FOREX API ERROR:", error);

        /* 🔥 FALLBACK */
        return NextResponse.json({
            pair: "UNKNOWN",
            price: null,
            fallback: true,
            timestamp: Date.now(),
        });
    }
}