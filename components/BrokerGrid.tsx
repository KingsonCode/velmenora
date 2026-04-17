import { getTopBrokers } from "@/lib/brokers";
import { resolveGeo } from "@/lib/geo";
import type { Broker, CountryCode } from "@/lib/types/broker";

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

export default function BrokerGrid() {
    const geo = resolveGeo();

    const brokers: Broker[] = getTopBrokers(toBrokerCountry(geo.country), 5);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {brokers.map((broker, i) => {
                const isTop = i === 0;

                return (
                    <div
                        key={broker.slug}
                        className={`relative p-5 border rounded-xl text-white transition ${isTop
                                ? "border-yellow-400 bg-gradient-to-b from-yellow-400/10 to-transparent"
                                : "border-gray-700 hover:border-yellow-400"
                            }`}
                    >
                        {/* 🔥 BADGE */}
                        {isTop && (
                            <div className="absolute top-3 right-3 text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                                #1 Recommended
                            </div>
                        )}

                        {/* 🔥 RANK */}
                        <div className="text-xs text-gray-500 mb-1">
                            #{i + 1} in {geo.meta?.name || "your region"}
                        </div>

                        {/* 🔥 NAME */}
                        <h3 className="text-lg font-semibold mb-2">
                            {broker.name}
                        </h3>

                        {/* 🔥 FEATURES / DESCRIPTION */}
                        <p className="text-sm text-gray-400 mb-3">
                            {broker.category.join(" • ")}
                        </p>

                        {/* 🔥 RATING + TRUST */}
                        <div className="flex items-center justify-between text-sm mb-3">
                            <span>⭐ {broker.rating ?? 4.5}</span>
                            <span className="text-green-400">
                                Trusted Broker
                            </span>
                        </div>

                        {/* 🔥 REGIONS */}
                        <div className="text-xs text-gray-500 mb-4">
                            Available in: {broker.regions?.join(", ") || "Global"}
                        </div>

                        {/* 🔥 PAYMENTS (FROM GEO) */}
                        {geo.payments.length > 0 && (
                            <div className="text-xs text-gray-400 mb-4">
                                Payments: {geo.payments.join(", ")}
                            </div>
                        )}

                        {/* 🔥 CTA STACK */}
                        <div className="flex gap-3">
                            <a
                                href={broker.url}
                                target="_blank"
                                className="flex-1 text-center bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
                            >
                                Trade Now
                            </a>

                            <a
                                href={`/brokers/${broker.slug}`}
                                className="flex-1 text-center border border-gray-600 px-4 py-2 rounded-lg text-sm"
                            >
                                Review
                            </a>
                        </div>

                        {/* 🔥 URGENCY (CONVERSION BOOST) */}
                        {isTop && (
                            <div className="mt-3 text-xs text-yellow-400">
                                🔥 High signup rate in your region
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
