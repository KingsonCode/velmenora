import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MARKETS } from "@/data/markets";

import MarketHeader from "@/components/market/MarketHeader";
import MarketChart from "@/components/market/MarketChart";
import MarketBrokers from "@/components/market/MarketBrokers";
import MarketCTA from "@/components/market/MarketCTA";

/* 🔥 ADD THESE (FIX ERROR) */
import SentimentSection from "@/components/market/sections/SentimentSection";
import NewsSection from "@/components/market/sections/NewsSection";
import SkeletonBlock from "@/components/ui/SkeletonBlock";

/* 🔥 PERFORMANCE CONFIG */
export const dynamic = "force-dynamic";
export const revalidate = 60;

/* ================= TYPES ================= */
type Params = { pair: string };

/* ================= SEO ================= */
export async function generateMetadata({ params }: { params: Params }) {
    const pair = params.pair.toUpperCase();
    const market = MARKETS.find((m) => m.symbol === pair);

    if (!market) return {};

    const url = `https://www.velmenora.com/markets/${pair}`;

    return {
        title: `${market.name} Live Chart & Analysis | Velmenora`,
        description: `Trade ${market.name} with live charts, sentiment, and market insights.`,
        alternates: { canonical: url },
        openGraph: {
            title: `${market.name} Analysis`,
            description: `Live ${market.name} insights`,
            url,
        },
    };
}

/* ================= PAGE ================= */
export default function MarketPage({ params }: { params: Params }) {
    const pair = params.pair.toUpperCase();
    const market = MARKETS.find((m) => m.symbol === pair);

    if (!market) return notFound();

    return (
        <main className="bg-black text-white min-h-screen">

            <MarketHeader pair={pair} name={market.name} />

            <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">

                {/* ⚡ CHART (FAST - NO BLOCK) */}
                <section>
                    <MarketChart pair={pair} />
                </section>

                {/* ⚡ STREAMED SECTIONS */}
                <Suspense fallback={<SkeletonBlock title="Loading sentiment..." />}>
                    <SentimentSection pair={pair} />
                </Suspense>

                <Suspense fallback={<SkeletonBlock title="Loading news..." />}>
                    <NewsSection pair={pair} />
                </Suspense>

                {/* STATIC */}
                <MarketBrokers pair={pair} />
                <MarketCTA pair={pair} />

            </div>
        </main>
    );
}