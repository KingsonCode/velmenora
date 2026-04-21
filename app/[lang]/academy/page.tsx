import Link from "next/link";
import { notFound } from "next/navigation";
import AcademyTopNav from "@/components/academy/AcademyTopNav";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

const academyGuides = [
    {
        title: "What is Forex?",
        href: "what-is-forex",
        desc: "Understand how the forex market works, how currencies are traded, and why traders participate globally.",
        badge: "Foundation",
    },
    {
        title: "Forex for Beginners",
        href: "forex-for-beginners",
        desc: "Start with the right foundation, avoid common mistakes, and learn how to approach trading safely.",
        badge: "Beginner",
    },
    {
        title: "Forex Demo Account",
        href: "forex-demo-account",
        desc: "Learn why demo trading matters, how to practice properly, and when to transition to live trading.",
        badge: "Practice",
    },
    {
        title: "Forex Risk Management",
        href: "forex-risk-management",
        desc: "Understand position sizing, stop loss, capital protection, and how to survive losing trades.",
        badge: "Protection",
    },
    {
        title: "How to Trade Forex",
        href: "how-to-trade-forex",
        desc: "Learn the step-by-step trading process: analysis, entries, execution, and capital protection.",
        badge: "Execution",
    },
];

const learningPoints = [
    "Forex market structure",
    "Beginner trading mindset",
    "Demo trading practice",
    "Risk management basics",
    "Trade execution process",
];

export default async function AcademyPage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    return (
        <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
            <AcademyTopNav
                lang={lang}
                current=""
                currentLabel="Academy"
            />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-blue-500/10 p-8 md:p-12 mb-14">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_30%)]" />

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-5">
                        Forex Academy
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        Forex Trading Academy
                    </h1>

                    <p className="text-gray-300 max-w-2xl text-lg md:text-xl leading-relaxed mb-8">
                        Learn forex trading from beginner to advanced level. Understand the market,
                        practice safely, manage risk, and build the foundations of consistent trading.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/country/academy/what-is-forex`}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Start Learning →
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

            {/* LEARNING POINTS */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-14">
                {learningPoints.map((item) => (
                    <div
                        key={item}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300 transition hover:bg-white/10"
                    >
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 text-blue-400">✔</span>
                            <span>{item}</span>
                        </div>
                    </div>
                ))}
            </section>

            {/* GUIDE CARDS */}
            <section className="mb-20">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">
                        Start with the right guide
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Move from understanding the market, to building your beginner foundation,
                        to practicing on demo, protecting capital, and learning how trades are executed.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {academyGuides.map((guide, index) => (
                        <Link
                            key={guide.href}
                            href={`/${lang}/country/academy/${guide.href}`}
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-white/10"
                        >
                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-blue-300">
                                        {guide.badge}
                                    </span>

                                    <span className="text-sm font-medium text-gray-500">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-semibold mb-3 transition group-hover:text-blue-400">
                                    {guide.title}
                                </h3>

                                <p className="text-gray-400 leading-relaxed mb-6">
                                    {guide.desc}
                                </p>

                                <div className="inline-flex items-center font-semibold text-blue-400 transition group-hover:text-blue-300">
                                    Read guide →
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FLOW SECTION */}
            <section className="mb-20 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-3">
                        Recommended learning flow
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Follow this order if you want a cleaner path through the academy.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 1</p>
                        <h3 className="text-xl font-semibold mb-3">Understand Forex</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Learn what forex trading is, how currency pairs work, and why the market moves.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 2</p>
                        <h3 className="text-xl font-semibold mb-3">Build Your Base</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Study beginner principles, avoid common mistakes, and understand the basics early.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 3</p>
                        <h3 className="text-xl font-semibold mb-3">Practice on Demo</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Learn execution, platform use, and discipline without risking real money.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 4</p>
                        <h3 className="text-xl font-semibold mb-3">Protect Capital</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Understand stop loss, position sizing, and how to survive losing trades.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 5</p>
                        <h3 className="text-xl font-semibold mb-3">Learn Execution</h3>
                        <p className="text-gray-400 leading-relaxed">
                            See how traders analyze setups, define entries, and manage trades properly.
                        </p>
                    </div>
                </div>
            </section>

            {/* FEATURED PATH */}
            <section className="mb-20 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent p-8 md:p-10">
                    <h2 className="text-3xl font-bold mb-4">
                        Best place to start as a beginner
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
                        New to trading? Start with the beginner track first: understand forex, use a demo
                        account seriously, then learn risk management before focusing on live execution.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/country/academy/forex-for-beginners`}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Open Beginner Guide →
                        </Link>

                        <Link
                            href={`/${lang}/country/academy/forex-demo-account`}
                            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
                        >
                            Learn Demo Trading
                        </Link>
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                    <h3 className="text-2xl font-semibold mb-4">
                        What this academy helps you do
                    </h3>

                    <ul className="space-y-3 text-gray-400">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-400 mt-0.5">✔</span>
                            <span>Understand how forex trading actually works</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-400 mt-0.5">✔</span>
                            <span>Avoid common beginner mistakes</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-400 mt-0.5">✔</span>
                            <span>Practice safely before going live</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-400 mt-0.5">✔</span>
                            <span>Protect your capital with risk rules</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-400 mt-0.5">✔</span>
                            <span>Build a cleaner path toward execution</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* CTA */}
            <section className="text-center rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/20 via-indigo-600/10 to-purple-600/20 p-10 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Start Trading?
                </h2>

                <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                    Learn the basics first, then compare trusted forex brokers and choose a platform
                    that matches your goals, experience level, and trading style.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/country/explorer`}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
                    >
                        Explore Top Forex Brokers →
                    </Link>

                    <Link
                        href={`/${lang}/country/academy/what-is-forex`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
                    >
                        Start with Forex Basics
                    </Link>
                </div>
            </section>
        </main>
    );
}