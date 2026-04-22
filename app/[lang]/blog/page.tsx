import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
    CATEGORY_CONFIG,
    type BlogCategory,
} from "@/lib/blog/categories";

import { buildBlogMetadata } from "@/lib/seo/metadataEngine";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export const revalidate = 3600;

/* =========================================
   HELPERS
========================================= */

function getBaseUrl() {
    return (
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
        process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
        "https://www.velmenora.com"
    );
}

function getCategoryHref(lang: Lang, category: BlogCategory) {
    return `/${lang}/country/blog/${category}`;
}

function getCategoryCards(lang: Lang) {
    const entries = Object.entries(CATEGORY_CONFIG) as Array<
        [BlogCategory, (typeof CATEGORY_CONFIG)[BlogCategory]]
    >;

    return entries.map(([slug, config]) => ({
        slug,
        href: getCategoryHref(lang, slug),
        title: config.heroTitle ?? config.title,
        description: config.heroDescription ?? config.description,
        keyword: config.seo.primaryKeyword,
    }));
}

/* =========================================
   STATIC PARAMS
========================================= */

export async function generateStaticParams() {
    return SUPPORTED_LANGS.map((lang) => ({
        lang,
    }));
}

/* =========================================
   METADATA
========================================= */

export async function generateMetadata({
    params,
}: {
    params: RouteParams;
}): Promise<Metadata> {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        return {};
    }

    return buildBlogMetadata({
        intent: "guide",
        pathname: `/${lang}/blog`,
        keyword: "Forex Broker Guides",
    });
}

/* =========================================
   PAGE
========================================= */

export default async function BlogPage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    const cards = getCategoryCards(lang);
    const baseUrl = getBaseUrl();

    const itemListSchema =
        cards.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: "Forex Broker Guides",
                itemListElement: cards.map((card, index) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    name: card.title,
                    url: `${baseUrl}${card.href}`,
                })),
            }
            : null;

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${baseUrl}/${lang}`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: `${baseUrl}/${lang}/blog`,
            },
        ],
    };

    return (
        <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
            {itemListSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
                />
            )}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <section className="mb-16 text-center">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 mb-5">
                    Forex Broker Guides
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Explore Forex Broker Categories
                </h1>

                <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
                    Browse broker guides built around real trading priorities — from ECN
                    execution and low spreads to fast withdrawals, beginner support, and
                    high leverage options.
                </p>
            </section>

            {cards.length === 0 ? (
                <section className="mb-20">
                    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-12 text-center backdrop-blur-sm">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.18em] text-gray-400 mb-6">
                            Blog Hub
                        </div>

                        <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                            No broker guides available right now
                        </h2>

                        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8">
                            The blog hub is available, but broker category cards are currently
                            unavailable. This may be temporary while content or configuration
                            is being updated.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href={`/${lang}`}
                                className="inline-block rounded-lg bg-white px-5 py-3 font-medium text-black"
                            >
                                Back to Home
                            </Link>

                            <Link
                                href={`/${lang}/country/brokers`}
                                className="inline-block rounded-lg border border-white/15 px-5 py-3 font-medium text-white"
                            >
                                View Brokers
                            </Link>
                        </div>
                    </div>
                </section>
            ) : (
                <>
                    <section className="mb-20">
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {cards.map((card) => (
                                <article
                                    key={card.slug}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
                                >
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                                        {card.keyword}
                                    </div>

                                    <h2 className="text-2xl font-semibold mb-3">
                                        {card.title}
                                    </h2>

                                    <p className="text-gray-400 mb-5 leading-relaxed">
                                        {card.description}
                                    </p>

                                    <Link
                                        href={card.href}
                                        className="inline-block bg-white text-black px-4 py-2 rounded-lg font-medium"
                                    >
                                        Read Guide
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mb-20">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                            Popular Broker Guides
                        </h2>

                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {cards.map((card) => (
                                <Link
                                    key={card.slug}
                                    href={card.href}
                                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
                                >
                                    <div className="font-medium mb-1">{card.title}</div>
                                    <div className="text-sm text-gray-400">{card.keyword}</div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </>
            )}

            <section className="prose prose-invert max-w-none mb-20">
                <h2>Why Category-Based Broker Research Matters</h2>

                <p>
                    Not every trader wants the same thing from a broker. Some traders care
                    most about raw spreads and execution speed. Others prioritize low
                    overall trading costs, better beginner support, faster withdrawals, or
                    higher leverage options.
                </p>

                <p>
                    That is why broker research works better when it is organized by real
                    priorities instead of broad generic rankings. Category pages help you
                    focus on the conditions that actually affect your trading experience.
                </p>

                <h3>What You Can Explore Here</h3>
                <ul>
                    <li>Best ECN forex brokers</li>
                    <li>Lowest spread forex brokers</li>
                    <li>High leverage forex brokers</li>
                    <li>Best forex brokers for beginners</li>
                    <li>Fast withdrawal forex brokers</li>
                </ul>
            </section>

            <section className="prose prose-invert max-w-none">
                <h2>Final Thoughts</h2>

                <p>
                    The best broker category for you depends on how you trade. A scalper
                    may care most about execution and spreads. A beginner may need simpler
                    onboarding and stronger education. Another trader may care most about
                    payout reliability.
                </p>

                <p>
                    Start with the category that matches your real priority, then move
                    deeper into broker reviews and comparison pages before making a final
                    decision.
                </p>
            </section>
        </main>
    );
}