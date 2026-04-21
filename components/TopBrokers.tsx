"use client";

import Link from "next/link";
import BrokerCard from "@/components/broker/BrokerCard";
import { getTopBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";
import {
    getBrokerBadges,
    getBrokerDescription,
    getBrokerHighlights,
    getTrustLabel,
} from "@/lib/brokers/card";
import type { Broker, CountryCode } from "@/lib/types/broker";

const BROKER_COUNTRIES = new Set<CountryCode>([
    "TZ",
    "KE",
    "NG",
    "ZA",
    "UG",
    "GH",
    "GLOBAL",
]);

function toBrokerCountry(code?: string | null): CountryCode {
    return code && BROKER_COUNTRIES.has(code as CountryCode)
        ? (code as CountryCode)
        : "GLOBAL";
}

function getBrokerSourceTag(slug: string, isTop: boolean) {
    return isTop
        ? `topbrokers_featured_${slug}`
        : `topbrokers_grid_${slug}`;
}

export default function TopBrokers() {
    const geo = resolveGeo();
    const country = toBrokerCountry(geo.country);

    const brokers: Broker[] = getTopBrokers(country, 6);

    const sorted = [...brokers].sort((a, b) => {
        const scoreA =
            (a.rating ?? 4.5) +
            (geo.brokers.includes(a.slug) ? 1 : 0) +
            ((a.priority ?? 0) * 0.05);

        const scoreB =
            (b.rating ?? 4.5) +
            (geo.brokers.includes(b.slug) ? 1 : 0) +
            ((b.priority ?? 0) * 0.05);

        return scoreB - scoreA;
    });

    if (!sorted.length) return null;

    const [featured, ...rest] = sorted;

    const regionLabel = geo.meta?.name || "Your Region";

    const featuredBadges = featured ? getBrokerBadges(featured) : [];
    const featuredHighlights = featured ? getBrokerHighlights(featured) : [];
    const featuredDescription = featured ? getBrokerDescription(featured) : "";
    const featuredTrustLabel = featured ? getTrustLabel(featured) : "Trusted";

    return (
        <section className="bg-black px-6 py-20 text-white">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <p className="mb-3 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-300">
                        Broker rankings
                    </p>

                    <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                        Top Forex Brokers in {regionLabel}
                    </h2>

                    <p className="text-base text-gray-400 md:text-lg">
                        Compare trusted brokers with strong execution, better payment flexibility, and trading conditions that match your region.
                    </p>
                </div>

                {featured && (
                    <div className="mb-8 overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-white/[0.03] to-transparent">
                        <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_0.9fr] md:p-8">
                            <div>
                                <div className="mb-4 flex flex-wrap items-center gap-3">
                                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
                                        #1 Recommended
                                    </span>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                                        {featured.category.join(" • ")}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold md:text-3xl">
                                    {featured.name}
                                </h3>

                                <p className="mt-3 max-w-2xl text-gray-300">
                                    {featuredDescription}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-yellow-300">
                                        ⭐ {featured.rating?.toFixed(1) ?? "4.5"} / 5
                                    </span>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-green-400">
                                        {featuredTrustLabel}
                                    </span>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                                        Popular in {regionLabel}
                                    </span>
                                </div>

                                {featuredBadges.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {featuredBadges.map((badge) => (
                                            <span
                                                key={badge}
                                                className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {featuredHighlights.length > 0 && (
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        {featuredHighlights.map((item) => (
                                            <div
                                                key={item}
                                                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300"
                                            >
                                                ✔ {item}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href={`/go/${featured.slug}?src=${getBrokerSourceTag(
                                            featured.slug,
                                            true
                                        )}`}
                                        className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
                                    >
                                        Trade Now
                                    </Link>

                                    <Link
                                        href={`/brokers/${featured.slug}`}
                                        className="rounded-xl border border-white/15 px-6 py-3 font-semibold transition hover:bg-white/10"
                                    >
                                        Read Review
                                    </Link>
                                </div>

                                <p className="mt-4 text-xs text-yellow-300">
                                    🔥 High signup momentum in your region
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                                <p className="text-sm font-semibold text-white">
                                    Why traders pick {featured.name}
                                </p>

                                <div className="mt-4 space-y-3 text-sm text-gray-300">
                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        Strong broker score based on rating, priority, and regional relevance.
                                    </div>

                                    {geo.payments.length > 0 && (
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                            <span className="font-medium text-white">
                                                Popular payments:
                                            </span>{" "}
                                            {geo.payments.join(", ")}
                                        </div>
                                    )}

                                    {featured.payments?.length ? (
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                            <span className="font-medium text-white">
                                                Broker supports:
                                            </span>{" "}
                                            {featured.payments.join(", ")}
                                        </div>
                                    ) : null}

                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        Suitable for traders comparing broker quality before account opening.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {rest.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {rest.map((broker, index) => (
                            <BrokerCard
                                key={broker.slug}
                                broker={broker}
                                rank={index + 2}
                                variant="compact"
                                countryLabel={regionLabel}
                                className="h-full"
                                ctaSource={getBrokerSourceTag(broker.slug, false)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}