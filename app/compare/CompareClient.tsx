"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { brokers } from "@/data/brokers";
import BrokerCard from "@/components/BrokerCard";
import CTAButton from "@/components/CTAButton";

export default function CompareClient() {
    const params = useSearchParams();
    const router = useRouter();

    /* ================= URL SELECT ================= */
    const ids = params.get("ids")?.split(",") || [];

    /* ================= FILTER MODE ================= */
    const [filter, setFilter] = useState("selected");

    /* ================= DATA ================= */
    const selected = useMemo(() => {
        if (filter === "selected") {
            return brokers.filter((b) => ids.includes(b.slug));
        }

        let data = [...brokers];

        /* ✅ LOW DEPOSIT (SAFE) */
        if (filter === "lowDeposit") {
            data = data.filter((b) => {
                const minDeposit = Number(b.minDeposit ?? Infinity);
                return minDeposit <= 10;
            });
        }

        /* ✅ HIGH LEVERAGE */
        if (filter === "highLeverage") {
            data = data.filter((b) => {
                const val = parseInt(b.leverage?.split(":")[1] || "0");
                return val >= 1000;
            });
        }

        /* ✅ BEST RATED */
        if (filter === "bestRated") {
            data = data.sort((a, b) => b.rating - a.rating);
        }

        return data.slice(0, 3); // limit to 3
    }, [ids, filter]);

    /* ❌ EMPTY GUARD */
    if (selected.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-3xl font-bold mb-4">
                    No brokers selected
                </h1>

                <button
                    onClick={() => router.push("/explorer")}
                    className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold"
                >
                    Go to Explorer
                </button>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-black text-white px-4 py-12">

            {/* 🔥 HEADER */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                    ⚖️ Compare Forex Brokers
                </h1>

                <p className="text-gray-400">
                    Analyze features, compare platforms, and choose the best broker.
                </p>
            </div>

            {/* 🎛 FILTER MODES */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {[
                    { key: "selected", label: "Selected" },
                    { key: "lowDeposit", label: "Low Deposit" },
                    { key: "highLeverage", label: "High Leverage" },
                    { key: "bestRated", label: "Top Rated" },
                ].map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`px-5 py-2 rounded-xl border transition ${filter === f.key
                                ? "bg-yellow-500 text-black"
                                : "border-white/20 hover:bg-white/10"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* 💎 TOP CARDS */}
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                {selected.map((broker) => (
                    <div
                        key={broker.id}
                        className="p-6 border border-white/10 rounded-xl bg-white/5 text-center"
                    >
                        <h2 className="text-xl font-semibold mb-2">
                            {broker.name}
                        </h2>

                        <p className="text-yellow-400 mb-2">
                            ⭐ {broker.rating}
                        </p>

                        <p className="text-gray-400 text-sm mb-4">
                            {broker.description}
                        </p>

                        <CTAButton
                            broker={broker.slug}
                            country="tanzania"
                            position="compare"
                            text="Open Account"
                            className="block bg-yellow-500 text-black py-3 rounded-xl font-semibold"
                        />
                    </div>
                ))}
            </div>

            {/* 📊 COMPARISON TABLE */}
            <div className="max-w-6xl mx-auto overflow-x-auto">
                <table className="w-full border border-white/10 text-sm">

                    <thead className="bg-white/10">
                        <tr>
                            <th className="p-4 text-left">Feature</th>
                            {selected.map((b) => (
                                <th key={b.id} className="p-4 text-center">
                                    {b.name}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>

                        <tr className="border-t border-white/10">
                            <td className="p-4">Rating</td>
                            {selected.map((b) => (
                                <td key={b.id} className="p-4 text-center text-yellow-400">
                                    ⭐ {b.rating}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-t border-white/10">
                            <td className="p-4">Min Deposit</td>
                            {selected.map((b) => (
                                <td key={b.id} className="p-4 text-center">
                                    ${Number(b.minDeposit ?? 0)}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-t border-white/10">
                            <td className="p-4">Leverage</td>
                            {selected.map((b) => (
                                <td key={b.id} className="p-4 text-center">
                                    {b.leverage}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-t border-white/10">
                            <td className="p-4">Platforms</td>
                            {selected.map((b) => (
                                <td key={b.id} className="p-4 text-center">
                                    {(b.platforms ?? []).join(", ")}
                                </td>
                            ))}
                        </tr>

                        <tr className="border-t border-white/10">
                            <td className="p-4">Key Features</td>
                            {selected.map((b) => (
                                <td key={b.id} className="p-4 text-center">
                                    {(b.features ?? []).slice(0, 3).join(", ")}
                                </td>
                            ))}
                        </tr>

                    </tbody>
                </table>
            </div>

            {/* 🔥 EXTRA GRID */}
            {filter !== "selected" && (
                <div className="max-w-6xl mx-auto mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {selected.map((broker, i) => (
                        <BrokerCard
                            key={broker.id}
                            broker={broker}
                            rank={i + 1}
                            country="tanzania"
                        />
                    ))}
                </div>
            )}

            {/* 🚀 BACK */}
            <div className="text-center mt-12">
                <button
                    onClick={() => router.push("/explorer")}
                    className="px-6 py-3 border border-white/20 rounded-xl hover:bg-white/10"
                >
                    ← Back to Explorer
                </button>
            </div>

        </section>
    );
}