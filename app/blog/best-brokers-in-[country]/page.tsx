import { notFound } from "next/navigation";
import { countries, getCountryBySlug, generateSEO } from "@/lib/countries";
import { getFunnel } from "@/lib/geoFunnel";
import CTAButton from "@/components/CTAButton";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers";

// 🔥 STATIC PATHS (SEO)
export async function generateStaticParams() {
    return countries.map((c) => ({
        country: c.slug,
    }));
}

// 🔥 SEO METADATA (VERY IMPORTANT)
export async function generateMetadata({
    params,
}: {
    params: { country: string };
}) {
    const country = countries.find((c) => c.slug === params.country);

    if (!country) return {};

    return {
        title: `Best Forex Brokers in ${country.name} (2026)`,
        description: `Compare the best forex brokers in ${country.name} with fast withdrawals, low spreads, and trusted platforms.`,
        openGraph: {
            title: `Best Forex Brokers in ${country.name}`,
            description: `Trade safely in ${country.name} with top brokers.`,
            images: ["/og-default.jpg"], // unaweza kubadilisha later
        },
    };
}

export default function Page({
    params,
}: {
    params: { country: string };
}) {
    const country = countries.find((c) => c.slug === params.country);

    if (!country) return notFound();

    return (
        <main className="max-w-3xl mx-auto py-24 px-6 text-white">

            {/* 🔥 TITLE */}
            <h1 className="text-3xl font-bold mb-6">
                Best Forex Brokers in {country.name} (2026)
            </h1>

            {/* 🔥 INTRO */}
            <p className="text-gray-400 mb-6">
                Discover the best forex brokers in {country.name} with fast withdrawals,
                low spreads, and beginner-friendly platforms.
            </p>

            {/* 🔥 CTA ABOVE THE FOLD */}
            <a
                href="/go/exness"
                className="inline-block bg-yellow-400 text-black px-5 py-3 rounded-lg font-semibold mb-10"
            >
                Start Trading in {country.name}
            </a>

            {/* 🔥 KEY FEATURES (SEO + UX) */}
            <div className="space-y-4 mb-10">
                <h2 className="text-xl font-semibold">
                    Why Traders in {country.name} Choose These Brokers
                </h2>

                <ul className="text-gray-400 space-y-2">
                    <li>✔ Fast withdrawals in {country.name}</li>
                    <li>✔ Low spreads and high leverage</li>
                    <li>✔ Beginner-friendly trading platforms</li>
                    <li>✔ Secure and regulated brokers</li>
                </ul>
            </div>

            {/* 🔥 INTERNAL LINKING (VERY IMPORTANT) */}
            <div className="mb-10">
                <h3 className="text-lg font-semibold mb-3">
                    Related Guides
                </h3>

                <ul className="space-y-2 text-blue-400">
                    <li>
                        <a href="/blog">View all trading guides →</a>
                    </li>
                    <li>
                        <a href={`/${country.code}`}>
                            Trading in {country.name} →
                        </a>
                    </li>
                </ul>
            </div>

            {/* 🔥 FINAL CTA */}
            <div className="text-center mt-12">
                <a
                    href="/go/exness"
                    className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold"
                >
                    Open Account Now
                </a>
            </div>

        </main>
    );
}