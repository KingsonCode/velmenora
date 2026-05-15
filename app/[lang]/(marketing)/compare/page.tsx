import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import CompareClient from "@/app/brokers/[broker]/CompareClient";
import { getTopBrokers, isValidCountry } from "@/lib/brokers";
import type { CountryCode } from "@/lib/types/broker";

const SUPPORTED_LANGS = ["en", "de", "fr", "ar"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

/* ================= GEO ================= */
function normalizeCountry(raw?: string | null): CountryCode | undefined {
    if (!raw) return undefined;

    const code = raw.trim().toUpperCase();

    if (!/^[A-Z]{2}$/.test(code)) {
        return undefined;
    }

    if (isValidCountry(code)) {
        return code;
    }

    return undefined;
}

async function resolveCountryFromRequest(): Promise<CountryCode | undefined> {
    const h = await headers();

    const country =
        h.get("x-vercel-ip-country") ||
        h.get("cf-ipcountry") ||
        h.get("x-country-code") ||
        h.get("x-geo-country");

    return normalizeCountry(country);
}

/* ================= PAGE ================= */
export default async function ComparePage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    /* 🌍 REAL GEO */
    const country = await resolveCountryFromRequest();

    /* 🔥 GET BROKERS */
    const brokers = getTopBrokers(country, 6);

    const topBroker = brokers[0];
    const others = brokers.slice(1, 6);

    if (!topBroker) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6 text-center text-white">
                No brokers available right now.
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_35%)]" />

                <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
                    <div className="mb-4 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-yellow-300">
                        Broker Comparison Hub
                    </div>

                    <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
                        Compare Forex Brokers
                    </h1>

                    <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-400 md:text-lg">
                        Compare the best forex brokers for spreads, execution speed,
                        platform quality, and trust. Find the broker that matches
                        your trading style and experience level.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={`/go/${topBroker.slug}?src=compare-hero${country ? `&country=${country}` : ""
                                }`}
                            className="rounded-xl bg-yellow-400 px-8 py-4 font-semibold text-black transition hover:opacity-90"
                        >
                            Start with {topBroker.name} →
                        </a>

                        <Link
                            href={`/${lang}/country/brokers/${topBroker.slug}`}
                            className="rounded-xl border border-white/20 px-6 py-4 transition hover:bg-white/5"
                        >
                            Read Review
                        </Link>

                        <Link
                            href={`/${lang}/country/explorer`}
                            className="rounded-xl border border-white/20 px-6 py-4 transition hover:bg-white/5"
                        >
                            Open Explorer
                        </Link>
                    </div>

                    <p className="mt-5 text-sm text-gray-500">
                        Trusted by traders • Fast withdrawals • Secure platforms
                    </p>
                </div>
            </section>

            {/* QUICK VALUE STRIP */}
            <section className="mx-auto max-w-6xl px-6 py-10">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="mb-2 text-lg font-semibold">Compare faster</h2>
                        <p className="text-sm leading-relaxed text-gray-400">
                            See broker differences clearly without opening dozens of pages.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="mb-2 text-lg font-semibold">Choose by trading style</h2>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Find a better fit for scalping, beginners, low deposits, or platform preference.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h2 className="mb-2 text-lg font-semibold">Reduce bad choices</h2>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Compare trust, trading conditions, and broker quality before signing up.
                        </p>
                    </div>
                </div>
            </section>

            {/* MAIN COMPARE ENGINE */}
            <section className="mx-auto max-w-6xl px-6 pb-6">
                <CompareClient broker={topBroker} lang={lang} />
            </section>

            {/* POPULAR COMPARES */}
            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="mb-8 text-center">
                    <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                        Popular Broker Comparisons
                    </h2>

                    <p className="mx-auto max-w-2xl text-gray-400">
                        Compare top brokers head-to-head and see which one fits your needs more clearly.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {others.map((b) => (
                        <Link
                            key={b.slug}
                            href={`/${lang}/country/compare/${topBroker.slug}-vs-${b.slug}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-yellow-500/30 hover:bg-white/10"
                        >
                            <h3 className="mb-2 text-lg font-semibold">
                                {topBroker.name} vs {b.name}
                            </h3>

                            <p className="mb-4 text-sm text-gray-400">
                                Compare features, trading conditions, and broker strengths.
                            </p>

                            <div className="text-sm font-semibold text-yellow-400">
                                View comparison →
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* TOP BROKERS GRID */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="mb-8 text-center">
                    <h2 className="mb-3 text-2xl font-bold md:text-3xl">
                        All Top Forex Brokers
                    </h2>

                    <p className="mx-auto max-w-2xl text-gray-400">
                        Explore the strongest broker options currently available in your compare set.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {brokers.map((b, index) => (
                        <Link
                            key={b.slug}
                            href={`/${lang}/country/brokers/${b.slug}`}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition hover:border-yellow-500/30 hover:bg-white/10"
                        >
                            <div className="mb-3 text-xs uppercase tracking-wide text-gray-500">
                                Rank #{index + 1}
                            </div>

                            <h3 className="text-lg font-semibold">{b.name}</h3>

                            <p className="mt-2 text-yellow-400">
                                ★ {b.rating.toFixed(1)}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* LEARNING STRIP */}
            <section className="mx-auto max-w-6xl px-6 pb-20">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Link
                            href={`/${lang}/academy/what-is-forex`}
                            className="rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:bg-black/30"
                        >
                            <h3 className="mb-2 font-semibold">New to forex?</h3>
                            <p className="text-sm text-gray-400">
                                Start with the basics and understand how forex trading works.
                            </p>
                        </Link>

                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:bg-black/30"
                        >
                            <h3 className="mb-2 font-semibold">Beginner guide</h3>
                            <p className="text-sm text-gray-400">
                                Learn how beginners should choose brokers and avoid common mistakes.
                            </p>
                        </Link>

                        <Link
                            href={`/${lang}/academy/forex-risk-management`}
                            className="rounded-2xl border border-white/10 bg-black/20 p-6 transition hover:bg-black/30"
                        >
                            <h3 className="mb-2 font-semibold">Risk management</h3>
                            <p className="text-sm text-gray-400">
                                Protect your capital before opening a live trading account.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="border-t border-white/10 py-20 text-center">
                <div className="mx-auto max-w-4xl px-6">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Ready to Start Trading?
                    </h2>

                    <p className="mx-auto mb-8 max-w-2xl text-gray-400">
                        Choose a trusted broker, compare the important details,
                        and begin your trading journey with more confidence.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href={`/go/${topBroker.slug}?src=compare-bottom${country ? `&country=${country}` : ""
                                }`}
                            className="rounded-xl bg-green-500 px-10 py-5 font-semibold text-white transition hover:bg-green-600"
                        >
                            Open Account with {topBroker.name} →
                        </a>

                        <Link
                            href={`/${lang}/country/explorer`}
                            className="rounded-xl border border-white/20 px-8 py-5 transition hover:bg-white/5"
                        >
                            Explore More Brokers
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}