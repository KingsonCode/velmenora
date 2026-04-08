"use client";

import { brokers } from "@/data/brokers";

export default function BrokerTable() {
    /* 🔥 SORT (same logic as grid) */
    const sorted = [...brokers].sort((a, b) => {
        const scoreA = a.rating + (a.reviews || 0) / 10000;
        const scoreB = b.rating + (b.reviews || 0) / 10000;
        return scoreB - scoreA;
    });

    return (
        <section className="py-20 px-6 bg-dark text-white">

            {/* 🔥 HEADER */}
            <div className="max-w-6xl mx-auto text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Compare Forex Brokers Side by Side
                </h2>

                <p className="text-gray-400">
                    See spreads, leverage, deposits and choose the best broker for you.
                </p>
            </div>

            {/* 🔥 TABLE WRAPPER */}
            <div className="max-w-6xl mx-auto overflow-x-auto">

                <table className="w-full border-collapse text-sm">

                    {/* 🔥 HEADER */}
                    <thead>
                        <tr className="text-left text-gray-400 border-b border-white/10">
                            <th className="py-4 px-4">Broker</th>
                            <th className="py-4 px-4">Rating</th>
                            <th className="py-4 px-4">Min Deposit</th>
                            <th className="py-4 px-4">Leverage</th>
                            <th className="py-4 px-4">Spreads</th>
                            <th className="py-4 px-4 text-center">Action</th>
                        </tr>
                    </thead>

                    {/* 🔥 BODY */}
                    <tbody>
                        {sorted.map((broker, i) => (
                            <tr
                                key={broker.id}
                                className="border-b border-white/5 hover:bg-white/5 transition"
                            >
                                {/* BROKER */}
                                <td className="py-4 px-4 font-semibold text-white">
                                    #{i + 1} {broker.name}
                                </td>

                                {/* RATING */}
                                <td className="py-4 px-4 text-yellow-400">
                                    {broker.rating} ★
                                </td>

                                {/* DEPOSIT */}
                                <td className="py-4 px-4">
                                    {broker.minDeposit || "-"}
                                </td>

                                {/* LEVERAGE */}
                                <td className="py-4 px-4">
                                    {broker.leverage || "-"}
                                </td>

                                {/* SPREAD */}
                                <td className="py-4 px-4">
                                    {broker.spreadsFrom || "-"}
                                </td>

                                {/* CTA */}
                                <td className="py-4 px-4 text-center">
                                    <a
                                        href={broker.link}
                                        className={`
                      inline-block px-5 py-2 rounded-lg font-semibold transition
                      ${i === 0
                                                ? "bg-gradient-primary shadow-glow hover:shadow-glow-lg"
                                                : "bg-white/10 hover:bg-white/20"
                                            }
                    `}
                                    >
                                        Trade Now
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* 🔥 SEO TEXT */}
            <div className="max-w-4xl mx-auto mt-12 text-center text-gray-400 text-sm">
                This comparison table helps traders in Tanzania choose the best forex broker based on trading conditions, leverage and deposit requirements.
            </div>

        </section>
    );
}