import CompareClient from "@/app/brokers/[broker]/CompareClient";
import { getTopBrokers } from "@/lib/brokers";
import Link from "next/link";

/* ================= PAGE ================= */
export default function ComparePage() {
    /* 🌍 GEO (later unaweza detect automatically) */
    const country = "TZ";

    /* 🔥 GET BROKERS (AI ENGINE) */
    const brokers = getTopBrokers(country, 6);

    const topBroker = brokers[0];
    const others = brokers.slice(1, 6);

    if (!topBroker) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                No brokers available
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#020617] text-white">

            {/* ================= HERO ================= */}
            <section className="text-center py-20 px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Compare Forex Brokers
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto mb-6">
                    Compare the best forex brokers for spreads, execution speed, and reliability.
                    Find the right broker for your trading strategy.
                </p>

                {/* 🔥 TOP CTA */}
                <div className="flex justify-center gap-4 flex-wrap">
                    <a
                        href={`/go/${topBroker.slug}?src=compare-hero`}
                        className="bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold"
                    >
                        Start with {topBroker.name} →
                    </a>

                    <Link
                        href={`/brokers/${topBroker.slug}`}
                        className="px-6 py-4 border border-white/20 rounded-xl"
                    >
                        Read Review
                    </Link>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Trusted by traders • Fast withdrawals • Secure platforms
                </p>
            </section>

            {/* ================= 🔥 MAIN ENGINE ================= */}
            <CompareClient broker={topBroker} />

            {/* ================= 🧠 QUICK COMPARES ================= */}
            <section className="max-w-6xl mx-auto px-6 py-16">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Popular Broker Comparisons
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {others.map((b) => (
                        <Link
                            key={b.slug}
                            href={`/compare/${topBroker.slug}-vs-${b.slug}`}
                            className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 text-center"
                        >
                            <h3 className="font-semibold mb-2">
                                {topBroker.name} vs {b.name}
                            </h3>

                            <p className="text-sm text-gray-400">
                                Compare features & performance
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ================= 🧱 ALL BROKERS ================= */}
            <section className="max-w-6xl mx-auto px-6 pb-20">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    All Top Forex Brokers
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {brokers.slice(0, 9).map((b) => (
                        <Link
                            key={b.slug}
                            href={`/brokers/${b.slug}`}
                            className="bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 text-center"
                        >
                            <h3 className="font-semibold">{b.name}</h3>

                            <p className="text-yellow-400 mt-2">
                                ★ {b.rating.toFixed(1)}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="text-center py-20 border-t border-white/10">

                <h2 className="text-3xl font-bold mb-4">
                    Ready to Start Trading?
                </h2>

                <p className="text-gray-400 mb-6">
                    Choose a trusted broker and begin your trading journey today.
                </p>

                <a
                    href={`/go/${topBroker.slug}?src=compare-bottom`}
                    className="bg-green-500 px-10 py-5 rounded-xl font-semibold"
                >
                    Open Account with {topBroker.name} →
                </a>

            </section>

        </main>
    );
}
