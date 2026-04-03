import { notFound } from "next/navigation";
import Link from "next/link";

import { generateAllSlugs, getPageData } from "@/lib/generate";
import CTAButton from "@/components/CTAButton";

/* =========================================================
   🔥 STATIC GENERATION
========================================================= */
export async function generateStaticParams() {
    return generateAllSlugs().map((item) => ({
        slug: item.slug,
    }));
}

/* =========================================================
   🔥 SEO METADATA (PRO VERSION)
========================================================= */
export function generateMetadata({ params }: { params: { slug: string } }) {
    const data = getPageData(params.slug);

    if (!data) return {};

    return {
        title: `${data.title} (2026 Guide)`,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            url: `https://velmenora.com/blog/${params.slug}`,
            siteName: "Velmenora",
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */
export default function Page({ params }: { params: { slug: string } }) {
    const data = getPageData(params.slug);

    if (!data) return notFound();

    const { country, title, description } = data;

    const ctaText = `Start Trading in ${country.name} — Limited Spots Available`;

    return (
        <main className="bg-[#0B0F14] text-white">

            <article className="max-w-3xl mx-auto px-6 py-20">

                {/* 🟡 TITLE */}
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    {title}
                </h1>

                {/* INTRO */}
                <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                    {description}
                </p>

                {/* 🧠 CONTENT */}
                <div className="space-y-8 text-gray-300 leading-relaxed">

                    <h2 className="text-2xl md:text-3xl font-bold">
                        Is Forex Trading Legal in {country.name}?
                    </h2>

                    <p>
                        Forex trading in <strong>{country.name}</strong> is rapidly growing as more traders gain access to global markets through mobile apps and online platforms.
                    </p>

                    <p>
                        Many traders prefer brokers that support local payment methods and fast withdrawals, making the experience smoother and more reliable.
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold mt-10">
                        Best Broker Recommendation in {country.name}
                    </h2>

                    <p>
                        Based on execution speed, withdrawal reliability, and user experience, Exness remains one of the top broker choices for traders in <strong>{country.name}</strong>.
                    </p>

                    <p>
                        It offers low spreads, instant withdrawals, and supports mobile trading — which makes it ideal for both beginners and advanced traders.
                    </p>

                </div>

                {/* 💰 CTA BLOCK */}
                <div className="mt-14 p-8 bg-[#121a24] border border-white/10 rounded-2xl text-center">
                    <h3 className="text-xl md:text-2xl font-semibold mb-3">
                        Start Trading in {country.name}
                    </h3>

                    <p className="text-gray-400 mb-5">
                        Join thousands of traders using trusted brokers with fast withdrawals.
                    </p>

                    <CTAButton broker="exness" text={ctaText} />

                    <p className="text-xs text-gray-500 mt-3">
                        No signup fees • Start in 2 minutes
                    </p>
                </div>

                {/* 🔗 INTERNAL LINKS (SEO BOOST) */}
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