"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search,
    SlidersHorizontal,
    Star,
    Wallet,
    Monitor,
    Sparkles,
    ArrowRight,
    RotateCcw,
    CheckCircle2,
} from "lucide-react";

import BrokerCard from "@/components/BrokerCard";
import { getAllBrokers } from "@/lib/brokers";
import type { Broker } from "@/lib/types/broker";

/* AI */
import { recommendBroker } from "@/lib/ai/recommendBroker";
import AIRecommendation from "@/components/AIRecommendation";

/* PERSONALIZATION */
import {
    getPersonalizedScore,
    subscribeProfileUpdate,
} from "@/lib/ai/personalization";

type Props = {
    lang: string;
};

const brokers = getAllBrokers();

function supportsPlatform(broker: Broker, platform: string) {
    if (platform === "All") return true;

    const search = platform.toLowerCase();

    return broker.features.some((feature) =>
        feature.toLowerCase().includes(search)
    );
}

export default function ExplorerClient({ lang }: Props) {
    const router = useRouter();
    const params = useSearchParams();

    const [search, setSearch] = useState(params.get("q") || "");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [minRating, setMinRating] = useState(Number(params.get("rating")) || 0);
    const [maxDeposit, setMaxDeposit] = useState(Number(params.get("deposit")) || 1000);
    const [platform, setPlatform] = useState(params.get("platform") || "All");
    const [sort, setSort] = useState(params.get("sort") || "ai");

    const [compare, setCompare] = useState<string[]>(() => {
        const ids = params.get("ids");
        if (!ids) return [];
        return ids.split(",").filter(Boolean).slice(0, 3);
    });

    const [, forceUpdate] = useState(0);

    useEffect(() => {
        const unsub = subscribeProfileUpdate(() => {
            forceUpdate((n) => n + 1);
        });

        return unsub;
    }, []);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const query = new URLSearchParams();

        if (search) query.set("q", search);
        if (minRating) query.set("rating", String(minRating));
        if (maxDeposit !== 1000) query.set("deposit", String(maxDeposit));
        if (platform !== "All") query.set("platform", platform);
        if (sort !== "ai") query.set("sort", sort);

        const qs = query.toString();
        router.replace(qs ? `/${lang}/explorer?${qs}` : `/${lang}/explorer`);
    }, [search, minRating, maxDeposit, platform, sort, router, lang]);

    const filtered = useMemo(() => {
        const result = brokers.filter((b) => {
            return (
                b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) &&
                b.rating >= minRating &&
                (b.minDeposit ?? 0) <= maxDeposit &&
                supportsPlatform(b, platform)
            );
        });

        if (sort === "ai") {
            result.sort((a, b) => {
                const diff = getPersonalizedScore(b) - getPersonalizedScore(a);
                if (diff !== 0) return diff;
                return b.rating - a.rating;
            });
        }

        if (sort === "rating") {
            result.sort((a, b) => b.rating - a.rating);
        }

        if (sort === "deposit") {
            result.sort((a, b) => (a.minDeposit ?? 0) - (b.minDeposit ?? 0));
        }

        return result;
    }, [debouncedSearch, minRating, maxDeposit, platform, sort]);

    const recommended = useMemo(() => {
        return recommendBroker(filtered);
    }, [filtered]);

    const toggleCompare = (slug: string) => {
        setCompare((prev) => {
            if (prev.includes(slug)) {
                return prev.filter((s) => s !== slug);
            }

            if (prev.length >= 3) {
                return prev;
            }

            return [...prev, slug];
        });
    };

    const resetFilters = () => {
        setSearch("");
        setMinRating(0);
        setMaxDeposit(1000);
        setPlatform("All");
        setSort("ai");
    };

    const clearCompare = () => {
        setCompare([]);
    };

    return (
        <section className="min-h-screen bg-black text-white px-4 py-12 pb-28">
            {/* HERO */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] via-white/[0.03] to-yellow-500/10 p-8 md:p-10">
                    <div className="max-w-3xl">
                        <p className="mb-4 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-300">
                            Broker Explorer
                        </p>

                        <h1 className="text-3xl md:text-5xl font-bold mb-4">
                            Explore Forex Brokers
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8">
                            Compare forex brokers, filter by rating, deposit, and platform,
                            and find the broker that fits your trading style.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={`/${lang}/academy`}
                                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                            >
                                Learn Forex First
                            </Link>

                            <Link
                                href="/blog"
                                className="inline-flex items-center justify-center rounded-xl bg-yellow-500 px-6 py-3.5 font-semibold text-black transition hover:opacity-90"
                            >
                                Read Broker Guides
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="relative z-10 max-w-6xl mx-auto mb-8 rounded-3xl border border-white/10 bg-black/80 p-4 backdrop-blur-xl">
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-300">
                    <SlidersHorizontal size={16} />
                    <span>Filter brokers</span>
                </div>

                <div className="grid gap-4 md:grid-cols-5">
                    <div className="relative">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search broker..."
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-10 py-3 text-gray-200 outline-none placeholder:text-gray-500"
                        />
                    </div>

                    <div className="relative">
                        <Star
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <select
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-10 py-3 text-white outline-none"
                        >
                            <option
                                value={0}
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                All Ratings
                            </option>
                            <option
                                value={4}
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                4★+
                            </option>
                            <option
                                value={4.5}
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                4.5★+
                            </option>
                        </select>
                    </div>

                    <div className="relative">
                        <Wallet
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <select
                            value={maxDeposit}
                            onChange={(e) => setMaxDeposit(Number(e.target.value))}
                            className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-10 py-3 text-white outline-none"
                        >
                            <option
                                value={1000}
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                Any Deposit
                            </option>
                            <option
                                value={10}
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                Under $10
                            </option>
                            <option
                                value={50}
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                Under $50
                            </option>
                        </select>
                    </div>

                    <div className="relative">
                        <Monitor
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <select
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-10 py-3 text-white outline-none"
                        >
                            <option
                                value="All"
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                All Platforms
                            </option>
                            <option
                                value="MT4"
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                MT4
                            </option>
                            <option
                                value="MT5"
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                MT5
                            </option>
                        </select>
                    </div>

                    <div className="relative">
                        <Sparkles
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-10 py-3 text-white outline-none"
                        >
                            <option
                                value="ai"
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                Recommended (AI)
                            </option>
                            <option
                                value="rating"
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                Top Rated
                            </option>
                            <option
                                value="deposit"
                                style={{ backgroundColor: "#111827", color: "#ffffff" }}
                            >
                                Lowest Deposit
                            </option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 text-sm text-gray-400 underline transition hover:text-white"
                    >
                        <RotateCcw size={14} />
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* AI RECOMMENDATION */}
            <AIRecommendation data={recommended} />

            {/* RESULTS */}
            <div className="max-w-6xl mx-auto mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-gray-400">
                <span>Showing {filtered.length} brokers</span>

                {compare.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-yellow-400">
                        <CheckCircle2 size={16} />
                        <span>{compare.length} selected for comparison</span>
                    </div>
                )}
            </div>

            {/* GRID */}
            <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((broker, i) => {
                    const selected = compare.includes(broker.slug);

                    return (
                        <div key={broker.slug} className="relative">
                            <button
                                type="button"
                                onClick={() => toggleCompare(broker.slug)}
                                className={`absolute right-2 top-2 z-10 rounded-full px-3 py-1 text-xs transition ${selected
                                    ? "bg-yellow-500 text-black"
                                    : "bg-white/10 text-white hover:bg-white/20"
                                    }`}
                            >
                                {selected ? "Selected" : "Compare"}
                            </button>

                            <BrokerCard
                                broker={broker}
                                rank={i + 1}
                                country="GLOBAL"
                                allBrokers={filtered}
                            />
                        </div>
                    );
                })}
            </div>

            {/* EMPTY STATE */}
            {filtered.length === 0 && (
                <div className="max-w-3xl mx-auto mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
                    <h2 className="text-2xl font-semibold mb-3">
                        No brokers matched your filters
                    </h2>

                    <p className="text-gray-400 mb-6">
                        Try resetting filters or broadening your search to see more brokers.
                    </p>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black"
                    >
                        Reset Filters
                        <ArrowRight size={16} />
                    </button>
                </div>
            )}

            {/* COMPARE BAR */}
            {compare.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 p-4 backdrop-blur">
                    <div className="max-w-6xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-gray-300">
                            Comparing {compare.length} broker{compare.length > 1 ? "s" : ""}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={clearCompare}
                                className="rounded-xl border border-white/15 px-4 py-3 text-sm text-white transition hover:bg-white/5"
                            >
                                Clear
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    router.push(`/${lang}/compare?ids=${compare.join(",")}`)
                                }
                                className="rounded-xl bg-yellow-500 px-6 py-3 font-semibold text-black"
                            >
                                Compare Now →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}