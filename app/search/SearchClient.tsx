"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers";

/* ================= FILTER ENGINE ================= */
function filterBrokers(query: string) {
    const q = query.toLowerCase();

    return brokers.filter((broker) => {
        return (
            broker.name.toLowerCase().includes(q) ||
            broker.description.toLowerCase().includes(q) ||
            broker.features.some((f) => f.toLowerCase().includes(q))
        );
    });
}

/* ================= SORT ENGINE (HIGH VALUE) ================= */
function sortBrokers(results: any[]) {
    return [...results].sort((a, b) => b.rating - a.rating);
}

export default function SearchClient() {
    const params = useSearchParams();
    const router = useRouter();

    const query = params.get("q") || "";

    /* ================= STATE ================= */
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    /* ================= DEBOUNCE ================= */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 350);

        return () => clearTimeout(timeout);
    }, [query]);

    /* ================= EXACT MATCH REDIRECT ================= */
    useEffect(() => {
        if (!debouncedQuery) return;

        const exact = brokers.find(
            (b) => b.name.toLowerCase() === debouncedQuery.toLowerCase()
        );

        if (exact) {
            router.push(`/broker/${exact.slug}`); // 🔥 MONEY MOVE
        }
    }, [debouncedQuery, router]);

    /* ================= RESULTS ================= */
    const results = useMemo(() => {
        if (!debouncedQuery) return [];

        const filtered = filterBrokers(debouncedQuery);
        return sortBrokers(filtered);
    }, [debouncedQuery]);

    /* ================= TRACK SEARCH ================= */
    useEffect(() => {
        if (!debouncedQuery) return;

        const payload = {
            event: "search_query",
            query: debouncedQuery,
            results: results.length,
            timestamp: new Date().toISOString(),
        };

        console.log(payload);

        // 🔥 future API
        /*
        fetch("/api/track-search", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        */
    }, [debouncedQuery, results.length]);

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-black text-white px-6 py-12">

            {/* 🔎 HEADER */}
            <div className="max-w-6xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    🔎 Search Results
                </h1>

                <p className="text-gray-400">
                    Showing results for:{" "}
                    <span className="text-yellow-400 font-semibold">
                        "{debouncedQuery || "all brokers"}"
                    </span>
                </p>
            </div>

            {/* 🔥 RESULTS */}
            <div className="max-w-6xl mx-auto">
                {results.length > 0 ? (
                    <>
                        {/* 📊 RESULT COUNT */}
                        <p className="text-sm text-gray-500 mb-6">
                            Found {results.length} brokers
                        </p>

                        {/* 🧱 GRID */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((broker, i) => (
                                <BrokerCard
                                    key={broker.id}
                                    broker={broker}
                                    rank={i + 1}
                                    country="tanzania"
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    /* ❌ EMPTY STATE */
                    <div className="text-center py-20">

                        <h2 className="text-2xl font-semibold mb-3">
                            No brokers found
                        </h2>

                        <p className="text-gray-400 mb-6">
                            Try searching for popular brokers below
                        </p>

                        {/* 🔥 SUGGESTIONS */}
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            {["Exness", "Deriv", "XM", "IC Markets"].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => router.push(`/search?q=${item}`)}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition"
                                >
                                    🔎 {item}
                                </button>
                            ))}
                        </div>

                        {/* 🚀 FALLBACK CTA */}
                        <button
                            onClick={() => router.push("/explorer")}
                            className="px-6 py-3 bg-yellow-500 text-black rounded-xl font-semibold"
                        >
                            Browse All Brokers
                        </button>

                    </div>
                )}
            </div>
        </div>
    );
}