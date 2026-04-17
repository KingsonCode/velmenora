"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getTopBrokers } from "@/lib/brokers";
import type { Broker } from "@/lib/types/broker";

/* ================= TYPES ================= */
type Props = {
    broker: Broker;
};

/* ================= FILTER ================= */
const FILTER_OPTIONS = [
    { key: "top", label: "Top Picks" },
    { key: "rating", label: "Best Rated" },
] as const;

type FilterType = typeof FILTER_OPTIONS[number]["key"];

function formatSpreads(broker: Broker): string {
    return broker.spreadsFrom != null
        ? `From ${broker.spreadsFrom} pips`
        : "Low spreads";
}

function formatPlatforms(broker: Broker): string {
    return broker.platforms?.length
        ? broker.platforms.join(" / ")
        : "Multiple platforms";
}

/* ================= COMPONENT ================= */
export default function CompareClient({ broker }: Props) {
    const [filter, setFilter] = useState<FilterType>("top");

    /* 🔥 LIGHT DATA ENGINE */
    const brokers = useMemo(() => {
        const list = getTopBrokers(undefined, 6);

        if (filter === "rating") {
            return [...list].sort((a, b) => b.rating - a.rating);
        }

        return list;
    }, [filter]);

    const compareList = useMemo(() => {
        return brokers.filter((b) => b.slug !== broker.slug);
    }, [brokers, broker.slug]);

    const alternatives = compareList.slice(0, 3);

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">

            {/* 🔥 TITLE */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                {broker.name} vs Top Forex Brokers
            </h2>

            <p className="text-center text-gray-400 mb-8">
                Compare spreads, platforms, and performance before choosing your broker.
            </p>

            {/* 🔥 FILTER */}
            <div className="flex justify-center gap-3 mb-10">
                {FILTER_OPTIONS.map((f) => (
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

            {/* 🔥 TOP BROKER (DOMINANT CARD) */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border border-yellow-500 p-8 rounded-2xl mb-10 text-center shadow-lg">

                <p className="text-xs text-yellow-400 mb-2">
                    🔥 TOP RECOMMENDED
                </p>

                <h3 className="text-2xl font-bold mb-2">
                    {broker.name}
                </h3>

                <p className="text-yellow-400 mb-2 text-lg">
                    ⭐ {broker.rating.toFixed(1)} / 5
                </p>

                <p className="text-gray-400 mb-4">
                    {formatSpreads(broker)} • {formatPlatforms(broker)}
                </p>

                {/* 🔥 FEATURES */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {broker.features.slice(0, 3).map((f, i) => (
                        <span
                            key={i}
                            className="text-xs bg-white/10 px-3 py-1 rounded-full"
                        >
                            {f}
                        </span>
                    ))}
                </div>

                {/* 🔥 PRIMARY CTA */}
                <a
                    href={`/go/${broker.slug}?src=compare-top`}
                    className="inline-block bg-yellow-400 text-black px-8 py-4 rounded-xl font-semibold text-lg"
                >
                    Start Trading →
                </a>

                <p className="text-xs text-gray-500 mt-3">
                    ✔ Fast withdrawals • ✔ Trusted broker • ✔ Secure
                </p>
            </div>

            {/* 🔥 QUICK COMPARISON GRID */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
                {alternatives.map((b) => (
                    <div
                        key={b.slug}
                        className="bg-white/5 p-5 rounded-xl text-center hover:bg-white/10 transition"
                    >
                        <h4 className="font-semibold mb-1">{b.name}</h4>

                        <p className="text-sm text-gray-400 mb-2">
                            ⭐ {b.rating.toFixed(1)}
                        </p>

                        <p className="text-xs text-gray-500 mb-3">
                            {formatSpreads(b)}
                        </p>

                        <Link
                            href={`/compare/${broker.slug}-vs-${b.slug}`}
                            className="text-yellow-400 text-sm"
                        >
                            Compare →
                        </Link>
                    </div>
                ))}
            </div>

            {/* 🔥 FULL LIST */}
            <div className="space-y-4 mb-10">
                {compareList.map((b) => (
                    <div
                        key={b.slug}
                        className="bg-white/5 p-5 rounded-xl flex items-center justify-between hover:bg-white/10 transition"
                    >
                        <div>
                            <h4 className="font-semibold">{b.name}</h4>
                            <p className="text-sm text-gray-400">
                                ⭐ {b.rating.toFixed(1)} • {formatSpreads(b)}
                            </p>
                        </div>

                        <div className="flex gap-3">

                            {/* 🔥 COMPARE LINK */}
                            <Link
                                href={`/compare/${broker.slug}-vs-${b.slug}`}
                                className="text-sm text-yellow-400"
                            >
                                Compare
                            </Link>

                            {/* 🔥 CTA */}
                            <a
                                href={`/go/${b.slug}?src=compare-list`}
                                className="bg-white text-black px-4 py-2 rounded-lg text-sm"
                            >
                                Try →
                            </a>

                        </div>
                    </div>
                ))}
            </div>

            {/* 🔥 TABLE (SEO + STRUCTURE) */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm border border-white/10">
                    <thead>
                        <tr className="bg-white/10">
                            <th className="p-3">Broker</th>
                            <th className="p-3">Rating</th>
                            <th className="p-3">Spreads</th>
                            <th className="p-3">Platforms</th>
                        </tr>
                    </thead>

                    <tbody>
                        {[broker, ...compareList].map((b) => (
                            <tr key={b.slug} className="border-t border-white/10">
                                <td className="p-3">{b.name}</td>
                                <td className="p-3">{b.rating}</td>
                                <td className="p-3">{formatSpreads(b)}</td>
                                <td className="p-3">{formatPlatforms(b)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 🔥 FINAL CTA */}
            <div className="text-center mt-12">
                <a
                    href={`/go/${broker.slug}?src=compare-bottom`}
                    className="bg-green-500 px-10 py-4 rounded-xl font-semibold"
                >
                    Open {broker.name} Account →
                </a>
            </div>

        </div>
    );
}
