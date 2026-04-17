"use client";

import Link from "next/link";

/* ================= TYPES ================= */
type CategoryPost = {
    slug: string;
    title: string;
    description?: string;
    type?: string;
    country?: string;
    date?: string;
};

/* ================= CATEGORY MAP ================= */
const CATEGORY_MAP: Record<string, string> = {
    beginners: "Beginner Guides",
    "low-spread": "Low Spread Brokers",
    "high-leverage": "High Leverage Brokers",
    guides: "Forex Guides",
    best: "Best Brokers",
};

export default function CategoryClient({
    posts,
    type,
    title,
}: {
    posts: CategoryPost[];
    type: string;
    title: string;
}) {
    return (
        <main className="min-h-screen bg-[#050816] text-white">
            {/* HERO */}
            <section className="relative border-b border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.10),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.10),transparent_30%)]" />

                <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
                    <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-300 mb-6">
                        <span className="h-2 w-2 rounded-full bg-yellow-300" />
                        Blog Category
                    </div>

                    <header className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            {title}
                        </h1>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            Explore expert forex guides and discover high-intent content built to help traders choose better brokers and smarter trading paths.
                        </p>
                    </header>
                </div>
            </section>

            {/* CATEGORY NAV */}
            <section className="max-w-6xl mx-auto px-6 pt-10">
                <div className="flex flex-wrap justify-center gap-3">
                    {Object.entries(CATEGORY_MAP).map(([key, label]) => {
                        const isActive = key === type;

                        return (
                            <Link
                                key={key}
                                href={`/blog/category/${key}`}
                                className={`px-4 py-2.5 rounded-full text-sm font-medium border transition ${isActive
                                    ? "bg-yellow-400 text-black border-yellow-300 shadow-lg"
                                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-yellow-300"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* POSTS */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                {posts.length > 0 ? (
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] hover:border-yellow-400/20 transition"
                            >
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-gray-300">
                                        {post.type || "Guide"}
                                    </span>

                                    {post.country ? (
                                        <span className="text-xs text-gray-500 truncate">
                                            {post.country}
                                        </span>
                                    ) : null}
                                </div>

                                <h2 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-yellow-300 transition">
                                    {post.title}
                                </h2>

                                <p className="text-sm text-gray-400 line-clamp-3 leading-6">
                                    {post.description ||
                                        "Learn forex trading and discover the best brokers."}
                                </p>

                                <div className="mt-5 inline-flex items-center text-sm font-medium text-yellow-300 group-hover:text-yellow-200 transition">
                                    Read Guide →
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/[0.03]">
                        <p className="text-gray-400 text-lg">
                            No posts found in this category.
                        </p>
                    </div>
                )}
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-6 pb-16">
                <div className="rounded-3xl border border-yellow-400/15 bg-gradient-to-br from-yellow-400/10 via-white/[0.02] to-transparent p-8 md:p-10 text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                        Ready to Compare Brokers?
                    </h3>

                    <p className="text-gray-300 max-w-2xl mx-auto mb-6 leading-7">
                        Explore broker comparisons, trading guides, and market-focused content designed to help you make stronger trading decisions.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/compare"
                            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 text-black px-8 py-4 font-semibold hover:scale-[1.02] transition"
                        >
                            Compare Brokers
                        </Link>

                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 font-semibold hover:bg-white/10 transition"
                        >
                            View All Guides
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}