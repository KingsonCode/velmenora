import { notFound } from "next/navigation";

import { getBroker } from "@/lib/brokerEngine";
import {
    buildComparisonTitle,
    buildComparisonDescription,
    generateCanonical,
} from "@/lib/seo";

import { buildComparisonSections } from "@/lib/contentEngine";
import {
    buildComparisonSchema,
    buildFAQSchema,
} from "@/lib/schemaEngine";

import { buildComparisonFAQs } from "@/lib/faqEngine";

import { getAffiliateLink } from "@/lib/brokerEngine";

/* 🔥 COMPONENTS */
import ComparisonHero from "@/components/comparison/ComparisonHero";
import ComparisonTable from "@/components/comparison/ComparisonTable";
import ComparisonWinner from "@/components/comparison/ComparisonWinner";

import TrackingView from "@/components/tracking/TrackingView";
import TrackedCTA from "@/components/tracking/TrackedCTA";

import SchemaMarkup from "@/components/SchemaMarkup";
import FAQ from "@/components/FAQ";

/* ================= NORMALIZER ================= */

function normalizeBroker(b: any) {
    return {
        ...b,
        platforms: b?.platforms ?? [],
        features: b?.features ?? [],
        payments: b?.payments ?? [],
        intent: b?.intent ?? [],
        category: b?.category ?? [],
        rating: b?.rating ?? 0,
        minDeposit: b?.minDeposit ?? 0,
    };
}

/* ================= STATIC ================= */

import { generateComparisonPairs } from "@/lib/comparisonEngine";
import { getComparisonSlug } from "@/lib/seo";

export function generateStaticParams() {
    return generateComparisonPairs().map(([a, b]) => ({
        slug: getComparisonSlug(a, b),
    }));
}

/* ================= METADATA (SEO BOOST) ================= */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { slug } = await params;

    const parts = slug.split("-vs-");
    const a = parts[0];
    const b = parts[1];

    if (!a || !b) {
        return {
            alternates: {
                canonical: generateCanonical(`/compare/${slug}`),
            },
        };
    }

    return {
        title: buildComparisonTitle(a, b),
        description: buildComparisonDescription(a, b),
        alternates: {
            canonical: generateCanonical(`/compare/${slug}`),
        },
    };
}

/* ================= PAGE ================= */

export default async function ComparisonPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) return notFound();

    const parts = slug.split("-vs-");
    if (parts.length !== 2) return notFound();

    const slugA = parts[0];
    const slugB = parts[1];

    if (!slugA || !slugB) return notFound();

    const rawA = getBroker(slugA);
    const rawB = getBroker(slugB);

    if (!rawA || !rawB) return notFound();

    const a = normalizeBroker(rawA);
    const b = normalizeBroker(rawB);

    /* 🔥 MONEY LOGIC (UPGRADE READY) */
    const winner = a.rating >= b.rating ? a : b;
    const loser = winner.slug === a.slug ? b : a;

    const comparisonKey = `${a.slug}_vs_${b.slug}`;

    const content = buildComparisonSections(a, b, winner);
    const faq = buildComparisonFAQs(a, b);

    const winnerLink = getAffiliateLink(winner);
    const loserLink = getAffiliateLink(loser);

    return (
        <>
            {/* 🔥 TRACKING */}
            <TrackingView
                page="comparison"
                comparisonKey={comparisonKey}
            />

            {/* 🔥 SCHEMA */}
            <SchemaMarkup data={buildComparisonSchema(a, b)} />
            <SchemaMarkup data={buildFAQSchema(faq)} />

            {/* 🔥 HERO */}
            <ComparisonHero brokerA={a} brokerB={b} />

            {/* 🔥 TITLE */}
            <div className="max-w-3xl mx-auto px-6 mt-10">
                <h1 className="text-3xl font-bold mb-4">
                    {buildComparisonTitle(a.name, b.name)}
                </h1>

                <p className="text-gray-400">
                    {buildComparisonDescription(a.name, b.name)}
                </p>
            </div>

            {/* 🔥 WINNER */}
            <ComparisonWinner broker={winner} />

            {/* 🔥 CTA (AB TEST READY) */}
            <div className="text-center my-10 space-y-4">

                <TrackedCTA
                    href={winnerLink}
                    broker={winner}
                    page="comparison"
                    cta="winner_primary"
                    className="bg-green-600 px-6 py-3 rounded-xl"
                >
                    🚀 Start Trading with {winner.name}
                </TrackedCTA>

                <TrackedCTA
                    href={loserLink}
                    broker={loser}
                    page="comparison"
                    cta="loser_alt"
                    className="bg-gray-800 px-4 py-2 rounded-lg"
                >
                    Trade {loser.name}
                </TrackedCTA>

            </div>

            {/* 🔥 TABLE */}
            <ComparisonTable brokerA={a} brokerB={b} />

            {/* 🔥 SEO CONTENT (EXPANDED) */}
            <div className="max-w-3xl mx-auto px-6 py-12 space-y-6">

                <h2>Trading Conditions</h2>
                <p>{content.conditions}</p>

                <h2>Platforms</h2>
                <p>{content.platforms}</p>

                <h2>Features</h2>
                <p>{content.features}</p>

                <h2>Which One Should You Choose?</h2>
                <p>{content.verdict}</p>

                {/* 🔥 EXTRA SEO SECTION */}
                <h2>{a.name} vs {b.name}: Final Decision</h2>
                <p>
                    If you prioritize speed and execution, choose <strong>{winner.name}</strong>.
                    However, {loser.name} may still be suitable depending on your strategy.
                </p>

            </div>

            {/* 🔥 FAQ */}
            <FAQ items={faq} />

        </>
    );
}
