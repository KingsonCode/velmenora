import Link from "next/link";

/* ================= GLOBAL HOMEPAGE ================= */
export default function Home() {
    return (
        <main className="min-h-screen bg-[#0B0F1A] text-white">

            {/* HERO */}
            <section className="text-center py-20 px-6">
                <h1 className="text-4xl font-bold mb-4">
                    Find & Compare the Best Forex Brokers Worldwide
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Discover top-rated forex brokers, compare spreads, fees, and platforms,
                    and choose the best broker for your trading journey.
                </p>

                {/* CTA */}
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/en/tz"
                        className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold"
                    >
                        🇹🇿 Brokers in Tanzania
                    </Link>

                    <Link
                        href="/en/ke"
                        className="bg-white/10 px-6 py-3 rounded-lg"
                    >
                        🇰🇪 Brokers in Kenya
                    </Link>
                </div>
            </section>

            {/* TOP BROKERS */}
            <section className="max-w-5xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-semibold mb-6">
                    Top Forex Brokers (Global)
                </h2>

                <div className="grid gap-6">
                    <div className="p-6 border border-yellow-500 rounded-lg">
                        <h3 className="text-xl font-bold">Exness</h3>
                        <p className="text-gray-400">
                            Best overall forex broker for global traders.
                        </p>
                        <Link href="/brokers/exness" className="text-yellow-400 mt-2 block">
                            Read Review →
                        </Link>
                    </div>

                    <div className="p-6 border border-yellow-500 rounded-lg">
                        <h3 className="text-xl font-bold">IC Markets</h3>
                        <p className="text-gray-400">
                            Lowest spreads for scalping and advanced traders.
                        </p>
                        <Link href="/brokers/ic-markets" className="text-yellow-400 mt-2 block">
                            Read Review →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}