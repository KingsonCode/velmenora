import { notFound } from "next/navigation";

// ✅ NEW
import { getBroker } from "@/lib/brokerEngine";
import { getAllBrokers } from "@/lib/brokers";
import {
    buildReviewTitle,
    buildReviewDescription,
    generateCanonical,
} from "@/lib/seo";

import { buildReviewSections } from "@/lib/contentEngine";

import {
    buildReviewSchema,
    buildFAQSchema,
} from "@/lib/schemaEngine";

import { buildReviewFAQs } from "@/lib/faqEngine";

import {
    getRelatedComparisons,
    getRelatedReviews,
} from "@/lib/linkEngine";

/* 🔥 COMPONENTS */
import BrokerHeroCard from "@/components/broker/BrokerHeroCard";
import BrokerStatsGrid from "@/components/broker/BrokerStatsGrid";
import BrokerTrustCard from "@/components/broker/BrokerTrustCard";
import BrokerCTA from "@/components/broker/BrokerCTA";
import StickyCTA from "@/components/broker/StickyCTA";
import InternalLinks from "@/components/InternalLinks";
import SchemaMarkup from "@/components/SchemaMarkup";
import FAQ from "@/components/FAQ";
import TrackingView from "@/components/tracking/TrackingView";

/* ================= STATIC (SEO SCALE) ================= */

export function generateStaticParams() {
    return getAllBrokers().map((b) => ({
        slug: `${b.slug}-review`,
    }));
}

/* ================= METADATA ================= */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { slug } = await params;

    const brokerSlug = slug.replace("-review", "");
    const broker = getBroker(brokerSlug);

    if (!broker) return {};

    return {
        title: buildReviewTitle(broker.name),
        description: buildReviewDescription(broker.name),
        alternates: {
            canonical: generateCanonical(`/review/${slug}`),
        },
    };
}

/* ================= PAGE ================= */

export default async function BrokerReviewPage({
    params,
}: {
    params: Promise<{ lang: string; slug: string }>;
}) {
    const { slug } = await params;

    if (!slug) return notFound();

    const brokerSlug = slug.replace("-review", "");
    const broker = getBroker(brokerSlug);

    if (!broker) return notFound();

    const content = buildReviewSections(broker);
    const faq = buildReviewFAQs(broker);

    return (
        <>
            {/* 🔥 TRACKING */}
            <TrackingView page="review" broker={broker.slug} />

            {/* 🔥 SCHEMA */}
            <SchemaMarkup data={buildReviewSchema(broker)} />
            <SchemaMarkup data={buildFAQSchema(faq)} />

            {/* 🔥 HERO */}
            <BrokerHeroCard broker={broker} geoLabel="Global" />

            {/* 🔥 STATS */}
            <BrokerStatsGrid
                broker={broker}
                payments={broker.payments || []}
            />

            {/* 🔥 TRUST */}
            <BrokerTrustCard broker={broker} />

            {/* 🔥 CONTENT (SEO HEAVY) */}
            <section className="max-w-3xl mx-auto px-6 py-12 space-y-6">

                <h1 className="text-3xl font-bold">
                    {broker.name} Review
                </h1>

                <p>{content.intro}</p>

                {/* 🔥 INTERNAL LINK BOOST */}
                <p className="mt-4">
                    Looking for alternatives?{" "}
                    <a href="/best-forex-brokers" className="underline">
                        Compare all forex brokers
                    </a>
                </p>

                <h2>Trading Conditions</h2>
                <p>{content.trading}</p>

                <h2>Features</h2>
                <p>{content.features}</p>

                <ul>
                    {content.pros.map((p) => (
                        <li key={p}>{p}</li>
                    ))}
                </ul>

                <h2>Deposits & Withdrawals</h2>
                <p>{content.payments}</p>

                <h2>Trust & Regulation</h2>
                <p>{content.trust}</p>

                <h2>Final Verdict</h2>
                <p>{content.conclusion}</p>

            </section>

            {/* 🔥 CTA (MONEY ZONE) */}
            <BrokerCTA broker={broker} />
            <StickyCTA broker={broker} />

            {/* 🔥 FAQ */}
            <FAQ items={faq} />

            {/* 🔥 INTERNAL LINKS */}
            <InternalLinks
                title="Compare with Other Brokers"
                links={getRelatedComparisons(broker.slug)}
            />

            <InternalLinks
                title="Other Broker Reviews"
                links={getRelatedReviews(broker.slug)}
            />

            {/* 🔥 FINAL SEO PUSH */}
            <p className="text-center mt-10">
                Still exploring?{" "}
                <a href="/best-forex-brokers" className="underline">
                    View all top forex brokers
                </a>
            </p>
        </>
    );
}