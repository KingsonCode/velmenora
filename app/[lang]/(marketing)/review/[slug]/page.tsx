import { notFound } from "next/navigation";
import type { Metadata } from "next";

// ✅ DATA
import { getBroker } from "@/lib/brokerEngine";
import { getAllBrokers } from "@/lib/brokers";

// ✅ NEW METADATA ENGINE
import { buildReviewMetadata } from "@/lib/seo/metadataEngine";

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
}): Promise<Metadata> {
    const { lang, slug } = await params;

    const brokerSlug = slug.replace("-review", "");
    const broker = getBroker(brokerSlug);

    if (!broker) {
        return {};
    }

    return buildReviewMetadata({
        brokerName: broker.name,
        pathname: `/${lang}/review/${slug}`,
    });
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
            <TrackingView page="review" broker={broker.slug} />

            <SchemaMarkup data={buildReviewSchema(broker)} />
            <SchemaMarkup data={buildFAQSchema(faq)} />

            <BrokerHeroCard broker={broker} geoLabel="Global" />

            <BrokerStatsGrid
                broker={broker}
                payments={broker.payments || []}
            />

            <BrokerTrustCard broker={broker} />

            <section className="max-w-3xl mx-auto px-6 py-12 space-y-6">
                <h1 className="text-3xl font-bold">
                    {broker.name} Review
                </h1>

                <p>{content.intro}</p>

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

            <BrokerCTA broker={broker} />
            <StickyCTA broker={broker} />

            <FAQ items={faq} />

            <InternalLinks
                title="Compare with Other Brokers"
                links={getRelatedComparisons(broker.slug)}
            />

            <InternalLinks
                title="Other Broker Reviews"
                links={getRelatedReviews(broker.slug)}
            />

            <p className="text-center mt-10">
                Still exploring?{" "}
                <a href="/best-forex-brokers" className="underline">
                    View all top forex brokers
                </a>
            </p>
        </>
    );
}