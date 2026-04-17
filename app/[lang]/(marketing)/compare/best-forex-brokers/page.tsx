import Link from "next/link";
import { headers } from "next/headers";

import { resolveGeo } from "@/lib/geo";
import { getBroker } from "@/lib/brokers";

/* ================= HELPER ================= */
async function buildRequestFromHeaders() {
    const h = await headers();

    return {
        headers: h,
        nextUrl: { searchParams: new URLSearchParams() },
        cookies: { get: () => undefined }
    } as any;
}

/* ================= PAGE ================= */
export default async function BestBrokersPage() {
    const req = await buildRequestFromHeaders();
    const geo = resolveGeo(req);

    const { config, brokers } = geo;

    const topBrokers = brokers
        .map((slug) => getBroker(slug))
        .filter((broker): broker is NonNullable<typeof broker> => !!broker);

    const top = topBrokers[0];

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">

            {/* 🔥 HERO (SEO + FEATURED SNIPPET TARGET) */}
            <section className="mb-14 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Best Forex Brokers in {config.seo.keyword_modifier} (2026)
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto">
                    The best forex brokers in {config.seo.keyword_modifier} are platforms
                    that offer low spreads, fast withdrawals, strong regulation, and support
                    for local payment methods like {config.payment_methods.join(", ")}.
                </p>
            </section>

            {/* 🏆 FEATURED BROKER (HIGH CONVERSION) */}
            {top && (
                <section className="mb-14">
                    <div className="bg-gradient-to-br from-green-900 to-black p-8 rounded-2xl border border-green-700">
                        <h2 className="text-2xl font-bold mb-2">
                            🥇 Best Overall: {top.name}
                        </h2>

                        <p className="text-gray-300 mb-4">
                            {top.name} is our top choice for traders in {config.seo.keyword_modifier}
                            due to its low spreads, instant withdrawals, and strong trading conditions.
                        </p>

                        <div className="flex gap-4 flex-wrap">
                            <a
                                href={top.url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="bg-green-600 px-6 py-3 rounded-xl font-semibold"
                            >
                                🚀 Open Account
                            </a>

                            <Link
                                href={`/brokers/${top.slug}`}
                                className="underline text-blue-400"
                            >
                                Read Full Review →
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* 🏆 BROKER CARDS */}
            <section className="mb-14 grid md:grid-cols-3 gap-6">
                {topBrokers.map((broker, index) => (
                    <div
                        key={broker.slug}
                        className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-green-500 transition"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            #{index + 1} {broker.name}
                        </h2>

                        <p className="text-gray-400 mb-3">
                            {broker.features?.join(", ")}
                        </p>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-yellow-400">
                                ⭐ {broker.rating || "4.5"}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/brokers/${broker.slug}`}
                                className="text-blue-400 underline"
                            >
                                👉 Read Review
                            </Link>

                            <a
                                href={broker.url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="bg-green-600 text-center py-2 rounded-lg"
                            >
                                🚀 Open Account
                            </a>
                        </div>
                    </div>
                ))}
            </section>

            {/* 🧠 HOW WE RANK */}
            <section className="mb-14">
                <h2 className="text-2xl font-semibold mb-4">
                    How We Ranked the Best Forex Brokers
                </h2>

                <p className="text-gray-400 mb-4">
                    Our ranking methodology focuses on the factors that matter most to traders.
                </p>

                <ul className="space-y-2">
                    <li>✔ Withdrawal speed & reliability</li>
                    <li>✔ Spread competitiveness</li>
                    <li>✔ Regulation & trust</li>
                    <li>✔ Payment methods in {config.seo.keyword_modifier}</li>
                    <li>✔ Platform stability</li>
                </ul>
            </section>

            {/* 💳 LOCAL PAYMENTS (SEO BOOST) */}
            <section className="mb-14">
                <h2 className="text-2xl font-semibold mb-4">
                    Payment Methods in {config.seo.keyword_modifier}
                </h2>

                <p className="text-gray-400 mb-4">
                    Traders in {config.seo.keyword_modifier} prefer brokers that support
                    fast and convenient deposit and withdrawal options.
                </p>

                <ul className="space-y-2">
                    {config.payment_methods.map((method) => (
                        <li key={method}>✔ {method}</li>
                    ))}
                </ul>
            </section>

            {/* 🔗 INTERNAL SEO LINKS */}
            <section className="mb-14">
                <h2 className="text-2xl font-semibold mb-4">
                    Compare Top Brokers
                </h2>

                <ul className="space-y-2">
                    <li>👉 <Link href="/exness-vs-xm">Exness vs XM</Link></li>
                    <li>👉 <Link href="/brokers/exness">Exness Review</Link></li>
                    <li>👉 <Link href="/brokers/xm">XM Review</Link></li>
                </ul>
            </section>

            {/* ❓ FAQ (SNIPPET TARGET) */}
            <section className="mb-14">
                <h2 className="text-2xl font-semibold mb-4">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold">
                            What is the best forex broker in {config.seo.keyword_modifier}?
                        </h3>
                        <p className="text-gray-400">
                            {top?.name} is currently one of the best options due to its low costs
                            and fast withdrawals.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold">
                            Which broker is best for beginners?
                        </h3>
                        <p className="text-gray-400">
                            Beginner-friendly brokers offer simple platforms and low deposit requirements.
                        </p>
                    </div>
                </div>
            </section>

            {/* 🚀 FINAL CTA */}
            {top && (
                <section className="text-center py-12">
                    <h2 className="text-2xl font-bold mb-4">
                        Start Trading with {top.name}
                    </h2>

                    <p className="text-gray-400 mb-6">
                        Join thousands of traders using one of the best brokers in {config.seo.keyword_modifier}.
                    </p>

                    <a
                        href={top.url}
                        target="_blank"
                        className="bg-green-600 px-8 py-4 rounded-xl font-semibold text-lg"
                    >
                        🚀 Open Account Now
                    </a>
                </section>
            )}
        </main>
    );
}
