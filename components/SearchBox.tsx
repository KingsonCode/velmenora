"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Lang } from "@/lib/i18n";

/* =========================
   TYPES
========================= */
type Props = {
    lang?: Lang;
};

/* =========================
   DATA (CAN MOVE TO DB LATER)
========================= */
const brokers = [
    { name: "Exness", slug: "exness" },
    { name: "Deriv", slug: "deriv" },
    { name: "XM", slug: "xm" },
    { name: "IC Markets", slug: "ic-markets" },
];

/* =========================
   I18N TEXT
========================= */
const text = {
    en: {
        placeholder: "Search Exness, XM, Deriv...",
        search: "Search",
        noResults: "No brokers found",
    },
    ar: {
        placeholder: "ابحث عن Exness أو XM...",
        search: "بحث",
        noResults: "لم يتم العثور على نتائج",
    },
    de: {
        placeholder: "Suche Exness, XM...",
        search: "Suchen",
        noResults: "Keine Broker gefunden",
    },
    fr: {
        placeholder: "Rechercher Exness, XM...",
        search: "Rechercher",
        noResults: "Aucun broker trouvé",
    },
};

export default function SearchBox({ lang = "en" }: Props) {
    const router = useRouter();

    const t = text[lang] || text.en;

    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const inputRef = useRef<HTMLDivElement>(null);

    /* =========================
       FILTER
    ========================= */
    const filtered = brokers.filter((b) =>
        b.name.toLowerCase().includes(query.toLowerCase())
    );

    /* =========================
       NAVIGATION (FIXED ROUTES)
    ========================= */
    const handleSearch = (value?: string) => {
        const q = value || query;
        if (!q) return;

        const exact = brokers.find(
            (b) => b.name.toLowerCase() === q.toLowerCase()
        );

        if (exact) {
            router.push(`/${lang}/brokers/${exact.slug}`); // ✅ FIXED
        } else {
            router.push(`/${lang}/search?q=${encodeURIComponent(q)}`); // ✅ FIXED
        }

        setOpen(false);
    };

    /* =========================
       KEYBOARD NAV
    ========================= */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;

        if (e.key === "ArrowDown") {
            setActiveIndex((prev) =>
                Math.min(prev + 1, filtered.length - 1)
            );
        }

        if (e.key === "ArrowUp") {
            setActiveIndex((prev) =>
                Math.max(prev - 1, 0)
            );
        }

        if (e.key === "Enter") {
            const selected = filtered[activeIndex];

            if (selected) {
                handleSearch(selected.name);
            } else {
                handleSearch();
            }
        }
    };

    /* =========================
       HIGHLIGHT
    ========================= */
    const highlight = (textValue: string) => {
        if (!query) return textValue;

        const parts = textValue.split(new RegExp(`(${query})`, "gi"));

        return parts.map((part, i) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={i} className="text-yellow-400 font-semibold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    /* =========================
       OUTSIDE CLICK
    ========================= */
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (!inputRef.current?.contains(e.target as Node)) {
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
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-yellow-400">

                <input
                    type="text"
                    placeholder={t.placeholder}
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
                    className="bg-yellow-500 text-black px-6 py-4 font-semibold flex items-center gap-2 hover:scale-105 transition"
                >
                    <Search size={18} />
                    {t.search}
                </button>
            </div>

            {/* 🔥 DROPDOWN */}
            {open && query && (
                <div className="absolute mt-2 w-full bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">

                    {filtered.length > 0 ? (
                        filtered.map((broker, i) => (
                            <div
                                key={broker.slug}
                                onClick={() => handleSearch(broker.name)}
                                className={`px-4 py-3 cursor-pointer transition ${i === activeIndex
                                        ? "bg-yellow-500/20"
                                        : "hover:bg-white/10"
                                    }`}
                            >
                                {highlight(broker.name)}
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-gray-400 text-sm">
                            {t.noResults}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}