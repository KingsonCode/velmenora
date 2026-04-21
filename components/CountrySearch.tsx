"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { countries, resolveGeo, type CountryMeta as Country } from "@/lib/geo";
import { getFlag } from "@/lib/countryFlag";

type Props = {
    lang?: string;
    onSelect?: (code: string) => void;
};

export default function CountrySearch({
    lang = "en",
    onSelect,
}: Props) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);

    const geo = resolveGeo();

    /* ================= FILTER ================= */
    const filtered = useMemo<Country[]>(() => {
        if (!query) return countries;

        return countries.filter((c) =>
            c.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    /* ================= SMART DEFAULT ================= */
    const topCountries = useMemo(() => {
        // 🔥 prioritize same region first
        const sameCluster = countries.filter(
            (c) => c.cluster === geo.cluster
        );

        const others = countries.filter(
            (c) => c.cluster !== geo.cluster
        );

        return [...sameCluster, ...others].slice(0, 10);
    }, [geo.cluster]);

    const visible =
        query.length === 0
            ? topCountries
            : filtered.slice(0, 20);

    /* ================= CLOSE OUTSIDE ================= */
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
                setActiveIndex(-1);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ================= SELECT ================= */
    function handleSelect(code: string) {
        setQuery("");
        setOpen(false);
        setActiveIndex(-1);

        if (onSelect) {
            onSelect(code);
        } else {
            window.location.href = `/${lang}/country/${code}`;
        }
    }

    /* ================= KEYBOARD NAV ================= */
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev < visible.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : visible.length - 1
            );
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0 && visible[activeIndex]) {
                handleSelect(visible[activeIndex].code);
            }
        }

        if (e.key === "Escape") {
            setOpen(false);
            setActiveIndex(-1);
        }
    }

    return (
        <div ref={containerRef} className="relative w-56 md:w-64">

            {/* INPUT */}
            <input
                type="text"
                placeholder="Search your country..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    setActiveIndex(-1);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-black border border-white/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-green-500"
            />

            {/* RESULTS */}
            {open && visible.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-black border border-white/10 mt-1 rounded shadow-lg z-50 max-h-60 overflow-y-auto">

                    {visible.map((c, index) => (
                        <div
                            key={c.code}
                            onClick={() => handleSelect(c.code)}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm ${index === activeIndex
                                    ? "bg-white/20"
                                    : "hover:bg-white/10"
                                }`}
                        >
                            <span>{getFlag(c.code)}</span>
                            <span>{c.name}</span>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}