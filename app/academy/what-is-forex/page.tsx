export default function WhatIsForex() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-6">
                What is Forex Trading?
            </h1>

            <p className="text-gray-700 mb-6">
                Forex trading (foreign exchange trading) is the process of buying
                and selling currencies to make a profit. It is the largest financial
                market in the world, with over $6 trillion traded daily.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                How Forex Market Works
            </h2>

            <p className="text-gray-700 mb-6">
                In forex, currencies are traded in pairs such as EUR/USD or GBP/USD.
                When you trade, you are speculating whether one currency will rise or fall
                against another.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Example
            </h2>

            <p className="text-gray-700 mb-6">
                If you believe EUR will rise against USD, you buy EUR/USD.
                If the price goes up, you make profit.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Why Trade Forex?
            </h2>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>High liquidity (easy to buy/sell)</li>
                <li>24-hour market</li>
                <li>Low starting capital</li>
                <li>Leverage opportunities</li>
            </ul>

            {/* INTERNAL LINK */}
            <div className="mt-12 p-6 bg-gray-100 rounded-xl">
                <h3 className="font-semibold mb-2">
                    Next Step
                </h3>
                <p className="mb-3">
                    Learn how to start as a beginner:
                </p>

                <a href="/academy/forex-for-beginners" className="text-blue-600 font-semibold">
                    Forex for Beginners →
                </a>
            </div>
        </main>
    );
}