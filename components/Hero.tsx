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
    countryCode?: string;
};

/* =========================
   TRANSLATIONS
========================= */
type HeroCopy = {
    headline_1: string;
    highlight: string;
    headline_2: string;
    sub: string;
    explore: string;
    compare: string;
    country: string;
    trusted: string;
    reviews: string;
    unbiased: string;
    brokerCount: string;
    brokerCountLabel: string;
    zeroCommission: string;
    zeroCommissionLabel: string;
    rankings: string;
    rankingsLabel: string;
};

const content: Record<Lang, HeroCopy> = {
    en: {
        headline_1: "Find & Compare the",
        highlight: "Best Forex Brokers",
        headline_2: "for Your Trading Style",
        sub: "Explore trusted brokers, compare trading conditions, and discover the right platform for your country and experience level.",
        explore: "🚀 Explore Top Brokers",
        compare: "📊 Compare Brokers",
        country: "🌍 Brokers by Country",
        trusted: "✔ Trusted by ambitious traders",
        reviews: "✔ Real broker reviews",
        unbiased: "✔ Data-first comparisons",
        brokerCount: "40+",
        brokerCountLabel: "Broker Profiles",
        zeroCommission: "$0",
        zeroCommissionLabel: "Commission Options",
        rankings: "Daily",
        rankingsLabel: "Ranking Updates",
    },
    ar: {
        headline_1: "ابحث وقارن بين",
        highlight: "أفضل وسطاء الفوركس",
        headline_2: "حسب أسلوب تداولك",
        sub: "استكشف الوسطاء الموثوقين وقارن ظروف التداول واختر المنصة المناسبة لبلدك وخبرتك.",
        explore: "🚀 استكشف أفضل الوسطاء",
        compare: "📊 قارن الوسطاء",
        country: "🌍 الوسطاء حسب البلد",
        trusted: "✔ موثوق لدى المتداولين الطموحين",
        reviews: "✔ مراجعات حقيقية",
        unbiased: "✔ مقارنات مبنية على البيانات",
        brokerCount: "40+",
        brokerCountLabel: "ملفات الوسطاء",
        zeroCommission: "$0",
        zeroCommissionLabel: "خيارات بدون عمولة",
        rankings: "يوميًا",
        rankingsLabel: "تحديث التصنيفات",
    },
    de: {
        headline_1: "Finde & vergleiche die",
        highlight: "besten Forex Broker",
        headline_2: "für deinen Trading-Stil",
        sub: "Entdecke vertrauenswürdige Broker, vergleiche Konditionen und finde die passende Plattform für dein Land und Erfahrungsniveau.",
        explore: "🚀 Top Broker entdecken",
        compare: "📊 Broker vergleichen",
        country: "🌍 Broker nach Land",
        trusted: "✔ Von ambitionierten Tradern genutzt",
        reviews: "✔ Echte Broker-Bewertungen",
        unbiased: "✔ Datenbasierte Vergleiche",
        brokerCount: "40+",
        brokerCountLabel: "Broker-Profile",
        zeroCommission: "$0",
        zeroCommissionLabel: "Kommissionsoptionen",
        rankings: "Täglich",
        rankingsLabel: "Ranking-Updates",
    },
    fr: {
        headline_1: "Trouvez et comparez les",
        highlight: "meilleurs brokers Forex",
        headline_2: "selon votre style de trading",
        sub: "Découvrez des brokers fiables, comparez les conditions de trading et trouvez la bonne plateforme pour votre pays et votre niveau.",
        explore: "🚀 Explorer les meilleurs brokers",
        compare: "📊 Comparer les brokers",
        country: "🌍 Brokers par pays",
        trusted: "✔ Utilisé par des traders ambitieux",
        reviews: "✔ Avis réels sur les brokers",
        unbiased: "✔ Comparaisons basées sur les données",
        brokerCount: "40+",
        brokerCountLabel: "Profils de brokers",
        zeroCommission: "$0",
        zeroCommissionLabel: "Options sans commission",
        rankings: "Quotidien",
        rankingsLabel: "Mises à jour",
    },
};

export default function Hero({
    lang = "en",
    funnel,
    countryCode,
}: Props) {
    const activeLang = funnel?.language || lang;
    const t = content[activeLang] || content.en;

    const isPro = funnel?.intent === "pro";
    const highlightedHeadline = funnel?.headline;
    const brokers = (funnel?.brokers || ["exness", "xm", "ic-markets", "octa"]).slice(
        0,
        isPro ? 3 : 4
    );

    const primaryHref = funnel?.cta?.link || `/${activeLang}/brokers`;
    const primaryLabel =
        funnel?.cta?.primary || (isPro ? "Open Pro Account" : t.explore);

    const compareHref = `/${activeLang}/compare/exness-vs-xm`;
    const countryHref = countryCode
        ? `/${activeLang}/${countryCode.toLowerCase()}`
        : `/${activeLang}/brokers`;

    return (
        <section className="relative overflow-hidden px-4 py-24 text-center text-white md:py-32">
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-black to-black" />

            {/* GLOW */}
            <div className="absolute left-1/2 top-[-140px] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[150px]" />
            <div className="absolute right-0 top-1/3 h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-[120px]" />

            {/* GRID */}
            <div className="absolute inset-0 opacity-[0.04] bg-[url('/grid.svg')]" />

            <div className="relative mx-auto max-w-6xl">
                {/* BADGE */}
                <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                    {funnel?.intent && (
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                            {isPro ? "⚡ Pro Trading Environment" : "🚀 Beginner Friendly"}
                        </span>
                    )}

                    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs uppercase tracking-wide text-yellow-300">
                        Forex • CFDs • Broker Comparison
                    </span>
                </div>

                {/* HEADLINE */}
                <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
                    {highlightedHeadline ? (
                        <>
                            {highlightedHeadline.split(" ").slice(0, -2).join(" ")}{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                {highlightedHeadline.split(" ").slice(-2).join(" ")}
                            </span>
                        </>
                    ) : (
                        <>
                            {t.headline_1}{" "}
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                {t.highlight}
                            </span>{" "}
                            {t.headline_2}
                        </>
                    )}
                </h1>

                {/* SUBHEADLINE */}
                <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-300 md:text-xl">
                    {funnel?.subheadline || funnel?.description || t.sub}
                </p>

                {/* SEARCH */}
                <div className="mx-auto mb-8 max-w-3xl">
                    <SearchBox lang={activeLang} />
                </div>

                {/* QUICK BROKER LINKS */}
                <div className="mb-10 flex flex-wrap justify-center gap-3 text-sm">
                    {brokers.map((item) => (
                        <Link
                            key={item}
                            href={`/${activeLang}/brokers/${item}`}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
                        >
                            🔎 {item.replace(/-/g, " ").toUpperCase()}
                        </Link>
                    ))}
                </div>

                {/* MAIN CTA */}
                <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href={primaryHref}
                        className="rounded-xl bg-yellow-500 px-8 py-4 text-lg font-semibold text-black shadow-xl transition hover:scale-[1.02]"
                    >
                        {primaryLabel}
                    </Link>

                    <Link
                        href={compareHref}
                        className="rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold transition hover:bg-white/10"
                    >
                        {t.compare}
                    </Link>

                    <Link
                        href={countryHref}
                        className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-8 py-4 text-lg font-semibold text-yellow-300 transition hover:bg-yellow-500/15"
                    >
                        {t.country}
                    </Link>
                </div>

                {/* STATS */}
                <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 text-center md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-bold text-yellow-400">{t.brokerCount}</p>
                        <p className="text-sm text-gray-400">{t.brokerCountLabel}</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-bold text-green-400">{t.zeroCommission}</p>
                        <p className="text-sm text-gray-400">{t.zeroCommissionLabel}</p>
                    </div>

                    <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5 md:col-span-1">
                        <p className="text-2xl font-bold text-blue-400">{t.rankings}</p>
                        <p className="text-sm text-gray-400">{t.rankingsLabel}</p>
                    </div>
                </div>

                {/* TRUST LINE */}
                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                    <span>{t.trusted}</span>
                    <span>{t.reviews}</span>
                    <span>{t.unbiased}</span>
                </div>
            </div>
        </section>
    );
}