"use client";

import { useState, useMemo } from "react";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers"; // ✅ SINGLE SOURCE

export default function ComparePage() {
    const [filter, setFilter] = useState("all");

    const filteredBrokers = useMemo(() => {
        let data = [...brokers];

        if (filter === "lowDeposit") {
            data = data.filter((b) => {
                const val = parseFloat(b.minDeposit?.replace("$", "") || "0");
                return val <= 10;
            });
        }

        if (filter === "highLeverage") {
            data = data.filter((b) => {
                const val = parseInt(b.leverage?.split(":")[1] || "0");
                return val >= 1000;
            });
        }

        if (filter === "bestRated") {
            data = [...data].sort((a, b) => b.rating - a.rating);
        }

        return data;
    }, [filter]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-black to-gray-900 text-white px-6 py-20">

            <div className="max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Compare Forex Brokers in Tanzania 🇹🇿
                    </h1>

                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Find the best broker based on spreads, leverage, and deposit requirements.
                    </p>
                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {[
                        { key: "all", label: "All Brokers" },
                        { key: "lowDeposit", label: "Low Deposit" },
                        { key: "highLeverage", label: "High Leverage" },
                        { key: "bestRated", label: "Top Rated" },
                    ].map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-5 py-2 rounded-xl border transition ${filter === f.key
                                    ? "bg-gradient-primary border-transparent text-white shadow-glow"
                                    : "border-white/20 hover:bg-white/10"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBrokers.map((broker, index) => (
                        <BrokerCard
                            key={broker.id} // ✅ FIXED
                            broker={broker}
                            rank={index + 1}
                            country="tanzania"
                        />
                    ))}
                </div>

                {/* TRUST */}
                <div className="flex justify-center flex-wrap gap-6 mt-16 text-sm text-gray-400">
                    <span>✔ Verified Brokers</span>
                    <span>✔ Fast Withdrawals</span>
                    <span>✔ Updated Rankings</span>
                    <span>✔ Beginner Friendly</span>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Start Trading with a Trusted Broker
                    </h2>

                    <p className="text-gray-400 mb-6">
                        Open your account in minutes and start trading today.
                    </p>

                    <a
                        href="/broker/exness"
                        className="bg-gradient-primary px-8 py-4 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transition"
                    >
                        Open Account →
                    </a>

                    <p className="text-gray-500 text-sm mt-4">
                        No fees • Fast withdrawals • Secure platform
                    </p>
                </div>

            </div>
        </div>
    );
}