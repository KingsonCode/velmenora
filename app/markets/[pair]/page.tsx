import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { MARKETS } from "@/data/markets";
import type { CountryCode } from "@/lib/types/broker";
import type { Lang } from "@/lib/i18n";

import MarketHeader from "@/components/market/MarketHeader";
import MarketChart from "@/components/market/MarketChart";
import MarketBrokers from "@/components/market/MarketBrokers";
import MarketCTA from "@/components/market/MarketCTA";
import SentimentSection from "@/components/market/sections/SentimentSection";
import NewsSection from "@/components/market/sections/NewsSection";
import SkeletonBlock from "@/components/ui/SkeletonBlock";

/* ================= PERFORMANCE ================= */
export const dynamic = "force-dynamic";
export const revalidate = 60;

/* ================= TYPES ================= */
type RouteParams = Promise<{ pair: string }>;

/* ================= DEFAULT LANG ================= */
const DEFAULT_LANG: Lang = "en";

/* ================= COUNTRY SUPPORT ================= */
const SUPPORTED_MARKET_COUNTRIES = [
    "TZ",
    "KE",
    "UG",
    "NG",
    "ZA",
    "GH",
    "IN",
    "PK",
] as const;

function resolveMarketCountry(raw?: string): CountryCode | undefined {
    if (!raw) return undefined;

    const normalized = raw.trim().toUpperCase();

    if (
        (SUPPORTED_MARKET_COUNTRIES as readonly string[]).includes(normalized)
    ) {
        return normalized as CountryCode;
    }

    return undefined;
}

/* ================= HELPERS ================= */
function splitPair(pair: string) {
    return {
        base: pair.slice(0, 3),
        quote: pair.slice(3),
    };
}

function getMarketIntentCopy(pair: string, name: string) {
    const { base, quote } = splitPair(pair);

    return {
        title: `Trade ${name} with Better Timing, Tighter Execution, and the Right Broker`,
        intro: `${base}/${quote} remains one of the most watched markets for traders looking for liquidity, volatility, and cleaner technical setups. Use the live chart below, follow sentiment and news, and compare brokers that fit this market best.`,
        brokerHeading: `Best Brokers for ${pair} Traders`,
        brokerSub: `Compare brokers offering strong execution, competitive spreads, and reliable platforms for trading ${pair}.`,
        learnHeading: `Why ${pair} Matters`,
        learnBody: `${pair} is actively tracked by traders because it often reflects macroeconomic expectations, risk appetite, and short-term momentum opportunities. If you are trading this market regularly, broker quality matters just as much as chart timing.`,
    };
}

/* ================= SEO ================= */
export async function generateMetadata({
    params,
}: {
    params: RouteParams;
}) {
    const { pair: rawPair } = await params;
    const pair = rawPair.toUpperCase();
    const market = MARKETS.find((m) => m.symbol === pair);

    if (!market) return {};

    const url = `https://velmenora.com/markets/${pair.toLowerCase()}`;

    return {
        title: `${market.name} Live Chart & Analysis | Velmenora`,
        description: `Trade ${market.name} with live charts, sentiment, market news, and broker comparisons on Velmenora.`,
        alternates: { canonical: url },
        openGraph: {
            title: `${market.name} Live Chart & Analysis`,
            description: `Live ${market.name} chart, market sentiment, broker options, and trading insights.`,
            url,
        },
    };
}

/* ================= PAGE ================= */
export default async function MarketPage({
    params,
}: {
    params: RouteParams;
}) {
    const { pair: rawPair } = await params;
    const pair = rawPair.toUpperCase();
    const market = MARKETS.find((m) => m.symbol === pair);

    if (!market) return notFound();

    const cookieStore = await cookies();
    const country = resolveMarketCountry(cookieStore.get("user_country")?.value);
    const lang: Lang = DEFAULT_LANG;

    const copy = getMarketIntentCopy(pair, market.name);

    return (
        <main className="min-h-screen bg-black text-white">
            <MarketHeader lang={lang} pair={pair} name={market.name} />

            <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 md:py-10">
                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <div className="max-w-4xl">
                        <p className="mb-3 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-300">
                            Live market analysis
                        </p>

                        <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                            {copy.title}
                        </h1>

                        <p className="mt-4 text-base leading-7 text-gray-300 md:text-lg">
                            {copy.intro}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/brokers"
                                className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
                            >
                                View Top Brokers
                            </Link>

                            <Link
                                href="/compare"
                                className="rounded-xl border border-white/15 px-6 py-3 font-semibold transition hover:bg-white/10"
                            >
                                Compare Brokers
                            </Link>

                            <Link
                                href="/markets"
                                className="rounded-xl border border-white/15 px-6 py-3 font-semibold transition hover:bg-white/10"
                            >
                                Explore More Markets
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl font-bold md:text-3xl">
                                {pair} Live Chart
                            </h2>
                            <p className="text-sm text-gray-400 md:text-base">
                                Track real-time price action before choosing your entry, exit, and broker.
                            </p>
                        </div>

                        <div className="text-sm text-gray-400">
                            Market: <span className="font-medium text-white">{market.name}</span>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                        <div className="p-2 md:p-4">
                            <MarketChart pair={pair} />
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl border border-yellow-500/20 bg-yellow-500/10 p-6 md:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-3xl">
                            <h3 className="text-2xl font-bold">
                                Ready to trade {pair} with the right broker?
                            </h3>
                            <p className="mt-2 text-gray-300">
                                Compare regulated brokers, trading platforms, and spread conditions before you place your next trade.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/brokers"
                                className="rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
                            >
                                Find a Broker
                            </Link>

                            <Link
                                href="/compare"
                                className="rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
                            >
                                Compare Options
                            </Link>
                        </div>
                    </div>
                </section>

                <Suspense fallback={<SkeletonBlock title="Loading sentiment..." />}>
                    <SentimentSection lang={lang} pair={pair} />
                </Suspense>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <h3 className="text-2xl font-bold">{copy.learnHeading}</h3>
                    <p className="mt-4 max-w-4xl leading-7 text-gray-300">
                        {copy.learnBody}
                    </p>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                            <p className="text-sm font-semibold text-white">Liquidity</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Strong liquidity can improve fills and reduce friction for active traders.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                            <p className="text-sm font-semibold text-white">Execution Quality</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Fast execution matters more when volatility expands and setups move quickly.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                            <p className="text-sm font-semibold text-white">Spread Efficiency</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Better spread conditions can make a meaningful difference over many trades.
                            </p>
                        </div>
                    </div>
                </section>

                <Suspense fallback={<SkeletonBlock title="Loading news..." />}>
                    <NewsSection lang={lang} pair={pair} />
                </Suspense>

                <section className="space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold md:text-3xl">
                            {copy.brokerHeading}
                        </h3>
                        <p className="mt-2 text-gray-400">
                            {copy.brokerSub}
                        </p>
                    </div>

                    <MarketBrokers
                        lang={lang}
                        pair={pair}
                        {...(country ? { country } : {})}
                    />
                </section>

                <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                    <h3 className="text-xl font-bold">Keep Exploring</h3>

                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                            href="/markets"
                            className="rounded-xl border border-white/15 px-5 py-3 transition hover:bg-white/10"
                        >
                            All Markets
                        </Link>

                        <Link
                            href="/brokers"
                            className="rounded-xl border border-white/15 px-5 py-3 transition hover:bg-white/10"
                        >
                            Top Brokers
                        </Link>

                        <Link
                            href="/compare"
                            className="rounded-xl border border-white/15 px-5 py-3 transition hover:bg-white/10"
                        >
                            Broker Comparisons
                        </Link>
                    </div>
                </section>

                <MarketCTA
                    lang={lang}
                    pair={pair}
                    {...(country ? { country } : {})}
                />
            </div>
        </main>
    );
}