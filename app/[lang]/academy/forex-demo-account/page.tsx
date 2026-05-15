import Link from "next/link";
import { notFound } from "next/navigation";
import AcademyTopNav from "@/components/academy/AcademyTopNav";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

const demoBenefits = [
    {
        title: "Practice without risking real money",
        desc: "A demo account lets you learn execution and platform navigation without financial exposure.",
    },
    {
        title: "Build confidence with order placement",
        desc: "Beginners can learn buy and sell orders, stop loss, and take profit more safely.",
    },
    {
        title: "Test basic strategies",
        desc: "A demo account is useful for checking whether your process makes sense before going live.",
    },
];

const demoSteps = [
    {
        step: "01",
        title: "Choose a reliable broker demo",
        desc: "Pick a broker with a clean platform, realistic pricing, and a demo environment that reflects the live product.",
        items: [
            "Look for MT4 or MT5 support if needed",
            "Check that spreads and interface feel realistic",
            "Prefer brokers with educational tools",
            "Make sure switching to live later is simple",
        ],
    },
    {
        step: "02",
        title: "Use demo to learn execution",
        desc: "The goal at first is not to chase fake profits. It is to understand how trades are opened, managed, and closed.",
        items: [
            "Place market and pending orders",
            "Practice using stop loss and take profit",
            "Read charts and price movement",
            "Learn how lot size changes exposure",
        ],
    },
    {
        step: "03",
        title: "Treat demo seriously",
        desc: "If you use demo casually, it teaches bad habits. Demo should be treated as practice for real discipline.",
        items: [
            "Follow a basic plan",
            "Avoid random overtrading",
            "Document trades in a journal",
            "Use realistic risk sizing",
        ],
    },
    {
        step: "04",
        title: "Move to live carefully",
        desc: "Demo is preparation, not the final destination. Once the process is clear, transition to live trading with small size and strict discipline.",
        items: [
            "Do not jump from demo to aggressive live risk",
            "Expect emotions to feel different with real money",
            "Keep risk smaller than you think you need",
            "Use live trading to confirm discipline, not ego",
        ],
    },
];

const glossary = [
    {
        term: "Demo Account",
        desc: "A simulated trading account that lets traders practice using virtual funds instead of real money.",
    },
    {
        term: "Live Account",
        desc: "A real trading account funded with actual money and exposed to real profits and losses.",
    },
    {
        term: "Market Order",
        desc: "An order that executes immediately at the best available market price.",
    },
    {
        term: "Pending Order",
        desc: "An order set to activate only if price reaches a specific level.",
    },
];

const mistakes = [
    "Using unrealistic account sizes on demo",
    "Taking oversized positions because the money is not real",
    "Skipping stop loss because there is no emotional pain",
    "Thinking demo profits automatically mean live success",
    "Jumping to live trading before building consistency",
    "Treating demo as entertainment instead of practice",
];

const checklist = [
    "I can place trades without confusion",
    "I know how to use stop loss and take profit",
    "I understand lot size and exposure",
    "I am following a repeatable process",
    "I am not overtrading just because it is virtual money",
    "I am ready to move slowly when switching to live",
];

const faqs = [
    {
        q: "What is a forex demo account?",
        a: "A forex demo account is a practice account that uses virtual funds so traders can learn the platform and test execution without risking real money.",
    },
    {
        q: "Should beginners use a demo account first?",
        a: "Yes. A demo account is one of the safest ways for beginners to learn order placement, chart reading, and risk basics before trading live.",
    },
    {
        q: "How long should I use a demo account?",
        a: "There is no perfect timeline, but beginners should use demo until they understand execution, follow a plan, and can manage risk consistently.",
    },
    {
        q: "Can demo trading make you profitable?",
        a: "Demo trading can help build skill and discipline, but live trading adds emotion and pressure that demo cannot fully replicate.",
    },
    {
        q: "What is the biggest mistake with a demo account?",
        a: "One of the biggest mistakes is treating demo like a game and taking unrealistic risk that would never be used in a live account.",
    },
];

export default async function ForexDemoAccountPage({
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
                current="forex-demo-account"
                currentLabel="Forex Demo Account"
            />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-cyan-500/10 p-8 md:p-12 mb-12">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.14),transparent_30%)]" />

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-sm font-medium text-cyan-300 mb-5">
                        Practice Trading Guide
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        Forex Demo Account
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                        A forex demo account helps beginners practice trading without risking real
                        money. This guide explains what a demo account is, why it matters, how to use
                        it properly, and when to move to live trading.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-6 py-3.5 font-semibold text-white transition hover:bg-cyan-700"
                        >
                            Read Beginner Guide →
                        </Link>

                        <Link
                            href={`/${lang}/country/explorer`}
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                        >
                            Compare Brokers
                        </Link>
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section className="grid gap-4 md:grid-cols-3 mb-14">
                {demoBenefits.map((item) => (
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
                        Why a demo account matters
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        Many beginners rush into live trading too early. But before real money is
                        involved, traders need to understand charts, order execution, position sizing,
                        and how platforms actually work.
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-4">
                        A demo account creates a safer environment for learning. It allows beginners to
                        practice with virtual funds while developing confidence and basic routine.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        If you are still learning the foundation, read our{" "}
                        <Link
                            href={`/${lang}/academy/what-is-forex`}
                            className="text-cyan-400 underline underline-offset-4 transition hover:text-cyan-300"
                        >
                            what is forex guide
                        </Link>{" "}
                        and{" "}
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="text-cyan-400 underline underline-offset-4 transition hover:text-cyan-300"
                        >
                            beginner forex guide
                        </Link>{" "}
                        before moving into live execution.
                    </p>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-7 md:p-8">
                    <h3 className="text-xl font-semibold mb-3 text-amber-300">
                        Important reality
                    </h3>

                    <p className="text-gray-300 leading-relaxed">
                        Demo removes financial pain, so it cannot fully reproduce live emotions. It is
                        valuable practice, but it should not be mistaken for full live-market psychology.
                    </p>
                </div>
            </section>

            {/* STEPS */}
            <section className="mb-16">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">
                        How to use a demo account properly
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These steps help beginners use demo trading as real preparation instead of casual experimentation.
                    </p>
                </div>

                <div className="grid gap-6">
                    {demoSteps.map((step) => (
                        <article
                            key={step.step}
                            className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8 transition hover:border-cyan-500/30 hover:bg-white/10"
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-5">
                                <div className="shrink-0">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-600/15 text-lg font-bold text-cyan-300">
                                        {step.step}
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-gray-300 leading-relaxed mb-5">{step.desc}</p>

                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {step.items.map((item) => (
                                            <li
                                                key={item}
                                                className="flex items-start gap-3 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-gray-400"
                                            >
                                                <span className="mt-1 text-cyan-400">✔</span>
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
                        Demo readiness checklist
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These signs suggest you are using demo practice in a serious and useful way.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {checklist.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-0.5">✔</span>
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
                        Demo trading terms to know
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        These ideas help beginners understand the difference between practicing and trading live.
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
                        Common demo account mistakes
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Demo helps only when it is used with discipline and realistic expectations.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {mistakes.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-cyan-400 mt-0.5">•</span>
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
                    This content is for educational purposes only and should not be considered
                    financial advice. Demo trading can help build skill, but live trading introduces
                    emotional pressure and real financial consequences that demo cannot fully simulate.
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
            <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-indigo-600/20 p-8 md:p-10 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to practice the right way?
                </h2>

                <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Start with the basics, use demo seriously, and choose a broker that gives beginners
                    a clean platform and solid trading foundation.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/country/explorer`}
                        className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-7 py-3.5 font-semibold text-white transition hover:bg-cyan-700"
                    >
                        Compare Demo-Friendly Brokers →
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