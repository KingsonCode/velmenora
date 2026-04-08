export default function ForexBeginners() {
    return (
        <main className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold mb-6">
                Forex Trading for Beginners
            </h1>

            <p className="text-gray-700 mb-6">
                If you're new to forex trading, this guide will help you understand
                the basics and avoid common beginner mistakes.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 1: Learn the Basics
            </h2>

            <p className="text-gray-700 mb-6">
                Understand currency pairs, pips, spreads, and leverage before risking money.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 2: Choose a Broker
            </h2>

            <p className="text-gray-700 mb-6">
                Select a trusted forex broker with low spreads and fast withdrawals.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 3: Start with Demo Account
            </h2>

            <p className="text-gray-700 mb-6">
                Practice trading without risking real money.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">
                Step 4: Risk Management
            </h2>

            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Never risk more than 1-2% per trade</li>
                <li>Use stop loss</li>
                <li>Avoid overtrading</li>
            </ul>

            {/* CTA */}
            <div className="mt-12 p-6 bg-blue-50 rounded-xl">
                <h3 className="font-semibold mb-2">
                    Start Trading Now
                </h3>

                <a href="/explore" className="text-blue-600 font-semibold">
                    View Best Forex Brokers →
                </a>
            </div>
        </main>
    );
}