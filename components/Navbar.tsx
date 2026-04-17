"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    countries,
    resolveGeo,
    type CountryMeta,
} from "@/lib/geo";

const SUPPORTED_LANGS = new Set(["en", "de", "fr", "ar"]);

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    const geo = resolveGeo();
    const firstSegment = pathname?.split("/")[1] || "";
    const langPrefix = SUPPORTED_LANGS.has(firstSegment)
        ? `/${firstSegment}`
        : "";
    const homeHref = langPrefix || "/";
    const compareHref = langPrefix
        ? `${langPrefix}/best-forex-brokers`
        : "/compare";

    /* ================= SMART COUNTRY PRIORITY ================= */
    const topCountries: CountryMeta[] = [
        ...countries.filter((c: CountryMeta) => c.code === geo.country),
        ...countries.filter(
            (c: CountryMeta) =>
                c.cluster === geo.cluster && c.code !== geo.country
        ),
        ...countries.filter(
            (c: CountryMeta) => c.cluster !== geo.cluster
        ),
    ].slice(0, 8);

    /* ================= MOCK LIVE MARKETS ================= */
    const [prices, setPrices] = useState([
        { pair: "EUR/USD", value: 1.0852 },
        { pair: "GBP/USD", value: 1.2731 },
        { pair: "USD/JPY", value: 151.22 },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices((prev) =>
                prev.map((p) => ({
                    ...p,
                    value: +(p.value + (Math.random() - 0.5) * 0.002).toFixed(4),
                }))
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="w-full border-b border-white/10 bg-black text-white">

            {/* 🔥 MARKET TICKER */}
            <div className="bg-white/5 text-xs py-1 px-6 overflow-hidden whitespace-nowrap">
                <div className="flex gap-6 animate-pulse">
                    {prices.map((p) => (
                        <span key={p.pair} className="text-gray-300">
                            {p.pair}:{" "}
                            <span className="text-green-400">{p.value}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* ================= LOGO ================= */}
                <Link href={homeHref} className="font-bold text-lg">
                    Velmenora
                </Link>

                {/* ================= DESKTOP MENU ================= */}
                <div className="hidden md:flex items-center gap-6">

                    <Link href={homeHref} className="hover:text-yellow-400">
                        Home
                    </Link>

                    <Link href={compareHref} className="hover:text-yellow-400">
                        Compare
                    </Link>

                    <Link href="/academy" className="hover:text-yellow-400">
                        Academy
                    </Link>

                    <Link href="/blog" className="hover:text-yellow-400">
                        Guides
                    </Link>

                    {/* ================= MARKETS DROPDOWN ================= */}
                    <div className="relative group">

                        <button className="hover:text-yellow-400">
                            Markets
                        </button>

                        <div className="absolute top-full left-0 mt-2 bg-black border border-white/10 rounded shadow-lg opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">

                            <div className="p-4 grid grid-cols-2 gap-3 min-w-[260px]">

                                {topCountries.map((c: CountryMeta) => (
                                    <Link
                                        key={c.code}
                                        href={`/blog/best-brokers-in-${c.slug}`}
                                        className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
                                    >
                                        {c.code === geo.country && (
                                            <span className="text-yellow-400">
                                                🔥
                                            </span>
                                        )}
                                        {c.name}
                                    </Link>
                                ))}

                            </div>
                        </div>
                    </div>

                </div>

                {/* ================= MOBILE BUTTON ================= */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-xl"
                >
                    ☰
                </button>

            </div>

            {/* ================= MOBILE MENU (PRO MAX++) ================= */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">

                    {/* TOP BAR */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <span className="font-bold">Menu</span>

                        <button onClick={() => setOpen(false)}>
                            ✕
                        </button>
                    </div>

                    {/* NAV LINKS */}
                    <div className="flex flex-col px-6 py-6 space-y-6 text-lg">

                        <Link href={homeHref} onClick={() => setOpen(false)}>
                            Home
                        </Link>

                        <Link href={compareHref} onClick={() => setOpen(false)}>
                            Compare
                        </Link>

                        <Link href="/academy" onClick={() => setOpen(false)}>
                            Academy
                        </Link>

                        <Link href="/blog" onClick={() => setOpen(false)}>
                            Guides
                        </Link>

                    </div>

                    {/* MARKETS */}
                    <div className="px-6 pb-8">

                        <div className="text-sm text-gray-400 mb-3">
                            Popular Markets
                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            {topCountries.map((c: CountryMeta) => (
                                <Link
                                    key={c.code}
                                    href={`/blog/best-brokers-in-${c.slug}`}
                                    onClick={() => setOpen(false)}
                                    className="text-sm bg-white/5 px-3 py-2 rounded hover:bg-white/10"
                                >
                                    {c.code === geo.country && "🔥 "}
                                    {c.name}
                                </Link>
                            ))}

                        </div>

                    </div>

                </div>
            )}
        </nav>
    );
}
