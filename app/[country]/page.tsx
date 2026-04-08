import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCountryBySlug, generateSEO } from "@/lib/countries";
import GeoFunnel from "components/GeoFunnel";
import CTAButton from "components/CTAButton";
import BrokerCard from "components/BrokerCard";
import { brokers } from "@/data/brokers";

/* =========================================================
   🔥 SEO (ASYNC SAFE)
========================================================= */

export async function generateMetadata(
    { params }: { params: Promise<{ country: string }> }
): Promise<Metadata> {
    const { country: slug } = await params;

    const country = getCountryBySlug(slug);
    if (!country) return {};

    const seo = generateSEO(country);

    return {
        title: seo.title,
        description: seo.description,
        openGraph: {
            title: seo.title,
            description: seo.description,
            url: `https://velmenora.com/${country.slug}`,
            type: "website",
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */

export default async function CountryPage(
    { params }: { params: Promise<{ country: string }> }
) {
    const { country: slug } = await params;

    const country = getCountryBySlug(slug);
    if (!country) return notFound();

    return (
        <main className="min-h-screen bg-[#0B0F14] text-white">

            {/* 🌍 GEO FUNNEL (TOP SEO + HOOK) */}
            <GeoFunnel
                data={{
                    countryName: country.name,
                    title: `Best Forex Brokers in ${country.name}`,
                    description: `Trade forex in ${country.name} using trusted brokers with fast withdrawals.`,
                    ctaText: `Start Trading in ${country.name}`,
                    ctaLink: `/blog/best-brokers-in-${country.slug}`,
                    brokers: ["Exness", "Deriv"],
                    payments: country.payments,
                    slug: country.slug,
                }}
            />

            {/* =========================================================
         🔥 MONEY SECTION (NEW — HIGH IMPACT)
      ========================================================= */}

            <section className="max-w-4xl mx-auto py-20 px-6">

                {/* 🔥 INTRO */}
                <p className="text-gray-400 mb-6 text-center">
                    Discover the best forex brokers in {country.name} with fast withdrawals,
                    low spreads, and beginner-friendly platforms.
                </p>

                {/* 🔥 CTA ABOVE THE FOLD */}
                <div className="text-center mb-10">
                    <CTAButton
                        broker="exness"
                        country={country.slug}
                        text={`Start Trading in ${country.name}`}
                        className="inline-block bg-yellow-400 text-black px-5 py-3 rounded-lg font-semibold"
                    />
                </div>

                {/* 🔥 BROKER LIST */}
                <div className="space-y-6 mb-12">
                    <h2 className="text-xl font-semibold text-center">
                        Top Brokers in {country.name}
                    </h2>

                    {brokers.map((b) => (
                        <BrokerCard
                            key={b.slug}
                            broker={b}
                            country={country.slug}
                        />
                    ))}
                </div>

                {/* 🔥 TRUST / FEATURES */}
                <div className="space-y-4 mb-10 text-center">
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

                {/* 🔥 FINAL CTA */}
                <div className="text-center mt-12">
                    <CTAButton
                        broker="exness"
                        country={country.slug}
                        text="Open Account Now"
                        className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold"
                    />
                </div>

            </section>

            {/* 🔗 INTERNAL SEO */}
            <section className="text-center py-16 px-6">
                <p className="text-gray-400 mb-4">
                    Explore more trading guides
                </p>

                <a href="/blog" className="btn-outline">
                    View All Forex Guides
                </a>
            </section>

        </main>
    );
}