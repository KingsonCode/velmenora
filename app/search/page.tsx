"use client";

import { useSearchParams } from "next/navigation";
import BrokerCard from "@/components/BrokerCard";
import { brokers } from "@/data/brokers"; // ✅ SINGLE SOURCE

/* 🔥 FILTER FUNCTION */
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

export default function SearchPage() {
    const params = useSearchParams();
    const query = params.get("q") || "";

    const results = query ? filterBrokers(query) : [];

    return (
        <div className="min-h-screen bg-dark text-white px-6 py-12">

            {/* HEADER */}
            <div className="max-w-6xl mx-auto mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Search Results
                </h1>

                <p className="text-gray-400">
                    Showing results for:{" "}
                    <span className="text-white font-semibold">"{query}"</span>
                </p>
            </div>

            {/* RESULTS */}
            <div className="max-w-6xl mx-auto">

                {results.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((broker, i) => (
                            <BrokerCard
                                key={broker.id} // ✅ FIXED
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