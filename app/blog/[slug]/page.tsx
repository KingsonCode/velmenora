import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsData, getPost } from "@/lib/blog/posts";
import { getRandomSlugs } from "@/lib/blog/programmaticEngine";

export const revalidate = 3600;

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

    return [...manualPosts, ...sampledProgrammatic];
}

/* ================= SEO ================= */
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = getPost(slug);

    if (!post) {
        return {
            title: "Blog Post Not Found | Velmenora",
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
    const canonical = `https://www.velmenora.com/blog/${post.slug}`;

    return {
        title,
        description,
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
    const post = getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050816] text-white">
            {/* HERO */}
            <section className="relative border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_30%)]" />

                <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
                    {/* BREADCRUMB */}
                    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-6">
                        <Link
                            href="/"
                            className="hover:text-yellow-300 transition"
                        >
                            Home
                        </Link>
                        <span>/</span>
                        <Link
                            href="/blog"
                            className="hover:text-yellow-300 transition"
                        >
                            Blog
                        </Link>
                        <span>/</span>
                        <span className="text-gray-500 truncate max-w-[220px] md:max-w-none">
                            {post.title}
                        </span>
                    </nav>

                    {/* EYEBROW */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300 mb-6">
                        <span className="h-2 w-2 rounded-full bg-yellow-300" />
                        Forex Guide
                    </div>

                    {/* TITLE */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* DESCRIPTION */}
                    {post.description ? (
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-8">
                            {post.description}
                        </p>
                    ) : null}

                    {/* META */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                        {post.date ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                                Updated: {post.date}
                            </span>
                        ) : null}

                        {post.country ? (
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                                Market: {post.country}
                            </span>
                        ) : null}

                        {post.type ? (
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
            <section className="max-w-4xl mx-auto px-6 py-12 md:py-16">
                <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
                    {/* ARTICLE */}
                    <article className="min-w-0">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl p-6 md:p-10">
                            {post.content ? (
                                <div
                                    className="
                                        prose prose-invert max-w-none
                                        prose-headings:text-white
                                        prose-headings:scroll-mt-24
                                        prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
                                        prose-h3:text-xl prose-h3:font-semibold
                                        prose-p:text-gray-300 prose-p:leading-8
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
                            <h2 className="text-2xl font-bold mb-3">
                                Ready to compare brokers?
                            </h2>

                            <p className="text-gray-300 mb-6 max-w-2xl">
                                Explore broker comparisons, trading guides, and market-focused content built to help traders choose better platforms.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href="/compare"
                                    className="inline-flex items-center justify-center rounded-xl bg-yellow-400 text-black px-6 py-3 font-semibold hover:scale-[1.02] transition"
                                >
                                    Compare Brokers
                                </Link>

                                <Link
                                    href="/blog"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold hover:bg-white/10 transition"
                                >
                                    More Guides
                                </Link>
                            </div>
                        </div>
                    </article>

                    {/* SIDEBAR */}
                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Quick Navigation
                            </h3>

                            <div className="space-y-3 text-sm">
                                <Link
                                    href="/blog"
                                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 hover:text-yellow-300 hover:bg-white/10 transition"
                                >
                                    All Trading Guides
                                </Link>

                                <Link
                                    href="/compare"
                                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 hover:text-yellow-300 hover:bg-white/10 transition"
                                >
                                    Broker Comparison
                                </Link>

                                <Link
                                    href="/brokers"
                                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-gray-300 hover:text-yellow-300 hover:bg-white/10 transition"
                                >
                                    Browse Brokers
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-yellow-400/15 bg-yellow-400/5 p-6">
                            <h3 className="text-lg font-semibold mb-3 text-yellow-200">
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
    );
}