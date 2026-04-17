import { getGeo } from "@/lib/geo/request";
import type { CountryCode } from "@/lib/types/broker";
import { getTopBrokers, getAllBrokers } from "@/lib/brokers";

import BrokerCard from "@/components/BrokerCard";

const BROKER_COUNTRIES = new Set<CountryCode>([
    "TZ",
    "KE",
    "NG",
    "ZA",
    "UG",
    "GH",
    "GLOBAL",
]);

function toBrokerCountry(code?: string | null): CountryCode {
    return code && BROKER_COUNTRIES.has(code as CountryCode)
        ? (code as CountryCode)
        : "GLOBAL";
}

/* ================= PAGE ================= */
export default async function BrokersPage() {
    const geo = await getGeo();

    const { config, intent } = geo;
    const brokerCountry = toBrokerCountry(geo.country);

    /* 🔥 SMART TOP BROKERS */
    const top = getTopBrokers(brokerCountry, 3);

    /* 🔥 ALL BROKERS */
    const all = getAllBrokers();

    const best = top[0]; // 🔥 safe reference

    return (
        <main className="max-w-7xl mx-auto px-6 py-12">

            {/* 🔥 HERO */}
            <section className="mb-16 text-center">
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                    Best Forex Brokers {config.seo?.keyword_modifier || "Global"} (2026)
                </h1>

                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Discover top-rated brokers optimized for your region, payment methods,
                    and trading experience.
                </p>
            </section>

            {/* 🏆 TOP PICKS */}
            <section className="mb-20">
                <h2 className="text-2xl font-bold mb-6">
                    🔥 Top Brokers for You
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {top.map((b, i) => (
                        <BrokerCard
                            key={b.slug}
                            broker={b}
                            rank={i + 1}
                            highlight={i === 0}
                            geo={geo} // 🔥 full geo passed
                        />
                    ))}
                </div>
            </section>

            {/* 📊 ALL BROKERS */}
            <section className="mb-24">
                <h2 className="text-2xl font-bold mb-6">
                    All Forex Brokers
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {all.map((b, i) => (
                        <BrokerCard
                            key={b.slug}
                            broker={b}
                            rank={i + 1}
                            geo={geo}
                        />
                    ))}
                </div>
            </section>

            {/* 💡 TRUST BLOCK */}
            <section className="bg-gray-900 p-10 rounded-2xl border border-gray-800 mb-24">
                <h2 className="text-2xl font-bold mb-4">
                    How We Rank Brokers
                </h2>

                <p className="text-gray-400 mb-4 leading-relaxed">
                    Our ranking engine adapts to your location, preferred payment methods,
                    and trading experience. We analyze execution speed, withdrawal reliability,
                    and trust signals to recommend the best brokers for you.
                </p>

                <ul className="text-gray-400 space-y-2">
                    <li>✔ Low spreads & execution quality</li>
                    <li>✔ Fast withdrawals (local methods supported)</li>
                    <li>✔ Trusted & regulated brokers</li>
                    <li>✔ Platform stability & performance</li>
                </ul>
            </section>

            {/* 🚀 FINAL CTA */}
            {best && (
                <section className="text-center py-16 bg-gradient-to-br from-green-900 to-black rounded-2xl">
                    <h2 className="text-3xl font-bold mb-4">
                        Start Trading Today
                    </h2>

                    <p className="text-gray-300 mb-6">
                        Join traders already using the best broker for your region.
                    </p>

                    <a
                        href={`/go/${best.slug}?src=brokers_page`}
                        className="bg-green-600 px-10 py-5 rounded-xl text-xl font-semibold"
                    >
                        🚀 Open {best.name}
                    </a>
                </section>
            )}

        </main>
    );
}
