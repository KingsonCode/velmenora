import Hero from "@/components/Hero";
import WhyVelmenora from "@/components/WhyVelmenora";
import LearnForex from "@/components/LearnForex";
import FinalCTA from "@/components/FinalCTA";
import TopBrokers from "@/components/TopBrokers";
import MarketHeroChart from "@/components/MarketHeroChart";
import TopMarkets from "@/components/TopMarkets";
import HomeCalendar from "@/components/home/HomeCalendar";

export type HomeLang = "en" | "ar" | "de" | "fr";

type Props = {
    lang: HomeLang;
};

/* ================= SHARED HOME SHELL ================= */
export default function HomeShell({ lang }: Props) {
    return (
        <main className="overflow-hidden bg-black text-white">
            <Hero lang={lang} />

            <MarketHeroChart lang={lang} />

            <section className="border-y border-white/10">
                <TopMarkets lang={lang} />
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
                <HomeCalendar />
            </section>

            <TopBrokers />

            <WhyVelmenora lang={lang} />

            <LearnForex lang={lang} />

            <FinalCTA lang={lang} />
        </main>
    );
}