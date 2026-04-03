import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCountryBySlug, generateSEO } from "../lib/countries";
import GeoFunnel from "../components/GeoFunnel";

/* =========================================================
   🔥 SEO
========================================================= */

export async function generateMetadata(
    { params }: { params: { country: string } }
): Promise<Metadata> {
    const country = getCountryBySlug(params.country);

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

export default function CountryPage(
    { params }: { params: { country: string } }
) {
    const country = getCountryBySlug(params.country);

    if (!country) return notFound();

    return (
        <main className="min-h-screen bg-[#0B0F14] text-white">

            {/* 🔥 GEO FUNNEL (FIXED WITH SLUG) */}
            <GeoFunnel
                data={{
                    countryName: country.name,
                    title: `Best Forex Brokers in ${country.name}`,
                    description: `Trade forex in ${country.name} using trusted brokers with fast withdrawals.`,
                    ctaText: `Start Trading in ${country.name}`,
                    ctaLink: `/blog/best-brokers-in-${country.slug}`,
                    brokers: ["Exness", "Deriv"],
                    payments: country.payments,
                    slug: country.slug, // ✅ IMPORTANT FIX
                }}
            />

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