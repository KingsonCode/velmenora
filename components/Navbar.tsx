"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SUPPORTED_LANGS = new Set(["en", "de", "fr", "ar"]);

const MARKET_LINKS = [
    { label: "EUR/USD", slug: "eurusd" },
    { label: "GBP/USD", slug: "gbpusd" },
    { label: "USD/JPY", slug: "usdjpy" },
    { label: "XAU/USD", slug: "xauusd" },
    { label: "BTC/USD", slug: "btcusd" },
    { label: "ETH/USD", slug: "ethusd" },
] as const;

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname() || "/";

    const firstSegment = pathname.split("/")[1] || "";
    const hasLangPrefix = SUPPORTED_LANGS.has(firstSegment);
    const langPrefix = hasLangPrefix ? `/${firstSegment}` : "/en";

    const homeHref = "/";
    const explorerHref = `${langPrefix}/explorer`;
    const compareHref = `${langPrefix}/compare`;
    const academyHref = `${langPrefix}/academy`;
    const guidesHref = "/blog";
    const marketsHref = `${langPrefix}/markets`;
    const watchlistHref = `${langPrefix}/watchlist`;

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const [prices, setPrices] = useState([
        { pair: "EUR/USD", value: 1.0852 },
        { pair: "GBP/USD", value: 1.2731 },
        { pair: "USD/JPY", value: 151.22 },
    ]);

    const marketLinks = useMemo(
        () =>
            MARKET_LINKS.map((market) => ({
                ...market,
                href: `${langPrefix}/markets/${market.slug}`,
            })),
        [langPrefix]
    );

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
            <div className="overflow-hidden whitespace-nowrap bg-white/5 px-6 py-1 text-xs">
                <div className="flex gap-6">
                    {prices.map((p) => (
                        <span key={p.pair} className="text-gray-300">
                            {p.pair}: <span className="text-green-400">{p.value}</span>
                        </span>
                    ))}
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* LOGO */}
                <Link href={homeHref} className="flex items-center">
                    <Image
                        src="/logo.svg"
                        alt="Velmenora"
                        width={40}
                        height={40}
                        className="h-10 w-auto"
                        priority
                    />
                </Link>

                {/* DESKTOP MENU */}
                <div className="hidden items-center gap-6 md:flex">
                    <Link
                        href={homeHref}
                        className={isActive(homeHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                    >
                        Home
                    </Link>

                    <div className="group relative">
                        <Link
                            href={marketsHref}
                            className={isActive(marketsHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                        >
                            Markets
                        </Link>

                        <div className="pointer-events-none absolute left-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-black opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:opacity-100">
                            <div className="min-w-[260px] p-4">
                                <Link
                                    href={marketsHref}
                                    className="mb-2 block rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-white transition hover:bg-white/5"
                                >
                                    View all markets →
                                </Link>

                                <div className="grid grid-cols-1 gap-2">
                                    {marketLinks.map((market) => (
                                        <Link
                                            key={market.slug}
                                            href={market.href}
                                            className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-gray-400 transition hover:bg-white/5 hover:text-white"
                                        >
                                            {market.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        href={explorerHref}
                        className={isActive(explorerHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                    >
                        Explorer
                    </Link>

                    <Link
                        href={compareHref}
                        className={isActive(compareHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                    >
                        Compare
                    </Link>

                    <Link
                        href={academyHref}
                        className={isActive(academyHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                    >
                        Academy
                    </Link>

                    <Link
                        href={watchlistHref}
                        className={isActive(watchlistHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                    >
                        Watchlist
                    </Link>

                    <Link
                        href={guidesHref}
                        className={isActive(guidesHref) ? "text-yellow-400" : "hover:text-yellow-400"}
                    >
                        Guides
                    </Link>
                </div>

                {/* MOBILE BUTTON */}
                <button
                    type="button"
                    onClick={() => setOpen((prev) => !prev)}
                    className="text-xl md:hidden"
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
                    className="fixed inset-0 z-50 flex flex-col bg-black text-white md:hidden"
                >
                    <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                        <span className="font-bold">Menu</span>

                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex flex-col space-y-6 px-6 py-6 text-lg">
                        <Link href={homeHref}>Home</Link>
                        <Link href={marketsHref}>Markets</Link>
                        <Link href={explorerHref}>Explorer</Link>
                        <Link href={compareHref}>Compare</Link>
                        <Link href={academyHref}>Academy</Link>
                        <Link href={watchlistHref}>Watchlist</Link>
                        <Link href={guidesHref}>Guides</Link>
                    </div>

                    <div className="px-6 pb-8">
                        <div className="mb-3 text-sm text-gray-400">Popular Markets</div>

                        <div className="grid grid-cols-2 gap-3">
                            {marketLinks.map((market) => (
                                <Link
                                    key={market.slug}
                                    href={market.href}
                                    className="rounded bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                                >
                                    {market.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}