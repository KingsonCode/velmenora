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
    const blogHref = "/blog";
    const marketsHref = `${langPrefix}/markets`;
    const watchlistHref = `${langPrefix}/watchlist`;
    const fundedHref = "/funded";
    const startHref = "/start";

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
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

            {/* MAIN NAV */}
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
                <div className="hidden items-center gap-7 md:flex">
                    <Link
                        href={homeHref}
                        className={
                            isActive(homeHref)
                                ? "text-yellow-400"
                                : "text-white/80 transition hover:text-yellow-400"
                        }
                    >
                        Home
                    </Link>

                    <Link
                        href={explorerHref}
                        className={
                            isActive(explorerHref)
                                ? "text-yellow-400"
                                : "text-white/80 transition hover:text-yellow-400"
                        }
                    >
                        Explorer
                    </Link>

                    <Link
                        href={compareHref}
                        className={
                            isActive(compareHref)
                                ? "text-yellow-400"
                                : "text-white/80 transition hover:text-yellow-400"
                        }
                    >
                        Compare
                    </Link>

                    <Link
                        href={fundedHref}
                        className={
                            isActive(fundedHref)
                                ? "text-yellow-400"
                                : "text-white/80 transition hover:text-yellow-400"
                        }
                    >
                        Funded Challenge
                    </Link>

                    <Link
                        href={blogHref}
                        className={
                            isActive(blogHref)
                                ? "text-yellow-400"
                                : "text-white/80 transition hover:text-yellow-400"
                        }
                    >
                        Blog
                    </Link>

                    <div className="group relative">
                        <button
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            className="flex items-center gap-2 text-white/80 transition hover:text-yellow-400 focus:outline-none focus:text-yellow-400"
                        >
                            More
                            <span className="text-xs">▼</span>
                        </button>

                        {/* hover bridge */}
                        <div className="absolute left-0 top-full h-3 w-full" />

                        <div
                            className="
            pointer-events-none absolute left-0 top-full z-50 mt-1 min-w-[240px]
            rounded-2xl border border-white/10 bg-black/95 p-3 opacity-0 shadow-xl
            backdrop-blur transition duration-150
            group-hover:pointer-events-auto group-hover:opacity-100
            group-focus-within:pointer-events-auto group-focus-within:opacity-100
        "
                        >
                            <Link
                                href={academyHref}
                                className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                            >
                                Academy
                            </Link>

                            <Link
                                href={marketsHref}
                                className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                            >
                                Markets
                            </Link>

                            <Link
                                href={watchlistHref}
                                className="block rounded-xl px-4 py-3 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                            >
                                Watchlist
                            </Link>

                            <div className="my-2 border-t border-white/10" />

                            <div className="px-4 pb-2 pt-1 text-[11px] uppercase tracking-[0.18em] text-white/35">
                                Popular Markets
                            </div>

                            <div className="grid grid-cols-2 gap-2 px-1 pb-1">
                                {marketLinks.slice(0, 4).map((market) => (
                                    <Link
                                        key={market.slug}
                                        href={market.href}
                                        className="rounded-lg px-3 py-2 text-xs text-gray-400 transition hover:bg-white/5 hover:text-white"
                                    >
                                        {market.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link
                        href={startHref}
                        className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-5 py-2.5 font-semibold text-black transition hover:scale-[1.02] hover:bg-yellow-300"
                    >
                        Start Trading
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

                    <div className="flex flex-col space-y-5 px-6 py-6 text-lg">
                        <Link href={homeHref}>Home</Link>
                        <Link href={explorerHref}>Explorer</Link>
                        <Link href={compareHref}>Compare</Link>
                        <Link href={fundedHref}>Funded Challenge</Link>
                        <Link href={blogHref}>Blog</Link>
                        <Link href={academyHref}>Academy</Link>
                        <Link href={marketsHref}>Markets</Link>
                        <Link href={watchlistHref}>Watchlist</Link>
                    </div>

                    <div className="px-6 pb-6">
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

                    <div className="mt-auto px-6 pb-8">
                        <Link
                            href={startHref}
                            className="inline-flex w-full items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 font-semibold text-black transition hover:bg-yellow-300"
                        >
                            Start Trading
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}