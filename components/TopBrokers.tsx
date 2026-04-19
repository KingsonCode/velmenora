"use client";

import Link from "next/link";
import { getTopBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";
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
            (a.rating ?? 4.5) + (geo.brokers.includes(a.slug) ? 1 : 0);

        const scoreB =
            (b.rating ?? 4.5) + (geo.brokers.includes(b.slug) ? 1 : 0);

        return scoreB - scoreA;
    });

    if (!sorted.length) return null;

    const [featured, ...rest] = sorted;

    return (
        <section className="bg-black px-6 py-20 text-white">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-3xl text-center">
                    <p className="mb-3 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-300">
                        Broker rankings
                    </p>

                    <h2 className="mb-4 text-3xl font-bold md:text-5xl">
                        Top Forex Brokers in {geo.meta?.name || "Your Region"}
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
                                    A strong choice for traders looking for reliable execution, broad market access, and competitive conditions in {geo.meta?.name || "their region"}.
                                </p>

                                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-yellow-300">
                                        ⭐ {featured.rating ?? 4.5} / 5
                                    </span>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-green-400">
                                        Trusted broker
                                    </span>

                                    {featured.regions?.length ? (
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                                            {featured.regions.join(", ")}
                                        </span>
                                    ) : null}
                                </div>

                                {featured.features?.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {featured.features.slice(0, 4).map((feature) => (
                                            <span
                                                key={feature}
                                                className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-gray-300"
                                            >
                                                {feature}
                                            </span>
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
                                            <span className="font-medium text-white">Popular payments:</span>{" "}
                                            {geo.payments.join(", ")}
                                        </div>
                                    )}

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
                        {rest.map((broker) => (
                            <div
                                key={broker.slug}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-yellow-500/40 hover:bg-white/[0.05]"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-lg font-semibold text-white">
                                            {broker.name}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-400">
                                            {broker.category.join(" • ")}
                                        </p>
                                    </div>

                                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-yellow-300">
                                        ⭐ {broker.rating ?? 4.5}
                                    </span>
                                </div>

                                {broker.features?.length > 0 && (
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {broker.features.slice(0, 3).map((feature) => (
                                            <span
                                                key={feature}
                                                className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-gray-300"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="mb-4 text-sm text-gray-400">
                                    Available in: {broker.regions?.join(", ") || "Global"}
                                </p>

                                <div className="flex gap-3">
                                    <Link
                                        href={`/go/${broker.slug}?src=${getBrokerSourceTag(
                                            broker.slug,
                                            false
                                        )}`}
                                        className="flex-1 rounded-xl bg-yellow-400 px-4 py-2.5 text-center text-sm font-semibold text-black transition hover:scale-[1.01]"
                                    >
                                        Trade Now
                                    </Link>

                                    <Link
                                        href={`/brokers/${broker.slug}`}
                                        className="flex-1 rounded-xl border border-white/15 px-4 py-2.5 text-center text-sm transition hover:bg-white/10"
                                    >
                                        Review
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}