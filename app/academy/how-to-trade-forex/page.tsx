export default function HowToTradeForex() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-6">
                How to Trade Forex (Step-by-Step)
            </h1>

            <p className="text-gray-700 mb-6">
                Forex trading involves analyzing the market, placing trades, and managing risk.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 1: Market Analysis
            </h2>

            <p className="text-gray-700 mb-6">
                There are two main types of analysis:
            </p>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Technical Analysis (charts, patterns)</li>
                <li>Fundamental Analysis (news, economy)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 2: Entry Strategy
            </h2>

            <p className="text-gray-700 mb-6">
                Use indicators like RSI, Moving Averages, and support/resistance.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 3: Risk Management
            </h2>

            <p className="text-gray-700 mb-6">
                Always define your stop loss and take profit before entering a trade.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 4: Execute Trade
            </h2>

            <p className="text-gray-700 mb-6">
                Use platforms like MT4 or MT5 to place trades.
            </p>

            {/* CTA */}
            <div className="mt-12 p-6 bg-green-50 rounded-xl">
                <h3 className="font-semibold mb-2">
                    Ready to Trade Live?
                </h3>

                <a href="/explore" className="text-green-600 font-semibold">
                    Open Trading Account →
                </a>
            </div>
        </main>
    );
}