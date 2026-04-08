import { NextResponse } from "next/server";

const API_KEY = process.env.FINNHUB_API_KEY;

/* ================= FETCH ================= */
async function fetchQuote(symbol: string) {
    try {
        const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`,
            { next: { revalidate: 10 } } // 🔥 cache optimization
        );

        return await res.json();
    } catch {
        return null;
    }
}

/* ================= SMOOTH HISTORY ================= */
function generateHistory(base: number) {
    let value = base;

    return Array.from({ length: 20 }, () => {
        value += (Math.random() - 0.5) * 0.002 * base;
        return Number(value.toFixed(5)); // 🔥 stable precision
    });
}

/* ================= API ================= */
export async function GET() {
    try {
        const [eurusd, gbpusd, btc, gold] = await Promise.all([
            fetchQuote("OANDA:EUR_USD"),
            fetchQuote("OANDA:GBP_USD"),
            fetchQuote("BINANCE:BTCUSDT"),
            fetchQuote("OANDA:XAU_USD"),
        ]);

        const markets = [
            {
                symbol: "EUR/USD",
                name: "Euro Dollar",
                price: eurusd?.c?.toFixed(5) || "1.00000",
                change: eurusd?.dp ?? 0,
                history: generateHistory(eurusd?.c || 1),
            },
            {
                symbol: "GBP/USD",
                name: "Pound Dollar",
                price: gbpusd?.c?.toFixed(5) || "1.25000",
                change: gbpusd?.dp ?? 0,
                history: generateHistory(gbpusd?.c || 1.25),
            },
            {
                symbol: "BTC/USD",
                name: "Bitcoin",
                price: btc?.c
                    ? Number(btc.c).toLocaleString()
                    : "65000",
                change: btc?.dp ?? 0,
                history: generateHistory(btc?.c || 65000),
            },
            {
                symbol: "XAU/USD",
                name: "Gold",
                price: gold?.c?.toFixed(2) || "2300",
                change: gold?.dp ?? 0,
                history: generateHistory(gold?.c || 2300),
            },
        ];

        return NextResponse.json(markets);
    } catch (error) {
        console.error("Markets API error:", error);
        return NextResponse.json([], { status: 200 }); // 🔥 fail-safe
    }
}