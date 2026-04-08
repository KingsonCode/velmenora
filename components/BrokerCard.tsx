"use client";

import Link from "next/link";
import CTAButton from "./CTAButton";
import { Broker } from "@/data/brokers";

/* ================= TYPES ================= */
type Props = {
    broker: Broker;
    country?: string;
    rank?: number;
};

/* ================= COMPONENT ================= */
export default function BrokerCard({ broker, country, rank }: Props) {
    return (
        <div className="relative">

            {/* ================= CLICKABLE CARD ================= */}
            <Link href={`/broker/${broker.slug}`} className="block">
                <div className="group relative cursor-pointer bg-dark/60 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col text-center transition-all duration-300 shadow-card hover:shadow-premium hover:-translate-y-1 active:scale-[0.98]">

                    {/* 🔥 HOVER GLOW (FIXED) */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-blue-500/5 blur-xl pointer-events-none" />

                    {/* 🔢 RANK */}
                    {typeof rank === "number" && (
                        <div className="absolute top-4 left-4 bg-gradient-primary text-white text-xs px-3 py-1 rounded-full font-semibold shadow-glow">
                            #{rank}
                        </div>
                    )}

                    {/* 🏆 BEST BADGE */}
                    {rank === 1 && (
                        <div className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
                            Best Overall
                        </div>
                    )}

                    {/* HEADER */}
                    <div className="flex items-center justify-center gap-3 mb-3 flex-wrap mt-4">
                        {broker.logo && (
                            <img
                                src={broker.logo}
                                alt={broker.name}
                                className="h-8 object-contain"
                            />
                        )}

                        <h2 className="text-xl font-semibold text-white">
                            {broker.name}
                        </h2>

                        {broker.badge && (
                            <span className="text-xs bg-gradient-primary px-3 py-1 rounded-full text-white">
                                {broker.badge}
                            </span>
                        )}
                    </div>

                    {/* ⭐ RATING */}
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <div className="flex text-yellow-400 text-sm">
                            {"★".repeat(Math.round(broker.rating))}
                            {"☆".repeat(5 - Math.round(broker.rating))}
                        </div>
                        <span className="text-gray-400 text-sm">
                            {broker.rating.toFixed(1)}/5
                        </span>
                    </div>

                    {/* 👥 REVIEWS */}
                    {broker.reviews && (
                        <p className="text-xs text-gray-500 mb-3">
                            {broker.reviews.toLocaleString()}+ traders
                        </p>
                    )}

                    {/* TRUST */}
                    <div className="mb-4 text-xs text-green-400 font-medium">
                        ✔ Regulated • ✔ Fast Withdrawals • ✔ Low Spread
                    </div>

                    {/* DESCRIPTION */}
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                        {broker.description}
                    </p>

                    {/* FEATURES */}
                    <ul className="space-y-2 mb-4 text-sm text-gray-300 text-left w-full max-w-xs mx-auto">
                        {broker.features.slice(0, 3).map((f: string, i: number) => (
                            <li key={i} className="flex items-start">
                                <span className="text-green-400 mr-2 mt-[2px]">✔</span>
                                {f}
                            </li>
                        ))}
                    </ul>

                    {/* STATS */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-6">
                        {broker.minDeposit && (
                            <div className="bg-white/5 rounded-lg p-2">
                                <div className="text-gray-500">Min</div>
                                <div className="text-white font-medium">
                                    {broker.minDeposit}
                                </div>
                            </div>
                        )}

                        {broker.leverage && (
                            <div className="bg-white/5 rounded-lg p-2">
                                <div className="text-gray-500">Lev</div>
                                <div className="text-white font-medium">
                                    {broker.leverage}
                                </div>
                            </div>
                        )}

                        {broker.spreadsFrom && (
                            <div className="bg-white/5 rounded-lg p-2">
                                <div className="text-gray-500">Spread</div>
                                <div className="text-white font-medium">
                                    {broker.spreadsFrom}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* UX SIGNAL */}
                    <div className="text-blue-400 text-sm font-medium mb-2">
                        View Full Review →
                    </div>
                </div>
            </Link>

            {/* ================= CTA (NOT INSIDE LINK) ================= */}
            <div className="mt-4 w-full space-y-3">

                {/* 💰 MONEY BUTTON */}
                <CTAButton
                    broker={broker.slug}
                    country={country || "global"}
                    href={`/go/${broker.slug}?src=card&country=${country}`}
                    text="Open Account →"
                    className="block w-full bg-gradient-primary px-4 py-3 rounded-xl font-semibold text-white hover:scale-[1.02] transition"
                />

                {/* 📄 DETAILS BUTTON */}
                <Link
                    href={`/broker/${broker.slug}`}
                    className="block w-full bg-white/5 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition text-center"
                >
                    View Details
                </Link>

                <p className="text-xs text-gray-500 text-center">
                    No fees • Fast signup • Secure
                </p>
            </div>
        </div>
    );
}