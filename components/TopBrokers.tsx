"use client";

import { brokers } from "@/data/brokers";
import CTAButton from "@/components/CTAButton";
import Link from "next/link";

/* 🔥 OPTIONAL: SORT (BEST FIRST) */
const sortedBrokers = [...brokers].sort((a, b) => b.rating - a.rating);

export default function TopBrokers() {
    return (
        <section className="py-24 bg-black text-white">

            <div className="max-w-6xl mx-auto px-4">

                {/* 🔥 HEADER */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        🔥 Top Forex Brokers in Tanzania
                    </h2>

                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Compare the best brokers with fast withdrawals, low spreads,
                        and trusted platforms.
                    </p>
                </div>

                {/* 💎 GRID */}
                <div className="grid md:grid-cols-3 gap-8">

                    {sortedBrokers.slice(0, 6).map((broker, i) => {
                        const isTop = i === 0;

                        return (
                            <div
                                key={broker.id}
                                className={`relative p-6 rounded-2xl border transition ${isTop
                                        ? "border-yellow-400 bg-yellow-500/5 scale-[1.03]"
                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                    }`}
                            >

                                {/* 🏆 BADGE */}
                                {isTop && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                                        🏆 Best Overall
                                    </div>
                                )}

                                {/* 📊 RANK */}
                                <div className="text-sm text-gray-400 mb-2">
                                    #{i + 1} Ranked Broker
                                </div>

                                {/* 🏢 NAME */}
                                <h3 className="text-xl font-semibold mb-2">
                                    {broker.name}
                                </h3>

                                {/* ⭐ RATING */}
                                <p className="text-yellow-400 text-sm mb-2">
                                    ⭐ {broker.rating} Rating
                                </p>

                                {/* 📄 DESCRIPTION */}
                                <p className="text-gray-400 text-sm mb-4">
                                    {broker.description}
                                </p>

                                {/* ✅ FEATURES */}
                                <ul className="text-sm text-gray-300 mb-6 space-y-1">
                                    {broker.features.slice(0, 3).map((f, idx) => (
                                        <li key={idx}>✔ {f}</li>
                                    ))}
                                </ul>

                                {/* 🚀 CTA */}
                                <div className="flex flex-col gap-3">

                                    <CTAButton
                                        broker={broker.slug}
                                        country="tanzania"
                                        position="mid"
                                        text="Open Account"
                                        className="bg-yellow-500 text-black text-center py-3 rounded-xl font-semibold hover:scale-105 transition"
                                    />

                                    <Link
                                        href={`/broker/${broker.slug}`}
                                        className="text-center text-sm text-gray-400 hover:text-white underline"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>
                        );
                    })}

                </div>

                {/* 🔍 VIEW ALL */}
                <div className="text-center mt-12">
                    <Link
                        href="/explorer"
                        className="inline-block px-8 py-4 border border-white/20 rounded-xl hover:bg-white/10 transition"
                    >
                        🔍 View All Brokers
                    </Link>
                </div>

            </div>
        </section>
    );
}