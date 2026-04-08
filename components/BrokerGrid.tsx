"use client";

import BrokerCard from "components/BrokerCard";
import { brokers } from "@/data/brokers";

/* 🔥 CONFIG */
const USER_COUNTRY = "tanzania";

export default function BrokerGrid() {
    /* =========================================================
       🔥 STEP 1: GEO FILTER
    ========================================================= */
    const geoFiltered = brokers.filter(
        (b) =>
            !b.countries || b.countries.includes(USER_COUNTRY)
    );

    /* =========================================================
       🔥 STEP 2: SMART SORT (RANKING ENGINE)
       score = rating + reviews weight
    ========================================================= */
    const sorted = [...geoFiltered].sort((a, b) => {
        const scoreA = a.rating + (a.reviews || 0) / 10000;
        const scoreB = b.rating + (b.reviews || 0) / 10000;
        return scoreB - scoreA;
    });

    /* =========================================================
       🔥 TOP BROKER (HIGH CONVERSION TRICK)
    ========================================================= */
    const topBroker = sorted[0];
    const rest = sorted.slice(1);

    return (
        <section id="brokers" className="py-20 px-6 bg-dark text-white">

            {/* 🔥 HEADER (SEO) */}
            <div className="max-w-6xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Best Forex Brokers in Tanzania (2026)
                </h2>

                <p className="text-gray-400 max-w-2xl mx-auto">
                    Compare top-rated forex brokers with low spreads, fast withdrawals, and strong regulation.
                </p>
            </div>

            {/* =========================================================
         🥇 TOP BROKER (FEATURED)
      ========================================================= */}
            {topBroker && (
                <div className="max-w-5xl mx-auto mb-14">

                    <div className="relative bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/20 rounded-2xl p-8 shadow-premium backdrop-blur-md">

                        <div className="absolute top-4 left-4 bg-gradient-primary px-4 py-1 text-sm rounded-full font-semibold shadow-glow">
                            #1 Recommended
                        </div>

                        <div className="text-center mt-6">
                            <h3 className="text-2xl font-bold mb-2">
                                {topBroker.name}
                            </h3>

                            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
                                {topBroker.description}
                            </p>

                            <div className="flex flex-wrap justify-center gap-3 mb-6 text-sm text-gray-300">
                                {topBroker.features.slice(0, 3).map((f, i) => (
                                    <span
                                        key={i}
                                        className="bg-white/10 px-3 py-1 rounded-full"
                                    >
                                        {f}
                                    </span>
                                ))}
                            </div>

                            {/* 🔥 CTA */}
                            <a
                                href={topBroker.link}
                                className="inline-block bg-gradient-primary shadow-glow hover:shadow-glow-lg px-8 py-4 rounded-xl font-semibold transition"
                            >
                                Open Account →
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* =========================================================
         🔥 GRID (REST OF BROKERS)
      ========================================================= */}
            <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((broker, i) => (
                    <BrokerCard
                        key={broker.id}
                        broker={broker}
                        rank={i + 2} // because #1 is featured
                        country={USER_COUNTRY}
                    />
                ))}
            </div>

            {/* =========================================================
         🔍 SEO PARAGRAPH (VERY IMPORTANT)
      ========================================================= */}
            <div className="max-w-4xl mx-auto mt-16 text-gray-400 text-sm leading-relaxed text-center">
                Choosing the best forex broker in Tanzania depends on spreads, withdrawal speed, and regulation.
                Our rankings are based on real trader feedback, platform reliability, and overall trading conditions.
                Always trade responsibly and verify broker regulations before opening an account.
            </div>

        </section>
    );
}