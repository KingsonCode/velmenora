import Link from "next/link";

export default function ForexBeginners() {
    return (
        <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
            {/* HERO */}
            <section className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                    Forex Trading for Beginners
                </h1>

                <p className="text-gray-400 text-lg leading-relaxed">
                    If you're new to forex trading, this guide will help you understand the basics,
                    avoid common mistakes, and start trading the right way.
                </p>
            </section>

            {/* STEP 1 */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 1: Learn the Basics
                </h2>

                <p className="text-gray-400 leading-relaxed mb-4">
                    Before you trade, you need to understand how the market works.
                    Learn key concepts like:
                </p>

                <ul className="space-y-3 text-gray-400">
                    <li>✔ Currency pairs (EUR/USD, GBP/USD)</li>
                    <li>✔ Pips and spreads</li>
                    <li>✔ Leverage and margin</li>
                    <li>✔ Buy vs Sell (long vs short)</li>
                </ul>
            </section>

            {/* STEP 2 */}
            <section className="mb-12 bg-white/5 border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 2: Choose a Reliable Broker
                </h2>

                <p className="text-gray-400 leading-relaxed mb-4">
                    Your broker determines your trading experience. Choose one with:
                </p>

                <ul className="space-y-2 text-gray-400">
                    <li>• Low spreads</li>
                    <li>• Fast withdrawals</li>
                    <li>• Strong regulation</li>
                    <li>• MT4 / MT5 platforms</li>
                </ul>

                <div className="mt-6">
                    <Link href="/explorer" className="text-blue-400 font-semibold">
                        Compare Trusted Brokers →
                    </Link>
                </div>
            </section>

            {/* STEP 3 */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Step 3: Start with a Demo Account
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    A demo account allows you to practice trading without risking real money.
                    This is where you build confidence and test strategies before going live.
                </p>
            </section>

            {/* STEP 4 */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 text-red-400">
                    Step 4: Risk Management (Critical)
                </h2>

                <p className="text-gray-400 mb-4 leading-relaxed">
                    Most beginners lose money because they ignore risk management.
                    Follow these rules:
                </p>

                <ul className="space-y-3 text-gray-400">
                    <li>✔ Never risk more than 1–2% per trade</li>
                    <li>✔ Always use a stop loss</li>
                    <li>✔ Avoid overtrading</li>
                    <li>✔ Stay disciplined</li>
                </ul>
            </section>

            {/* COMMON MISTAKES (SEO BOOST + TRUST) */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">
                    Common Beginner Mistakes
                </h2>

                <ul className="space-y-3 text-gray-400">
                    <li>• Trading without a strategy</li>
                    <li>• Over-leveraging</li>
                    <li>• Letting emotions control decisions</li>
                    <li>• Skipping demo practice</li>
                </ul>
            </section>

            {/* CTA */}
            <section className="mt-16 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-8">
                <h3 className="text-2xl font-semibold mb-3">
                    Ready to Start Trading?
                </h3>

                <p className="text-gray-400 mb-6">
                    Explore trusted forex brokers and open your first trading account today.
                </p>

                <Link
                    href="/explorer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-lg font-semibold"
                >
                    View Best Forex Brokers →
                </Link>
            </section>
        </main>
    );
}