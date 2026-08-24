import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsData, getPost } from "@/lib/blog/posts";
import { getRandomSlugs } from "@/lib/blog/programmaticEngine";

export const revalidate = 3600;

/* ================= CATEGORY HELPERS ================= */
const CATEGORY_SLUGS = new Set([
    "best-forex-brokers",
    "ecn-brokers",
    "low-spread-brokers",
    "high-leverage-brokers",
    "best-forex-brokers-for-beginners",
    "fast-withdrawal-forex-brokers",
]);

function isCategorySlug(slug: string) {
    return CATEGORY_SLUGS.has(slug);
}

function formatCategoryTitle(slug: string) {
    return slug
        .replaceAll("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

function generateCategoryContent(slug: string) {
    const title = formatCategoryTitle(slug);

    return `
        <h2>Top ${title}</h2>
        <p>
            This page highlights the best ${title} based on trading conditions,
            spreads, execution speed, and overall trader experience.
        </p>

        <h2>What to Look For</h2>
        <ul>
            <li>Low spreads and commissions</li>
            <li>Fast withdrawals</li>
            <li>Reliable regulation</li>
            <li>Strong trading platforms (MT4, MT5, cTrader)</li>
        </ul>

        <h2>Why This Matters</h2>
        <p>
            Choosing the right broker can significantly impact your trading
            performance, especially in volatile forex markets.
        </p>

        <h2>Compare Brokers</h2>
        <p>
            Use our comparison tools to evaluate brokers side by side and
            find the best match for your trading strategy.
        </p>
    `;
}

function getFallbackCategoryPost(slug: string) {
    if (!isCategorySlug(slug)) return null;

    return {
        slug,
        title: formatCategoryTitle(slug),
        description:
            "Compare top forex brokers based on trading conditions, spreads, and features.",
        content: generateCategoryContent(slug),
        type: "category",
        image: "/og-default.jpg",
    };
}

/* ================= STATIC PATHS ================= */
export async function generateStaticParams() {
    const manualPosts = getAllPostsData()
        .filter((post) => !post.country)
        .map((post) => ({
            slug: post.slug,
        }));

    const sampledProgrammatic = getRandomSlugs(100).map((slug) => ({
        slug,
    }));

    const categoryPages = Array.from(CATEGORY_SLUGS).map((slug) => ({
        slug,
    }));

    return [...manualPosts, ...sampledProgrammatic, ...categoryPages];
}

/* ================= SEO ================= */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const post = getPost(slug) || getFallbackCategoryPost(slug);

    if (!post) {
        return {
            title: {
                absolute: "Blog Post Not Found | Velmenora",
            },
            description: "The requested blog post could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const title = `${post.title} | Velmenora`;
    const description =
        post.description || "Forex trading guides and broker comparisons.";
    const image = post.image || "/og-default.jpg";
    const canonical = `https://velmenora.com/blog/${post.slug}`;

    return {
        title: { absolute: title },
        description,
        authors: [
            {
                name: "Velmenora Research",
                url: "https://velmenora.com/",
            },
        ],
        publisher: "Velmenora",
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "Velmenora",
            type: "article",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}

/* ================= PAGE ================= */
export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    let post = getPost(slug);

    /* ================= HANDLE CATEGORY PAGES ================= */
    if (!post) {
        post = getFallbackCategoryPost(slug);
    }

    if (!post) {
        notFound();
    }

    const canonical =
        `https://velmenora.com/blog/${post.slug}`;

    const postImage =
        "image" in post &&
        typeof post.image === "string" &&
        post.image
            ? post.image
            : "/og-default.jpg";

    const absoluteImage = postImage.startsWith("http")
        ? postImage
        : `https://velmenora.com${postImage.startsWith("/") ? postImage : `/${postImage}`}`;

    const publishedDate =
        "date" in post &&
        typeof post.date === "string" &&
        post.date
            ? post.date
            : undefined;

    const breadcrumbSchema = {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://velmenora.com/",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Blog",
                item: "https://velmenora.com/blog",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: canonical,
            },
        ],
    };

    const primarySchema = isCategorySlug(post.slug)
        ? {
            "@type": "CollectionPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: post.title,
            description:
                post.description ||
                "Forex broker comparisons and trading guides.",
            isPartOf: {
                "@id": "https://velmenora.com/#website",
            },
            breadcrumb: {
                "@id": `${canonical}#breadcrumb`,
            },
            inLanguage: "en",
        }
        : {
            "@type": "BlogPosting",
            "@id": `${canonical}#article`,
            url: canonical,
            headline: post.title,
            description:
                post.description ||
                "Forex trading guides and broker comparisons.",
            image: [absoluteImage],
            datePublished: publishedDate,
            dateModified: publishedDate,
            author: {
                "@type": "Organization",
                "@id": "https://velmenora.com/#organization",
                name: "Velmenora Research",
                url: "https://velmenora.com/",
            },
            publisher: {
                "@id": "https://velmenora.com/#organization",
            },
            mainEntityOfPage: {
                "@id": `${canonical}#webpage`,
            },
            isPartOf: {
                "@id": "https://velmenora.com/#website",
            },
            breadcrumb: {
                "@id": `${canonical}#breadcrumb`,
            },
            inLanguage: "en",
        };

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            primarySchema,
            breadcrumbSchema,
        ],
    };

    return (
        <>
            <script
                id="velmenora-blog-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        structuredData
                    ).replace(/</g, "\\u003c"),
                }}
            />
            <main className="min-h-screen bg-[#050816] text-white">
            {/* HERO */}
            <section className="relative overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_30%)]" />

                <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-24">
                    {/* BREADCRUMB */}
                    <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
                        <Link
                            href="/"
                            className="transition hover:text-yellow-300"
                        >
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href="/blog"
                            className="transition hover:text-yellow-300"
                        >
                            Blog
                        </Link>
                        <span>/</span>
                        <span className="max-w-[220px] truncate text-gray-500 md:max-w-none">
                            {post.title}
                        </span>
                    </nav>

                    {/* EYEBROW */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300">
                        <span className="h-2 w-2 rounded-full bg-yellow-300" />
                        Forex Guide
                    </div>

                    {/* TITLE */}
                    <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                        {post.title}
                    </h1>

                    {/* DESCRIPTION */}
                    {post.description ? (
                        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
                            {post.description}
                        </p>
                    ) : null}

                    {/* META */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        {"date" in post && post.date ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                                Updated: {post.date}
                            </span>
                        ) : null}

                        {"country" in post && post.country ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                                Market: {post.country}
                            </span>
                        ) : null}

                        {"type" in post && post.type ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 uppercase">
                                {post.type}
                            </span>
                        ) : null}

                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                            Velmenora Research
                        </span>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="mx-auto max-w-4xl px-6 py-12 md:py-16">
                <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
                    {/* ARTICLE */}
                    <article className="min-w-0">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-sm md:p-10">
                            {post.content ? (
                                <div
                                    className="
                                        prose prose-invert max-w-none
                                        prose-headings:scroll-mt-24
                                        prose-headings:text-white
                                        prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-bold
                                        prose-h3:text-xl prose-h3:font-semibold
                                        prose-p:leading-8 prose-p:text-gray-300
                                        prose-li:text-gray-300
                                        prose-strong:text-yellow-200
                                        prose-a:text-yellow-300 hover:prose-a:text-yellow-200
                                        prose-blockquote:border-yellow-400/40 prose-blockquote:text-gray-300
                                        prose-ul:marker:text-yellow-300
                                    "
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            ) : (
                                <div className="text-gray-400">
                                    No content available for this post yet.
                                </div>
                            )}
                        </div>

                        {/* BOTTOM CTA */}
                        <div className="mt-10 rounded-3xl border border-yellow-400/15 bg-gradient-to-br from-yellow-400/10 via-white/[0.02] to-transparent p-6 md:p-8">
                            <h2 className="mb-3 text-2xl font-bold">
                                Ready to compare brokers?
                            </h2>

                            <p className="mb-6 max-w-2xl text-gray-300">
                                Explore broker comparisons, trading guides, and
                                market-focused content built to help traders choose
                                better platforms.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/compare"
                                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
                                >
                                    Compare Brokers
                                </Link>

                                <Link
                                    href="/blog"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10"
                                >
                                    More Guides
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* SIDEBAR */}
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="mb-4 text-lg font-semibold">
                                Quick Navigation
                            </h3>

                            <div className="space-y-3 text-sm">
                                <Link
                                    href="/blog"
                                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-yellow-300"
                                >
                                    All Trading Guides
                                </Link>

                                <Link
                                    href="/compare"
                                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-yellow-300"
                                >
                                    Broker Comparison
                                </Link>

                                <Link
                                    href="/brokers"
                                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-yellow-300"
                                >
                                    Browse Brokers
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-yellow-400/15 bg-yellow-400/5 p-6">
                            <h3 className="mb-3 text-lg font-semibold text-yellow-200">
                                Why Velmenora?
                            </h3>

                            <ul className="space-y-3 text-sm text-gray-300">
                                <li>• Market-focused forex education</li>
                                <li>• Broker comparison with clear intent</li>
                                <li>• Content built for real trader decisions</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </section>
            </main>
        </>
    );
}