"use client";

import Link from "next/link";
import SearchBox from "./SearchBox";

import { Funnel } from "@/types/funnel";

/* =========================
   SUPPORTED LANGUAGES
========================= */
type Lang = "en" | "ar" | "de" | "fr";

/* =========================
   PROPS
========================= */
type Props = {
    lang?: Lang;
    funnel?: Funnel;
};

/* =========================
   TRANSLATIONS
========================= */
const content: Record<Lang, any> = {
    en: {
        headline_1: "Find & Compare the",
        highlight: "Best Forex Brokers",
        headline_2: "in Your Country",
        sub: "Discover trusted brokers, compare features, and trade with confidence.",
        explore: "🚀 Explore Top Brokers",
        compare: "📊 Compare Brokers",
        trusted: "✔ Trusted by 10,000+ traders",
        reviews: "✔ Real user reviews",
        unbiased: "✔ No hidden bias",
    },
    ar: {
        headline_1: "ابحث وقارن بين",
        highlight: "أفضل وسطاء الفوركس",
        headline_2: "في بلدك",
        sub: "اكتشف وسطاء موثوقين وابدأ التداول بثقة.",
        explore: "🚀 استكشف الوسطاء",
        compare: "📊 قارن الوسطاء",
        trusted: "✔ موثوق من آلاف المتداولين",
        reviews: "✔ مراجعات حقيقية",
        unbiased: "✔ بدون تحيز",
    },
    de: {
        headline_1: "Finde & vergleiche die",
        highlight: "besten Forex Broker",
        headline_2: "in deinem Land",
        sub: "Vergleiche Broker und handle sicher.",
        explore: "🚀 Top Broker entdecken",
        compare: "📊 Broker vergleichen",
        trusted: "✔ Über 10.000 Trader vertrauen uns",
        reviews: "✔ Echte Bewertungen",
        unbiased: "✔ Keine versteckten Bias",
    },
    fr: {
        headline_1: "Trouvez et comparez les",
        highlight: "meilleurs brokers Forex",
        headline_2: "dans votre pays",
        sub: "Comparez des brokers fiables et tradez en toute confiance.",
        explore: "🚀 Explorer les brokers",
        compare: "📊 Comparer les brokers",
        trusted: "✔ Plus de 10 000 traders",
        reviews: "✔ Avis réels",
        unbiased: "✔ Sans biais caché",
    },
};

export default function Hero({ lang = "en", funnel }: Props) {
    const activeLang = funnel?.language || lang;
    const t = content[activeLang] || content.en;

    const isPro = funnel?.intent === "pro";

    return (
        <section className="relative py-28 px-4 text-center text-white overflow-hidden">

            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />

            {/* GLOW */}
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/20 blur-[140px] rounded-full" />

            {/* GRID */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')]" />

            <div className="relative max-w-5xl mx-auto">

                {/* 🧠 INTENT BADGE */}
                {funnel?.intent && (
                    <div className="mb-4">
                        <span className="text-xs uppercase tracking-wide bg-white/10 px-3 py-1 rounded-full text-gray-300">
                            {isPro
                                ? "⚡ Pro Trading Environment"
                                : "🚀 Beginner Friendly"}
                        </span>
                    </div>
                )}

                {/* 💥 HEADLINE */}
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                    {funnel?.headline ? (
                        <>
                            {funnel.headline.split(" ").slice(0, -2).join(" ")}{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                                {funnel.headline.split(" ").slice(-2).join(" ")}
                            </span>
                        </>
                    ) : (
                        <>
                            {t.headline_1}{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                                {t.highlight}
                            </span>{" "}
                            {t.headline_2}
                        </>
                    )}
                </h1>

                {/* ✨ SUBHEADLINE */}
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    {funnel?.subheadline || funnel?.description || t.sub}
                </p>

                {/* 🔎 SEARCH */}
                <div className="mb-6">
                    <SearchBox lang={activeLang} />
                </div>

                {/* ⚡ BROKER QUICK LINKS */}
                <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
                    {(funnel?.brokers || ["exness", "xm", "ic-markets", "octa"])
                        .slice(0, isPro ? 3 : 4)
                        .map((item) => (
                            <Link
                                key={item}
                                href={`/${activeLang}/brokers/${item}`}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"
                            >
                                🔎 {item.replace("-", " ").toUpperCase()}
                            </Link>
                        ))}
                </div>

                {/* 🚀 CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">

                    <Link
                        href={funnel?.cta.link || `/${activeLang}/brokers`}
                        className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition shadow-xl"
                    >
                        {funnel?.cta?.primary ||
                            (isPro ? "Open Pro Account" : "Start Trading")}
                    </Link>

                    <Link
                        href={`/${activeLang}/compare/exness-vs-xm`}
                        className="border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
                    >
                        {t.compare}
                    </Link>

                </div>

                {/* 🔥 STATS */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-2xl font-bold text-yellow-400">42+</p>
                        <p className="text-sm text-gray-400">Brokers Reviewed</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-2xl font-bold text-green-400">$0</p>
                        <p className="text-sm text-gray-400">Commission Brokers</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2 md:col-span-1">
                        <p className="text-2xl font-bold text-blue-400">Updated</p>
                        <p className="text-sm text-gray-400">Daily Rankings</p>
                    </div>

                </div>

                {/* ✅ TRUST */}
                <div className="mt-8 text-sm text-gray-400 flex flex-wrap justify-center gap-4">
                    <span>{t.trusted}</span>
                    <span>{t.reviews}</span>
                    <span>{t.unbiased}</span>
                </div>

            </div>
        </section>
    );
}