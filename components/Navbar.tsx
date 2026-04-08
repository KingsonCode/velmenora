"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getByTier } from "@/lib/countries";

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

    /* 🔥 ACTIVE LINK */
    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* ================= HEADER ================= */}
            <header
                className={`fixed top-0 left-0 w-full z-[999] transition-all duration-300 ${scrolled
                    ? "bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 shadow-lg"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                    {/* LOGO */}
                    <Link href="/" className="text-xl font-bold tracking-wide">
                        Velmenora
                    </Link>

                    {/* DESKTOP NAV */}
                    <nav className="hidden md:flex items-center gap-8 text-sm">

                        <Link
                            href="/"
                            className={`transition ${isActive("/") ? "text-white" : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Home
                        </Link>

                        <Link
                            href="/compare"
                            className={`transition ${isActive("/compare")
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Compare
                        </Link>

                        {/* DROPDOWN */}
                        <div className="relative group">
                            <span className="cursor-pointer text-gray-400 group-hover:text-white transition">
                                Markets ▾
                            </span>

                            <div className="absolute left-0 mt-4 w-64 bg-[#020617]/95 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-3 space-y-2 shadow-2xl">
                                {topMarkets.slice(0, 5).map((c) => (
                                    <Link
                                        key={c.code}
                                        href={`/${c.slug}`}
                                        className="block px-3 py-2 rounded-lg hover:bg-white/5 transition"
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/blog"
                            className={`transition ${isActive("/blog")
                                ? "text-white"
                                : "text-gray-400 hover:text-white"
                                }`}
                        >
                            Blog
                        </Link>
                    </nav>

                    {/* 🔥 CTA (FIXED FUNNEL) */}
                    <div className="hidden md:block">
                        <Link
                            href="/compare"
                            className={`
                px-5 py-2 rounded-xl font-semibold transition-all duration-300
                ${scrolled
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-black shadow-lg hover:scale-105"
                                    : "bg-white/10 backdrop-blur text-white hover:bg-white/20"
                                }
              `}
                        >
                            Start Trading
                        </Link>
                    </div>

                    {/* MOBILE BUTTON */}
                    <button
                        onClick={() => setOpen(true)}
                        className="md:hidden text-2xl text-gray-300"
                    >
                        ☰
                    </button>
                </div>
            </header>

            {/* ================= MOBILE ONLY ================= */}
            <div className="md:hidden">

                {/* OVERLAY */}
                <div
                    className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition ${open ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                    onClick={() => setOpen(false)}
                />

                {/* MENU */}
                <div
                    className={`fixed top-0 right-0 h-full w-[80%] max-w-sm bg-[#020617] z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-6 flex flex-col h-full">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-bold">Menu</h2>
                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        {/* LINKS */}
                        <div className="space-y-6 text-gray-300">

                            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
                            <Link href="/compare" onClick={() => setOpen(false)}>Compare</Link>

                            <div>
                                <p className="text-xs text-gray-500 mb-2 uppercase">Markets</p>
                                <div className="space-y-2">
                                    {topMarkets.slice(0, 5).map((c) => (
                                        <Link
                                            key={c.code}
                                            href={`/${c.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="block"
                                        >
                                            {c.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
                        </div>

                        {/* CTA */}
                        <div className="mt-auto">
                            <Link
                                href="/compare"
                                onClick={() => setOpen(false)}
                                className="block bg-gradient-to-r from-yellow-400 to-yellow-300 text-black text-center py-3 rounded-xl font-semibold mt-6"
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