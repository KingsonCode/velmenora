"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CountrySearch from "./CountrySearch";
import { Funnel } from "@/types/funnel";

// 🌍 FLAGS (OPTIONAL FALLBACK)
const COUNTRY_FLAGS: Record<string, string> = {
    TZ: "🇹🇿",
    KE: "🇰🇪",
    NG: "🇳🇬",
    ZA: "🇿🇦",
    AE: "🇦🇪",
    SA: "🇸🇦",
    DE: "🇩🇪",
    FR: "🇫🇷",
    GB: "🇬🇧",
    IN: "🇮🇳",
};

export default function GeoBanner({ funnel }: { funnel: Funnel }) {
    const router = useRouter();

    const [visible, setVisible] = useState(false);
    const [variant, setVariant] = useState<"A" | "B">("A");

    /* ================= INIT ================= */
    useEffect(() => {
        const dismissed = localStorage.getItem("geoBannerDismissed");
        const savedVariant = localStorage.getItem("geoBannerVariant");

        // 🧪 A/B TEST
        if (!savedVariant) {
            const v = Math.random() > 0.5 ? "A" : "B";
            localStorage.setItem("geoBannerVariant", v);
            setVariant(v);
        } else {
            setVariant(savedVariant as "A" | "B");
        }

        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    const isGlobal = funnel.country === "Global";

    /* ================= CTA ================= */
    const primaryCTA =
        variant === "A"
            ? funnel.cta.primary
            : "Start Trading";

    /* ================= COUNTRY CHANGE ================= */
    function handleCountrySelect(code: string) {
        const lang = funnel.language || "en";
        const upper = code.toUpperCase();

        // 🍪 SAVE USER COUNTRY
        document.cookie = `user_country=${upper}; path=/; max-age=31536000`;

        // 🚀 NAVIGATE
        router.push(`/${lang}/${code}`);
    }

    return (
        <div className="w-full bg-gradient-to-r from-black to-gray-900 text-white px-4 py-3 border-b border-gray-800">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

                {/* 🌍 MESSAGE */}
                <div className="text-sm md:text-base flex items-center gap-2">
                    <span className="text-lg">
                        {COUNTRY_FLAGS[funnel.country] || "🌍"}
                    </span>

                    <span>
                        You’re viewing content for{" "}
                        <b>
                            {isGlobal ? "your region" : funnel.country}
                        </b>
                    </span>
                </div>

                {/* 🔥 ACTION AREA */}
                <div className="flex items-center gap-3 flex-wrap">

                    {/* 💰 PRIMARY CTA */}
                    <a
                        href={funnel.cta.link}
                        className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        {primaryCTA}
                    </a>

                    {/* 🌍 COUNTRY SEARCH (NEW SYSTEM) */}
                    <CountrySearch
                        lang={funnel.language}
                        onSelect={handleCountrySelect}
                    />

                    {/* ❌ CLOSE */}
                    <button
                        onClick={() => {
                            localStorage.setItem("geoBannerDismissed", "true");
                            setVisible(false);
                        }}
                        className="text-white/70 hover:text-white text-lg"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}