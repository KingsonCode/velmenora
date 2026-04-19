import Link from "next/link";
import { notFound } from "next/navigation";
import AcademyTopNav from "@/components/academy/AcademyTopNav";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

const beginnerSteps = [
    {
        title: "Learn the Basics",
        desc: "Understand how forex works before risking money in the market.",
        items: [
            "Currency pairs like EUR/USD and GBP/USD",
            "Pips, spreads, lots, and execution",
            "Leverage, margin, and account balance",
            "Buy vs sell decisions",
        ],
    },
    {
        title: "Choose a Reliable Broker",
        desc: "Your broker affects spreads, withdrawals, execution speed, and trust.",
        items: [
            "Low spreads and transparent fees",
            "Strong regulation and reputation",
            "Fast deposits and withdrawals",
            "MT4 / MT5 or other reliable platforms",
        ],
    },
    {
        title: "Start with a Demo Account",
        desc: "Practice first. Build confidence before using real capital.",
        items: [
            "Learn order placement",
            "Test simple strategies",
            "Understand chart behavior",
            "Reduce emotional mistakes",
        ],
    },
    {
        title: "Manage Risk Seriously",
        desc: "Beginners usually lose because of bad risk management, not because forex is impossible.",
        items: [
            "Risk only 1–2% per trade",
            "Always use stop loss",
            "Avoid revenge trading",
            "Protect capital first",
        ],
    },
];

const mistakes = [
    "Trading without a plan",
    "Using too much leverage",
    "Ignoring stop loss",
    "Entering random trades from emotion",
    "Trying to get rich too fast",
    "Skipping demo practice",
];

const quickFacts = [
    { label: "Best first step", value: "Learn before live trading" },
    { label: "Recommended risk", value: "1–2% per trade" },
    { label: "Best practice account", value: "Demo first" },
];

const glossary = [
    {
        term: "Currency Pair",
        desc: "A forex quote showing the value of one currency against another, such as EUR/USD.",
    },
    {
        term: "Pip",
        desc: "A pip is one of the smallest standard price movements in a forex pair.",
    },
    {
        term: "Leverage",
        desc: "Leverage allows traders to control a larger position with a smaller amount of money.",
    },
    {
        term: "Stop Loss",
        desc: "A stop loss is a predefined exit level designed to limit losses on a trade.",
    },
];

const beginnerChecklist = [
    "I understand what currency pairs are",
    "I know how leverage and margin work",
    "I can place trades on demo without confusion",
    "I know how to use a stop loss",
    "I am risking small amounts only",
    "I am following a plan, not emotions",
];

const faqs = [
    {
        q: "Can beginners start forex trading?",
        a: "Yes, but beginners should start with education, demo practice, and strong risk management before using real money.",
    },
    {
        q: "What should beginners learn first in forex?",
        a: "Beginners should first learn currency pairs, pips, leverage, order execution, and risk management fundamentals.",
    },
    {
        q: "Should I use a demo account before trading live?",
        a: "Yes. A demo account helps you understand execution, test discipline, and build confidence before risking capital.",
    },
    {
        q: "How much should a beginner risk per trade?",
        a: "Many beginners use a small fixed risk, often around 1–2% per trade, to protect the account while learning.",
    },
    {
        q: "Why do most beginners lose money in forex?",
        a: "Most beginners lose because they trade without a plan, use too much leverage, ignore stop loss, and act emotionally.",
    },
];

export default async function ForexBeginnersPage({
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
                current="forex-for-beginners"
                currentLabel="Forex for Beginners"
            />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-blue-500/10 p-8 md:p-12 mb-12">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_30%)]" />

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-5">
                        Beginner Forex Guide
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        Forex Trading for Beginners
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                        New to forex trading? This guide helps you understand the fundamentals,
                        avoid beginner mistakes, and start with a safer, smarter foundation.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/explorer`}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Compare Trusted Brokers →
                        </Link>

                        <Link
                            href={`/${lang}/academy`}
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                        >
                            Back to Academy
                        </Link>
                    </div>
                </div>
            </section>

            {/* QUICK FACTS */}
            <section className="grid gap-4 md:grid-cols-3 mb-12">
                {quickFacts.map((fact) => (
                    <div
                        key={fact.label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.07]"
                    >
                        <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
                            {fact.label}
                        </p>
                        <h2 className="text-xl font-semibold text-white leading-snug">
                            {fact.value}
                        </h2>
                    </div>
                ))}
            </section>

            {/* INTRO */}
            <section className="grid lg:grid-cols-[1.4fr_0.9fr] gap-8 mb-14">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                        What beginners need to understand first
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        Forex is the global market where currencies are traded. Traders try to profit
                        from price movement between one currency and another. The opportunity is real,
                        but beginners usually fail when they start without structure.
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-4">
                        The goal is not to trade fast. The goal is to learn how the market behaves,
                        protect your capital, and build consistency one step at a time.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        If you are still trying to understand the market itself, start with{" "}
                        <Link
                            href={`/${lang}/academy/what-is-forex`}
                            className="text-blue-400 underline underline-offset-4 transition hover:text-blue-300"
                        >
                            what forex trading is
                        </Link>{" "}
                        before moving deeper into beginner execution and broker selection.
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-7 md:p-8">
                    <h3 className="text-xl font-semibold mb-3 text-amber-300">
                        Important reality
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                        Most beginners lose because they overtrade, overleverage, and enter the market
                        too early. A strong start in forex is built on discipline, not excitement.
                    </p>
                </div>
            </section>

            {/* STEPS */}
            <section className="mb-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">
                        Step-by-step path for beginners
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These are the four core stages every new trader should follow before expecting
                        meaningful results.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {beginnerSteps.map((step, index) => (
                        <article
                            key={step.title}
                            className="group rounded-2xl border border-white/10 bg-white/5 p-7 transition hover:border-blue-500/40 hover:bg-white/10"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-blue-300 font-bold">
                                    {index + 1}
                                </div>
                                <h3 className="text-2xl font-semibold">
                                    {step.title}
                                </h3>
                            </div>

                            <p className="text-gray-300 leading-relaxed mb-5">
                                {step.desc}
                            </p>

                            <ul className="space-y-3">
                                {step.items.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3 text-gray-400"
                                    >
                                        <span className="mt-1 text-blue-400">✔</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {index === 1 && (
                                <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">
                                    <p className="text-sm text-gray-300 mb-3">
                                        Choosing the right broker matters from day one.
                                    </p>

                                    <Link
                                        href={`/${lang}/explorer`}
                                        className="inline-flex items-center font-semibold text-blue-400 transition hover:text-blue-300"
                                    >
                                        View broker comparison →
                                    </Link>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>

            {/* GLOSSARY */}
            <section className="mb-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Beginner forex terms worth understanding
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These terms appear often in broker platforms, tutorials, and trading discussions.
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

            {/* CHECKLIST */}
            <section className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Beginner readiness checklist
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Before moving toward live trading, make sure these basics are already clear.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {beginnerChecklist.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-blue-400 mt-0.5">✔</span>
                                <span>{item}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* RISK */}
            <section className="mb-16 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10 p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-4 text-red-300">
                    Risk management is what keeps you alive
                </h2>

                <p className="text-gray-300 leading-relaxed max-w-3xl mb-6">
                    Beginners often focus too much on entries and indicators, but the real difference
                    comes from risk control. One bad habit with oversized trades can wipe out weeks or
                    months of progress.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold mb-2">Do this</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✔ Keep risk small on every trade</li>
                            <li>✔ Use stop loss every time</li>
                            <li>✔ Journal your trades</li>
                            <li>✔ Protect your account first</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold mb-2">Avoid this</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✘ Chasing losses</li>
                            <li>✘ Adding to bad trades emotionally</li>
                            <li>✘ Overleveraging small accounts</li>
                            <li>✘ Trading without a clear setup</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* MISTAKES */}
            <section className="mb-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Common beginner mistakes
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These are the patterns that damage most new trading accounts early.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {mistakes.map((mistake) => (
                        <div
                            key={mistake}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{mistake}</span>
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
                    advice. Forex trading involves risk, and beginners should practice on demo,
                    understand capital protection, and trade small before going live.
                </p>
            </section>

            {/* ROADMAP */}
            <section className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-6">
                    A simple beginner roadmap
                </h2>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Phase 1</p>
                        <h3 className="text-xl font-semibold mb-3">Learn</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Study market basics, chart reading, and execution terminology.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Phase 2</p>
                        <h3 className="text-xl font-semibold mb-3">Practice</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Use a demo account to test discipline, entries, and risk control.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Phase 3</p>
                        <h3 className="text-xl font-semibold mb-3">Go small</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Move to live trading carefully with small size and strict rules.
                        </p>
                    </div>
                </div>
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
                            <h3 className="text-lg font-semibold mb-2">
                                {item.q}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {item.a}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-indigo-600/10 to-purple-600/20 p-8 md:p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to take the first real step?
                </h2>

                <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Compare trusted forex brokers, check important features, and choose a platform
                    that matches your needs as a beginner.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/explorer`}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                    >
                        View Best Forex Brokers →
                    </Link>

                    <Link
                        href={`/${lang}/academy/how-to-trade-forex`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                    >
                        Learn How to Trade Forex
                    </Link>
                </div>
            </section>
        </main>
    );
}