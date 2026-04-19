import Hero from "@/components/Hero";
import WhyVelmenora from "@/components/WhyVelmenora";
import LearnForex from "@/components/LearnForex";
import FinalCTA from "@/components/FinalCTA";
import TopBrokers from "@/components/TopBrokers";
import MarketHeroChart from "@/components/MarketHeroChart";
import TopMarkets from "@/components/TopMarkets";
import NewsSection from "@/components/NewsSection";

export type HomeLang = "en" | "ar" | "de" | "fr";

type Props = {
    lang: HomeLang;
};

/* ================= SHARED HOME SHELL ================= */
export default function HomeShell({ lang }: Props) {
    return (
        <main className="bg-black text-white overflow-hidden">
            {/* HERO */}
            <Hero lang={lang} />

            {/* LIVE MARKET */}
            <MarketHeroChart />

            {/* TOP MARKETS */}
            <section className="border-y border-white/10">
                <TopMarkets lang={lang} />
            </section>

            {/* TOP BROKERS */}
            <TopBrokers />

            {/* WHY VELMENORA */}
            <WhyVelmenora lang={lang} />

            {/* LEARN FOREX */}
            <LearnForex lang={lang} />

            {/* NEWS */}
            <NewsSection />

            {/* FINAL CTA */}
            <FinalCTA lang={lang} />
        </main>
    );
}