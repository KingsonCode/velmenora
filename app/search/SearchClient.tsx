"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers";

/* ================= FILTER FUNCTION ================= */
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

export default function SearchClient() {
    const params = useSearchParams();
    const query = params.get("q") || "";

    /* ================= STATE ================= */
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    /* ================= DEBOUNCE (UX + PERFORMANCE) ================= */
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400); // 🔥 adjust (300–500ms best)

        return () => clearTimeout(timeout);
    }, [query]);

    /* ================= FILTERED RESULTS ================= */
    const results = useMemo(() => {
        if (!debouncedQuery) return [];
        return filterBrokers(debouncedQuery);
    }, [debouncedQuery]);

    /* ================= TRACK SEARCH (DATA GOLD) ================= */
    useEffect(() => {
        if (!debouncedQuery) return;

        const payload = {
            event: "search_query",
            query: debouncedQuery,
            timestamp: new Date().toISOString(),
        };

        console.log(payload);

        /* 🔥 FUTURE: SEND TO API */
        /*
        fetch("/api/track-search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        */
    }, [debouncedQuery]);

    /* ================= UI ================= */
    return (
        <div className="min-h-screen bg-dark text-white px-6 py-12">

            {/* HEADER */}
            <div className="max-w-6xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Search Results
                </h1>

                <p className="text-gray-400">
                    Showing results for:{" "}
                    <span className="text-white font-semibold">
                        "{debouncedQuery}"
                    </span>
                </p>
            </div>

            {/* RESULTS */}
            <div className="max-w-6xl mx-auto">
                {results.length > 0 ? (
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
                ) : (
                    <div className="text-center py-20">

                        <h2 className="text-2xl font-semibold mb-3">
                            No brokers found
                        </h2>

                        <p className="text-gray-400 mb-6">
                            Try searching for popular brokers like Exness, XM or Deriv.
                        </p>

                        {/* QUICK SUGGESTIONS */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {["Exness", "Deriv", "XM"].map((item) => (
                                <a
                                    key={item}
                                    href={`/search?q=${item}`}
                                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}