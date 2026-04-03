import { headers } from "next/headers";
import type { Metadata } from "next";

import GeoFunnel from "@/components/GeoFunnel";
import { getCountryByCode } from "@/lib/countries";
import { getFunnel } from "@/lib/geoFunnel";

import CTAButton from "@/components/CTAButton";
import BrokerCard from "@/components/BrokerCard";
import BlogCard from "@/components/BlogCard";

import { brokers } from "@/data/brokers";
import { blogPosts } from "@/data/blogPreview";

/* =========================================================
   🔥 DYNAMIC SEO
========================================================= */

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const code = h.get("x-vercel-ip-country")?.toLowerCase();

    const country = getCountryByCode(code || "tz");
    const name = country?.name || "Worldwide";

    return {
        title: `Best Forex Brokers in ${name} | Velmenora`,
        description: `Trade forex in ${name} using trusted brokers with fast withdrawals.`,
        openGraph: {
            title: `Trade Forex in ${name}`,
            description: `Top brokers available in ${name}`,
            url: "https://velmenora.com",
            type: "website",
        },
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */

export default async function Home() {
    /* 🌍 GEO DETECTION */
    const h = await headers();
    const code = h.get("x-vercel-ip-country")?.toUpperCase();

    const country = getCountryByCode(code?.toLowerCase() || "tz");

    const name = country?.name || "Worldwide";

    /* 🔥 FUNNEL ENGINE */
    const funnel = getFunnel(code);

    /* 📰 BLOG */
    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1);

    return (
        <main className="min-h-screen bg-[#0B0F14] text-white relative">

            {/* 💰 LIVE TICKER */}
            <section className="text-center text-xs text-green-400 py-2">
                🟢 John from Kenya just made $120 • 1 min ago
            </section>

            {/* 🔴 NAVBAR */}
            <header className="w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

                    <h1 className="text-lg font-semibold">Velmenora</h1>

                    <nav className="hidden md:flex gap-6 text-sm text-gray-300">
                        <a href="/">Home</a>
                        <a href="/brokers">Brokers</a>
                        <a href="/blog">Blog</a>
                    </nav>

                    {/* 🌍 COUNTRY SWITCHER */}
                    <select className="hidden md:block bg-[#020617] text-sm border border-white/10 px-2 py-1 rounded">
                        <option value="tz">Tanzania</option>
                        <option value="ke">Kenya</option>
                        <option value="ng">Nigeria</option>
                    </select>

                    <CTAButton broker="exness" />
                </div>
            </header>

            {/* 🟡 HERO */}
            <section className="text-center py-24 px-6">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Best Forex Brokers <span className="text-blue-500">in {name}</span>
                </h1>

                <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
                    Trade safely with verified brokers. Fast withdrawals, low spreads, beginner-friendly platforms.
                </p>

                {/* 🧠 TRUST STACK */}
                <p className="text-xs text-gray-500 mt-4">
                    ✔ Regulated Brokers • ✔ 1M+ Traders • ✔ Secure Trading
                </p>

                <div className="mt-8">
                    <CTAButton broker="exness" />
                </div>
            </section>

            {/* 💎 TRUST BAR */}
            <section className="py-6 border-y border-gray-800 text-center text-sm text-gray-300">
                ✔ Trusted Brokers • ✔ Fast Withdrawals • ✔ Beginner Friendly • ✔ Secure Platform
            </section>

            {/* 🧠 WHY US */}
            <section className="py-20 px-6 text-center">
                <h2 className="text-3xl font-semibold mb-10">
                    Why Choose Our Recommendations?
                </h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-gray-300">
                    <div className="p-6 border border-white/10 rounded-xl">
                        ✔ Verified & regulated brokers
                    </div>
                    <div className="p-6 border border-white/10 rounded-xl">
                        ✔ Instant withdrawals tested
                    </div>
                    <div className="p-6 border border-white/10 rounded-xl">
                        ✔ Beginner-friendly platforms
                    </div>
                </div>
            </section>

            {/* 🏦 BROKERS */}
            <section className="py-24 px-6">
                <h2 className="text-center text-3xl font-semibold mb-12">
                    Top Brokers in {name}
                </h2>

                <div className="broker-grid max-w-5xl mx-auto">
                    {brokers.map((broker, i) => (
                        <div
                            key={broker.slug}
                            className="relative p-4 rounded-xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617]"
                        >

                            {i === 0 && (
                                <span className="absolute top-3 right-3 text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                                    🔥 Top Choice
                                </span>
                            )}

                            <BrokerCard broker={broker} />

                            <p className="text-xs text-gray-500 mt-3 text-center">
                                Regulated • Trusted by millions
                            </p>

                            <p className="text-xs text-gray-400 mt-1 text-center">
                                🔥 {10 + i * 3} traders joined today
                            </p>

                        </div>
                    ))}
                </div>
            </section>

            {/* 📊 COMPARISON TABLE */}
            <section className="py-20 px-6 max-w-6xl mx-auto">
                <h2 className="text-3xl font-semibold text-center mb-10">
                    Compare Top Brokers
                </h2>

                <table className="w-full text-sm text-left border border-white/10">
                    <thead className="bg-[#020617]">
                        <tr>
                            <th className="p-3">Broker</th>
                            <th>Min Deposit</th>
                            <th>Spreads</th>
                            <th>Best For</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t border-white/10">
                            <td className="p-3">Exness</td>
                            <td>$10</td>
                            <td>Low</td>
                            <td>Beginners</td>
                        </tr>
                        <tr className="border-t border-white/10">
                            <td className="p-3">Deriv</td>
                            <td>$5</td>
                            <td>Medium</td>
                            <td>Options Trading</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* 💸 SOCIAL PROOF */}
            <section className="py-6 border-y border-gray-800 text-center text-sm text-green-400">
                💸 Someone from {name} just withdrew $320 • 2 mins ago
            </section>

            {/* 📰 BLOG */}
            <section className="py-24 px-6">

                <h2 className="text-center text-3xl font-semibold mb-12">
                    Learn Forex Trading in {name}
                </h2>

                <div className="max-w-6xl mx-auto space-y-8">

                    {featuredPost && (
                        <a href={`/blog/${featuredPost.slug}`} className="featured-blog">
                            <h3 className="text-2xl font-bold mb-3">
                                {featuredPost.title}
                            </h3>

                            <p className="text-gray-400 max-w-2xl">
                                {featuredPost.excerpt}
                            </p>

                            <span className="text-blue-400 mt-4 inline-block">
                                Read full article →
                            </span>
                        </a>
                    )}

                    <div className="grid md:grid-cols-3 gap-6">
                        {otherPosts.map((post: any) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>

                </div>

                <div className="text-center mt-12">
                    <a
                        href={`/blog/best-brokers-in-${funnel.slug}`}
                        className="btn-outline"
                    >
                        View Best Brokers in {name}
                    </a>
                </div>

            </section>

            {/* 🚀 FINAL CTA */}
            <section className="text-center py-24 px-6">
                <h2 className="text-3xl font-bold">
                    Start Trading in {name} Today
                </h2>

                <p className="text-gray-400 mt-4 mb-6">
                    Join thousands of traders using trusted forex platforms.
                </p>

                <CTAButton broker="exness" />
            </section>

            {/* 🔴 FOOTER */}
            <footer className="border-t border-white/10 py-10 text-center text-sm text-gray-400">
                <p>© 2026 Velmenora. All rights reserved.</p>

                <div className="mt-4 flex justify-center gap-6">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
            </footer>

            {/* 🔥 STICKY CTA */}
            <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
                <div className="bg-blue-600 px-6 py-3 rounded-xl shadow-lg">
                    <CTAButton broker="exness" />
                </div>
            </div>

        </main>
    );
}