import { notFound } from "next/navigation";
import Link from "next/link";
import type { CountryCode } from "@/lib/types/broker";

import { getPost, getAllPostsData } from "@/lib/blog/posts";
import { generateProgrammaticPost } from "@/lib/blog/programmaticEngine";
import { generateAllSlugs } from "@/lib/blog/keywords";

/* 🔥 COMPONENTS */
import CTAButton from "@/components/CTAButton";
import BrokerCard from "@/components/BrokerCard";

/* ✅ NEW SOURCE OF TRUTH */
import { getAllBrokers } from "@/lib/brokers";

/* 🔥 ENGINES */
import { injectInternalLinks } from "@/lib/blog/internalLinks";
import { injectBrokerCards } from "@/lib/blog/brokerCards";

const BLOG_COUNTRY_TO_CODE: Record<string, CountryCode> = {
    global: "GLOBAL",
    tanzania: "TZ",
    kenya: "KE",
    nigeria: "NG",
    "south-africa": "ZA",
    uganda: "UG",
    ghana: "GH",
};

/* =========================================================
   🔥 SSG
========================================================= */
export async function generateStaticParams() {
    return generateAllSlugs().map((slug) => ({ slug }));
}

/* =========================================================
   🔥 SEO METADATA
========================================================= */
export async function generateMetadata({ params }: any) {
    let post = getPost(params.slug);

    if (!post) {
        post = generateProgrammaticPost(params.slug);
    }

    if (!post) {
        return { title: "Article Not Found" };
    }

    return {
        title: `${post.title} (2026 Guide)`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            url: `https://velmenora.com/blog/${post.slug}`,
            siteName: "Velmenora",
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */
export default function BlogPostPage({ params }: any) {
    let post = getPost(params.slug);

    if (!post) {
        post = generateProgrammaticPost(params.slug);
    }

    if (!post) return notFound();

    const allPosts = getAllPostsData();

    const related = allPosts
        .filter((p) => p.slug !== post.slug)
        .slice(0, 3);

    const country = post.country || "global";
    const brokerCountry = BLOG_COUNTRY_TO_CODE[country] ?? "GLOBAL";
    const slug = post.slug;

    /* ================= CONTENT PIPELINE ================= */

    let html = post.content || "";

    html = injectInternalLinks(html, country);
    html = injectBrokerCards(html, slug, country);

    /* ================= BROKERS (FIXED) ================= */

    const brokers = getAllBrokers();

    const broker = brokers.find((b) => b.slug === slug);

    /* ========================================================= */

    return (
        <main className="bg-[#0B0F14] text-white">

            {/* BACK */}
            <div className="max-w-3xl mx-auto px-6 pt-10">
                <Link
                    href="/blog"
                    className="text-sm text-gray-400 hover:text-white"
                >
                    ← Back to Blog
                </Link>
            </div>

            <article className="max-w-3xl mx-auto px-6 py-16">

                {/* TITLE */}
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                    {post.title}
                </h1>

                {/* DESCRIPTION */}
                <p className="text-lg text-gray-400 mb-8">
                    {post.description}
                </p>

                {/* TOP CTA */}
                <div className="mb-10 p-6 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <p className="font-semibold mb-3">
                        🚀 Start Trading with Trusted Brokers
                    </p>

                    <CTAButton
                        broker="exness"
                        country={country}
                        text="Compare Brokers →"
                    />
                </div>

                {/* 🔥 BROKER GRID */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">
                        Recommended Brokers
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {brokers.map((b, i) => (
                            <BrokerCard
                                key={b.slug}
                                broker={b}
                                country={brokerCountry}
                                rank={i + 1}
                                allBrokers={brokers}
                            />
                        ))}
                    </div>
                </section>

                {/* CONTENT */}
                <article
                    className="prose prose-invert max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: html }}
                />

                {/* MID CTA */}
                <div className="mb-12 p-6 bg-white/5 border border-white/10 rounded-xl text-center">
                    <h3 className="text-xl font-semibold mb-2">
                        ⚡ Open Your Trading Account
                    </h3>

                    <CTAButton
                        broker="exness"
                        country={country}
                        text="Open Account →"
                    />
                </div>

                {/* RELATED */}
                <section className="mt-16">
                    <h3 className="text-xl font-semibold mb-6">
                        Related Articles
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        {related.map((p) => (
                            <Link
                                key={p.slug}
                                href={`/blog/${p.slug}`}
                                className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                            >
                                <h4 className="text-sm font-semibold line-clamp-2">
                                    {p.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="mt-16 text-center p-10 bg-blue-500/10 rounded-xl border border-blue-500/30">
                    <h3 className="text-2xl font-semibold mb-3">
                        💰 Ready to Trade Forex?
                    </h3>

                    <p className="text-gray-400 mb-6">
                        Compare top brokers and start trading today.
                    </p>

                    <CTAButton
                        broker="exness"
                        country={country}
                        text="Compare Brokers →"
                    />
                </section>

            </article>
        </main>
    );
}
