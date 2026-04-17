"use client";

import { useState, useMemo } from "react";
import { getTopBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";
import type { Broker, CountryCode } from "@/lib/types/broker";

const BROKER_COUNTRIES = new Set<CountryCode>([
    "TZ",
    "KE",
    "NG",
    "ZA",
    "UG",
    "GH",
    "GLOBAL",
]);

function toBrokerCountry(code?: string | null): CountryCode {
    return code && BROKER_COUNTRIES.has(code as CountryCode)
        ? (code as CountryCode)
        : "GLOBAL";
}

export default function SearchClient() {
    const [query, setQuery] = useState("");

    /* 🌍 GEO CONTEXT (SMART MOVE) */
    const geo = resolveGeo();

    /* 🔥 SOURCE (NOW GEO-AWARE) */
    const brokers: Broker[] = getTopBrokers(toBrokerCountry(geo.country), 10);

    /* 🔍 FILTER + SCORING */
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) return brokers.slice(0, 10); // top results default

        return brokers
            .map((b) => {
                let score = 0;

                /* 🔥 SMART MATCHING */
                if (b.name.toLowerCase().includes(q)) score += 5;
                if (b.slug.toLowerCase().includes(q)) score += 3;

                if (
                    b.category.some((c) =>
                        c.toLowerCase().includes(q)
                    )
                )
                    score += 2;

                /* 🔥 PRIORITY BOOST (IMPORTANT) */
                if (geo.brokers.includes(b.slug)) score += 4;

                return { ...b, score };
            })
            .filter((b) => b.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // limit results
    }, [query, brokers, geo]);

    return (
        <div className="max-w-3xl mx-auto py-10 px-4 text-white">

            {/* 🔍 INPUT */}
            <input
                type="text"
                placeholder="Search brokers (e.g. Exness, MT5, low spread...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 rounded-lg bg-black border border-gray-700 mb-6 outline-none focus:border-yellow-400"
            />

            {/* 🔥 RESULTS */}
            <div className="space-y-4">
                {results.length === 0 ? (
                    <p className="text-gray-500">
                        No brokers found. Try different keywords.
                    </p>
                ) : (
                    results.map((b, i) => (
                        <div
                            key={b.slug}
                            className="p-4 border border-gray-700 rounded-lg hover:border-yellow-400 transition"
                        >
                            {/* 🔥 RANK */}
                            <div className="text-xs text-gray-500 mb-1">
                                #{i + 1} recommended
                            </div>

                            <h3 className="font-semibold text-lg">
                                {b.name}
                            </h3>

                            <p className="text-sm text-gray-400 mb-2">
                                {b.category.join(", ")}
                            </p>

                            {/* 🔥 CTA (VERY IMPORTANT) */}
                            <a
                                href={b.url}
                                target="_blank"
                                className="inline-block mt-2 text-sm bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
                            >
                                Trade Now
                            </a>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
