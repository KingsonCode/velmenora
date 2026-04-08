"use client";

import SearchBox from "./SearchBox";

export default function Hero() {
    return (
        <section className="relative py-28 px-4 text-center text-white overflow-hidden">

            {/* 🔥 BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-black" />

            {/* 🔥 GLOW EFFECT */}
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-500/20 blur-[140px] rounded-full" />

            {/* 🔥 GRID TEXTURE */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')]" />

            {/* 🔥 CONTENT */}
            <div className="relative max-w-5xl mx-auto">

                {/* 💥 HEADLINE */}
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                    Find & Compare the{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                        Best Forex Brokers
                    </span>{" "}
                    in Africa
                </h1>

                {/* ✨ SUBHEADLINE */}
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                    Discover trusted brokers, compare features, and trade with confidence —
                    all in one powerful platform.
                </p>

                {/* 🔎 SEARCH */}
                <div className="mb-6">
                    <SearchBox />
                </div>

                {/* ⚡ QUICK SEARCH (HIGH CTR) */}
                <div className="flex flex-wrap justify-center gap-3 mb-10 text-sm">
                    {["Exness", "XM", "Deriv", "IC Markets"].map((item) => (
                        <a
                            key={item}
                            href={`/search?q=${item}`}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition"
                        >
                            🔎 {item}
                        </a>
                    ))}
                </div>

                {/* 🚀 CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                    <a
                        href="/explorer"
                        className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition shadow-xl"
                    >
                        🚀 Explore Top Brokers
                    </a>

                    <a
                        href="/compare"
                        className="border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
                    >
                        📊 Compare Brokers
                    </a>
                </div>

                {/* 🔥 LIVE STATS */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-2xl font-bold text-yellow-400">42+</p>
                        <p className="text-sm text-gray-400">Brokers Reviewed</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-2xl font-bold text-green-400">$0</p>
                        <p className="text-sm text-gray-400">Commission Brokers</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 col-span-2 md:col-span-1">
                        <p className="text-2xl font-bold text-blue-400">Updated</p>
                        <p className="text-sm text-gray-400">Daily Rankings</p>
                    </div>

                </div>

                {/* ✅ TRUST */}
                <div className="mt-8 text-sm text-gray-400 flex flex-wrap justify-center gap-4">
                    <span>✔ Trusted by 10,000+ traders</span>
                    <span>✔ Real user reviews</span>
                    <span>✔ No hidden bias</span>
                </div>

            </div>
        </section>
    );
}