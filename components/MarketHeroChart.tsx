"use client";

import Sparkline from "./Sparkline";

const sampleData = Array.from({ length: 40 }, (_, i) => {
    let base = 1.1;
    base += (Math.random() - 0.5) * 0.01;
    return base;
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

                {/* 🔥 BIG CHART */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">

                    <div className="h-40 w-full">
                        <Sparkline data={sampleData} />
                    </div>

                </div>

            </div>
        </section>
    );
}