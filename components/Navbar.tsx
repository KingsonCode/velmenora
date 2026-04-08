"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getByTier } from "@/lib/countries";
import MarketTicker from "./MarketTicker";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    const topMarkets = getByTier(1);

    /* 🔥 SCROLL EFFECT */
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* 🔥 MARKET TICKER */}
            <div className="fixed top-0 left-0 w-full z-[1000]">
                <MarketTicker />
            </div>

            {/* 🔥 HEADER */}
            <header
                className={`fixed top-[28px] left-0 w-full z-[999] transition-all duration-300 ${scrolled
                    ? "bg-white/70 backdrop-blur-xl border-b border-black/5 shadow-sm py-1.5"
                    : "bg-transparent py-2.5"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                    {/* LOGO */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.svg"
                            alt="Velmenora"
                            width={130}
                            height={36}
                            priority
                            style={{ height: "auto" }} // 🔥 muhimu
                        />
                    </Link>

                    {/* NAV */}
                    <nav className="hidden md:flex items-center gap-7 text-sm font-medium">

                        <NavLink href="/" active={isActive("/")}>Home</NavLink>
                        <NavLink href="/compare" active={isActive("/compare")}>Compare</NavLink>
                        <NavLink href="/news" active={isActive("/news")}>News</NavLink>
                        <NavLink href="/academy" active={isActive("/academy")}>Academy</NavLink>

                        {/* MARKETS */}
                        <div className="relative group">
                            <span className="cursor-pointer text-gray-500 group-hover:text-black transition flex items-center gap-1">
                                Markets <span className="text-xs">▾</span>
                            </span>

                            <div className="absolute left-0 mt-3 w-60 bg-white border border-black/5 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 shadow-xl">
                                {topMarkets.slice(0, 6).map((c) => (
                                    <Link
                                        key={c.code}
                                        href={`/${c.slug}`}
                                        className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm"
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* CTA */}
                    <div className="hidden md:block">
                        <Link
                            href="/compare"
                            className="px-4 py-1.5 rounded-lg font-semibold transition-all duration-300 bg-black text-white hover:bg-gray-800 hover:scale-[1.03]"
                        >
                            Start Trading
                        </Link>
                    </div>

                    {/* MOBILE BTN */}
                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden text-xl text-gray-700"
                    >
                        ☰
                    </button>
                </div>
            </header>

            {/* 🔥 MOBILE MENU */}
            <div className="md:hidden">

                <div
                    className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition ${open ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                    onClick={() => setOpen(false)}
                />

                <div
                    className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-white z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-6 flex flex-col h-full">

                        <div className="flex justify-between items-center mb-8">
                            <Image
                                src="/logo.svg"
                                alt="Velmenora"
                                width={130}
                                height={40}
                            />
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        <div className="space-y-6 text-gray-700 text-base">
                            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                            <Link href="/compare" onClick={() => setOpen(false)}>Compare</Link>
                            <Link href="/news" onClick={() => setOpen(false)}>News</Link>
                            <Link href="/academy" onClick={() => setOpen(false)}>Academy</Link>
                        </div>

                        <div className="mt-auto">
                            <Link
                                href="/compare"
                                onClick={() => setOpen(false)}
                                className="block bg-black text-white text-center py-3 rounded-xl font-semibold mt-6"
                            >
                                Start Trading →
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

/* NAV LINK */
function NavLink({ href, active, children }: any) {
    return (
        <Link
            href={href}
            className={`transition ${active
                ? "text-black"
                : "text-gray-500 hover:text-black"
                }`}
        >
            {children}
        </Link>
    );
}