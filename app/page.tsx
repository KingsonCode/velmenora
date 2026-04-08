"use client";

import { brokers } from "@/data/brokers";
import BrokerCard from "@/components/BrokerCard";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

/* 🔥 HERO BACKGROUNDS */
const images = [
    "/hero/forex1.jpg",
    "/hero/forex2.jpg",
    "/hero/forex3.jpg",
];

export default function HomePage() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const i = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(i);
    }, []);

    return (
        <main className="text-white">

            {/* ================= HERO ================= */}
            <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden">

                {/* 🔥 BACKGROUND SLIDER (NEXT IMAGE) */}
                {images.map((img, i) => (
                    <Image
                        key={i}
                        src={img}
                        alt={`Forex trading background ${i + 1}`}
                        fill
                        priority={i === 0} // first image loads fast
                        className={`object-cover transition duration-1000 ${i === index ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))}

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

                {/* CONTENT */}
                <div className="relative z-10 max-w-3xl px-6">

                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Best Forex Brokers in Tanzania 🇹🇿
                    </h1>

                    <p className="text-gray-300 mb-8 text-lg">
                        Trade with trusted brokers. Fast withdrawals. Low spreads. High leverage.
                    </p>

                    {/* CTA */}
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            href="#brokers"
                            className="px-8 py-4 bg-gradient-primary rounded-xl font-semibold shadow-glow hover:scale-105 transition"
                        >
                            Compare Brokers →
                        </Link>

                        <Link
                            href="/learn"
                            className="px-6 py-4 bg-white/10 rounded-xl hover:bg-white/20 transition"
                        >
                            Learn First
                        </Link>
                    </div>

                    {/* TRUST */}
                    <div className="mt-8 flex justify-center gap-6 text-sm text-gray-400 flex-wrap">
                        <span>✔ Verified Brokers</span>
                        <span>✔ Fast Withdrawals</span>
                        <span>✔ Beginner Friendly</span>
                    </div>

                </div>
            </section>

            {/* ================= BROKERS ================= */}
            <section id="brokers" className="py-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Top Forex Brokers in Tanzania
                    </h2>
                    <p className="text-gray-400">
                        Compare the best platforms and start trading today.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {brokers.map((b, i) => (
                        <BrokerCard
                            key={b.id}
                            broker={b}
                            rank={i + 1}
                            country="tanzania"
                        />
                    ))}
                </div>
            </section>

            {/* ================= WHY ================= */}
            <section className="py-20 bg-white/5 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    Why Traders Choose Velmenora
                </h2>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-gray-300">

                    <div>
                        <h3 className="font-semibold mb-2">Verified Brokers</h3>
                        <p className="text-sm">
                            Only trusted platforms with strong reputation.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Fast Withdrawals</h3>
                        <p className="text-sm">
                            Get your money quickly and securely.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Low Spreads</h3>
                        <p className="text-sm">
                            Trade with tight spreads and better pricing.
                        </p>
                    </div>

                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="py-20 text-center border-t border-white/10">
                <h2 className="text-3xl font-bold mb-6">
                    Ready to Start Trading?
                </h2>

                <Link
                    href="/compare"
                    className="px-10 py-5 bg-gradient-primary rounded-xl font-semibold shadow-glow hover:scale-105 transition"
                >
                    Compare Brokers Now →
                </Link>

                <p className="text-gray-500 text-sm mt-4">
                    No fees • Fast signup • Secure
                </p>
            </section>

        </main>
    );
}