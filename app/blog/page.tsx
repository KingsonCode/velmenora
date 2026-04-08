import Link from "next/link";
import { getAllPostsData } from "@/lib/blog/posts";

/* ================= SEO ================= */
export const metadata = {
    title: "Forex Trading Blog | Velmenora",
    description:
        "Learn forex trading, compare brokers, and discover the best platforms in Africa.",
};

/* 🌍 MARKETS (EXPANDABLE) */
const markets = [
    { name: "Tanzania", slug: "tanzania" },
    { name: "Kenya", slug: "kenya" },
    { name: "Nigeria", slug: "nigeria" },
    { name: "South Africa", slug: "south-africa" },
    { name: "Ghana", slug: "ghana" },
];

export default async function BlogPage() {
    const posts = getAllPostsData();

    /* ================= GROUP ================= */
    const byMarket: Record<string, any[]> = {};

    posts.forEach((p: any) => {
        const market = (p.country || "global").toLowerCase();
        if (!byMarket[market]) byMarket[market] = [];
        byMarket[market].push(p);
    });

    /* ================= SORT ================= */
    const sortedMarkets = Object.keys(byMarket).sort((a, b) => {
        if (a === "tanzania") return -1;
        if (b === "tanzania") return 1;
        return a.localeCompare(b);
    });

    return (
        <main className="py-16 space-y-20">

            {/* ================= HERO ================= */}
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Forex Trading Guides 📈
                </h1>

                <p className="text-gray-400 mb-6">
                    Learn how to trade forex, choose trusted brokers, and maximize your profits.
                </p>

                {/* 🔥 CTA ABOVE THE FOLD */}
                <Link
                    href="/compare"
                    className="inline-block px-6 py-3 bg-gradient-primary rounded-xl font-semibold shadow-glow hover:scale-105 transition"
                >
                    Compare Brokers →
                </Link>
            </section>

            {/* ================= MARKETS ================= */}
            <section>
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Popular Markets
                </h2>

                <div className="flex flex-wrap justify-center gap-3">
                    {markets.map((m) => (
                        <Link
                            key={m.slug}
                            href={`/blog/best-brokers-in-${m.slug}`}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition capitalize"
                        >
                            {m.name}
                        </Link>
                    ))}
                </div>
            </section>

            {/* ================= BLOG SECTIONS ================= */}
            <section className="space-y-16">
                {sortedMarkets.map((market) => {
                    const marketPosts = byMarket[market]
                        .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
                        .slice(0, 6);

                    return (
                        <div key={market}>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold capitalize">
                                    {market}
                                </h2>

                                <Link
                                    href={`/blog/best-brokers-in-${market}`}
                                    className="text-sm text-blue-400 hover:underline"
                                >
                                    View all →
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {marketPosts.map((post: any) => (
                                    <Link
                                        key={post.slug}
                                        href={`/blog/${post.slug}`}
                                        className="group p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm text-gray-400 line-clamp-2">
                                                {post.description ||
                                                    `Learn forex trading and brokers in ${market}`}
                                            </p>
                                        </div>

                                        {/* 🔥 MINI CTA */}
                                        <span className="text-xs text-blue-400 mt-4">
                                            Read more →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* ================= CATEGORY SHORTCUT ================= */}
            <section className="text-center">
                <h3 className="text-xl font-semibold mb-4">
                    Explore by Category
                </h3>

                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { slug: "beginners", label: "Beginner Guides" },
                        { slug: "low-spread", label: "Low Spread" },
                        { slug: "high-leverage", label: "High Leverage" },
                    ].map((c) => (
                        <Link
                            key={c.slug}
                            href={`/blog/category/${c.slug}`}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition"
                        >
                            {c.label}
                        </Link>
                    ))}
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="text-center p-10 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-xl border border-blue-500/30">
                <h3 className="text-2xl font-semibold mb-3">
                    🚀 Ready to Start Trading?
                </h3>

                <p className="text-gray-400 mb-6">
                    Compare top forex brokers and open your account today.
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