"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

/* 🔥 DATA (READY FOR SCALING) */
const brokers = [
    { name: "Exness", slug: "exness" },
    { name: "Deriv", slug: "deriv" },
    { name: "XM", slug: "xm" },
    { name: "IC Markets", slug: "ic-markets" },
];

export default function SearchBox() {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const inputRef = useRef<HTMLDivElement>(null);

    /* 🔥 FILTER */
    const filtered = brokers.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
    );

    /* 🔥 NAVIGATION */
    const handleSearch = (value?: string) => {
        const q = value || query;
        if (!q) return;
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
    };

    /* 🔥 KEYBOARD CONTROL */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;

        if (e.key === "ArrowDown") {
            setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
        }

        if (e.key === "ArrowUp") {
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        }

        if (e.key === "Enter") {
            if (activeIndex >= 0) {
                handleSearch(filtered[activeIndex].name);
            } else {
                handleSearch();
            }
        }
    };

    /* 🔥 HIGHLIGHT */
    const highlight = (text: string) => {
        if (!query) return text;

        const parts = text.split(new RegExp(`(${query})`, "gi"));

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="text-blue-400 font-semibold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    /* 🔥 OUTSIDE CLICK */
    useEffect(() => {
        const handleClick = (e: any) => {
            if (!inputRef.current?.contains(e.target)) {
                setOpen(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <div ref={inputRef} className="relative max-w-2xl mx-auto">

            {/* 🔎 INPUT */}
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-soft focus-within:ring-2 focus-within:ring-primary">

                <input
                    type="text"
                    placeholder="Search Exness, Deriv, XM..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                        setActiveIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-5 py-4 bg-transparent text-white placeholder-gray-400 outline-none"
                />

                <button
                    onClick={() => handleSearch()}
                    className="bg-gradient-primary shadow-glow hover:shadow-glow-lg px-6 py-4 flex items-center gap-2 font-semibold transition"
                >
                    <Search size={18} />
                    Search
                </button>
            </div>

            {/* 🔥 DROPDOWN */}
            {open && query && (
                <div className="absolute mt-2 w-full bg-black/80 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-card z-50">

                    {/* ✅ RESULTS */}
                    {filtered.length > 0 ? (
                        filtered.map((broker, i) => (
                            <div
                                key={broker.slug}
                                onClick={() => handleSearch(broker.name)}
                                className={`px-4 py-3 cursor-pointer transition text-left ${i === activeIndex
                                        ? "bg-blue-500/20"
                                        : "hover:bg-white/10"
                                    }`}
                            >
                                {highlight(broker.name)}
                            </div>
                        ))
                    ) : (
                        /* ❌ EMPTY */
                        <div className="p-4 text-gray-400 text-sm">
                            No brokers found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}