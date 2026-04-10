import Link from "next/link";
import { MARKETS } from "@/data/markets";

/* ================= PAGE ================= */

export default function MarketsIndex() {
    return (
        <main className="bg-black text-white min-h-screen">

            {/* 🔥 HERO */}
            <section className="border-b border-white/10 py-10 px-6 text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Forex & Crypto Markets
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Explore live charts, sentiment analysis, market news, and top brokers
                    for each trading pair.
                </p>
            </section>

            {/* 🔥 MARKETS GRID */}
            <section className="max-w-6xl mx-auto px-4 py-10">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

                    {MARKETS.map((market) => {
                        const pair = market.symbol;
                        const base = pair.slice(0, 3);
                        const quote = pair.slice(3);

                        return (
                            <Link
                                key={pair}
                                href={`/markets/${pair}`} // 🔥 NO LOWERCASE (FIX 404)
                                className="group p-5 rounded-xl border border-gray-800 bg-white/5 hover:border-blue-500 hover:bg-white/10 transition-all"
                            >
                                {/* 🔥 PAIR */}
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-lg font-semibold">
                                        {base}/{quote}
                                    </h2>

                                    <span className="text-xs text-green-400">
                                        ● LIVE
                                    </span>
                                </div>

                                {/* 🔥 NAME */}
                                <p className="text-sm text-gray-400 mb-4">
                                    {market.name}
                                </p>

                                {/* 🔥 META INFO */}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{market.type}</span>
                                    <span className="group-hover:text-blue-400 transition">
                                        View →
                                    </span>
                                </div>

                            </Link>
                        );
                    })}

                </div>
            </section>

            {/* 🔥 CTA (MONETIZATION READY) */}
            <section className="border-t border-white/10 py-12 text-center px-6">
                <h3 className="text-xl font-semibold mb-3">
                    Ready to Trade These Markets?
                </h3>
                <p className="text-gray-400 mb-6">
                    Compare top forex brokers and start trading today.
                </p>

                <Link
                    href="/brokers"
                    className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                >
                    View Top Brokers
                </Link>
            </section>

        </main>
    );
}