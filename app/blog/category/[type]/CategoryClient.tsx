// app/blog/category/[type]/CategoryClient.tsx

"use client";

import Link from "next/link";

/* ================= CATEGORY MAP ================= */
const CATEGORY_MAP: Record<string, string> = {
    beginners: "Beginner Guides",
    "low-spread": "Low Spread Brokers",
    "high-leverage": "High Leverage Brokers",
    scalping: "Scalping Brokers",
    regulation: "Regulated Brokers",
};

export default function CategoryClient({
    posts,
    type,
    title,
}: {
    posts: any[];
    type: string;
    title: string;
}) {
    return (
        <main className="py-16">
            {/* HEADER */}
            <header className="text-center mb-14">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

                <p className="text-gray-400 max-w-2xl mx-auto">
                    Explore expert forex guides and find the best brokers for your trading style.
                </p>
            </header>

            {/* CATEGORY NAV */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                    <Link
                        key={key}
                        href={`/blog/category/${key}`}
                        className={`px-4 py-2 rounded-full text-sm border transition ${key === type
                                ? "bg-blue-600 text-white border-blue-500"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                    >
                        {label}
                    </Link>
                ))}
            </div>

            {/* POSTS */}
            {posts.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-6">
                    {posts.map((post: any) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="block p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition group"
                        >
                            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                                {post.title}
                            </h3>

                            <p className="text-sm text-gray-400 line-clamp-2">
                                {post.description ||
                                    "Learn forex trading and discover the best brokers."}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-400">
                        No posts found in this category.
                    </p>
                </div>
            )}

            {/* CTA */}
            <section className="mt-20 text-center p-10 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl border border-blue-500/30">
                <h3 className="text-2xl font-semibold mb-3">
                    🚀 Ready to Start Trading?
                </h3>

                <p className="text-gray-400 mb-6">
                    Compare the best forex brokers and open your account today.
                </p>

                <Link
                    href="/compare"
                    className="inline-block px-8 py-4 bg-gradient-primary rounded-xl font-semibold shadow-glow hover:scale-105 transition"
                >
                    Compare Brokers →
                </Link>
            </section>
        </main>
    );
}