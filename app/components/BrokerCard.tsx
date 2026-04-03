"use client";

import CTAButton from "./CTAButton";

type Broker = {
    name: string;
    slug: string;
    description: string;
    features: string[];
    rating?: number;
    badge?: string;
};

export default function BrokerCard({ broker }: { broker: Broker }) {
    return (
        <div className="bg-[#121A24] rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-[#1f2a36] flex flex-col items-center text-center">

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
            <p className="text-gray-400 text-sm mb-4 max-w-md">
                {broker.description}
            </p>

            {/* 🔥 TRUST LINE */}
            <p className="text-xs text-green-400 mb-3">
                ✔ Verified & Trusted Broker
            </p>

            {/* FEATURES */}
            <ul className="space-y-2 mb-6 text-sm text-gray-300 text-left w-full max-w-xs mx-auto">
                {broker.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-start">
                        <span className="text-green-400 mr-2">✔</span>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto">
                <CTAButton broker={broker.slug} />
            </div>
        </div>
    );
}