"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getByTier } from "@/lib/countries";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const topMarkets = getByTier(1);

    // 🔥 SCROLL EFFECT (CTA BOOST)
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`w-full sticky top-0 z-50 transition ${scrolled
                    ? "bg-[#020617]/95 backdrop-blur border-b border-[#1f2a36]"
                    : "bg-transparent"
                }`}
        >
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* 🔥 LOGO */}
                <Link href="/" className="text-lg font-bold tracking-wide">
                    Velmenora
                </Link>

                {/* 🔥 TOP COUNTRIES (SEO POWER) */}
                <div className="hidden md:flex gap-6 text-sm text-gray-300">
                    {topMarkets.slice(0, 5).map((c) => (
                        <Link
                            key={c.code}
                            href={`/${c.slug}`}
                            className="hover:text-yellow-400 transition"
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>

                {/* 🔥 DESKTOP NAV */}
                <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">

                    <Link href="/" className="hover:text-white transition">
                        Home
                    </Link>

                    {/* 🔥 DROPDOWN (SEO + FUNNEL) */}
                    <div className="relative group">
                        <span className="cursor-pointer hover:text-white transition">
                            Brokers ▾
                        </span>

                        <div className="absolute left-0 mt-3 w-64 bg-[#020617] border border-[#1f2a36] rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition p-3 space-y-2">

                            <Link
                                href="/blog/best-brokers-in-tanzania"
                                className="block px-3 py-2 rounded hover:bg-[#121a24]"
                            >
                                🇹🇿 Tanzania Brokers
                            </Link>

                            <Link
                                href="/blog/how-to-trade-in-kenya"
                                className="block px-3 py-2 rounded hover:bg-[#121a24]"
                            >
                                🇰🇪 Kenya Guide
                            </Link>

                            <Link
                                href="/blog/is-exness-legit-in-nigeria"
                                className="block px-3 py-2 rounded hover:bg-[#121a24]"
                            >
                                🇳🇬 Exness Nigeria
                            </Link>

                        </div>
                    </div>

                    <Link href="/blog" className="hover:text-white transition">
                        Blog
                    </Link>

                </nav>

                {/* 🔥 CTA */}
                <div className="hidden md:block">
                    <Link
                        href="/go/exness"
                        className={`px-5 py-2 rounded-lg font-semibold transition ${scrolled
                                ? "bg-yellow-400 text-black shadow-lg"
                                : "bg-[#1f2a36] text-white hover:bg-[#2a3645]"
                            }`}
                    >
                        Start Trading
                    </Link>
                </div>

                {/* 🔥 MOBILE BUTTON */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden text-gray-300 text-xl"
                >
                    ☰
                </button>
            </div>

            {/* 🔥 MOBILE MENU */}
            {open && (
                <div className="md:hidden px-6 pb-6 space-y-4 text-sm text-gray-300 bg-[#020617] border-t border-[#1f2a36]">

                    <Link href="/" className="block">Home</Link>

                    {/* COUNTRIES */}
                    <div className="space-y-2">
                        <p className="text-gray-500 text-xs uppercase">Markets</p>

                        {topMarkets.slice(0, 5).map((c) => (
                            <Link key={c.code} href={`/${c.slug}`} className="block">
                                {c.name}
                            </Link>
                        ))}
                    </div>

                    {/* BLOG LINKS */}
                    <div className="space-y-2">
                        <p className="text-gray-500 text-xs uppercase">Learn</p>

                        <Link href="/blog/best-brokers-in-tanzania" className="block">
                            🇹🇿 Tanzania Brokers
                        </Link>

                        <Link href="/blog/how-to-trade-in-kenya" className="block">
                            🇰🇪 Kenya Guide
                        </Link>

                        <Link href="/blog/is-exness-legit-in-nigeria" className="block">
                            🇳🇬 Exness Nigeria
                        </Link>
                    </div>

                    <Link href="/blog" className="block">Blog</Link>

                    {/* CTA */}
                    <Link
                        href="/go/exness"
                        className="block bg-yellow-400 text-black text-center py-2 rounded-lg font-semibold mt-4"
                    >
                        Start Trading
                    </Link>

                </div>
            )}
        </header>
    );
}