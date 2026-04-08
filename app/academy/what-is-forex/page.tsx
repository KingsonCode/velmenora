import Link from "next/link";

export default function WhatIsForex() {
    return (
        <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
            {/* HERO */}
            <section className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    What is Forex Trading?
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed">
                    Forex trading (foreign exchange trading) is the process of buying and selling currencies
                    to make a profit. It is the largest financial market in the world, with over
                    <span className="text-white font-semibold"> $6 trillion traded daily</span>.
                </p>
            </section>

            {/* HOW IT WORKS */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    How the Forex Market Works
                </h2>

                <p className="text-gray-400 leading-relaxed mb-4">
                    In forex trading, currencies are traded in pairs such as EUR/USD or GBP/USD.
                    When you place a trade, you are predicting whether one currency will rise or fall
                    relative to another.
                </p>

                <p className="text-gray-400 leading-relaxed">
                    The market operates 24 hours a day, five days a week, allowing traders around the world
                    to participate at any time.
                </p>
            </section>

            {/* EXAMPLE */}
            <section className="mb-12 bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Simple Example
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    If you believe the Euro (EUR) will increase in value against the US Dollar (USD),
                    you buy the EUR/USD pair. If the price rises, you make a profit. If it falls,
                    you incur a loss.
                </p>
            </section>

            {/* WHY FOREX */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Why Do People Trade Forex?
                </h2>

                <ul className="space-y-3 text-gray-400">
                    <li>✔ High liquidity (easy to enter and exit trades)</li>
                    <li>✔ 24-hour market access</li>
                    <li>✔ Low starting capital requirements</li>
                    <li>✔ Leverage opportunities (trade bigger positions)</li>
                    <li>✔ Global accessibility from anywhere</li>
                </ul>
            </section>

            {/* RISKS (IMPORTANT FOR TRUST + SEO) */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-red-400">
                    Risks of Forex Trading
                </h2>

                <p className="text-gray-400 leading-relaxed mb-4">
                    While forex trading offers opportunities, it also carries significant risk.
                    Many beginners lose money due to lack of knowledge and poor risk management.
                </p>

                <ul className="space-y-2 text-gray-400">
                    <li>• High volatility can cause rapid losses</li>
                    <li>• Over-leverage increases risk exposure</li>
                    <li>• Emotional trading leads to bad decisions</li>
                </ul>
            </section>

            {/* CTA / INTERNAL LINK */}
            <section className="mt-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-3">
                    Ready to Start Trading?
                </h3>

                <p className="text-gray-400 mb-6">
                    Learn step-by-step how to start trading safely as a beginner.
                </p>

                <Link
                    href="/academy/forex-for-beginners"
                    className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
                >
                    Forex for Beginners →
                </Link>
            </section>
        </main>
    );
}