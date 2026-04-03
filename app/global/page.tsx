import type { Metadata } from "next";
import CountryHero from "@/components/CountryHero";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Best Forex Brokers Worldwide (2026) | Start Trading Globally",
    description:
        "Discover the best forex brokers worldwide. Trade from anywhere with low spreads, fast withdrawals, and trusted platforms.",
    openGraph: {
        title: "Start Forex Trading Anywhere in the World",
        description:
            "Access global brokers, low spreads, and fast withdrawals no matter where you are.",
        url: "https://yourdomain.com/global",
        type: "website",
    },
};

export default function GlobalPage() {
    return (
        <main className="min-h-screen bg-[#0B0F14] text-white">

            {/* 🌍 HERO (WITH CTA STACK) */}
            <CountryHero
                country="Worldwide"
                title="Start Forex Trading Anywhere in the World"
                description="Access top forex brokers, ultra-low spreads, and instant withdrawals — no matter where you are."
                ctaText="Start Trading Now"
                ctaLink="/blog"
                secondaryCtaText="Learn Forex Basics"
                secondaryCtaLink="/blog"
            />

            {/* 🔥 TRUST SECTION */}
            <section className="max-w-5xl mx-auto px-6 py-16 text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Trade with Trusted Global Brokers
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    We partner with globally recognized forex brokers offering secure platforms,
                    fast execution, and reliable withdrawals.
                </p>
            </section>

            {/* 🔥 BENEFITS */}
            <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
                <div className="bg-[#121a24] p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Low Spreads</h3>
                    <p className="text-gray-400 text-sm">
                        Trade major pairs with competitive spreads and minimal fees.
                    </p>
                </div>

                <div className="bg-[#121a24] p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Fast Withdrawals</h3>
                    <p className="text-gray-400 text-sm">
                        Get your profits quickly with secure and instant withdrawal systems.
                    </p>
                </div>

                <div className="bg-[#121a24] p-6 rounded-xl">
                    <h3 className="font-semibold mb-2">Global Access</h3>
                    <p className="text-gray-400 text-sm">
                        Trade from anywhere — mobile, desktop, or web platforms.
                    </p>
                </div>
            </section>

            {/* 🔥 INTERNAL SEO LINKS */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-xl font-semibold mb-6 text-center">
                    Explore Trading by Region
                </h2>

                <div className="flex flex-wrap justify-center gap-4 text-sm">

                    <Link href="/tz" className="bg-[#121a24] px-4 py-2 rounded-lg hover:bg-[#1a2532]">
                        🇹🇿 Tanzania
                    </Link>

                    <Link href="/ke" className="bg-[#121a24] px-4 py-2 rounded-lg hover:bg-[#1a2532]">
                        🇰🇪 Kenya
                    </Link>

                    <Link href="/ng" className="bg-[#121a24] px-4 py-2 rounded-lg hover:bg-[#1a2532]">
                        🇳🇬 Nigeria
                    </Link>

                </div>
            </section>

            {/* 🔥 MID CTA (SMART ADDITION) */}
            <section className="text-center py-16 px-6">
                <p className="text-gray-400 mb-4">
                    Not sure where to start?
                </p>

                <Link
                    href="/blog"
                    className="btn-outline"
                >
                    Learn Forex Step by Step
                </Link>
            </section>

            {/* 🔥 FINAL CTA (CONVERSION) */}
            <section className="text-center py-20 px-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Ready to Start Trading?
                </h2>

                <p className="text-gray-400 mb-6">
                    Join thousands of traders worldwide using trusted forex platforms.
                </p>

                <Link
                    href="/blog"
                    className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                    Start Trading Now
                </Link>
            </section>

        </main>
    );
}