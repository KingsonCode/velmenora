"use client";

import { useEffect, useMemo, useState } from "react";
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
    const pathname = usePathname() || "/";

    const geo = resolveGeo();

    const firstSegment = pathname.split("/")[1] || "";
    const hasLangPrefix = SUPPORTED_LANGS.has(firstSegment);
    const langPrefix = hasLangPrefix ? `/${firstSegment}` : "/en";

    const homeHref = langPrefix;
    const explorerHref = `${langPrefix}/explorer`;
    const compareHref = `${langPrefix}/compare`;
    const academyHref = `${langPrefix}/academy`;
    const guidesHref = "/blog";

    const isActive = (href: string) => {
        if (href === langPrefix) {
            return pathname === href;
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const topCountries: CountryMeta[] = useMemo(
        () =>
            [
                ...countries.filter((c: CountryMeta) => c.code === geo.country),
                ...countries.filter(
                    (c: CountryMeta) =>
                        c.cluster === geo.cluster && c.code !== geo.country
                ),
                ...countries.filter(
                    (c: CountryMeta) => c.cluster !== geo.cluster
                ),
            ].slice(0, 8),
        [geo.country, geo.cluster]
    );

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

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <nav className="w-full border-b border-white/10 bg-black text-white">
            {/* MARKET TICKER */}
            <div className="bg-white/5 text-xs py-1 px-6 overflow-hidden whitespace-nowrap">
                <div className="flex gap-6">
                    {prices.map((p) => (
                        <span key={p.pair} className="text-gray-300">
                            {p.pair}:{" "}
                            <span className="text-green-400">{p.value}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* LOGO */}
                <Link href={homeHref} className="font-bold text-lg">
                    Velmenora
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href={homeHref}
                        className={
                            isActive(homeHref)
                                ? "text-yellow-400"
                                : "hover:text-yellow-400"
                        }
                    >
                        Home
                    </Link>

                    <Link
                        href={explorerHref}
                        className={
                            isActive(explorerHref)
                                ? "text-yellow-400"
                                : "hover:text-yellow-400"
                        }
                    >
                        Explorer
                    </Link>

                    <Link
                        href={compareHref}
                        className={
                            isActive(compareHref)
                                ? "text-yellow-400"
                                : "hover:text-yellow-400"
                        }
                    >
                        Compare
                    </Link>

                    <Link
                        href={academyHref}
                        className={
                            isActive(academyHref)
                                ? "text-yellow-400"
                                : "hover:text-yellow-400"
                        }
                    >
                        Academy
                    </Link>

                    <Link
                        href={guidesHref}
                        className={
                            isActive(guidesHref)
                                ? "text-yellow-400"
                                : "hover:text-yellow-400"
                        }
                    >
                        Guides
                    </Link>

                    {/* MARKETS DROPDOWN */}
                    <div className="relative group">
                        <button
                            type="button"
                            className="hover:text-yellow-400"
                        >
                            Markets
                        </button>

                        <div className="absolute top-full left-0 mt-2 rounded-xl border border-white/10 bg-black shadow-lg opacity-0 transition pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                            <div className="grid grid-cols-1 gap-2 p-4 min-w-[260px]">
                                {topCountries.map((c: CountryMeta) => (
                                    <Link
                                        key={c.code}
                                        href={`/blog/best-brokers-in-${c.slug}`}
                                        className="flex items-center gap-2 whitespace-nowrap rounded-lg px-2 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
                                    >
                                        {c.code === geo.country && (
                                            <span className="text-yellow-400">🔥</span>
                                        )}
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* MOBILE BUTTON */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="md:hidden text-xl"
                    aria-label={open ? "Close menu" : "Open menu"}
                    aria-controls="mobile-menu"
                    aria-haspopup="dialog"
                >
                    ☰
                </button>
            </div>

            {/* MOBILE MENU */}
            {open && (
                <div
                    id="mobile-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile navigation"
                    className="fixed inset-0 z-50 bg-black text-white flex flex-col md:hidden"
                >
                    {/* TOP BAR */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <span className="font-bold">Menu</span>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    {/* NAV LINKS */}
                    <div className="flex flex-col px-6 py-6 space-y-6 text-lg">
                        <Link href={homeHref}>Home</Link>
                        <Link href={explorerHref}>Explorer</Link>
                        <Link href={compareHref}>Compare</Link>
                        <Link href={academyHref}>Academy</Link>
                        <Link href={guidesHref}>Guides</Link>
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