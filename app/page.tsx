import Hero from "@/components/Hero";
import WhyVelmenora from "@/components/WhyVelmenora";
import LearnForex from "@/components/LearnForex";
import FinalCTA from "@/components/FinalCTA";
import TopBrokers from "@/components/TopBrokers";
import MarketHeroChart from "@/components/MarketHeroChart";
import TopMarkets from "@/components/TopMarkets";
import NewsSection from "@/components/NewsSection";

/* ================= SAFE SYMBOL HELPER ================= */
function getSymbol(pair?: string) {
    if (!pair) return "FX:EURUSD"; // 🔥 HARD FALLBACK

    if (pair === "XAUUSD") return "OANDA:XAUUSD";
    if (pair === "XAGUSD") return "OANDA:XAGUSD";
    if (pair === "BTCUSD") return "BITSTAMP:BTCUSD";
    if (pair === "ETHUSD") return "BITSTAMP:ETHUSD";

    if (pair.length === 6) return `FX:${pair}`;

    return pair;
}

export default function Home() {

    /* 🔥 OPTIONAL: DEFAULT PAIR (SAFE) */
    const defaultPair = "EURUSD";

    /* 🔥 SAFE USAGE (NO CRASH) */
    const symbol = getSymbol(defaultPair);

    return (
        <main className="bg-black text-white overflow-hidden">

            {/* 🔥 HERO */}
            <Hero />

            {/* 🔥 MARKET CHART (SAFE COMPONENT) */}
            <MarketHeroChart />

            {/* 🔥 TOP MARKETS */}
            <section className="border-y border-white/10">
                <TopMarkets />
            </section>

            {/* 🔥 TRUST */}
            <WhyVelmenora />

            {/* 🔥 NEWS */}
            <section className="border-y border-white/10">
                <NewsSection />
            </section>

            {/* 🔥 MONEY */}
            <TopBrokers />

            {/* 🔥 EDUCATION */}
            <LearnForex />

            {/* 🔥 CTA */}
            <FinalCTA />

        </main>
    );
}