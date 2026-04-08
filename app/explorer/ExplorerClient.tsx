"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers";

/* 🔥 AI CORE */
import { recommendBroker } from "@/lib/ai/recommendBroker";
import AIRecommendation from "@/components/AIRecommendation";

/* 🧠 PERSONALIZATION */
import {
    getPersonalizedScore,
    subscribeProfileUpdate,
} from "@/lib/ai/personalization";

export default function ExplorerClient() {
    const router = useRouter();
    const params = useSearchParams();

    /* ================= STATE ================= */
    const [search, setSearch] = useState(params.get("q") || "");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [minRating, setMinRating] = useState(Number(params.get("rating")) || 0);
    const [maxDeposit, setMaxDeposit] = useState(Number(params.get("deposit")) || 1000);
    const [platform, setPlatform] = useState(params.get("platform") || "All");

    const [sort, setSort] = useState(params.get("sort") || "ai");

    const [compare, setCompare] = useState<string[]>([]);

    /* 🔥 FORCE RE-RENDER (AI LEARNING) */
    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const unsub = subscribeProfileUpdate(() => {
            forceUpdate((n) => n + 1);
        });

        return unsub;
    }, []);

    /* ================= DEBOUNCE ================= */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    /* ================= URL SYNC ================= */
    useEffect(() => {
        const query = new URLSearchParams();

        if (search) query.set("q", search);
        if (minRating) query.set("rating", String(minRating));
        if (maxDeposit !== 1000) query.set("deposit", String(maxDeposit));
        if (platform !== "All") query.set("platform", platform);

        if (sort !== "ai") query.set("sort", sort);

        router.replace(`/explorer?${query.toString()}`);
    }, [search, minRating, maxDeposit, platform, sort, router]);

    /* ================= FILTER + PERSONALIZED SORT ================= */
    const filtered = useMemo(() => {
        let result = brokers.filter((b) => {
            return (
                b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
                b.rating >= minRating &&
                b.minDeposit <= maxDeposit &&
                (platform === "All" || b.platforms.includes(platform))
            );
        });

        /* 🧠 PERSONALIZED AI SORT (🔥 MAIN UPGRADE) */
        if (sort === "ai") {
            result.sort((a, b) => {
                const diff = getPersonalizedScore(b) - getPersonalizedScore(a);
                if (diff !== 0) return diff;

                return b.rating - a.rating; // fallback
            });
        }

        /* ⭐ RATING */
        if (sort === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        }

        /* 💰 DEPOSIT */
        if (sort === "deposit") {
            result.sort((a, b) => a.minDeposit - b.minDeposit);
        }

        return result;
    }, [debouncedSearch, minRating, maxDeposit, platform, sort]);

    /* ================= 🤖 AI RECOMMENDATION ================= */
    const recommended = useMemo(() => {
        return recommendBroker(filtered);
    }, [filtered]);

    /* ================= COMPARE ================= */
    const toggleCompare = (slug: string) => {
        setCompare((prev) => {
            if (prev.includes(slug)) return prev.filter((s) => s !== slug);
            if (prev.length >= 3) return prev;
            return [...prev, slug];
        });
    };

    /* ================= RESET ================= */
    const resetFilters = () => {
        setSearch("");
        setMinRating(0);
        setMaxDeposit(1000);
        setPlatform("All");
        setSort("ai");
    };

    return (
        <section className="min-h-screen bg-black text-white px-4 py-12">

            {/* 🔥 HEADER */}
            <div className="max-w-6xl mx-auto text-center mb-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">
                    🔍 Explore Forex Brokers
                </h1>
                <p className="text-gray-400">
                    Compare brokers, filter features, and choose the best platform.
                </p>
            </div>

            {/* 🧠 FILTER BAR */}
            <div className="sticky top-20 z-40 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl max-w-6xl mx-auto mb-8">

                <div className="grid md:grid-cols-5 gap-4">

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search broker..."
                        className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl"
                    />

                    <select
                        value={minRating}
                        onChange={(e) => setMinRating(Number(e.target.value))}
                        className="bg-white/10 border border-white/20 rounded-xl px-3"
                    >
                        <option value={0}>All Ratings</option>
                        <option value={4}>4★+</option>
                        <option value={4.5}>4.5★+</option>
                    </select>

                    <select
                        value={maxDeposit}
                        onChange={(e) => setMaxDeposit(Number(e.target.value))}
                        className="bg-white/10 border border-white/20 rounded-xl px-3"
                    >
                        <option value={1000}>Any Deposit</option>
                        <option value={10}>Under $10</option>
                        <option value={50}>Under $50</option>
                    </select>

                    <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-xl px-3"
                    >
                        <option value="All">All Platforms</option>
                        <option value="MT4">MT4</option>
                        <option value="MT5">MT5</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-xl px-3"
                    >
                        <option value="ai">🔥 Recommended (AI)</option>
                        <option value="rating">Top Rated</option>
                        <option value="deposit">Lowest Deposit</option>
                    </select>

                </div>

                <div className="mt-3 text-right">
                    <button
                        onClick={resetFilters}
                        className="text-sm text-gray-400 hover:text-white underline"
                    >
                        Reset Filters
                    </button>
                </div>

            </div>

            {/* 🤖 AI RECOMMENDATION */}
            <AIRecommendation data={recommended} />

            {/* 📊 RESULTS */}
            <div className="max-w-6xl mx-auto mb-6 text-gray-400">
                Showing {filtered.length} brokers
            </div>

            {/* 💎 GRID */}
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {filtered.map((broker, i) => (
                    <div key={broker.id} className="relative">

                        <button
                            onClick={() => toggleCompare(broker.slug)}
                            className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full ${compare.includes(broker.slug)
                                    ? "bg-yellow-500 text-black"
                                    : "bg-white/10"
                                }`}
                        >
                            {compare.includes(broker.slug) ? "Selected" : "Compare"}
                        </button>

                        <BrokerCard
                            broker={broker}
                            rank={i + 1}
                            country="tanzania"
                            allBrokers={filtered} // 🔥 IMPORTANT (for badges)
                        />

                    </div>
                ))}

            </div>

            {/* 🚀 COMPARE BAR */}
            {compare.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4 flex justify-between items-center z-50">

                    <span className="text-sm text-gray-300">
                        Comparing {compare.length} brokers
                    </span>

                    <button
                        onClick={() => router.push(`/compare?ids=${compare.join(",")}`)}
                        className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold"
                    >
                        Compare Now →
                    </button>

                </div>
            )}

        </section>
    );
}