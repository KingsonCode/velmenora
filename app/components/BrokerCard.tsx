"use client";

import CTAButton from "./CTAButton";

type Broker = {
    name: string;
    slug: string;
    description: string;
    features: string[];
    rating?: number;
    badge?: string;
    link?: string; // 🔥 optional (for override)
};

export default function BrokerCard({
    broker,
    country,
}: {
    broker: Broker;
    country: string;
}) {
    return (
        <div
            className="
      group relative
      bg-[#121A24]
      rounded-2xl p-6
      border border-[#1f2a36]
      flex flex-col items-center text-center
      transition-all duration-300
      hover:scale-[1.02] hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10
    "
        >
            {/* 🔥 HOVER GLOW */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-blue-500/5 blur-xl"></div>

            {/* HEADER */}
            <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                <h2 className="text-xl font-semibold">{broker.name}</h2>

                {broker.badge && (
                    <span className="text-xs bg-blue-600 px-3 py-1 rounded-full">
                        {broker.badge}
                    </span>
                )}
            </div>

            {/* ⭐ RATING */}
            {broker.rating && (
                <div className="mb-3 text-yellow-400 text-sm">
                    ⭐ {broker.rating}/5 Rating
                </div>
            )}

            {/* DESCRIPTION */}
            <p className="text-gray-400 text-sm mb-4 max-w-md leading-relaxed">
                {broker.description}
            </p>

            {/* 🔥 TRUST LINE */}
            <p className="text-xs text-green-400 mb-4">
                ✔ Verified & Trusted Broker
            </p>

            {/* FEATURES */}
            <ul className="space-y-2 mb-6 text-sm text-gray-300 text-left w-full max-w-xs mx-auto">
                {broker.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                        <span className="text-green-400 mr-2 mt-[2px]">✔</span>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* 🔥 CTA (TRACKED + DYNAMIC) */}
            <div className="mt-auto w-full">
                <CTAButton
                    broker={broker.slug}
                    country={country}
                    href={broker.link} // optional override
                    text={`Trade with ${broker.name}`}
                    className="inline-block w-full bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-center"
                />
            </div>
        </div>
    );
}