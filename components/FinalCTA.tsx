"use client";

import Link from "next/link";
import CTAButton from "@/components/CTAButton";
import { getFinalCTAContent, Lang } from "@/lib/i18n";

type Props = {
    lang?: Lang;
    country?: string;
    topBroker?: {
        slug: string;
        name: string;
    };
};

export default function FinalCTA({
    lang = "en",
    country = "global",
    topBroker = { slug: "exness", name: "Exness" },
}: Props) {
    const t = getFinalCTAContent(lang);

    return (
        <section className="relative overflow-hidden bg-black py-24 text-white">
            {/* BACKGROUND */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0B1020] to-black" />

            {/* GLOW */}
            <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[140px]" />
            <div className="absolute right-0 bottom-0 h-[260px] w-[260px] rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative mx-auto max-w-6xl px-4">
                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04]">
                    <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-12">
                        {/* LEFT */}
                        <div>
                            <p className="mb-4 inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-yellow-300">
                                Final step
                            </p>

                            <h2 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                                {t.headline_1}{" "}
                                <span className="text-yellow-400">{topBroker.name}</span>{" "}
                                {t.headline_2}
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
                                {t.sub}
                            </p>

                            {/* PRIMARY / SECONDARY CTA */}
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                                <CTAButton
                                    broker={topBroker.slug}
                                    country={country}
                                    position="bottom"
                                    text={`🚀 ${t.primary} ${topBroker.name}`}
                                    className="rounded-2xl bg-yellow-500 px-8 py-4 text-lg font-bold text-black shadow-xl transition hover:scale-[1.02]"
                                />

                                <Link
                                    href={`/${lang}/country/brokers`}
                                    className="rounded-2xl border border-white/15 px-8 py-4 text-center font-semibold transition hover:bg-white/10"
                                >
                                    {t.compare}
                                </Link>
                            </div>

                            {/* NAV */}
                            <div className="mt-6 flex flex-wrap gap-3 text-sm">
                                <Link
                                    href={`/${lang}/country/academy`}
                                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition hover:bg-white/10"
                                >
                                    {t.learn}
                                </Link>

                                <Link
                                    href={`/${lang}/country/brokers`}
                                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition hover:bg-white/10"
                                >
                                    Browse Brokers
                                </Link>

                                <Link
                                    href="/markets"
                                    className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition hover:bg-white/10"
                                >
                                    Explore Markets
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT PANEL */}
                        <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
                            <p className="text-sm font-semibold text-white">
                                Why act now
                            </p>

                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="text-sm font-medium text-white">
                                        Better broker selection
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Avoid weak broker choices by comparing trust, execution, and trading conditions first.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="text-sm font-medium text-white">
                                        Faster decision-making
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Move from research to account opening with a clearer path and fewer wasted clicks.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <p className="text-sm font-medium text-white">
                                        Stronger starting position
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-gray-400">
                                        Start with a broker that better matches your region, goals, and market access needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TRUST STRIP */}
                    <div className="border-t border-white/10 px-6 py-5 md:px-12">
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:gap-6">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300">
                                {t.trust_1}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300">
                                {t.trust_2}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-gray-300">
                                {t.trust_3}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}