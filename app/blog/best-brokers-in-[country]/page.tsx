import { notFound } from "next/navigation";
import type { CountryCode as BrokerCountryCode } from "@/lib/types/broker";
import {
    countries,
    getCountryBySlug,
    generateSEO,
    resolveGeo,
} from "@/lib/geo";

import CTAButton from "@/components/CTAButton";
import BrokerCard from "@/components/BrokerCard";
import { getTopBrokers } from "@/lib/brokers";

const BROKER_COUNTRIES = new Set<BrokerCountryCode>([
    "TZ",
    "KE",
    "NG",
    "ZA",
    "UG",
    "GH",
    "GLOBAL",
]);

function toBrokerCountry(code: string): BrokerCountryCode {
    return BROKER_COUNTRIES.has(code as BrokerCountryCode)
        ? (code as BrokerCountryCode)
        : "GLOBAL";
}

/* ================= STATIC PATHS ================= */
export async function generateStaticParams() {
    return countries.map((c) => ({
        country: c.slug,
    }));
}

/* ================= SEO ================= */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ country: string }>;
}) {
    const { country: countrySlug } = await params;
    const country = getCountryBySlug(countrySlug);

    if (!country) return {};

    const seo = generateSEO(country);

    return {
        title: seo.title,
        description: seo.description,
        openGraph: {
            title: seo.title,
            description: seo.description,
            images: ["/og-default.jpg"],
        },
    };
}

/* ================= PAGE ================= */
export default async function Page({
    params,
}: {
    params: Promise<{ country: string }>;
}) {
    const { country: countrySlug } = await params;
    const country = getCountryBySlug(countrySlug);

    if (!country) return notFound();

    const geo = resolveGeo(country.code);
    const brokerCountry = toBrokerCountry(country.code);

    /* 🔥 REAL BROKER ENGINE */
    const filteredBrokers = getTopBrokers(brokerCountry, 5)
        .filter((b) => geo.brokers.includes(b.slug));

    return (
        <main className="max-w-3xl mx-auto py-24 px-6 text-white">

            <h1 className="text-3xl font-bold mb-6">
                Best Forex Brokers in {country.name} (2026)
            </h1>

            <p className="text-gray-400 mb-6">
                Trade forex in {country.name} with fast withdrawals, low spreads,
                and trusted brokers. Supported payments:{" "}
                {geo.payments.join(", ") || "Card, Bank Transfer"}.
            </p>

            <CTAButton
                broker={filteredBrokers[0]?.slug || "exness"}
                country={brokerCountry}
                text={`Start Trading in ${country.name}`}
                className="bg-yellow-400 text-black px-5 py-3 rounded-lg font-semibold mb-10"
            />

            <div className="space-y-6 mb-12">
                {filteredBrokers.map((b, i) => (
                    <BrokerCard
                        key={b.slug}
                        broker={b}
                        country={brokerCountry}
                        rank={i + 1}
                        allBrokers={filteredBrokers}
                    />
                ))}
            </div>

            <div className="space-y-4 mb-10">
                <h2 className="text-xl font-semibold">
                    Why Traders in {country.name} Choose These Brokers
                </h2>

                <ul className="text-gray-400 space-y-2">
                    <li>✔ Fast withdrawals ({geo.payments.join(", ")})</li>
                    <li>✔ Low spreads & high leverage</li>
                    <li>✔ Beginner-friendly platforms</li>
                    <li>✔ Regulated & secure brokers</li>
                </ul>
            </div>

            <div className="mb-10">
                <h3 className="text-lg font-semibold mb-3">
                    Related Guides
                </h3>

                <ul className="space-y-2 text-blue-400">
                    <li>
                        <a href="/blog">View all trading guides →</a>
                    </li>
                    <li>
                        <a href={`/blog/best-brokers-in-${country.slug}`}>
                            Trading in {country.name} →
                        </a>
                    </li>
                </ul>
            </div>

            <div className="text-center mt-12">
                <CTAButton
                    broker={filteredBrokers[0]?.slug || "exness"}
                    country={country.code}
                    text="Compare Brokers"
                    className="bg-green-500 px-6 py-3 rounded-xl font-semibold"
                />
            </div>

        </main>
    );
}
