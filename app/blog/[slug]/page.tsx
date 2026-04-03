import { notFound } from "next/navigation";
import Link from "next/link";

import { generateAllSlugs, getPageData } from "@/lib/generate";
import CTAButton from "@/components/CTAButton";

/* 🔥 NEW IMPORTS (UPGRADE) */
import { generateContent } from "@/lib/contentEngine";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers";
import FAQ from "@/components/FAQ";
import { getFAQ } from "@/lib/faq";
import { generateFAQSchema } from "@/lib/faqSchema";

/* =========================================================
   🔥 STATIC GENERATION
========================================================= */
export async function generateStaticParams() {
    return generateAllSlugs().map((item) => ({
        slug: item.slug,
    }));
}

/* =========================================================
   🔥 SEO METADATA
========================================================= */
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const data = getPageData(slug);

    if (!data) return {};

    return {
        title: `${data.title} (2026 Guide)`,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            url: `https://velmenora.com/blog/${slug}`,
            siteName: "Velmenora",
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */
export default async function Page(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const data = getPageData(slug);

    if (!data) return notFound();

    const { country, title } = data;

    const content = generateContent(data);
    const faqItems = getFAQ(country.name);
    const faqSchema = generateFAQSchema(faqItems);

    const ctaText = `Start Trading in ${country.name} — Limited Spots Available`;

    return (
        <main className="bg-[#0B0F14] text-white">

            {/* 🔙 BACK BUTTON */}
            <div className="max-w-3xl mx-auto px-6 pt-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
                >
                    ← Back to Home
                </Link>
            </div>

            <article className="max-w-3xl mx-auto px-6 py-20">

                {/* 🟡 TITLE */}
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    {title}
                </h1>

                {/* 🔥 INTRO (DYNAMIC) */}
                <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                    {content.intro}
                </p>

                {/* 💰 CTA TOP */}
                <CTAButton
                    broker="exness"
                    country={country.slug}
                    text={`Start Trading in ${country.name}`}
                    className="inline-block bg-yellow-400 text-black px-5 py-3 rounded-lg font-semibold mb-10"
                />

                {/* 🔥 BROKER SECTION */}
                <div className="space-y-6 mb-12">
                    <h2 className="text-2xl font-bold">
                        {content.sectionTitle}
                    </h2>

                    {brokers.map((b) => (
                        <BrokerCard
                            key={b.slug}
                            broker={b}
                            country={country.slug}
                        />
                    ))}
                </div>

                {/* 🧠 CONTENT */}
                <div className="space-y-8 text-gray-300 leading-relaxed">

                    <p>
                        Traders in <strong>{country.name}</strong> prefer brokers with fast withdrawals,
                        strong regulation, and reliable platforms.
                    </p>

                    <p>
                        Choosing the right broker can significantly impact your trading success,
                        especially in fast-moving forex markets.
                    </p>

                </div>

                {/* 💰 CTA BLOCK (FIXED) */}
                <div className="mt-14 p-8 bg-[#121a24] border border-white/10 rounded-2xl text-center">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3">
                        Start Trading in {country.name}
                    </h3>

                    <p className="text-gray-400 mb-5">
                        Join thousands of traders using trusted brokers with fast withdrawals.
                    </p>

                    <CTAButton
                        broker="exness"
                        country={country.slug}
                        text={ctaText}
                    />

                    <p className="text-xs text-gray-500 mt-3">
                        No signup fees • Start in 2 minutes
                    </p>
                </div>

                {/* 💰 FINAL CTA */}
                <div className="mt-10 text-center">
                    <CTAButton
                        broker="exness"
                        country={country.slug}
                        text="Open Account Now"
                        className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold"
                    />
                </div>

                {/* ❓ FAQ */}
                <FAQ items={faqItems} />

                {/* 🧾 FAQ SCHEMA */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqSchema),
                    }}
                />

                {/* 🔗 INTERNAL LINKS */}
                <div className="mt-16 border-t border-[#1f2a36] pt-8">
                    <h3 className="text-xl font-semibold mb-4">
                        Related Guides
                    </h3>

                    <div className="grid gap-3">

                        <Link
                            href={`/blog/best-brokers-in-${country.slug}`}
                            className="text-blue-400 hover:underline"
                        >
                            Best Brokers in {country.name}
                        </Link>

                        <Link
                            href={`/blog/how-to-trade-in-${country.slug}`}
                            className="text-blue-400 hover:underline"
                        >
                            How to Trade in {country.name}
                        </Link>

                    </div>
                </div>

            </article>

        </main>
    );
}