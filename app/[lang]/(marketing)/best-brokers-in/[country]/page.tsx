import { notFound } from "next/navigation";
import type { Broker } from "@/lib/types/broker";

import {
    getCountryPageData,
    resolveCountry,
} from "@/lib/countryEngine";

import {
    buildCountryTitle,
    generateCanonical,
} from "@/lib/seo";

import {
    buildCountrySections,
} from "@/lib/contentEngine";

import {
    buildBreadcrumbSchema,
} from "@/lib/schemaEngine";

/* 🔥 COMPONENTS */
import SchemaMarkup from "@/components/SchemaMarkup";
import TrackingCountryView from "@/components/tracking/TrackingCountryView";
import TrackedLink from "@/components/tracking/TrackedLink";

/* ================= CONFIG ================= */

const LANGS = ["en"];

const COUNTRIES = [
    { code: "TZ", slug: "tanzania" },
    { code: "KE", slug: "kenya" },
    { code: "NG", slug: "nigeria" },
    { code: "ZA", slug: "south-africa" },
    { code: "UG", slug: "uganda" },
    { code: "GH", slug: "ghana" },

    // 🔥 NEW MARKETS (SEO expansion)
    { code: "IN", slug: "india" },
    { code: "PK", slug: "pakistan" },
    { code: "BD", slug: "bangladesh" },
    { code: "AE", slug: "uae" },
    { code: "SA", slug: "saudi-arabia" },
];

/* ================= STATIC ================= */

export function generateStaticParams() {
    return LANGS.flatMap((lang) =>
        COUNTRIES.map((c) => ({
            lang,
            country: c.slug,
        }))
    );
}

/* ================= METADATA ================= */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string; country: string }>;
}) {
    const { country } = await params;

    const code = resolveCountry(country);
    const data = getCountryPageData(code);

    return {
        title: buildCountryTitle(data.name),
        description: `Best forex brokers in ${data.name} with fast withdrawals, low spreads, and local payment methods.`,
        alternates: {
            canonical: generateCanonical(`/best-brokers-in/${country}`),
        },
    };
}

/* ================= PAGE ================= */

export default async function CountryPage({
    params,
}: {
    params: Promise<{ lang: string; country: string }>;
}) {
    const { country } = await params;

    const code = resolveCountry(country);

    /* ✅ DECLARE ONCE ONLY */
    const data = getCountryPageData(code);

    /* ✅ SAFE GUARD */
    if (!data?.brokers?.length) return notFound();

    const { name, brokers } = data;

    const content = buildCountrySections(name);

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">

            {/* 🔥 TRACKING */}
            <TrackingCountryView country={code} />

            {/* 🔥 SCHEMA */}
            <SchemaMarkup
                data={buildBreadcrumbSchema([
                    { name: "Home", path: "/" },
                    { name: "Brokers", path: "/best-forex-brokers" },
                    {
                        name,
                        path: `/best-brokers-in/${country}`,
                    },
                ])}
            />

            {/* 🔥 TITLE */}
            <h1 className="text-3xl font-bold">
                {buildCountryTitle(name)}
            </h1>

            {/* 🔥 INTRO */}
            <p>{content.intro}</p>

            {/* 🔥 INTERNAL LINK */}
            <p>
                Looking for global options?{" "}
                <a href="/best-forex-brokers" className="underline">
                    View all forex brokers
                </a>
            </p>

            {/* 🔥 MONEY SECTION */}
            <h2 className="text-xl font-semibold">
                Top Brokers in {name}
            </h2>

            {brokers.map((b: Broker) => (
                <div
                    key={b.slug}
                    className="border p-4 rounded-xl mb-4"
                >
                    <h3 className="font-semibold">{b.name}</h3>

                    <p>Rating: {b.rating ?? "N/A"}</p>
                    <p>Min Deposit: ${b.minDeposit ?? "N/A"}</p>

                    <TrackedLink
                        href={`/go/${b.slug}?src=country`}
                        broker={b.slug}
                        page="country"
                        cta="list"
                        country={code}
                        className="inline-block mt-2 bg-green-600 px-4 py-2 rounded-lg"
                    >
                        🚀 Open Account
                    </TrackedLink>
                </div>
            ))}

            {/* 🔥 MID LINK */}
            <p>
                Want to compare more options?{" "}
                <a href="/best-forex-brokers" className="underline">
                    Explore all brokers
                </a>
            </p>

            {/* 🔥 SEO CONTENT */}
            <h2>Regulation</h2>
            <p>{content.regulation}</p>

            <h2>Payments & Withdrawals</h2>
            <p>{content.payments}</p>

            <h2>Conclusion</h2>
            <p>{content.conclusion}</p>

            {/* 🔥 FINAL CTA */}
            <p className="text-center mt-10">
                Ready to start trading?{" "}
                <a href="/best-forex-brokers" className="underline">
                    View top brokers globally
                </a>
            </p>

        </div>
    );
}