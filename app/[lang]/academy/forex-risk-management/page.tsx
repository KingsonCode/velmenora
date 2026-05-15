import Link from "next/link";
import { notFound } from "next/navigation";
import AcademyTopNav from "@/components/academy/AcademyTopNav";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

const corePrinciples = [
    {
        title: "Risk a small amount per trade",
        desc: "Many traders use a fixed percentage such as 1–2% of account equity per trade to avoid large drawdowns.",
    },
    {
        title: "Always use a stop loss",
        desc: "A stop loss defines the maximum acceptable loss before the trade is opened.",
    },
    {
        title: "Think in probabilities",
        desc: "No setup wins every time. Risk management exists because losses are part of trading.",
    },
];

const riskRules = [
    {
        step: "01",
        title: "Decide your maximum risk",
        desc: "Before entering a trade, decide exactly how much money you are willing to lose if the setup fails.",
        items: [
            "Use a fixed percentage model",
            "Avoid changing risk emotionally",
            "Protect capital before chasing returns",
            "Keep position size aligned with stop loss distance",
        ],
    },
    {
        step: "02",
        title: "Place your stop loss logically",
        desc: "A stop loss should sit in a place where the trade idea is no longer valid, not at a random distance.",
        items: [
            "Use structure-based stops",
            "Avoid placing stops too tight without reason",
            "Do not widen stops emotionally",
            "Respect invalidation points",
        ],
    },
    {
        step: "03",
        title: "Size the position correctly",
        desc: "Lot size should be calculated from account size, risk percentage, and stop loss distance.",
        items: [
            "Smaller account does not mean bigger leverage",
            "Lot size should match your risk rule",
            "Do not guess position size",
            "High leverage without control is dangerous",
        ],
    },
    {
        step: "04",
        title: "Protect reward-to-risk quality",
        desc: "Good risk management is not only about cutting losses. It is also about making sure the potential reward justifies the trade.",
        items: [
            "Look for sensible reward-to-risk ratios",
            "Avoid low-quality entries with poor upside",
            "Do not force trades just to be active",
            "Let good setups carry the performance",
        ],
    },
];

const commonMistakes = [
    "Risking too much on one trade",
    "Moving stop loss further after entry",
    "Using oversized leverage on a small account",
    "Trading again immediately after a loss",
    "Taking random setups without clear invalidation",
    "Ignoring position sizing completely",
];

const glossary = [
    {
        term: "Risk-to-Reward Ratio",
        desc: "A comparison between the amount being risked and the potential profit target on a trade.",
    },
    {
        term: "Drawdown",
        desc: "The decline in account value from a peak to a lower point.",
    },
    {
        term: "Position Size",
        desc: "The amount of a currency pair being traded, usually measured in lots.",
    },
    {
        term: "Stop Loss",
        desc: "A predefined exit level intended to limit losses if the market moves against the trade.",
    },
];

const checklist = [
    "I know how much I am risking before entry",
    "My stop loss is based on structure, not emotion",
    "My position size matches my risk plan",
    "The trade has a reasonable reward-to-risk profile",
    "I am not forcing the setup",
    "I can accept the loss if the trade fails",
];

const faqs = [
    {
        q: "What is risk management in forex?",
        a: "Risk management in forex is the process of controlling how much money can be lost on each trade and across the whole account.",
    },
    {
        q: "How much should I risk per trade in forex?",
        a: "Many traders use a small fixed percentage such as 1–2% per trade, though the exact number depends on the trader's plan and experience.",
    },
    {
        q: "Why is stop loss important in forex trading?",
        a: "A stop loss limits downside and protects the account from larger, uncontrolled losses if the market moves against the position.",
    },
    {
        q: "Can good risk management make a weak strategy profitable?",
        a: "Risk management alone does not create an edge, but it can protect the account long enough for a trader to improve and stay consistent.",
    },
    {
        q: "What is the biggest risk management mistake beginners make?",
        a: "One of the biggest mistakes is risking too much on a single trade or using high leverage without understanding position size.",
    },
];

export default async function ForexRiskManagementPage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    return (
        <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
            <AcademyTopNav
                lang={lang}
                current="forex-risk-management"
                currentLabel="Forex Risk Management"
            />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-red-500/10 p-8 md:p-12 mb-12">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)]" />

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-red-400/20 bg-red-500/10 px-4 py-1.5 text-sm font-medium text-red-300 mb-5">
                        Capital Protection Guide
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        Forex Risk Management
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                        Risk management is what keeps traders in the game. This guide explains how to
                        control losses, size trades properly, use stop loss effectively, and protect
                        your account from avoidable damage.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-6 py-3.5 font-semibold text-white transition hover:bg-red-700"
                        >
                            Read Beginner Guide →
                        </Link>

                        <Link
                            href={`/${lang}/academy/how-to-trade-forex`}
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                        >
                            Learn Trade Execution
                        </Link>
                    </div>
                </div>
            </section>

            {/* PRINCIPLES */}
            <section className="grid gap-4 md:grid-cols-3 mb-14">
                {corePrinciples.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                    >
                        <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* INTRO */}
            <section className="grid lg:grid-cols-[1.35fr_0.9fr] gap-8 mb-16">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                        Why risk management matters more than excitement
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        Many traders spend too much time looking for perfect entries and too little
                        time learning how to survive losing trades. But losses are part of the game.
                        The real difference is whether a trader can absorb them without damaging the
                        whole account.
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-4">
                        A trader with strong discipline and sensible risk control can survive bad
                        periods and keep improving. A trader with weak risk control can destroy an
                        account even with decent market analysis.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        If you are still building your base, read our{" "}
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="text-red-400 underline underline-offset-4 transition hover:text-red-300"
                        >
                            forex for beginners guide
                        </Link>{" "}
                        to understand the broader foundation before risking capital live.
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-7 md:p-8">
                    <h3 className="text-xl font-semibold mb-3 text-amber-300">
                        Important reality
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                        You do not need to win every trade to succeed. You do need to make sure one
                        bad trade cannot do major damage.
                    </p>
                </div>
            </section>

            {/* RULES */}
            <section className="mb-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">
                        Core risk management rules
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These principles create a cleaner and safer framework for protecting your account.
                    </p>
                </div>

                <div className="grid gap-6">
                    {riskRules.map((rule) => (
                        <article
                            key={rule.step}
                            className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8 transition hover:border-red-500/30 hover:bg-white/10"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <div className="shrink-0">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-600/15 text-lg font-bold text-red-300">
                                        {rule.step}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold mb-3">{rule.title}</h3>
                                    <p className="text-gray-300 leading-relaxed mb-5">{rule.desc}</p>

                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {rule.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-400"
                                            >
                                                <span className="mt-1 text-red-400">✔</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* CHECKLIST */}
            <section className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Pre-trade risk checklist
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Before placing any trade, these conditions should already be clear.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {checklist.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-red-400 mt-0.5">✔</span>
                                <span>{item}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* GLOSSARY */}
            <section className="mb-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Important risk terms to understand
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These ideas appear often in serious trading education and account protection planning.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {glossary.map((item) => (
                        <div
                            key={item.term}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6"
                        >
                            <h3 className="text-xl font-semibold mb-2">{item.term}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* MISTAKES */}
            <section className="mb-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Common risk management mistakes
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These mistakes hurt accounts faster than most traders expect.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {commonMistakes.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{item}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TRUST NOTE */}
            <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-3">
                    Important note
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    This guide is for educational purposes only and should not be considered financial
                    advice. Risk management does not remove risk completely, but it helps reduce avoidable
                    damage and encourages more disciplined trading behavior.
                </p>
            </section>

            {/* FAQ */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {faqs.map((item) => (
                        <div
                            key={item.q}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6"
                        >
                            <h3 className="text-lg font-semibold mb-2">{item.q}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-red-600/20 via-orange-600/10 to-blue-600/20 p-8 md:p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to trade more responsibly?
                </h2>

                <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Learn the basics, understand execution, and choose a broker that fits your needs
                    before risking real capital.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/academy/how-to-trade-forex`}
                        className="inline-flex items-center justify-center rounded-xl bg-red-600 px-7 py-3.5 font-semibold text-white transition hover:bg-red-700"
                    >
                        Learn How to Trade Forex →
                    </Link>

                    <Link
                        href={`/${lang}/country/explorer`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                    >
                        Compare Trusted Brokers
                    </Link>
                </div>
            </section>
        </main>
    );
}