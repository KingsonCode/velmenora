import type { Metadata } from "next";
import Link from "next/link";
import { resolveGeoFromServer } from "@/lib/geo/resolver.server";
import { getBrokerCardsBySlugs } from "@/lib/geo/brokerByCountry";
import type { CountryCode as BrokerCountryCode } from "@/lib/types/broker";

export const metadata: Metadata = {
    title: "Start Forex the Right Way | Velmenora",
    description:
        "Start Forex the right way with trusted brokers, simple beginner steps, and clear guidance from Velmenora.",
    alternates: {
        canonical: "/start",
    },
    openGraph: {
        title: "Start Forex the Right Way | Velmenora",
        description:
            "Trusted brokers, simple beginner steps, and a cleaner way to start Forex.",
        url: "/start",
        siteName: "Velmenora",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Start Forex the Right Way | Velmenora",
        description:
            "Trusted brokers, simple beginner steps, and a cleaner way to start Forex.",
    },
};

const START_LINKS = {
    steps: "#steps",
    brokers: "#brokers",
    brokersPage: "/brokers",
    comparePage: "/compare",
    blogPage: "/blog",
    academyPage: "/en/academy",
} as const;

const steps = [
    {
        number: "01",
        title: "Choose a trusted broker",
        text: "Pick a platform that is reliable, easy to use, and fits your starting level and region.",
    },
    {
        number: "02",
        title: "Create your account",
        text: "Sign up, verify your details, and get your profile ready in just a few minutes.",
    },
    {
        number: "03",
        title: "Fund your account",
        text: "Use the supported payment methods available for your region and start small.",
    },
    {
        number: "04",
        title: "Learn before you risk more",
        text: "Start with simple strategy, proper risk control, and clear discipline.",
    },
] as const;

const mistakes = [
    "Starting without guidance",
    "Choosing the wrong broker",
    "Overtrading too early",
    "Risking too much money",
] as const;

const trustPoints = [
    "Beginner-focused guidance",
    "Real broker comparisons",
    "No hype — just practical direction",
    "Built for beginners who want to do it right",
] as const;

function GridGlow() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
        >
            <div className="absolute left-1/2 top-[-140px] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute right-[-100px] top-[18%] h-[280px] w-[280px] rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute left-[-100px] bottom-[8%] h-[260px] w-[260px] rounded-full bg-sky-500/15 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_52%,transparent_85%)]" />
        </div>
    );
}

function SectionTitle({
    eyebrow,
    title,
    text,
}: {
    eyebrow?: string;
    title: string;
    text?: string;
}) {
    return (
        <div className="mx-auto mb-12 max-w-3xl text-center">
            {eyebrow ? (
                <div className="mb-3 inline-flex rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                    {eyebrow}
                </div>
            ) : null}

            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {title}
            </h2>

            {text ? (
                <p className="mt-4 text-base leading-7 text-white/70 md:text-lg">
                    {text}
                </p>
            ) : null}
        </div>
    );
}

function getHeroCta(country: string) {
    if (country === "US") {
        return "Start with a Trusted Broker";
    }

    return "Start Forex Safely";
}

function getHeroSubline(country: string, regionLabel: string) {
    if (country === "US") {
        return `Showing high-trust broker options for ${regionLabel}.`;
    }

    if (country === "GLOBAL") {
        return "Showing the strongest beginner-friendly options for your region.";
    }

    return `Showing the strongest beginner-friendly options for ${regionLabel}.`;
}

function getBrokerSectionText(country: string, regionLabel: string) {
    if (country === "US") {
        return "Showing trusted broker options selected for your market.";
    }

    if (country === "GLOBAL") {
        return "Showing beginner-friendly broker options selected for your region.";
    }

    return `Showing beginner-friendly broker options selected for ${regionLabel}.`;
}

function JsonLd({
    country,
    regionLabel,
}: {
    country: string;
    regionLabel: string;
}) {
    const data = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Start Forex the Right Way",
        description:
            "Trusted brokers, simple beginner steps, and clear guidance to start Forex the right way.",
        url: "https://www.velmenora.com/start",
        isPartOf: {
            "@type": "WebSite",
            name: "Velmenora",
            url: "https://www.velmenora.com",
        },
        about: {
            "@type": "Thing",
            name: "Forex Trading for Beginners",
        },
        audience: {
            "@type": "Audience",
            audienceType:
                country === "GLOBAL"
                    ? "Beginner traders"
                    : `Beginner traders in ${regionLabel}`,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export default async function StartPage() {
    const geo = await resolveGeoFromServer();

    const country = geo.country ?? "GLOBAL";
    const regionLabel = geo.meta?.name || "your region";

    const brokers = getBrokerCardsBySlugs(
        geo.brokers,
        geo.country as BrokerCountryCode | null
    );

    const heroCta = getHeroCta(country);
    const heroSubline = getHeroSubline(country, regionLabel);
    const brokerSectionText = getBrokerSectionText(country, regionLabel);

    return (
        <main className="min-h-screen bg-[#050816] text-white">
            <JsonLd country={country} regionLabel={regionLabel} />

            <section className="relative isolate overflow-hidden border-b border-white/10">
                <GridGlow />

                <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
                    <div className="mx-auto max-w-5xl text-center">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur">
                            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                            Trusted beginner path to Forex with Velmenora
                        </div>

                        <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
                            Start Forex the Right Way{" "}
                            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                                Even as a Complete Beginner
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                            Simple step-by-step guidance, trusted brokers, and a cleaner path
                            to getting started without confusion, hype, or unnecessary risk.
                        </p>

                        <p className="mt-3 text-sm font-medium text-cyan-300">
                            {heroSubline}
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href={START_LINKS.brokers}
                                className="inline-flex min-w-[230px] items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-cyan-300"
                            >
                                {heroCta}
                            </Link>

                            <Link
                                href={START_LINKS.steps}
                                className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/10"
                            >
                                See How It Works
                            </Link>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                <div className="text-sm text-white/50">Focus</div>
                                <div className="mt-1 text-lg font-semibold">Beginner clarity</div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                <div className="text-sm text-white/50">Approach</div>
                                <div className="mt-1 text-lg font-semibold">
                                    Smarter broker selection
                                </div>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                                <div className="text-sm text-white/50">Goal</div>
                                <div className="mt-1 text-lg font-semibold">Safer first steps</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Why Velmenora"
                        title="Not sure where to start?"
                        text="Most beginners fail early because they start blindly — wrong broker, no structure, and too much noise. Velmenora exists to simplify the first move."
                    />

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
                            <div className="mb-4 text-sm font-medium text-cyan-300">
                                Clear path
                            </div>
                            <h3 className="text-xl font-semibold">Simple beginner steps</h3>
                            <p className="mt-3 text-sm leading-7 text-white/65">
                                No fluff. No overload. Just a direct path from zero knowledge to
                                your first structured setup.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
                            <div className="mb-4 text-sm font-medium text-cyan-300">
                                Better decisions
                            </div>
                            <h3 className="text-xl font-semibold">Trusted broker direction</h3>
                            <p className="mt-3 text-sm leading-7 text-white/65">
                                Start with brokers that are easier to use and make sense for
                                your market instead of choosing blindly.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/10">
                            <div className="mb-4 text-sm font-medium text-cyan-300">
                                Realistic mindset
                            </div>
                            <h3 className="text-xl font-semibold">No hype, just guidance</h3>
                            <p className="mt-3 text-sm leading-7 text-white/65">
                                The goal is not fantasy. The goal is starting correctly,
                                managing risk, and building skill over time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="steps" className="border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Step by step"
                        title="How to start Forex the simple way"
                        text="Reduce confusion. Follow a clean sequence."
                    />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.06]"
                            >
                                <div className="text-sm font-semibold tracking-[0.2em] text-cyan-300">
                                    {step.number}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-white">
                                    {step.title}
                                </h3>
                                <p className="mt-3 text-sm leading-7 text-white/65">
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href={START_LINKS.brokers}
                            className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-cyan-300"
                        >
                            Choose Your First Broker
                        </Link>
                    </div>
                </div>
            </section>

            <section id="brokers" className="border-b border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Best brokers"
                        title="Best brokers to start with"
                        text={brokerSectionText}
                    />

                    <div
                        className={`grid gap-6 ${brokers.length === 2
                            ? "mx-auto max-w-4xl lg:grid-cols-2"
                            : "lg:grid-cols-3"
                            }`}
                    >
                        {brokers.map((broker, index) => (
                            <div
                                key={broker.slug}
                                className="relative flex h-full flex-col rounded-3xl border border-white/10 bg-[#0b1123] p-6 shadow-2xl shadow-black/20"
                            >
                                {index === 0 ? (
                                    <div className="absolute -top-3 left-6 rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-black">
                                        Best Starting Option
                                    </div>
                                ) : null}

                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div className="text-2xl font-semibold">{broker.name}</div>
                                    <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                                        {broker.badge}
                                    </span>
                                </div>

                                <p className="text-sm leading-7 text-white/65">
                                    {broker.description}
                                </p>

                                <ul className="mt-6 space-y-3">
                                    {broker.features.slice(0, 4).map((feature) => (
                                        <li
                                            key={feature}
                                            className="flex items-center gap-3 text-sm text-white/80"
                                        >
                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                                                ✓
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-6">
                                    <Link
                                        href={`/go/${broker.slug}`}
                                        className="inline-flex w-full items-center justify-center rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-cyan-300"
                                    >
                                        {broker.cta}
                                    </Link>

                                    <p className="mt-2 text-center text-xs text-white/40">
                                        {broker.microCopy}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-white/50">
                        These recommendations are designed to help beginners start with more
                        clarity. Trading carries risk, so always begin carefully.
                    </p>
                </div>
            </section>

            <section className="border-b border-white/10">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Trust"
                        title="Why traders trust Velmenora"
                        text="The positioning is simple: clarity first, noise last."
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        {trustPoints.map((point) => (
                            <div
                                key={point}
                                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
                                        ✓
                                    </span>
                                    <p className="text-sm leading-7 text-white/80">{point}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b border-white/10 bg-[#070d1d]">
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <SectionTitle
                        eyebrow="Avoid mistakes"
                        title="Most beginners do not fail because Forex is impossible"
                        text="They fail because they start with the wrong structure."
                    />

                    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="rounded-3xl border border-red-400/15 bg-red-400/5 p-6">
                            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-red-300">
                                Common mistakes
                            </div>

                            <ul className="space-y-4">
                                {mistakes.map((mistake) => (
                                    <li key={mistake} className="flex items-center gap-3 text-white/85">
                                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-400/15 text-red-300">
                                            !
                                        </span>
                                        {mistake}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-emerald-400/15 bg-emerald-400/5 p-6">
                            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                                Better approach
                            </div>

                            <p className="text-sm leading-7 text-white/75">
                                Pick a trusted broker, start small, learn the basics, and focus
                                on consistency instead of speed. Starting the right way matters
                                more than starting fast.
                            </p>

                            <div className="mt-6">
                                <Link
                                    href={START_LINKS.brokers}
                                    className="inline-flex items-center justify-center rounded-2xl bg-emerald-300 px-5 py-3.5 text-sm font-semibold text-black transition hover:bg-emerald-200"
                                >
                                    Choose a Better Starting Point
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-[#0d1328] to-[#070b18] p-8 shadow-2xl shadow-black/20 md:p-12">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0"
                        >
                            <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
                            <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
                        </div>

                        <div className="relative mx-auto max-w-4xl text-center">
                            <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                                Final step
                            </div>

                            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
                                Ready to start Forex the smarter way?
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                                Start with a trusted broker, compare your options, or learn the
                                basics first — all in one cleaner path from Velmenora.
                            </p>

                            <div className="mt-8 grid grid-cols-1 gap-4 sm:mx-auto sm:max-w-2xl sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-3">
                                <Link
                                    href={START_LINKS.brokers}
                                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.01] hover:bg-cyan-300"
                                >
                                    Get Started with a Trusted Broker
                                </Link>

                                <Link
                                    href={START_LINKS.comparePage}
                                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-cyan-400/30 hover:bg-white/10"
                                >
                                    Compare Brokers
                                </Link>

                                <Link
                                    href={START_LINKS.academyPage}
                                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-6 py-3.5 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                                >
                                    Learn Forex
                                </Link>
                            </div>

                            <p className="mt-5 text-sm text-white/45">
                                Choose the path that fits your level best.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div>
                        <div className="text-lg font-semibold tracking-tight">Velmenora</div>
                        <p className="mt-2 max-w-md text-sm leading-7 text-white/50">
                            Forex education, broker comparisons, and practical guidance for
                            traders who want a smarter start.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-5 text-sm text-white/70">
                        <Link href={START_LINKS.brokersPage} className="hover:text-cyan-300">
                            Brokers
                        </Link>
                        <Link href={START_LINKS.comparePage} className="hover:text-cyan-300">
                            Compare
                        </Link>
                        <Link href={START_LINKS.academyPage} className="hover:text-cyan-300">
                            Learn
                        </Link>
                    </div>
                </div>

                <div className="border-t border-white/10 px-4 py-5 text-center text-xs leading-6 text-white/45">
                    Trading involves risk. Only trade what you can afford to lose.
                </div>
            </footer>
        </main>
    );
}