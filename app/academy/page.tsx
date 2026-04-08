import Link from "next/link";

export default function AcademyPage() {
    return (
        <main className="max-w-6xl mx-auto px-4 py-16">
            {/* HERO */}
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">
                    Forex Trading Academy
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Learn forex trading from beginner to advanced level.
                    Master strategies, risk management, and how to trade profitably.
                </p>
            </section>

            {/* CORE GUIDES */}
            <section className="grid md:grid-cols-3 gap-6">
                <Link href="/academy/what-is-forex" className="p-6 border rounded-xl hover:shadow-lg">
                    <h2 className="font-semibold text-xl mb-2">What is Forex?</h2>
                    <p className="text-gray-600">
                        Understand how the forex market works and how money is made.
                    </p>
                </Link>

                <Link href="/academy/forex-for-beginners" className="p-6 border rounded-xl hover:shadow-lg">
                    <h2 className="font-semibold text-xl mb-2">Forex for Beginners</h2>
                    <p className="text-gray-600">
                        Step-by-step beginner guide to start trading safely.
                    </p>
                </Link>

                <Link href="/academy/how-to-trade-forex" className="p-6 border rounded-xl hover:shadow-lg">
                    <h2 className="font-semibold text-xl mb-2">How to Trade Forex</h2>
                    <p className="text-gray-600">
                        Learn strategies, analysis, and execution techniques.
                    </p>
                </Link>
            </section>

            {/* CTA */}
            <section className="mt-16 text-center">
                <h3 className="text-2xl font-semibold mb-4">
                    Ready to Start Trading?
                </h3>
                <p className="text-gray-600 mb-6">
                    Choose a trusted forex broker and begin your journey today.
                </p>

                <Link
                    href="/explore"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
                >
                    Explore Top Forex Brokers
                </Link>
            </section>
        </main>
    );
}