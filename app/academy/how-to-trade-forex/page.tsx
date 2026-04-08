import Link from "next/link";

export default function HowToTradeForex() {
    return (
        <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
            {/* HERO */}
            <section className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    How to Trade Forex (Step-by-Step)
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed">
                    Forex trading involves analyzing the market, placing trades, and managing risk.
                    This step-by-step guide will show you how professional traders approach the market.
                </p>
            </section>

            {/* STEP 1 */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 1: Market Analysis
                </h2>

                <p className="text-gray-400 mb-4 leading-relaxed">
                    Before entering any trade, you must analyze the market direction.
                    There are two main approaches:
                </p>

                <ul className="space-y-3 text-gray-400">
                    <li>✔ <span className="text-white">Technical Analysis</span> – using charts, patterns, and indicators</li>
                    <li>✔ <span className="text-white">Fundamental Analysis</span> – analyzing news and economic events</li>
                </ul>
            </section>

            {/* STEP 2 */}
            <section className="mb-12 bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 2: Entry Strategy
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    A good trader never enters randomly. Use proven tools like:
                </p>

                <ul className="mt-4 space-y-2 text-gray-400">
                    <li>• Support & Resistance levels</li>
                    <li>• RSI (Relative Strength Index)</li>
                    <li>• Moving Averages</li>
                    <li>• Trendlines</li>
                </ul>
            </section>

            {/* STEP 3 */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-red-400">
                    Step 3: Risk Management (Most Important)
                </h2>

                <p className="text-gray-400 mb-4 leading-relaxed">
                    This is where most beginners fail. Protecting your capital is more important than making profits.
                </p>

                <ul className="space-y-3 text-gray-400">
                    <li>✔ Risk only 1–2% per trade</li>
                    <li>✔ Always set a stop loss</li>
                    <li>✔ Define your take profit before entering</li>
                    <li>✔ Avoid overtrading</li>
                </ul>
            </section>

            {/* STEP 4 */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 4: Execute the Trade
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    Once your analysis and risk setup are ready, execute your trade using a trading platform
                    like MT4 or MT5. Stick to your plan and avoid emotional decisions.
                </p>
            </section>

            {/* STEP 5 (ADVANCED TOUCH) */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 5: Review & Improve
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    After every trade, review what worked and what didn’t. Keep a trading journal
                    and continuously refine your strategy.
                </p>
            </section>

            {/* CTA */}
            <section className="mt-16 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-3">
                    Ready to Trade Live?
                </h3>

                <p className="text-gray-400 mb-6">
                    Choose a trusted forex broker and start trading with confidence.
                </p>

                <Link
                    href="/explorer"
                    className="inline-block bg-green-600 hover:bg-green-700 transition px-6 py-3 rounded-lg font-semibold"
                >
                    Open Trading Account →
                </Link>
            </section>
        </main>
    );
}