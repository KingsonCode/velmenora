import Link from "next/link";

export default function AcademyPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
            {/* HERO */}
            <section className="text-center mb-20">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                    Forex Trading Academy
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                    Learn forex trading from beginner to advanced level.
                    Master strategies, risk management, and how to trade profitably.
                </p>
            </section>

            {/* CORE GUIDES */}
            <section className="grid md:grid-cols-3 gap-8">
                <Link
                    href="/academy/what-is-forex"
                    className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500 hover:bg-white/10 transition-all duration-300"
                >
                    <h2 className="font-semibold text-2xl mb-3 group-hover:text-blue-400 transition">
                        What is Forex?
                    </h2>

                    <p className="text-gray-400 leading-relaxed">
                        Understand how the forex market works and how traders make money globally.
                    </p>
                </Link>

                <Link
                    href="/academy/forex-for-beginners"
                    className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500 hover:bg-white/10 transition-all duration-300"
                >
                    <h2 className="font-semibold text-2xl mb-3 group-hover:text-blue-400 transition">
                        Forex for Beginners
                    </h2>

                    <p className="text-gray-400 leading-relaxed">
                        A step-by-step guide to help you start trading safely and confidently.
                    </p>
                </Link>

                <Link
                    href="/academy/how-to-trade-forex"
                    className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500 hover:bg-white/10 transition-all duration-300"
                >
                    <h2 className="font-semibold text-2xl mb-3 group-hover:text-blue-400 transition">
                        How to Trade Forex
                    </h2>

                    <p className="text-gray-400 leading-relaxed">
                        Learn trading strategies, analysis methods, and execution techniques.
                    </p>
                </Link>
            </section>

            {/* CTA */}
            <section className="mt-24 text-center bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-10">
                <h3 className="text-3xl font-semibold mb-4">
                    Ready to Start Trading?
                </h3>

                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                    Choose a trusted forex broker and begin your trading journey today.
                </p>

                <Link
                    href="/explorer"
                    className="inline-block bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold text-lg"
                >
                    Explore Top Forex Brokers →
                </Link>
            </section>
        </main>
    );
}