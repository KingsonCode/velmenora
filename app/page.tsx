import Hero from "@/components/Hero";
import WhyVelmenora from "@/components/WhyVelmenora";
import LearnForex from "@/components/LearnForex";
import FinalCTA from "@/components/FinalCTA";
import TopBrokers from "@/components/TopBrokers";
import MarketHeroChart from "@/components/MarketHeroChart";

/* 🔥 NEW (ENGAGEMENT + AUTHORITY) */
import NewsSection from "@/components/NewsSection";

export default function Home() {
    return (
        <main className="bg-black text-white overflow-hidden">

            {/* HERO */}
            <Hero />

            {/* 🔥 NEW: MARKET CHART (HIGH IMPACT) */}
            <MarketHeroChart />

            {/* TRUST */}
            <WhyVelmenora />

            {/* NEWS */}
            <section className="border-y border-white/10">
                <NewsSection />
            </section>

            {/* MONEY */}
            <TopBrokers />

            {/* EDUCATION */}
            <LearnForex />

            {/* CTA */}
            <FinalCTA />

        </main>
    );
}