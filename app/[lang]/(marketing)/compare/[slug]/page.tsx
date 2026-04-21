import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";

import { getBroker, isValidCountry } from "@/lib/brokers";
import { getCompareSlugs } from "@/lib/compare";
import type { CountryCode, Broker } from "@/lib/types/broker";

/* =========================================================
   CONFIG
========================================================= */

export const revalidate = 3600;

/* =========================================================
   TYPES
========================================================= */

type RouteParams = Promise<{
    slug: string;
    lang: string;
}>;

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

/* =========================================================
   HELPERS
========================================================= */

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

function normalizeCountry(raw?: string | null): CountryCode {
    if (!raw) return "TZ";

    const code = raw.trim().toUpperCase();

    if (!/^[A-Z]{2}$/.test(code)) {
        return "TZ";
    }

    if (isValidCountry(code)) {
        return code;
    }

    return "TZ";
}

async function resolveCountryFromRequest(): Promise<CountryCode> {
    const h = await headers();

    const country =
        h.get("x-vercel-ip-country") ||
        h.get("cf-ipcountry") ||
        h.get("x-country-code") ||
        h.get("x-geo-country");

    return normalizeCountry(country);
}

/* =========================================================
   STATIC BUILD (LIMITED)
========================================================= */

export async function generateStaticParams() {
    const slugs = getCompareSlugs({ limit: 50 });

    return SUPPORTED_LANGS.flatMap((lang) =>
        slugs.map((slug) => ({ lang, slug }))
    );
}

/* =========================================================
   PARSER
========================================================= */

function parseSlug(slug?: string) {
    if (!slug) return null;

    const parts = slug.split("-vs-");
    if (parts.length !== 2) return null;

    const [a, b] = parts;

    if (!a || !b) return null;
    if (a === b) return null;

    return { a, b };
}

/* =========================================================
   SCORING ENGINE
========================================================= */

function scoreBroker(b: Broker) {
    let score = 0;

    score += (b.rating || 0) * 2;

    if (b.priority) score += b.priority;

    if (b.features?.length) score += b.features.length * 0.3;

    return score;
}

function getWinner(a: Broker, b: Broker) {
    return scoreBroker(a) >= scoreBroker(b) ? a : b;
}

/* =========================================================
   SEO
========================================================= */

export async function generateMetadata({
    params,
}: {
    params: RouteParams;
}): Promise<Metadata> {
    const { slug, lang } = await params;

    if (!isValidLang(lang)) return {};

    const parsed = parseSlug(slug);
    if (!parsed) return {};

    const { a, b } = parsed;

    const brokerA = getBroker(a);
    const brokerB = getBroker(b);

    if (!brokerA || !brokerB) return {};

    const title = `${brokerA.name} vs ${brokerB.name} (2026) – Full Comparison`;
    const description = `Compare ${brokerA.name} vs ${brokerB.name} in spreads, fees, platforms, features and overall performance. Find the better broker for your trading style.`;

    return {
        title,
        description,
        alternates: {
            canonical: `https://velmenora.com/${lang}/country/compare/${slug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://velmenora.com/${lang}/country/compare/${slug}`,
            siteName: "Velmenora",
            type: "article",
            images: ["/og-default.jpg"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-default.jpg"],
        },
    };
}

/* =========================================================
   PAGE
========================================================= */

export default async function CompareSlugPage({
    params,
}: {
    params: RouteParams;
}) {
    const { slug, lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    const parsed = parseSlug(slug);
    if (!parsed) {
        notFound();
    }

    const brokerA = getBroker(parsed.a);
    const brokerB = getBroker(parsed.b);

    if (!brokerA || !brokerB) {
        notFound();
    }

    const country = await resolveCountryFromRequest();
    const winner = getWinner(brokerA, brokerB);
    const orderedBrokers =
        winner.slug === brokerA.slug ? [brokerA, brokerB] : [brokerB, brokerA];

    const scoreA = scoreBroker(brokerA);
    const scoreB = scoreBroker(brokerB);

    return (
        <main className="min-h-screen bg-[#020617] px-6 py-20 text-white">
            <div className="mx-auto max-w-5xl">
                {/* HERO */}
                <section className="mb-10 text-center">
                    <div className="mb-4 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-yellow-300">
                        Head-to-Head Broker Comparison
                    </div>

                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                        {brokerA.name} vs {brokerB.name}
                    </h1>

                    <p className="mx-auto max-w-3xl text-base leading-relaxed text-gray-400 md:text-lg">
                        Compare {brokerA.name} and {brokerB.name} side by side in
                        rating, features, trading strength, and overall value to find
                        the better broker for your needs.
                    </p>
                </section>

                {/* WINNER BADGE */}
                <section className="mb-10 text-center">
                    <span className="inline-flex rounded-full bg-yellow-400 px-5 py-2.5 font-semibold text-black">
                        🏆 Best Overall: {winner.name}
                    </span>
                </section>

                {/* TOP CTA */}
                <section className="mb-12 grid gap-6 md:grid-cols-2">
                    {orderedBrokers.map((broker) => (
                        <Link
                            key={broker.slug}
                            href={`/go/${broker.slug}?src=${brokerA.slug}-vs-${brokerB.slug}&country=${country}`}
                            className={`block rounded-2xl border p-6 text-center font-semibold transition hover:scale-[1.02] ${broker.slug === winner.slug
                                    ? "border-yellow-400/30 bg-yellow-500 text-black"
                                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                                }`}
                        >
                            Trade with {broker.name} →
                        </Link>
                    ))}
                </section>

                {/* QUICK SUMMARY */}
                <section className="mb-12 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-2 text-sm uppercase tracking-wide text-gray-400">
                            Higher score
                        </div>
                        <div className="text-xl font-semibold">{winner.name}</div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-2 text-sm uppercase tracking-wide text-gray-400">
                            Broker A score
                        </div>
                        <div className="text-xl font-semibold">
                            {scoreA.toFixed(1)}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <div className="mb-2 text-sm uppercase tracking-wide text-gray-400">
                            Broker B score
                        </div>
                        <div className="text-xl font-semibold">
                            {scoreB.toFixed(1)}
                        </div>
                    </div>
                </section>

                {/* COMPARISON TABLE */}
                <section className="mb-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                    <table className="w-full min-w-[720px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-left text-sm font-semibold text-white">
                                    Feature
                                </th>
                                <th className="p-4 text-center text-sm font-semibold text-white">
                                    {brokerA.name}
                                </th>
                                <th className="p-4 text-center text-sm font-semibold text-white">
                                    {brokerB.name}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="text-sm text-gray-300">
                            <tr className="border-b border-white/10">
                                <td className="p-4 font-medium text-white">Rating</td>
                                <td className="p-4 text-center">
                                    {brokerA.rating?.toFixed(1) ?? "—"}
                                </td>
                                <td className="p-4 text-center">
                                    {brokerB.rating?.toFixed(1) ?? "—"}
                                </td>
                            </tr>

                            <tr className="border-b border-white/10">
                                <td className="p-4 font-medium text-white">Priority</td>
                                <td className="p-4 text-center">
                                    {brokerA.priority ?? "—"}
                                </td>
                                <td className="p-4 text-center">
                                    {brokerB.priority ?? "—"}
                                </td>
                            </tr>

                            <tr className="border-b border-white/10">
                                <td className="p-4 font-medium text-white">Features</td>
                                <td className="p-4 text-center">
                                    {brokerA.features?.length
                                        ? brokerA.features.join(", ")
                                        : "—"}
                                </td>
                                <td className="p-4 text-center">
                                    {brokerB.features?.length
                                        ? brokerB.features.join(", ")
                                        : "—"}
                                </td>
                            </tr>

                            <tr>
                                <td className="p-4 font-medium text-white">
                                    Overall score
                                </td>
                                <td className="p-4 text-center">{scoreA.toFixed(1)}</td>
                                <td className="p-4 text-center">{scoreB.toFixed(1)}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                {/* CONTENT */}
                <section className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                    <h2 className="mb-4 text-2xl font-bold">
                        {brokerA.name} vs {brokerB.name}: Full Comparison
                    </h2>

                    <p className="mb-5 leading-relaxed text-gray-300">
                        When comparing {brokerA.name} and {brokerB.name}, traders
                        should focus on core decision areas such as trust, broker
                        quality, platform fit, trading conditions, and overall
                        experience.
                    </p>

                    <h3 className="mb-3 text-xl font-semibold">
                        Which broker is better?
                    </h3>

                    <p className="mb-5 leading-relaxed text-gray-300">
                        Based on our scoring model, <strong>{winner.name}</strong>{" "}
                        ranks higher overall in this comparison. That does not mean it
                        is automatically better for every trader, but it currently
                        offers the stronger balance of rating, features, and broker
                        strength in this matchup.
                    </p>

                    <h3 className="mb-3 text-xl font-semibold">
                        Who should choose {winner.name}?
                    </h3>

                    <p className="leading-relaxed text-gray-300">
                        Traders looking for the stronger all-round option in this pair
                        should start with <strong>{winner.name}</strong>, then read the
                        full broker review before opening an account.
                    </p>
                </section>

                {/* SECONDARY LINKS */}
                <section className="mb-12 grid gap-4 md:grid-cols-3">
                    <Link
                        href={`/${lang}/country/brokers/${brokerA.slug}`}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                    >
                        <h3 className="mb-2 font-semibold">{brokerA.name} Review</h3>
                        <p className="text-sm text-gray-400">
                            Read the full review for {brokerA.name}.
                        </p>
                    </Link>

                    <Link
                        href={`/${lang}/country/brokers/${brokerB.slug}`}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                    >
                        <h3 className="mb-2 font-semibold">{brokerB.name} Review</h3>
                        <p className="text-sm text-gray-400">
                            Read the full review for {brokerB.name}.
                        </p>
                    </Link>

                    <Link
                        href={`/${lang}/country/compare`}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                    >
                        <h3 className="mb-2 font-semibold">More comparisons</h3>
                        <p className="text-sm text-gray-400">
                            Explore more broker comparison pages.
                        </p>
                    </Link>
                </section>

                {/* FINAL CTA */}
                <section className="text-center">
                    <Link
                        href={`/go/${winner.slug}?src=${brokerA.slug}-vs-${brokerB.slug}-bottom&country=${country}`}
                        className="inline-block rounded-xl bg-yellow-500 px-8 py-4 font-bold text-black transition hover:scale-[1.02]"
                    >
                        Start Trading with {winner.name} →
                    </Link>
                </section>
            </div>
        </main>
    );
}