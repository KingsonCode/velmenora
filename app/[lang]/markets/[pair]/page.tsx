import type { Metadata } from "next";
import { notFound } from "next/navigation";

import MarketHeader from "@/components/market/MarketHeader";
import MarketChart from "@/components/market/MarketChart";
import MarketSentiment from "@/components/market/MarketSentiment";
import MarketNews from "@/components/market/MarketNews";
import MarketBrokers from "@/components/market/MarketBrokers";
import MarketCTA from "@/components/market/MarketCTA";
import PairEconomicEventsSection from "@/components/market/PairEconomicEventsSection";

/* =========================================================
   CONFIG
========================================================= */

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const MARKET_MAP = {
    eurusd: {
        code: "eurusd",
        symbol: "EUR/USD",
        name: {
            en: "Euro vs US Dollar",
            ar: "اليورو مقابل الدولار الأمريكي",
            de: "Euro vs US-Dollar",
            fr: "Euro contre dollar américain",
        },
        category: "forex",
    },
    gbpusd: {
        code: "gbpusd",
        symbol: "GBP/USD",
        name: {
            en: "British Pound vs US Dollar",
            ar: "الجنيه الإسترليني مقابل الدولار الأمريكي",
            de: "Britisches Pfund vs US-Dollar",
            fr: "Livre sterling contre dollar américain",
        },
        category: "forex",
    },
    usdjpy: {
        code: "usdjpy",
        symbol: "USD/JPY",
        name: {
            en: "US Dollar vs Japanese Yen",
            ar: "الدولار الأمريكي مقابل الين الياباني",
            de: "US-Dollar vs Japanischer Yen",
            fr: "Dollar américain contre yen japonais",
        },
        category: "forex",
    },
    xauusd: {
        code: "xauusd",
        symbol: "XAU/USD",
        name: {
            en: "Gold vs US Dollar",
            ar: "الذهب مقابل الدولار الأمريكي",
            de: "Gold vs US-Dollar",
            fr: "Or contre dollar américain",
        },
        category: "metal",
    },
    btcusd: {
        code: "btcusd",
        symbol: "BTC/USD",
        name: {
            en: "Bitcoin vs US Dollar",
            ar: "بيتكوين مقابل الدولار الأمريكي",
            de: "Bitcoin vs US-Dollar",
            fr: "Bitcoin contre dollar américain",
        },
        category: "crypto",
    },
    ethusd: {
        code: "ethusd",
        symbol: "ETH/USD",
        name: {
            en: "Ethereum vs US Dollar",
            ar: "إيثريوم مقابل الدولار الأمريكي",
            de: "Ethereum vs US-Dollar",
            fr: "Ethereum contre dollar américain",
        },
        category: "crypto",
    },
} as const;

type PairSlug = keyof typeof MARKET_MAP;

type PageParams = Promise<{
    lang: string;
    pair: string;
}>;

/* =========================================================
   HELPERS
========================================================= */

function isValidLang(value: string): value is Lang {
    return SUPPORTED_LANGS.includes(value as Lang);
}

function isValidPair(value: string): value is PairSlug {
    return value in MARKET_MAP;
}

function getMarket(pair: PairSlug) {
    return MARKET_MAP[pair];
}

function getMarketMeta(lang: Lang, pair: PairSlug) {
    const market = getMarket(pair);

    return {
        title: `${market.symbol} Analysis, Chart, News & Economic Events | Velmenora`,
        description: `Track ${market.name[lang]} live with chart analysis, pair-specific news, economic events, market sentiment, and broker options on Velmenora.`,
    };
}

/* =========================================================
   STATIC PARAMS
========================================================= */

export function generateStaticParams(): Array<{ lang: Lang; pair: PairSlug }> {
    return SUPPORTED_LANGS.flatMap((lang) =>
        (Object.keys(MARKET_MAP) as PairSlug[]).map((pair) => ({
            lang,
            pair,
        }))
    );
}

/* =========================================================
   METADATA
========================================================= */

export async function generateMetadata({
    params,
}: {
    params: PageParams;
}): Promise<Metadata> {
    const { lang, pair } = await params;

    if (!isValidLang(lang) || !isValidPair(pair)) {
        return {
            title: "Market Not Found | Velmenora",
            description: "The requested market page could not be found.",
        };
    }

    const meta = getMarketMeta(lang, pair);

    return {
        title: meta.title,
        description: meta.description,
        alternates: {
            canonical: `/${lang}/country/markets/${pair}`,
        },
        openGraph: {
            title: meta.title,
            description: meta.description,
            url: `/${lang}/country/markets/${pair}`,
            siteName: "Velmenora",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: meta.title,
            description: meta.description,
        },
    };
}

/* =========================================================
   PAGE
========================================================= */

export default async function MarketPairPage({
    params,
}: {
    params: PageParams;
}) {
    const { lang, pair } = await params;

    if (!isValidLang(lang) || !isValidPair(pair)) {
        notFound();
    }

    const market = getMarket(pair);

    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
                <div className="absolute right-0 top-[180px] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-3xl" />
            </div>

            <section className="relative border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
                <div className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:pb-14 lg:px-6">
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm sm:p-8">
                        <MarketHeader
                            pair={pair}
                            lang={lang}
                            name={market.name[lang]}
                        />
                    </div>
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-8 sm:py-10 lg:px-6">
                <MarketChart pair={pair} />
            </section>

            <section className="relative mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1.2fr)_380px] lg:items-start lg:px-6">
                <div className="min-w-0">
                    <MarketNews
                        pair={pair}
                        lang={lang}
                        symbol={market.symbol}
                        marketName={market.name[lang]}
                        category={market.category}
                    />
                </div>

                <div className="min-w-0 lg:sticky lg:top-24">
                    <MarketSentiment pair={pair} lang={lang} />
                </div>
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <PairEconomicEventsSection
                    pair={pair}
                    lang={lang}
                    symbol={market.symbol}
                    marketName={market.name[lang]}
                    category={market.category}
                />
            </section>

            <section className="relative mx-auto max-w-7xl px-4 py-8 lg:px-6">
                <MarketBrokers pair={pair} lang={lang} />
            </section>

            <section className="relative mx-auto max-w-7xl px-4 pb-20 pt-4 lg:px-6">
                <MarketCTA pair={pair} lang={lang} />
            </section>
        </main>
    );
}