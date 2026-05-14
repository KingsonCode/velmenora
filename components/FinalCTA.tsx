"use client";

import Link from "next/link";

type Props = {
    lang?: "en" | "ar" | "de" | "fr";
};

export default function FinalCTA({ lang = "en" }: Props) {
    const brokerHref = "/brokers";

    return (
        <section className="relative overflow-hidden bg-black py-24 text-white">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0B1020] to-black" />
            <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-green-500/10 blur-[140px]" />
            <div className="absolute right-0 bottom-0 h-[260px] w-[260px] rounded-full bg-yellow-500/10 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl px-4">
                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]">
                    <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
                        <div>
                            <p className="mb-4 inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-green-300">
                                Choose your path
                            </p>

                            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                                Ready to trade with structure and better broker clarity?
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                                Start with the Velmenora funded challenge if you want a rules-based
                                evaluation, or compare brokers if you are choosing where to open your
                                trading account.
                            </p>

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                                <Link
                                    href="/funded"
                                    className="rounded-2xl bg-green-500 px-8 py-4 text-center text-lg font-black text-black shadow-xl transition hover:scale-[1.02] hover:bg-green-400"
                                >
                                    Start Funded Challenge
                                </Link>

                                <Link
                                    href={brokerHref}
                                    className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-8 py-4 text-center text-lg font-bold text-yellow-300 transition hover:bg-yellow-500/15"
                                >
                                    Compare Brokers
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                            <p className="text-sm font-semibold text-white">
                                What Velmenora focuses on
                            </p>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="text-sm font-medium text-white">
                                        Funded challenge clarity
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Transparent rules, fixed reward structure, and manual review before reward approval.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="text-sm font-medium text-white">
                                        Broker recommendation
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Compare brokers based on trading conditions, payments, trust, and regional fit.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="text-sm font-medium text-white">
                                        Less distraction
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        No broken news widgets, no noisy market dashboards, and no unnecessary homepage clutter.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 px-6 py-5 md:px-12">
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:gap-6">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300">
                                10% profit target
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300">
                                5% daily loss limit
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300">
                                Broker comparison included
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
