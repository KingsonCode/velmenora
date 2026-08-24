import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { IS_INDEXABLE_DEPLOYMENT } from "@/lib/seo/indexing";
import AcademyTopNav from "@/components/academy/AcademyTopNav";

const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];
type RouteParams = Promise<{ lang: string }>;

const BASE_URL = "https://velmenora.com";

const ACADEMY_CANONICAL =
    `${BASE_URL}/en/academy/what-is-forex`;

const ACADEMY_TITLE =
    "What Is Forex Trading? Beginner Guide | Velmenora";

const ACADEMY_DESCRIPTION =
    "Learn what forex trading is, how currency pairs work, essential terminology, beginner risks, and the importance of demo practice and risk management.";

function isValidLang(value: string): value is Lang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

const coreConcepts = [
    {
        title: "Currency Pairs",
        desc: "Forex is traded in pairs like EUR/USD, GBP/USD, or USD/JPY, where one currency is priced against another.",
    },
    {
        title: "Price Movement",
        desc: "Traders try to profit from whether one currency strengthens or weakens relative to the other.",
    },
    {
        title: "24/5 Market",
        desc: "The forex market operates 24 hours a day, five days a week across major global trading sessions.",
    },
];

const benefits = [
    "High liquidity and easy trade execution",
    "24-hour market access during weekdays",
    "Lower barrier to entry than many traditional markets",
    "Ability to trade both rising and falling markets",
    "Access from almost anywhere in the world",
    "Wide choice of brokers and trading platforms",
];

const risks = [
    "High volatility can create fast losses",
    "Over-leverage increases exposure dramatically",
    "Emotional decisions can destroy consistency",
    "Lack of knowledge leads to avoidable mistakes",
    "Poor risk management can wipe out small accounts quickly",
    "Random trading without a plan usually fails",
];

const keyFacts = [
    {
        label: "Market type",
        value: "Global currency market",
    },
    {
        label: "Trading hours",
        value: "24 hours, 5 days",
    },
    {
        label: "Main focus",
        value: "Currency price movement",
    },
];

const glossary = [
    {
        term: "Pip",
        desc: "A pip is one of the smallest standard price movements in a currency pair.",
    },
    {
        term: "Spread",
        desc: "The spread is the difference between the buy price and the sell price of a forex pair.",
    },
    {
        term: "Leverage",
        desc: "Leverage allows traders to control larger positions using a smaller amount of capital.",
    },
    {
        term: "Lot",
        desc: "A lot is the standard unit size used to measure a forex trade.",
    },
];

const faqs = [
    {
        q: "What is forex trading in simple terms?",
        a: "Forex trading is the buying and selling of currencies to profit from changes in their prices.",
    },
    {
        q: "Can beginners start forex trading?",
        a: "Yes, but beginners should start with education, demo trading, and strong risk management before trading with real money.",
    },
    {
        q: "How much money do you need to start forex?",
        a: "You can start with a small amount, but account size matters less than discipline, position sizing, and risk control.",
    },
    {
        q: "Is forex trading risky?",
        a: "Yes. Forex trading involves risk, especially when traders use leverage or enter trades without a clear plan.",
    },
    {
        q: "Why do people trade forex?",
        a: "People trade forex because the market is liquid, accessible, active across the week, and offers opportunities in both rising and falling conditions.",
    },
];

export async function generateMetadata({
    params,
}: {
    params: RouteParams;
}): Promise<Metadata> {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        return {
            title: {
                absolute: "Academy Page Not Found | Velmenora",
            },
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    return {
        title: { absolute: ACADEMY_TITLE },
        description: ACADEMY_DESCRIPTION,
        authors: [
            {
                name: "Velmenora Research",
                url: `${BASE_URL}/`,
            },
        ],
        publisher: "Velmenora",
        alternates: {
            canonical: ACADEMY_CANONICAL,
            languages: {
                en: ACADEMY_CANONICAL,
                "x-default": ACADEMY_CANONICAL,
            },
        },
        openGraph: {
            type: "article",
            title: ACADEMY_TITLE,
            description: ACADEMY_DESCRIPTION,
            url: ACADEMY_CANONICAL,
            siteName: "Velmenora",
            locale: "en_US",
            images: [
                {
                    url: `${BASE_URL}/og-default.jpg`,
                    width: 1200,
                    height: 630,
                    alt: "What is forex trading — Velmenora Academy",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: ACADEMY_TITLE,
            description: ACADEMY_DESCRIPTION,
            images: [`${BASE_URL}/og-default.jpg`],
        },
        robots: {
            index: lang === "en" && IS_INDEXABLE_DEPLOYMENT,
            follow: IS_INDEXABLE_DEPLOYMENT,
        },
    };
}

export default async function WhatIsForexPage({
    params,
}: {
    params: RouteParams;
}) {
    const { lang } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    const breadcrumbId =
        `${ACADEMY_CANONICAL}#breadcrumb`;

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LearningResource",
                "@id": `${ACADEMY_CANONICAL}#learning-resource`,
                url: ACADEMY_CANONICAL,
                name: ACADEMY_TITLE,
                headline: "What is Forex Trading?",
                description: ACADEMY_DESCRIPTION,
                inLanguage: "en",
                isAccessibleForFree: true,
                learningResourceType: "Beginner guide",
                educationalLevel: "Beginner",
                teaches: [
                    "How currency pairs work",
                    "Basic forex terminology",
                    "Forex market risks",
                    "Demo trading and risk management",
                ],
                author: {
                    "@id": `${BASE_URL}/#organization`,
                },
                publisher: {
                    "@id": `${BASE_URL}/#organization`,
                },
                isPartOf: {
                    "@id": `${BASE_URL}/#website`,
                },
                breadcrumb: {
                    "@id": breadcrumbId,
                },
            },
            {
                "@type": "FAQPage",
                "@id": `${ACADEMY_CANONICAL}#faq`,
                mainEntity: faqs.map((item) => ({
                    "@type": "Question",
                    name: item.q,
                    acceptedAnswer: {
                        "@type": "Answer",
                        text: item.a,
                    },
                })),
            },
            {
                "@type": "BreadcrumbList",
                "@id": breadcrumbId,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: `${BASE_URL}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Forex Academy",
                        item: `${BASE_URL}/en/academy`,
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: "What is Forex?",
                        item: ACADEMY_CANONICAL,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                id="velmenora-academy-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        structuredData
                    ).replace(/</g, "\\u003c"),
                }}
            />
            <main className="max-w-6xl mx-auto px-4 pt-32 pb-20">
            <nav
                aria-label="Breadcrumb"
                className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400"
            >
                <Link
                    href="/"
                    className="transition hover:text-white"
                >
                    Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link
                    href={`/${lang}/academy`}
                    className="transition hover:text-white"
                >
                    Forex Academy
                </Link>
                <span aria-hidden="true">/</span>
                <span aria-current="page">
                    What is Forex?
                </span>
            </nav>

            <AcademyTopNav
                lang={lang}
                current="what-is-forex"
                currentLabel="What is Forex?"
            />

            {/* HERO */}
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-blue-500/10 p-8 md:p-12 mb-12">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_30%)]" />

                <div className="relative z-10 max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 mb-5">
                        Forex Basics
                    </span>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                        What is Forex Trading?
                    </h1>

                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                        Forex trading is the buying and selling of currencies to profit from price
                        movement. It is one of the largest and most active financial markets in the
                        world, attracting traders, institutions, and businesses globally.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Forex for Beginners →
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

            {/* QUICK FACTS */}
            <section className="grid gap-4 md:grid-cols-3 mb-12">
                {keyFacts.map((fact) => (
                    <div
                        key={fact.label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
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

            {/* CORE CONCEPTS */}
            <section className="grid gap-4 md:grid-cols-3 mb-14">
                {coreConcepts.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
                    >
                        <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                        <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* HOW IT WORKS */}
            <section className="grid lg:grid-cols-[1.35fr_0.9fr] gap-8 mb-16">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-7 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                        How the forex market works
                    </h2>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        In forex, currencies are traded in pairs such as EUR/USD, GBP/USD, or USD/JPY.
                        When you place a trade, you are speculating on whether one currency will rise
                        or fall against another.
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-4">
                        For example, if you believe the Euro will strengthen against the US Dollar,
                        you may buy EUR/USD. If the price rises, the trade may generate profit. If the
                        price falls, the trade may result in a loss.
                    </p>

                    <p className="text-gray-400 leading-relaxed mb-4">
                        Because the market is global, trading activity moves across major financial
                        centers like London, New York, and Asia, creating opportunities throughout
                        the trading week.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        If you are new, read our{" "}
                        <Link
                            href={`/${lang}/academy/forex-for-beginners`}
                            className="text-blue-400 underline underline-offset-4 transition hover:text-blue-300"
                        >
                            beginner forex guide
                        </Link>{" "}
                        to understand how to start safely before taking real trades.
                    </p>
                </div>

                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-7 md:p-8">
                    <h3 className="text-xl font-semibold mb-3 text-blue-300">
                        Simple example
                    </h3>

                    <p className="text-gray-300 leading-relaxed mb-4">
                        Imagine EUR/USD is rising and you bought the pair earlier. As the price moves
                        upward, your position may gain value.
                    </p>

                    <p className="text-gray-400 leading-relaxed">
                        But if the pair moves in the opposite direction, the trade can lose value.
                        That is why understanding market direction and risk management matters from
                        the very beginning.
                    </p>
                </div>
            </section>

            {/* WHY PEOPLE TRADE FOREX */}
            <section className="mb-16">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        Why do people trade forex?
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Traders are attracted to forex because the market is active, accessible, and
                        offers flexibility in how opportunities are approached.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {benefits.map((item) => (
                        <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-blue-400 mt-0.5">✔</span>
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
                        Key forex terms beginners should know
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Understanding basic forex terminology makes it easier to read broker platforms,
                        educational content, and market commentary.
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

            {/* WHY BEGINNERS GET CONFUSED */}
            <section className="mb-16 rounded-3xl border border-amber-500/20 bg-amber-500/10 p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-4 text-amber-300">
                    Why beginners often misunderstand forex
                </h2>

                <p className="text-gray-300 leading-relaxed max-w-3xl mb-6">
                    Many people hear about forex through hype, screenshots, or unrealistic promises.
                    That creates the false impression that trading is easy money. In reality, forex
                    requires education, patience, and disciplined decision-making.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold mb-3">Wrong mindset</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✘ Looking for fast money</li>
                            <li>✘ Trading without understanding the market</li>
                            <li>✘ Copying others blindly</li>
                            <li>✘ Ignoring risk completely</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                        <h3 className="font-semibold mb-3">Better mindset</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>✔ Learn the structure first</li>
                            <li>✔ Start with a demo account</li>
                            <li>✔ Focus on discipline over excitement</li>
                            <li>✔ Treat trading like a skill</li>
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
                    Forex trading involves risk and is not suitable for everyone. This page is provided
                    for educational purposes only and should not be considered financial advice. New
                    traders should learn the basics, practice in a demo environment, and understand
                    position sizing and risk management before trading live.
                </p>
            </section>

            {/* RISKS */}
            <section className="mb-16 rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-500/10 to-orange-500/10 p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-4 text-red-300">
                    Risks of forex trading
                </h2>

                <p className="text-gray-300 leading-relaxed max-w-3xl mb-6">
                    Forex offers opportunity, but it also carries serious risk. Many beginners lose
                    because they start without education, structure, risk control, or emotional discipline.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                    {risks.map((risk) => (
                        <div
                            key={risk}
                            className="rounded-2xl border border-white/10 bg-black/20 p-5 text-gray-300"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-red-400 mt-0.5">•</span>
                                <span>{risk}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* NEXT STEP */}
            <section className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-3">
                        What should you do next?
                    </h2>
                    <p className="text-gray-400 max-w-2xl leading-relaxed">
                        Once you understand what forex is, the next step is learning how beginners
                        should approach the market safely.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 1</p>
                        <h3 className="text-xl font-semibold mb-3">Understand basics</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Learn how currency pairs, pips, leverage, and price movement actually work.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 2</p>
                        <h3 className="text-xl font-semibold mb-3">Practice first</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Use demo trading to build confidence before risking real money.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                        <p className="text-sm text-gray-400 mb-2">Step 3</p>
                        <h3 className="text-xl font-semibold mb-3">Build structure</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Learn risk management and follow a clear trading process.
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
                    Ready to go deeper?
                </h2>

                <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                    Learn the next steps, avoid beginner mistakes, and build a stronger foundation
                    before placing real trades.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={`/${lang}/academy/forex-for-beginners`}
                        className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Forex for Beginners →
                    </Link>

                    <Link
                        href={`/${lang}/academy/how-to-trade-forex`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:bg-white/10"
                    >
                        How to Trade Forex
                    </Link>
                </div>
            </section>
            </main>
        </>
    );
}