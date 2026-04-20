import { getAllBrokers, getTopBrokers } from "@/lib/brokers";
import type { Lang } from "@/lib/i18n";
import type { Category, CountryCode } from "@/lib/types/broker";

/* ================= HELPERS ================= */
function getCategory(pair: string): Category {
    const upper = pair.toUpperCase();

    if (upper.includes("XAU") || upper.includes("XAG")) return "CFD";
    if (upper.includes("BTC") || upper.includes("ETH")) return "CRYPTO";
    return "FOREX";
}

function formatPair(pair: string) {
    const clean = pair.replace("/", "").toUpperCase();

    if (clean.length === 6) {
        return `${clean.slice(0, 3)}/${clean.slice(3)}`;
    }

    return pair.toUpperCase();
}

function formatFeature(feature: string) {
    return feature
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

/* ================= TYPES ================= */
type Props = {
    pair: string;
    lang: Lang;
    country?: CountryCode;
};

const text = {
    en: {
        bestBrokersFor: "Best Brokers for",
        brokersFor: "Brokers for",
        noBrokers: "No brokers available at the moment.",
        rankedFor: "Ranked for",
        globalRanking: "Global ranking",
        tradeWithTopTier: "with top-tier conditions",
        tradeWithLowSpreads: "with low spreads",
        startTrading: "Start Trading",
        brokerMatches: "Broker Matches",
        featuredPick: "Featured Pick",
        alternatives: "More Options",
        whyItFits: "Why it fits",
        rating: "Rating",
    },
    ar: {
        bestBrokersFor: "أفضل الوسطاء لـ",
        brokersFor: "وسطاء",
        noBrokers: "لا يوجد وسطاء متاحون حالياً.",
        rankedFor: "مصنف لـ",
        globalRanking: "تصنيف عالمي",
        tradeWithTopTier: "بشروط تداول قوية",
        tradeWithLowSpreads: "بفروقات سعرية منخفضة",
        startTrading: "ابدأ التداول",
        brokerMatches: "الوسطاء المناسبون",
        featuredPick: "الخيار المميز",
        alternatives: "خيارات إضافية",
        whyItFits: "لماذا يناسب",
        rating: "التقييم",
    },
    de: {
        bestBrokersFor: "Beste Broker für",
        brokersFor: "Broker für",
        noBrokers: "Aktuell sind keine Broker verfügbar.",
        rankedFor: "Bewertet für",
        globalRanking: "Globales Ranking",
        tradeWithTopTier: "mit Top-Konditionen",
        tradeWithLowSpreads: "mit niedrigen Spreads",
        startTrading: "Jetzt traden",
        brokerMatches: "Passende Broker",
        featuredPick: "Top-Empfehlung",
        alternatives: "Weitere Optionen",
        whyItFits: "Warum passend",
        rating: "Bewertung",
    },
    fr: {
        bestBrokersFor: "Meilleurs brokers pour",
        brokersFor: "Brokers pour",
        noBrokers: "Aucun broker disponible pour le moment.",
        rankedFor: "Classé pour",
        globalRanking: "Classement global",
        tradeWithTopTier: "avec des conditions premium",
        tradeWithLowSpreads: "avec des spreads réduits",
        startTrading: "Commencer à trader",
        brokerMatches: "Brokers adaptés",
        featuredPick: "Choix principal",
        alternatives: "Autres options",
        whyItFits: "Pourquoi il convient",
        rating: "Note",
    },
} satisfies Record<
    Lang,
    {
        bestBrokersFor: string;
        brokersFor: string;
        noBrokers: string;
        rankedFor: string;
        globalRanking: string;
        tradeWithTopTier: string;
        tradeWithLowSpreads: string;
        startTrading: string;
        brokerMatches: string;
        featuredPick: string;
        alternatives: string;
        whyItFits: string;
        rating: string;
    }
>;

export default function MarketBrokers({ pair, lang, country }: Props) {
    const t = text[lang];
    const formattedPair = formatPair(pair);
    const category = getCategory(pair);

    const list = getAllBrokers()
        .filter((broker) => broker.category.includes(category))
        .filter(
            (broker) =>
                !country ||
                !broker.countries ||
                broker.countries.includes(country) ||
                broker.countries.includes("GLOBAL")
        )
        .slice(0, 4);

    const fallback = getTopBrokers(country, 4);
    const brokers = list.length > 0 ? list : fallback;

    if (!Array.isArray(brokers) || brokers.length === 0) {
        return (
            <section
                id="brokers"
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)]"
            >
                <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                    <div className="mb-2 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                        {t.brokerMatches}
                    </div>

                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                        {t.brokersFor} {formattedPair}
                    </h2>
                </div>

                <div className="px-5 py-10 sm:px-6">
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-10 text-center">
                        <h3 className="text-base font-semibold text-white">{t.noBrokers}</h3>
                    </div>
                </div>
            </section>
        );
    }

    const [top, ...rest] = brokers;
    if (!top) return null;

    const visible = rest.slice(0, 3);

    return (
        <section
            id="brokers"
            className="scroll-mt-24 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#0B0F1A_0%,#090D16_100%)] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        >
            <div className="border-b border-white/10 px-5 py-6 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="mb-3 inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300">
                            {t.brokerMatches}
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            {t.bestBrokersFor} {formattedPair}
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            {country
                                ? `${t.rankedFor} ${country}`
                                : t.globalRanking}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.brokersFor}
                        </div>
                        <div className="mt-1 text-xl font-semibold text-white">
                            {brokers.length}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 px-5 py-5 sm:px-6">
                <a
                    href={`/go/${top.slug}?src=market_${pair.toLowerCase()}`}
                    className="group block overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition hover:border-cyan-400/20 hover:bg-white/[0.045]"
                >
                    <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <div className="p-5 sm:p-6">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                                    {t.featuredPick}
                                </span>

                                {top.tags?.[0] && (
                                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-gray-300">
                                        {top.tags[0]}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <h3 className="text-2xl font-semibold tracking-tight text-white transition group-hover:text-cyan-300">
                                        {top.name}
                                    </h3>

                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                                        {formattedPair} {t.tradeWithTopTier}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm">
                                    <div className="text-[11px] uppercase tracking-[0.14em] text-gray-500">
                                        {t.rating}
                                    </div>
                                    <div className="mt-1 text-lg font-semibold text-white">
                                        ⭐ {top.rating} / 5
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5">
                                <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-gray-500">
                                    {t.whyItFits}
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {top.features.slice(0, 6).map((feature, index) => (
                                        <span
                                            key={`${top.slug}-${index}`}
                                            className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-300"
                                        >
                                            {formatFeature(feature)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end border-t border-white/10 bg-black/20 p-5 lg:border-l lg:border-t-0 lg:p-6">
                            <span className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition group-hover:bg-cyan-400">
                                {t.startTrading} →
                            </span>
                        </div>
                    </div>
                </a>

                {visible.length > 0 && (
                    <div>
                        <div className="mb-4 text-[11px] uppercase tracking-[0.16em] text-gray-500">
                            {t.alternatives}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {visible.map((broker) => (
                                <a
                                    key={broker.slug}
                                    href={`/go/${broker.slug}?src=market_${pair.toLowerCase()}`}
                                    className="group rounded-[22px] border border-white/10 bg-white/[0.02] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.04]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-white transition group-hover:text-cyan-300">
                                                {broker.name}
                                            </h3>

                                            <p className="mt-2 text-sm text-gray-400">
                                                {formattedPair} {t.tradeWithLowSpreads}
                                            </p>
                                        </div>

                                        <div className="text-sm font-semibold text-white">
                                            ⭐ {broker.rating}
                                        </div>
                                    </div>

                                    {broker.features?.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {broker.features.slice(0, 3).map((feature, index) => (
                                                <span
                                                    key={`${broker.slug}-feature-${index}`}
                                                    className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] text-gray-300"
                                                >
                                                    {formatFeature(feature)}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-5 inline-flex items-center text-sm font-medium text-cyan-300">
                                        {t.startTrading} →
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}