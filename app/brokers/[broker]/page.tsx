// /app/brokers/[broker]/page.tsx

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";

import { getBroker, getRelatedBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";

/* 🔥 COMPONENTS */
import BrokerHeroCard from "@/components/broker/BrokerHeroCard";
import BrokerStatsGrid from "@/components/broker/BrokerStatsGrid";
import BrokerTrustCard from "@/components/broker/BrokerTrustCard";
import BrokerCTA from "@/components/broker/BrokerCTA";
import StickyCTA from "@/components/broker/StickyCTA";

/* ================= TYPES ================= */
type Props = {
    params: Promise<{ broker: string }>;
};

/* ================= HELPER ================= */
async function buildRequestFromHeaders() {
    const h = await headers();

    return {
        headers: h,
        nextUrl: { searchParams: new URLSearchParams() },
        cookies: { get: () => undefined },
    } as any;
}

/* ================= SEO (VERY IMPORTANT) ================= */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { broker: slug } = await params;

    const broker = getBroker(slug);
    if (!broker) return {};

    return {
        title: `${broker.name} Review (2026) — Is It Worth It?`,
        description: `Full ${broker.name} review covering spreads, withdrawals, platforms, and trading experience.`,
    };
}

/* ================= PAGE ================= */
export default async function BrokerPage({ params }: Props) {
    const { broker: slug } = await params;

    const broker = getBroker(slug);
    if (!broker) return notFound();

    /* 🔥 GEO ENGINE */
    const req = await buildRequestFromHeaders();
    const geo = resolveGeo(req);

    const { config, payments, intent } = geo;

    const geoLabel = config?.seo?.keyword_modifier || "Global";

    /* 🔥 RELATED */
    const related = getRelatedBrokers(broker.slug, 3);

    return (
        <main className="w-full max-w-7xl mx-auto px-6 py-12">

            {/* 🔥 HERO */}
            <BrokerHeroCard
                broker={broker}
                geoLabel={geoLabel}
            />

            {/* 🔥 STATS */}
            <BrokerStatsGrid
                broker={broker}
                payments={payments}
            />

            {/* 🔥 TRUST */}
            <BrokerTrustCard broker={broker} />

            {/* 🔥 LONG CONTENT (SEO BOOST) */}
            <section className="mb-20 bg-gray-900 p-10 rounded-2xl border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">
                    {broker.name} Review {geoLabel}
                </h2>

                <p className="text-gray-400 leading-relaxed mb-4">
                    {broker.name} is one of the most widely used forex brokers globally,
                    offering competitive spreads, fast withdrawals, and multiple trading platforms.
                    Traders choose {broker.name} for its reliability, execution speed, and overall performance.
                </p>

                <p className="text-gray-400 leading-relaxed">
                    In this review, we explore trading conditions, payment options, and why
                    {broker.name} stands out compared to other brokers in {geoLabel}.
                </p>
            </section>

            {/* 🔥 RELATED */}
            {related.length > 0 && (
                <section className="mb-24">
                    <h2 className="text-2xl font-bold mb-6">
                        Compare {broker.name} with Other Brokers
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {related.map((b) => (
                            <a
                                key={b.slug}
                                href={`/brokers/${b.slug}`}
                                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition"
                            >
                                <h3 className="font-semibold mb-2">{b.name}</h3>

                                <p className="text-gray-400 text-sm">
                                    {b.features?.join(", ")}
                                </p>

                                <div className="mt-4 text-green-400 text-sm">
                                    View Review →
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* 🔥 CTA */}
            <BrokerCTA broker={broker} />

            {/* 🔥 STICKY CTA */}
            <StickyCTA broker={broker} />

        </main>
    );
}
