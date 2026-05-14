"use client";

import Link from "next/link";

/* =========================
   SUPPORTED LANGUAGES
========================= */
type Lang = "en" | "ar" | "de" | "fr";

type Props = {
    lang?: Lang;
};

/* =========================
   FOCUSED HOMEPAGE HERO
========================= */
export default function Hero({ lang = "en" }: Props) {
    const brokerHref = "/brokers";

    return (
        <section className="relative overflow-hidden px-4 py-24 text-center text-white md:py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-black to-black" />
            <div className="absolute left-1/2 top-[-140px] h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[150px]" />
            <div className="absolute right-0 top-1/3 h-[320px] w-[320px] rounded-full bg-green-500/10 blur-[120px]" />
            <div className="absolute inset-0 opacity-[0.04] bg-[url('/grid.svg')]" />

            <div className="relative mx-auto max-w-6xl">
                <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
                    <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-green-300">
                        Velmenora Funded Challenge
                    </span>

                    <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-1 text-xs font-black uppercase tracking-[0.22em] text-yellow-300">
                        Broker Recommendations
                    </span>
                </div>

                <h1 className="mx-auto mb-6 max-w-5xl text-4xl font-extrabold leading-tight md:text-6xl">
                    Start a structured forex challenge or choose a{" "}
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        broker with clarity
                    </span>
                </h1>

                <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-gray-300 md:text-xl">
                    Velmenora helps traders access a rules-based virtual funded challenge
                    and compare trusted forex brokers without market noise, broken news feeds,
                    or confusing trading dashboards.
                </p>

                <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/funded"
                        className="rounded-xl bg-green-500 px-8 py-4 text-lg font-black text-black shadow-xl transition hover:scale-[1.02] hover:bg-green-400"
                    >
                        Start Funded Challenge
                    </Link>

                    <Link
                        href={brokerHref}
                        className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-8 py-4 text-lg font-bold text-yellow-300 transition hover:bg-yellow-500/15"
                    >
                        Compare Brokers
                    </Link>
                </div>

                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 text-center md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-black text-green-400">10%</p>
                        <p className="mt-1 text-sm text-gray-400">Profit Target</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-black text-red-300">5%</p>
                        <p className="mt-1 text-sm text-gray-400">Max Daily Loss</p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                        <p className="text-2xl font-black text-yellow-400">Fixed</p>
                        <p className="mt-1 text-sm text-gray-400">Reward After Review</p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                    <span>✔ Clear challenge rules</span>
                    <span>✔ Broker recommendations</span>
                    <span>✔ Built for disciplined traders</span>
                </div>
            </div>
        </section>
    );
}
