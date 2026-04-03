import { headers } from "next/headers";
import type { Metadata } from "next";

import CTAButton from "@/components/CTAButton";
import BrokerCard from "@/components/BrokerCard";
import BlogCard from "@/components/BlogCard";

import { getCountryByCode } from "@/lib/countries";
import { getFunnel } from "@/lib/geoFunnel";

import { brokers } from "@/data/brokers";
import { blogPosts } from "@/data/blogPreview";

/* =========================================================
   🔥 SEO (UNCHANGED)
========================================================= */

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const code = h.get("x-vercel-ip-country")?.toLowerCase();

    const country = getCountryByCode(code || "tz");
    const name = country?.name || "Worldwide";

    return {
        title: `Best Forex Brokers in ${name} | Velmenora`,
        description: `Trade forex in ${name} using trusted brokers with fast withdrawals.`,
    };
}

/* =========================================================
   🔥 PAGE
========================================================= */

export default async function Home() {
    const h = await headers();
    const code = h.get("x-vercel-ip-country")?.toUpperCase();

    const country = getCountryByCode(code?.toLowerCase() || "tz");
    const name = country?.name || "Worldwide";

    const funnel = getFunnel(code);

    const featuredPost = blogPosts[0];
    const otherPosts = blogPosts.slice(1);

    /* 🔥 SOCIAL PROOF */
    const names = ["John", "David", "Michael", "James", "Brian"];
    const countries = ["Kenya", "Tanzania", "Nigeria", "Ghana"];
    const amounts = [120, 240, 75, 310, 180];

    const rand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
    const liveEvent = `${rand(names)} from ${rand(countries)} just made $${rand(amounts)}`;

    const ctaText = `Start Trading in ${name} — Limited Spots Available`;

    return (
        <main className="min-h-screen bg-[#0B0F14] text-white relative">

            {/* 🔥 LIVE BAR */}
            <section className="text-center text-xs text-green-400 py-2">
                🟢 {liveEvent} • {Math.floor(Math.random() * 3) + 1} min ago
            </section>

            {/* 🔴 NAVBAR */}
            <header className="w-full border-b border-white/10 bg-[#020617]/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
                    <h1 className="text-lg font-semibold">Velmenora</h1>
                    <CTAButton broker="exness" text={ctaText} />
                </div>
            </header>

            {/* ✅ WRAPPER */}
            <div className="container">

                {/* 🟡 HERO */}
                <section className="text-center py-20 md:py-24">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Best Forex Brokers <span className="text-blue-500">in {name}</span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Trade safely with verified brokers. Fast withdrawals, low spreads.
                    </p>

                    <div className="mt-8">
                        <CTAButton broker="exness" text={ctaText} />
                    </div>

                    <p className="text-xs text-red-400 mt-4">
                        ⏳ Limited bonus spots available
                    </p>
                </section>

                {/* 🧠 WHY */}
                <section className="py-24 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
                        Why Choose Our Recommendations?
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="p-6 border border-white/10 rounded-xl">✔ Verified</div>
                        <div className="p-6 border border-white/10 rounded-xl">✔ Fast Withdrawals</div>
                        <div className="p-6 border border-white/10 rounded-xl">✔ Beginner Friendly</div>
                    </div>
                </section>

                {/* 🏦 BROKERS (FINAL FIXED) */}
                <section className="py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Top Brokers in {name}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-6 md:gap-8 mt-12 max-w-5xl mx-auto">
                        {brokers.map((broker) => (
                            <BrokerCard key={broker.slug} broker={broker} />
                        ))}
                    </div>
                </section>

                {/* 📰 BLOG */}
                <section className="py-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Learn Forex Trading in {name}
                    </h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {otherPosts.map((post: any) => (
                            <BlogCard key={post.slug} post={post} />
                        ))}
                    </div>
                </section>

                {/* 🚀 CTA */}
                <section className="text-center py-24">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Start Trading in {name} Today
                    </h2>

                    <p className="text-gray-400 mt-4 mb-6">
                        Join thousands of traders using trusted platforms.
                    </p>

                    <CTAButton broker="exness" text={ctaText} />

                    <p className="text-xs text-gray-500 mt-3">
                        No signup fees • Start in 2 minutes
                    </p>
                </section>

            </div>

            {/* 🔥 FLOATING SOCIAL PROOF */}
            <div className="fixed bottom-6 left-6 bg-[#020617] border border-white/10 px-4 py-3 rounded-lg text-sm text-green-400 shadow-lg">
                🟢 {liveEvent}
            </div>

        </main>
    );
}