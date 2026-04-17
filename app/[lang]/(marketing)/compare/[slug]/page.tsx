import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";

import { getBroker } from "@/lib/brokers";
import { getCompareSlugs } from "@/lib/compare";

/* =========================================================
   🔥 CONFIG
========================================================= */

export const revalidate = 3600;

/* =========================================================
   🔥 STATIC BUILD (LIMITED)
========================================================= */

export async function generateStaticParams() {
    const slugs = getCompareSlugs({ limit: 50 });

    return slugs.map((slug) => ({ slug }));
}

/* =========================================================
   🔥 PARSER
========================================================= */

function parseSlug(slug: string) {
    const parts = slug.split("-vs-");
    if (parts.length !== 2) return null;

    const [a, b] = parts;

    if (!a || !b) return null;

    return { a, b };
}

/* =========================================================
   🔥 SCORING ENGINE (UPGRADE 🔥)
========================================================= */

function scoreBroker(b: any) {
    let score = 0;

    score += (b.rating || 0) * 2;

    if (b.priority) score += b.priority;

    if (b.features?.length) score += b.features.length * 0.3;

    return score;
}

function getWinner(a: any, b: any) {
    return scoreBroker(a) >= scoreBroker(b) ? a : b;
}

/* =========================================================
   🔥 SEO
========================================================= */

export async function generateMetadata({
    params,
}: {
    params: { slug: string; lang: string };
}): Promise<Metadata> {
    const parsed = parseSlug(params.slug);

    if (!parsed) return notFound();

    const { a, b } = parsed;

    const brokerA = getBroker(a);
    const brokerB = getBroker(b);

    if (!brokerA || !brokerB) return notFound();

    const title = `${brokerA.name} vs ${brokerB.name} (2026) – Full Comparison`;

    const description = `Compare ${brokerA.name} vs ${brokerB.name} in spreads, fees, platforms, features and overall performance. Find the best broker for your trading strategy.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://velmenora.com/${params.lang}/compare/${params.slug}`,
        },
        openGraph: {
            title,
            description,
            images: ["/og-default.jpg"],
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */

export default function ComparePage({
    params,
}: {
    params: { slug: string; lang: string };
}) {
    const parsed = parseSlug(params.slug);

    if (!parsed) return notFound();

    const brokerA = getBroker(parsed.a);
    const brokerB = getBroker(parsed.b);

    if (!brokerA || !brokerB) return notFound();

    const winner = getWinner(brokerA, brokerB);

    return (
        <main className="max-w-5xl mx-auto py-20 px-6 text-white">

            {/* TITLE */}
            <h1 className="text-4xl font-bold mb-6 text-center">
                {brokerA.name} vs {brokerB.name}
            </h1>

            {/* WINNER BADGE */}
            <div className="text-center mb-10">
                <span className="px-4 py-2 bg-yellow-400 text-black rounded-full font-semibold">
                    🏆 Best Overall: {winner.name}
                </span>
            </div>

            {/* CTA TOP (ORDERED BY WINNER) */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {[brokerA, brokerB]
                    .sort((x, y) =>
                        winner.slug === x.slug ? -1 : 1
                    )
                    .map((broker) => (
                        <Link
                            key={broker.slug}
                            href={`/go/${broker.slug}`}
                            className={`block p-6 rounded-xl text-center font-semibold transition hover:scale-105 ${broker.slug === winner.slug
                                ? "bg-yellow-500 text-black"
                                : "bg-white/10"
                                }`}
                        >
                            Trade with {broker.name} →
                        </Link>
                    ))}
            </div>

            {/* COMPARISON TABLE */}
            <div className="overflow-x-auto mb-12">
                <table className="w-full border border-white/10 rounded-xl">
                    <thead>
                        <tr className="bg-white/10">
                            <th className="p-4 text-left">Feature</th>
                            <th className="p-4">{brokerA.name}</th>
                            <th className="p-4">{brokerB.name}</th>
                        </tr>
                    </thead>

                    <tbody className="text-gray-300">
                        <tr>
                            <td className="p-4">Rating</td>
                            <td className="p-4">{brokerA.rating}</td>
                            <td className="p-4">{brokerB.rating}</td>
                        </tr>

                        <tr>
                            <td className="p-4">Features</td>
                            <td className="p-4">
                                {brokerA.features?.join(", ")}
                            </td>
                            <td className="p-4">
                                {brokerB.features?.join(", ")}
                            </td>
                        </tr>

                        <tr>
                            <td className="p-4">Score</td>
                            <td className="p-4">
                                {scoreBroker(brokerA).toFixed(1)}
                            </td>
                            <td className="p-4">
                                {scoreBroker(brokerB).toFixed(1)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* SEO CONTENT */}
            <section className="prose prose-invert max-w-none mb-12">
                <h2>{brokerA.name} vs {brokerB.name}: Full Comparison</h2>

                <p>
                    When comparing {brokerA.name} and {brokerB.name}, traders should evaluate
                    spreads, execution quality, available platforms, and overall reliability.
                </p>

                <h2>Which Broker is Better?</h2>

                <p>
                    Based on our scoring system, <strong>{winner.name}</strong> ranks higher
                    due to better overall performance, features, and trader experience.
                </p>
            </section>

            {/* FINAL CTA */}
            <div className="text-center">
                <Link
                    href={`/go/${winner.slug}`}
                    className="inline-block px-8 py-4 bg-yellow-500 text-black rounded-xl font-bold hover:scale-105 transition"
                >
                    Start Trading with {winner.name} →
                </Link>
            </div>

        </main>
    );
}
