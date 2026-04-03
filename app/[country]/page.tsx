import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getCountryBySlug, generateSEO } from "@/lib/countries";
import GeoFunnel from "@/components/GeoFunnel";

/* =========================================================
   🔥 SEO (FIXED FOR ASYNC PARAMS)
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

            {/* 🌍 GEO FUNNEL */}
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