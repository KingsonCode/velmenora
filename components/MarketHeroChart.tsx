"use client";

import dynamic from "next/dynamic";

/* 🔥 SSR SAFE IMPORT */
const MarketChart = dynamic(() => import("./MarketChart"), {
    ssr: false,
});

/* 🔥 MOCK DATA (REALISTIC FOREX STYLE) */
const sampleData = Array.from({ length: 40 }, (_, i) => {
    let base = 1.08;
    base += (Math.random() - 0.5) * 0.01;

    return {
        time: `${9 + Math.floor(i / 4)}:${(i % 4) * 15}`.padStart(5, "0"),
        price: Number(base.toFixed(5)),
    };
});

export default function MarketHeroChart() {
    return (
        <section className="py-12 border-b border-white/10">

            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">
                            EUR/USD Live Market
                        </h2>
                        <p className="text-sm text-gray-400">
                            Real-time market sentiment & trend overview
                        </p>
                    </div>

                    <div className="text-green-400 font-semibold text-lg">
                        1.08432
                    </div>
                </div>

                {/* 🔥 CHART CARD */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                    {/* 🔥 IMPORTANT WRAPPER */}
                    <div className="w-full min-w-0">
                        <MarketChart data={sampleData} />
                    </div>

                </div>

            </div>
        </section>
    );
}