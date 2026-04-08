"use client";

import CTAButton from "@/components/CTAButton";
import { AIResult } from "@/lib/ai/recommendBroker";

export default function AIRecommendation({
    data,
}: {
    data: AIResult | null;
}) {
    if (!data) return null;

    const { broker, reasons, badges, score } = data;

    return (
        <div className="relative max-w-5xl mx-auto mb-12 p-8 rounded-2xl border border-yellow-400/30 bg-gradient-to-b from-yellow-500/10 to-transparent text-center overflow-hidden">

            {/* 🔥 GLOW */}
            <div className="absolute inset-0 bg-yellow-500/10 blur-2xl opacity-30 pointer-events-none" />

            {/* 🤖 LABEL */}
            <p className="text-sm text-yellow-400 mb-2 tracking-wide">
                🤖 AI Recommendation
            </p>

            {/* 🏆 TITLE */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Best Broker for You:{" "}
                <span className="text-yellow-400">{broker.name}</span>
            </h2>

            {/* 🧠 REASONS */}
            <div className="flex flex-wrap justify-center gap-3 mb-5">
                {reasons.map((r, i) => (
                    <span
                        key={i}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300"
                    >
                        ✔ {r}
                    </span>
                ))}
            </div>

            {/* 🔥 BADGES */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {badges.map((b, i) => (
                    <span
                        key={i}
                        className="px-3 py-1 bg-yellow-500 text-black text-xs rounded-full font-semibold shadow"
                    >
                        {b}
                    </span>
                ))}
            </div>

            {/* 🚀 CTA */}
            <CTAButton
                broker={broker.slug}
                country="tanzania"
                position="mid"
                text={`🚀 Start with ${broker.name}`}
                className="inline-block bg-yellow-500 text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition shadow-lg"
            />

            {/* 🧪 DEBUG (optional) */}
            {process.env.NODE_ENV === "development" && (
                <p className="text-xs text-gray-500 mt-4">
                    Score: {score}
                </p>
            )}
        </div>
    );
}