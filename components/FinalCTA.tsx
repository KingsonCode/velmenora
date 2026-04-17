"use client";

import CTAButton from "@/components/CTAButton";
import Link from "next/link";
import { getFinalCTAContent, Lang } from "@/lib/i18n";

/* ================= TYPES ================= */
type Props = {
    lang?: Lang;
    country?: string;
    topBroker?: {
        slug: string;
        name: string;
    };
};

/* ================= COMPONENT ================= */
export default function FinalCTA({
    lang = "en",
    country = "global",
    topBroker = { slug: "exness", name: "Exness" },
}: Props) {
    const t = getFinalCTAContent(lang);

    return (
        <section className="relative py-24 text-center text-white overflow-hidden">

            {/* 🔥 BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />

            {/* 🔥 GLOW */}
            <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/20 blur-[140px] rounded-full" />

            <div className="relative max-w-4xl mx-auto px-4">

                {/* 💥 HEADLINE */}
                <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                    {t.headline_1}{" "}
                    <span className="text-yellow-400">
                        {topBroker.name}
                    </span>{" "}
                    {t.headline_2}
                </h2>

                {/* ✨ SUB */}
                <p className="text-gray-400 mb-10 text-lg max-w-2xl mx-auto">
                    {t.sub}
                </p>

                {/* 🚀 PRIMARY CTA */}
                <div className="flex justify-center mb-6">
                    <CTAButton
                        broker={topBroker.slug}
                        country={country}
                        position="bottom"
                        text={`🚀 ${t.primary} ${topBroker.name}`}
                        className="bg-yellow-500 text-black px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition shadow-xl"
                    />
                </div>

                {/* ⚡ SECONDARY CTA */}
                <div className="flex justify-center mb-8">
                    <CTAButton
                        broker={topBroker.slug}
                        country={country}
                        position="bottom"
                        text={t.secondary}
                        className="text-sm text-gray-400 underline hover:text-white transition"
                    />
                </div>

                {/* 🔍 NAV */}
                <div className="flex flex-wrap justify-center gap-4 text-sm mb-10">

                    <Link
                        href={`/${lang}/brokers`}
                        className="px-5 py-2 border border-white/20 rounded-full hover:bg-white/10 transition"
                    >
                        {t.compare}
                    </Link>

                    <Link
                        href={`/${lang}/academy`}
                        className="px-5 py-2 border border-white/20 rounded-full hover:bg-white/10 transition"
                    >
                        {t.learn}
                    </Link>

                </div>

                {/* ✅ TRUST */}
                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <span>{t.trust_1}</span>
                    <span>{t.trust_2}</span>
                    <span>{t.trust_3}</span>
                </div>

            </div>
        </section>
    );
}