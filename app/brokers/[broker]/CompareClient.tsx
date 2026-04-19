"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getTopBrokers, getAllBrokers } from "@/lib/brokers";
import type { Broker } from "@/lib/types/broker";

/* ================= TYPES ================= */
type Props = {
    broker: Broker;
    lang: string;
};

/* ================= FILTER ================= */
const FILTER_OPTIONS = [
    { key: "top", label: "Top Picks" },
    { key: "rating", label: "Best Rated" },
] as const;

type FilterType = (typeof FILTER_OPTIONS)[number]["key"];

const allBrokers = getAllBrokers();

/* ================= HELPERS ================= */
function formatSpreads(broker: Broker): string {
    return broker.spreadsFrom != null
        ? `From ${broker.spreadsFrom} pips`
        : "Low spreads";
}

function formatPlatforms(broker: Broker): string {
    const platformFeatures = broker.features?.filter((feature) =>
        ["MT4", "MT5", "cTrader", "TradingView", "WebTrader"].some((p) =>
            feature.toLowerCase().includes(p.toLowerCase())
        )
    );

    if (platformFeatures?.length) {
        return platformFeatures.join(" / ");
    }

    return "Multiple platforms";
}

function formatValue(value: unknown) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
}

/* ================= COMPONENT ================= */
export default function CompareClient({ broker, lang }: Props) {
    const params = useSearchParams();
    const [filter, setFilter] = useState<FilterType>("top");

    const selectedBrokers = useMemo(() => {
        const ids = params.get("ids");

        if (!ids) {
            return [broker];
        }

        const slugs = ids
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 3);

        const matched = slugs
            .map((slug) => allBrokers.find((b) => b.slug === slug))
            .filter((b): b is Broker => Boolean(b));

        if (matched.length === 0) {
            return [broker];
        }

        return matched;
    }, [params, broker]);

    const leadBroker = selectedBrokers[0] ?? broker;

    const brokerPool = useMemo(() => {
        const list = getTopBrokers(undefined, 8);

        if (filter === "rating") {
            return [...list].sort((a, b) => b.rating - a.rating);
        }

        return list;
    }, [filter]);

    const compareList = useMemo(() => {
        return brokerPool.filter(
            (b) => !selectedBrokers.some((selected) => selected.slug === b.slug)
        );
    }, [brokerPool, selectedBrokers]);

    const alternatives = compareList.slice(0, 3);

    const rows = [
        {
            label: "Rating",
            getValue: (b: Broker) => (b.rating ? `★ ${b.rating.toFixed(1)}` : "—"),
        },
        {
            label: "Minimum Deposit",
            getValue: (b: Broker) =>
                b.minDeposit !== undefined ? `$${b.minDeposit}` : "—",
        },
        {
            label: "Spreads",
            getValue: (b: Broker) => formatSpreads(b),
        },
        {
            label: "Platforms",
            getValue: (b: Broker) => formatPlatforms(b),
        },
        {
            label: "Key Features",
            getValue: (b: Broker) => formatValue(b.features?.slice(0, 4)),
        },
        {
            label: "Categories",
            getValue: (b: Broker) =>
                formatValue((b as Broker & { categories?: string[] }).categories),
        },
        {
            label: "Regions",
            getValue: (b: Broker) =>
                formatValue((b as Broker & { regions?: string[] }).regions),
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            {/* TITLE */}
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
                {selectedBrokers.length > 1
                    ? "Compare Forex Brokers Side by Side"
                    : `${leadBroker.name} vs Top Forex Brokers`}
            </h2>

            <p className="text-center text-gray-400 mb-8 max-w-2xl mx-auto">
                Compare spreads, platforms, minimum deposit, and broker strengths
                before choosing the platform that fits your trading style.
            </p>

            {/* FILTER */}
            <div className="flex justify-center gap-3 mb-10 flex-wrap">
                {FILTER_OPTIONS.map((f) => (
                    <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        className={`rounded-xl border px-5 py-2 transition ${filter === f.key
                                ? "bg-yellow-500 text-black"
                                : "border-white/20 hover:bg-white/10"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* SELECTED BROKERS */}
            <div
                className={`grid gap-6 mb-10 ${selectedBrokers.length === 1
                        ? "md:grid-cols-1"
                        : selectedBrokers.length === 2
                            ? "md:grid-cols-2"
                            : "md:grid-cols-3"
                    }`}
            >
                {selectedBrokers.map((b, index) => (
                    <div
                        key={b.slug}
                        className={`rounded-2xl border p-6 text-center shadow-lg ${index === 0
                                ? "border-yellow-500 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5"
                                : "border-white/10 bg-white/5"
                            }`}
                    >
                        {index === 0 && (
                            <p className="text-xs text-yellow-400 mb-2">
                                🔥 TOP RECOMMENDED
                            </p>
                        )}

                        <h3 className="text-2xl font-bold mb-2">
                            {b.name}
                        </h3>

                        <p className="text-yellow-400 mb-2 text-lg">
                            ⭐ {b.rating?.toFixed(1) ?? "—"} / 5
                        </p>

                        <p className="text-gray-400 mb-4">
                            {formatSpreads(b)} • {formatPlatforms(b)}
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {b.features?.slice(0, 3).map((feature, i) => (
                                <span
                                    key={`${b.slug}-${i}`}
                                    className="rounded-full bg-white/10 px-3 py-1 text-xs"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <a
                                href={`/go/${b.slug}?src=compare-top`}
                                className="inline-block rounded-xl bg-yellow-400 px-8 py-4 font-semibold text-black text-lg"
                            >
                                Start Trading →
                            </a>

                            <Link
                                href={`/${lang}/brokers/${b.slug}`}
                                className="rounded-xl border border-white/20 px-6 py-3 transition hover:bg-white/5"
                            >
                                Read Review
                            </Link>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            ✔ Fast withdrawals • ✔ Trusted broker • ✔ Secure
                        </p>
                    </div>
                ))}
            </div>

            {/* QUICK COMPARISON GRID */}
            {alternatives.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                    {alternatives.map((b) => (
                        <div
                            key={b.slug}
                            className="rounded-xl bg-white/5 p-5 text-center transition hover:bg-white/10"
                        >
                            <h4 className="font-semibold mb-1">{b.name}</h4>

                            <p className="text-sm text-gray-400 mb-2">
                                ⭐ {b.rating.toFixed(1)}
                            </p>

                            <p className="text-xs text-gray-500 mb-3">
                                {formatSpreads(b)}
                            </p>

                            <Link
                                href={`/${lang}/compare/${leadBroker.slug}-vs-${b.slug}`}
                                className="text-yellow-400 text-sm"
                            >
                                Compare →
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {/* FULL LIST */}
            {compareList.length > 0 && (
                <div className="space-y-4 mb-10">
                    {compareList.map((b) => (
                        <div
                            key={b.slug}
                            className="flex items-center justify-between rounded-xl bg-white/5 p-5 transition hover:bg-white/10"
                        >
                            <div>
                                <h4 className="font-semibold">{b.name}</h4>
                                <p className="text-sm text-gray-400">
                                    ⭐ {b.rating.toFixed(1)} • {formatSpreads(b)}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Link
                                    href={`/${lang}/compare/${leadBroker.slug}-vs-${b.slug}`}
                                    className="text-sm text-yellow-400"
                                >
                                    Compare
                                </Link>

                                <a
                                    href={`/go/${b.slug}?src=compare-list`}
                                    className="rounded-lg bg-white px-4 py-2 text-sm text-black"
                                >
                                    Try →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto">
                <div className="min-w-[760px]">
                    <div
                        className="grid overflow-hidden rounded-2xl border border-white/10"
                        style={{
                            gridTemplateColumns: `220px repeat(${selectedBrokers.length}, minmax(180px, 1fr))`,
                        }}
                    >
                        <div className="bg-white/10 px-4 py-4 font-semibold">
                            Criteria
                        </div>

                        {selectedBrokers.map((b) => (
                            <div
                                key={`${b.slug}-head`}
                                className="bg-white/10 px-4 py-4 text-center font-semibold"
                            >
                                {b.name}
                            </div>
                        ))}

                        {rows.map((row, rowIndex) => (
                            <div
                                key={row.label}
                                className="contents"
                            >
                                <div
                                    className={`px-4 py-4 font-medium text-gray-300 ${rowIndex % 2 === 0 ? "bg-white/[0.03]" : "bg-black/20"
                                        }`}
                                >
                                    {row.label}
                                </div>

                                {selectedBrokers.map((b) => (
                                    <div
                                        key={`${row.label}-${b.slug}`}
                                        className={`px-4 py-4 text-center text-gray-400 ${rowIndex % 2 === 0 ? "bg-white/[0.03]" : "bg-black/20"
                                            }`}
                                    >
                                        {row.getValue(b)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* NOTES */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
                <h3 className="font-semibold mb-2">
                    Comparison note
                </h3>

                <p className="text-sm text-gray-400 leading-relaxed">
                    Broker choice depends on your priorities. A beginner may prefer
                    lower deposit and simpler platforms, while an advanced trader may
                    care more about execution, spreads, and trading tools.
                </p>
            </div>

            {/* FINAL CTA */}
            <div className="text-center mt-12">
                <a
                    href={`/go/${leadBroker.slug}?src=compare-bottom`}
                    className="rounded-xl bg-green-500 px-10 py-4 font-semibold"
                >
                    Open {leadBroker.name} Account →
                </a>
            </div>
        </div>
    );
}