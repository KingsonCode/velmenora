import Link from "next/link";
import { notFound } from "next/navigation";
import AcademyTopNav from "@/components/academy/AcademyTopNav";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

const tradeSteps = [
    {
        step: "01",
        title: "Analyze the Market",
        desc: "Before entering any trade, understand market direction, structure, and the reason behind the move.",
        items: [
            "Technical analysis using charts, patterns, and indicators",
            "Fundamental analysis using news and economic events",
            "Trend direction and market structure",
            "Key zones where price may react",
        ],
    },
    {
        step: "02",
        title: "Build an Entry Strategy",
        desc: "A serious trader does not enter randomly. Every trade should come from a repeatable setup.",
        items: [
            "Support and resistance levels",
            "Trendlines and breakout zones",
            "Moving averages",
            "RSI and confirmation signals",
        ],
    },
    {
        step: "03",
        title: "Manage Risk First",
        desc: "Risk management matters more than any single winning trade. Protecting capital is the real priority.",
        items: [
            "Risk only 1–2% per trade",
            "Always use a stop loss",
            "Set take profit before entry",
            "Avoid overtrading and revenge trading",
        ],
    },
    {
        step: "04",
        title: "Execute the Trade",
        desc: "Once the setup is valid, place the trade with discipline and follow the plan you defined before entry.",
        items: [
            "Use MT4, MT5, or another reliable platform",
            "Confirm lot size before entering",
            "Avoid emotional changes after entry",
            "Stick to your rules, not fear or greed",
        ],
    },
    {
        step: "05",
        title: "Review and Improve",
        desc: "Every trade should teach you something. Review your performance and refine your process over time.",
        items: [
            "Keep a trading journal",
            "Track winning and losing patterns",
            "Review execution quality",
            "Improve consistency gradually",
        ],
    },
];

const corePillars = [
    {
        title: "Analysis",
        desc: "Read the market first before thinking about entries.",
    },
    {
        title: "Execution",
        desc: "Take trades only when your setup is fully confirmed.",
    },
    {
        title: "Risk Control",
        desc: "Protect capital with strict position sizing and discipline.",
    },
];

const executionChecklist = [
    "Direction is clear",
    "Entry setup is confirmed",
    "Stop loss is defined",
    "Take profit is planned",
    "Risk size is acceptable",
    "No emotional forcing",
];

const glossary = [
    {
        term: "Technical Analysis",
        desc: "The process of reading charts, patterns, indicators, and price action to identify possible trade setups.",
    },
    {
        term: "Fundamental Analysis",
        desc: "The evaluation of economic data, central bank decisions, and news events that can influence currency prices.",
    },
    {
        term: "Stop Loss",
        desc: "A predefined exit level used to limit how much money can be lost on a trade.",
    },
    {
        term: "Take Profit",
        desc: "A predefined level where a trader plans to close the trade and secure profit.",
    },
];

const faqs = [
    {
        q: "How do you trade forex step by step?",
        a: "A basic forex trading process includes market analysis, finding an entry setup, defining risk, executing the trade, and reviewing the result afterward.",
    },
    {
        q: "What is the first thing to learn before trading forex?",
        a: "The first things to learn are market structure, currency pairs, risk management, and how to avoid entering trades without a clear plan.",
    },
    {
        q: "Do beginners need technical analysis to trade forex?",
        a: "Yes. Even simple technical analysis can help beginners understand direction, support and resistance, and better entry timing.",
    },
    {
        q: "Why is risk management important in forex trading?",
        a: "Risk management protects capital. Without it, even a few bad trades can damage or wipe out a trading account.",
    },
    {
        q: "Should beginners trade live immediately?",
        a: "No. Most beginners should start with education, practice on demo, and use small risk only after they understand their process.",
    },
];

export default async function HowToTradeForexPage({
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
                current="how-to-trade-forex"
                currentLabel="How to Trade Forex"
            />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-green-500/10 p-8 md:p-12 mb-12">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_30%)]" />

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-green-400/20 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-300 mb-5">
                        Step-by-Step Forex Guide
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        How to Trade Forex
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                        Forex trading is not just about placing trades. It is a structured process of
                        market analysis, timing, execution, and risk management. This guide shows how
                        disciplined traders approach the market step by step.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/country/explorer`}
                            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700"
                        >
                            Open Trading Account →
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

            {/* CORE PILLARS */}
            <section className="grid gap-4 md:grid-cols-3 mb-14">
                {corePillars.map((pillar) => (
                    <div
                        key={pillar.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                    >
                        <h2 className="text-xl font-semibold mb-3">{pillar.title}</h2>
                        <p className="text-gray-400 leading-relaxed">{pillar.desc}</p>
                    </div>
                ))}
            </section>

            {/* INTRO */}
            <section className="grid lg:grid-cols-[1.35fr_0.9fr] gap-8 mb-16">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                        Trading is a process, not a guess
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        Strong traders do not open charts and jump into random positions. They read the
                        market, wait for structure, define risk, and only then decide whether a trade is
                        worth taking.
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-4">
                        The purpose of this guide is to help you think like a trader, not like a gambler.
                        That means every trade should have a reason, a risk limit, and a clear plan.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        If you are still learning the fundamentals, start with our{" "}
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="text-green-400 underline underline-offset-4 transition hover:text-green-300"
                        >
                            forex beginner guide
                        </Link>{" "}
                        before moving into live market execution.
                    </p>
                </div>

                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-7 md:p-8">
                    <h3 className="text-xl font-semibold mb-3 text-red-300">
                        Most important truth
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                        Most beginners do not fail because the market is impossible. They fail because
                        they trade without structure, force bad entries, and ignore risk management.
                    </p>
                </div>
            </section>

            {/* STEP CARDS */}
            <section className="mb-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">
                        Step-by-step trading framework
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These five steps create a cleaner process for entering, managing, and learning
                        from trades.
                    </p>
                </div>

                <div className="grid gap-6">
                    {tradeSteps.map((step) => (
                        <article
                            key={step.step}
                            className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8 transition hover:border-green-500/30 hover:bg-white/10"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <div className="shrink-0">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/20 bg-green-600/15 text-lg font-bold text-green-300">
                                        {step.step}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold mb-3">
                                        {step.title}
                                    </h3>

                                    <p className="text-gray-300 leading-relaxed mb-5">
                                        {step.desc}
                                    </p>

                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {step.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-400"
                                            >
                                                <span className="mt-1 text-green-400">✔</span>
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
                        Pre-trade checklist
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Before placing any trade, make sure these conditions are clear. This alone can
                        filter many bad entries.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {executionChecklist.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-green-400 mt-0.5">✔</span>
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
                        Key trading terms you should understand
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These concepts appear often in forex education, broker platforms, and trading plans.
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

            {/* RISK BLOCK */}
            <section className="mb-16 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10 p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-4 text-red-300">
                    Risk management is the real edge
                </h2>

                <p className="text-gray-300 leading-relaxed max-w-3xl mb-6">
                    A weak strategy with strong discipline can survive. A strong strategy with poor risk
                    control can still destroy an account. That is why professionals treat risk as a rule,
                    not as an afterthought.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold mb-3">Best practices</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✔ Use fixed risk per trade</li>
                            <li>✔ Define stop loss before entry</li>
                            <li>✔ Trade only when the setup is clear</li>
                            <li>✔ Focus on consistency over excitement</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold mb-3">Common failures</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✘ Overleveraging small accounts</li>
                            <li>✘ Moving stop loss emotionally</li>
                            <li>✘ Entering without confirmation</li>
                            <li>✘ Chasing losses after bad trades</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* TRUST NOTE */}
            <section className="mb-16 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-3">
                    Important note
                </h2>

                <p className="text-gray-400 leading-relaxed">
                    This guide is for educational purposes only and should not be considered financial
                    advice. Forex trading carries risk, and new traders should build understanding,
                    practice on demo, and learn capital protection before trading live.
                </p>
            </section>

            {/* IMPROVEMENT */}
            <section className="mb-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        How traders improve over time
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Improvement comes from reviewing decisions, not from taking more random trades.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-gray-400 mb-2">Phase 1</p>
                        <h3 className="text-xl font-semibold mb-3">Observe</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Study charts, price behavior, and session structure before forcing action.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-gray-400 mb-2">Phase 2</p>
                        <h3 className="text-xl font-semibold mb-3">Execute</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Take only setups that match your rules and document the result.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm text-gray-400 mb-2">Phase 3</p>
                        <h3 className="text-xl font-semibold mb-3">Refine</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Review mistakes, improve entry quality, and reduce emotional execution.
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
            <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-green-600/20 via-emerald-600/10 to-blue-600/20 p-8 md:p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to trade with more structure?
                </h2>

                <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Compare trusted forex brokers, choose a platform that fits your style, and build a
                    better trading foundation from the start.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/country/explorer`}
                        className="inline-flex items-center justify-center rounded-xl bg-green-600 px-7 py-3.5 font-semibold text-white transition hover:bg-green-700"
                    >
                        Open Trading Account →
                    </Link>

                    <Link
                        href={`/${lang}/academy/forex-for-beginners`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                    >
                        Read Beginner Guide
                    </Link>
                </div>
            </section>
        </main>
    );
}