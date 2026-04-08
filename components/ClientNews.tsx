"use client";

import { useState } from "react";
import NewsCard from "./NewsCard";
import { News } from "@/types/news";

export default function ClientNews({ news }: { news: News[] }) {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const filtered = news.filter((item) => {
        const matchesCategory =
            filter === "all" ? true : item.category === filter;

        const matchesSearch = item.title
            .toLowerCase()
            .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            {/* 🔍 SEARCH */}
            <input
                type="text"
                placeholder="Search market news..."
                className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-white/10 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* 🧠 FILTERS */}
            <div className="flex gap-3 mb-6 flex-wrap">
                {["all", "forex", "crypto", "gold", "stocks"].map(
                    (cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm transition ${filter === cat
                                    ? "bg-blue-500 text-white"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    )
                )}
            </div>

            {/* EMPTY STATE */}
            {!filtered.length && (
                <p className="text-gray-400">
                    No news found.
                </p>
            )}

            {/* GRID */}
            <div className="grid md:grid-cols-3 gap-6">
                {filtered.map((item) => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>
        </>
    );
}