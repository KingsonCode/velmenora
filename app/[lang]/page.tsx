import { getAllBrokers } from "@/lib/brokers";
import { buildCTA } from "@/lib/seo";

import TrackedCTA from "@/components/tracking/TrackedCTA";
import TrackingView from "@/components/tracking/TrackingView";

import Link from "next/link";

/* ================= PAGE ================= */

export default function HomePage({
    params,
}: {
    params: { lang: string };
}) {
    const brokers = getAllBrokers().slice(0, 5);

    const ctaText = buildCTA();

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

            {/* ================= TRACKING ================= */}
            <TrackingView page="home" />

            {/* ================= HERO ================= */}
            <section className="text-center space-y-6">
                <h1 className="text-4xl font-bold">
                    Trade Forex with Trusted Brokers
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto">
                    Compare top forex brokers with low spreads, fast withdrawals,
                    and reliable platforms. Find the best broker for your trading needs.
                </p>

                <div className="flex justify-center gap-4 mt-6">
                    <Link
                        href={`/${params.lang}/best-forex-brokers`}
                        className="bg-white text-black px-6 py-3 rounded-xl"
                    >
                        Compare Brokers
                    </Link>

                    <Link
                        href={`/${params.lang}/best-brokers-in/tanzania`}
                        className="border px-6 py-3 rounded-xl"
                    >
                        Find Brokers in Your Country
                    </Link>
                </div>
            </section>

            {/* ================= TOP BROKERS ================= */}
            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">
                    Top Forex Brokers
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {brokers.map((b) => (
                        <div
                            key={b.slug}
                            className="border rounded-xl p-6 space-y-4"
                        >
                            <h3 className="text-xl font-semibold">
                                {b.name}
                            </h3>

                            <p className="text-gray-400">
                                Rating: {b.rating ?? "N/A"} ⭐
                            </p>

                            <p className="text-gray-400">
                                Min Deposit: ${b.minDeposit ?? "N/A"}
                            </p>

                            <TrackedCTA
                                broker={b}
                                page="home"
                                cta="list"
                                className="bg-green-600 px-4 py-2 rounded-lg"
                            >
                                {ctaText}
                            </TrackedCTA>
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= WHY US ================= */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Why Choose Velmenora?
                </h2>

                <ul className="list-disc pl-6 text-gray-400 space-y-2">
                    <li>Compare brokers easily</li>
                    <li>Find best trading conditions</li>
                    <li>Access fast withdrawals</li>
                    <li>Trusted global platforms</li>
                </ul>
            </section>

            {/* ================= INTERNAL SEO LINKS ================= */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Explore More
                </h2>

                <div className="flex flex-wrap gap-4">
                    <Link href={`/${params.lang}/compare/exness-vs-xm`}>
                        Exness vs XM
                    </Link>

                    <Link href={`/${params.lang}/compare/exness-vs-deriv`}>
                        Exness vs Deriv
                    </Link>

                    <Link href={`/${params.lang}/best-brokers-in/kenya`}>
                        Brokers in Kenya
                    </Link>

                    <Link href={`/${params.lang}/best-brokers-in/nigeria`}>
                        Brokers in Nigeria
                    </Link>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">
                    Start Trading Today
                </h2>

                <p className="text-gray-400">
                    Choose a trusted broker and begin your trading journey now.
                </p>

                <Link
                    href={`/${params.lang}/best-forex-brokers`}
                    className="bg-green-600 px-6 py-3 rounded-xl"
                >
                    View Top Brokers
                </Link>
            </section>

        </div>
    );
}