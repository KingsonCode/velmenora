import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import {
    CATEGORY_CONFIG,
    type BlogCategory,
    isValidBlogCategory,
    getCategorySeoTitle,
    getCategorySeoDescription,
} from "@/lib/blog/categories";
import { buildCategoryContent } from "@/lib/blog/contents";
import { filterBrokers } from "@/lib/blog/filterBrokers";
import { isValidLang, type Lang } from "@/lib/i18n";
import type { Broker, CountryCode } from "@/lib/types/broker";

type Params = Promise<{
    lang: string;
    category: string;
}>;

/* =========================================
   STATIC CONTROL
========================================= */

export const dynamicParams = false;
export const revalidate = 3600;

/* =========================================
   HELPERS
========================================= */

function getBaseUrl() {
    return process.env.NEXT_PUBLIC_BASE_URL || "https://www.velmenora.com";
}

function getRelatedLinks(lang: Lang, category: BlogCategory) {
    const links: Array<{ href: string; label: string }> = [
        { href: `/${lang}/blog/ecn-brokers`, label: "Best ECN Forex Brokers" },
        { href: `/${lang}/blog/low-spread-brokers`, label: "Lowest Spread Forex Brokers" },
        { href: `/${lang}/blog/high-leverage-brokers`, label: "High Leverage Forex Brokers" },
        {
            href: `/${lang}/blog/best-forex-brokers-for-beginners`,
            label: "Best Forex Brokers for Beginners",
        },
        {
            href: `/${lang}/blog/fast-withdrawal-forex-brokers`,
            label: "Fast Withdrawal Forex Brokers",
        },
    ];

    return links.filter((item) => !item.href.endsWith(`/${category}`));
}

function getCompareHref(lang: Lang, a: string, b: string) {
    return `/${lang}/compare/${a}-vs-${b}`;
}

function formatFeatureLabel(feature: string) {
    return feature
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function getBrokerBadge(broker: Broker): string {
    const maybeBadge = (broker as Broker & { badge?: string }).badge;
    return maybeBadge || "Trusted broker for active traders";
}

async function getCountryContext(): Promise<{
    countryCode: CountryCode | null;
    countryName: string | null;
}> {
    return {
        countryCode: null,
        countryName: null,
    };
}

/* =========================================
   STATIC PARAMS
========================================= */

export async function generateStaticParams() {
    const langs: Lang[] = ["en", "de", "fr", "ar"];
    const categories = Object.keys(CATEGORY_CONFIG) as BlogCategory[];

    return langs.flatMap((lang) =>
        categories.map((category) => ({
            lang,
            category,
        }))
    );
}

/* =========================================
   METADATA
========================================= */

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const { lang, category } = await params;

    if (!isValidLang(lang) || !isValidBlogCategory(category)) {
        return {};
    }

    const { countryName } = await getCountryContext();
    const config = CATEGORY_CONFIG[category];

    const title = `${getCategorySeoTitle(category, countryName ?? undefined)} | Velmenora`;
    const description = getCategorySeoDescription(category, countryName ?? undefined);
    const canonical = `/${lang}/blog/${category}`;

    return {
        title,
        description,
        keywords: [config.seo.primaryKeyword, ...config.seo.secondaryKeywords],
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

/* =========================================
   PAGE
========================================= */

export default async function CategoryPage({
    params,
}: {
    params: Params;
}) {
    const { lang, category } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    if (!isValidBlogCategory(category)) {
        notFound();
    }

    const config = CATEGORY_CONFIG[category];
    const { countryCode, countryName } = await getCountryContext();

    const brokers = filterBrokers({
        ...config.filter,
        ...(countryCode ? { country: countryCode } : {}),
        limit: 6,
        allowFallback: true,
    });

    if (!brokers.length) {
        notFound();
    }

    const primaryBroker = brokers[0];
    if (!primaryBroker) {
        notFound();
    }

    const content = buildCategoryContent(category, countryName ?? undefined);
    const relatedLinks = getRelatedLinks(lang, category);
    const baseUrl = getBaseUrl();
    const pageUrl = `${baseUrl}/${lang}/blog/${category}`;
    const topThree = brokers.slice(0, 3);

    const pageTitle = getCategorySeoTitle(category, countryName ?? undefined);
    const pageDescription = getCategorySeoDescription(category, countryName ?? undefined);

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: pageTitle,
        description: pageDescription,
        mainEntityOfPage: pageUrl,
        keywords: [content.seo.primaryKeyword, ...content.seo.secondaryKeywords].join(", "),
        author: {
            "@type": "Organization",
            name: "Velmenora",
        },
        publisher: {
            "@type": "Organization",
            name: "Velmenora",
            url: baseUrl,
        },
    };

    const faqSchema =
        content.faq.length > 0
            ? {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: content.faq.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: faq.answer,
                    },
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
            {
                "@type": "ListItem",
                position: 3,
                name: content.title,
                item: pageUrl,
            },
        ],
    };

    return (
        <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* HERO */}
            <section className="mb-16">
                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300 mb-5">
                    {content.seo.primaryKeyword}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    {content.heroTitle}
                </h1>

                <p className="text-gray-400 max-w-3xl text-lg leading-relaxed">
                    {content.heroDescription}
                </p>
            </section>

            {/* TOP PICKS */}
            <section className="mb-20">
                <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                    <h2 className="text-2xl md:text-3xl font-semibold">Top Picks</h2>

                    <Link
                        href={`/${lang}/brokers`}
                        className="text-sm text-gray-300 hover:text-white transition"
                    >
                        View all brokers →
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {brokers.map((broker, index) => (
                        <article
                            key={broker.slug}
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <span className="text-xs uppercase tracking-wide text-gray-400">
                                    #{index + 1} Pick
                                </span>

                                <span className="text-sm text-gray-300">
                                    {broker.rating ?? "—"} ⭐
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold mb-2">{broker.name}</h3>

                            <p className="text-sm text-gray-400 mb-4">
                                {getBrokerBadge(broker)}
                            </p>

                            {broker.features?.length ? (
                                <div className="flex flex-wrap gap-2 mb-5">
                                    {broker.features.slice(0, 4).map((feature) => (
                                        <span
                                            key={feature}
                                            className="text-xs rounded-full border border-white/10 px-2.5 py-1 text-gray-300"
                                        >
                                            {formatFeatureLabel(feature)}
                                        </span>
                                    ))}
                                </div>
                            ) : null}

                            <div className="flex gap-3 flex-wrap">
                                <Link
                                    href={`/${lang}/brokers/${broker.slug}`}
                                    className="inline-block border border-white/15 px-4 py-2 rounded-lg"
                                >
                                    Read Review
                                </Link>

                                <Link
                                    href={`/go/${broker.slug}`}
                                    className="inline-block bg-white text-black px-4 py-2 rounded-lg font-medium"
                                >
                                    Trade Now
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* INTRO + CONTENT SECTIONS */}
            <section className="prose prose-invert max-w-none mb-20">
                <h2>Introduction</h2>
                <p>{content.intro}</p>

                {content.sections.map((section) => (
                    <div key={section.title}>
                        <h3>{section.title}</h3>
                        {section.body.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                ))}

                <h3>Key Factors to Evaluate</h3>
                <ul>
                    {content.factors.map((factor) => (
                        <li key={factor}>{factor}</li>
                    ))}
                </ul>

                <h3>Why This Category Matters</h3>
                <p>
                    This page is built around the primary keyword{" "}
                    <strong>{content.seo.primaryKeyword}</strong> and related search intent.
                    Instead of reviewing brokers in a general way, it narrows the selection
                    to the conditions traders usually care about most for this specific category.
                </p>
            </section>

            {/* QUICK COMPARES */}
            {topThree.length >= 2 && (
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                        Popular Comparisons
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {topThree[0] && topThree[1] && (
                            <Link
                                href={getCompareHref(lang, topThree[0].slug, topThree[1].slug)}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
                            >
                                <div className="text-lg font-medium mb-1">
                                    {topThree[0].name} vs {topThree[1].name}
                                </div>
                                <div className="text-sm text-gray-400">
                                    Compare platforms, spreads, trust, and overall trading conditions.
                                </div>
                            </Link>
                        )}

                        {topThree[0] && topThree[2] && (
                            <Link
                                href={getCompareHref(lang, topThree[0].slug, topThree[2].slug)}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
                            >
                                <div className="text-lg font-medium mb-1">
                                    {topThree[0].name} vs {topThree[2].name}
                                </div>
                                <div className="text-sm text-gray-400">
                                    See which broker fits your trading priorities better.
                                </div>
                            </Link>
                        )}

                        {topThree[1] && topThree[2] && (
                            <Link
                                href={getCompareHref(lang, topThree[1].slug, topThree[2].slug)}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
                            >
                                <div className="text-lg font-medium mb-1">
                                    {topThree[1].name} vs {topThree[2].name}
                                </div>
                                <div className="text-sm text-gray-400">
                                    A fast side-by-side comparison for active traders.
                                </div>
                            </Link>
                        )}
                    </div>
                </section>
            )}

            {/* CTA BLOCK */}
            <section className="mb-20 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                    {content.cta.title}
                </h2>

                <p className="text-gray-400 max-w-2xl mb-6">{content.cta.description}</p>

                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/go/${primaryBroker.slug}`}
                        className="inline-block bg-white text-black px-5 py-3 rounded-lg font-medium"
                    >
                        {content.cta.primaryLabel}
                    </Link>

                    <Link
                        href={`/${lang}/brokers/${primaryBroker.slug}`}
                        className="inline-block border border-white/15 px-5 py-3 rounded-lg"
                    >
                        {content.cta.secondaryLabel}
                    </Link>
                </div>
            </section>

            {/* RELATED GUIDES */}
            <section className="mb-20">
                <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                    Related Broker Guides
                </h2>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {relatedLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06] transition"
                        >
                            <div className="font-medium">{item.label}</div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            {content.faq.length > 0 && (
                <section className="mb-20">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {content.faq.map((faq) => (
                            <article
                                key={faq.question}
                                className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                            >
                                <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                                <p className="text-gray-400">{faq.answer}</p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {/* FINAL SEO SECTION */}
            <section className="prose prose-invert max-w-none">
                <h2>Final Thoughts</h2>

                {content.finalThoughts.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </section>
        </main>
    );
}