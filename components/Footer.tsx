"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { countries } from "@/lib/geo";

const SUPPORTED_LANGS = new Set(["en", "de", "fr", "ar"]);

const DISPLAY_CLUSTERS = [
    "AFRICA",
    "SOUTH_AFRICA",
    "MIDDLE_EAST",
    "EUROPE",
] as const;

/* ================= GROUP COUNTRIES ================= */
const grouped = countries.reduce((acc, c) => {
    const clusterList = acc[c.cluster] ?? ([] as typeof countries);
    clusterList.push(c);
    acc[c.cluster] = clusterList;
    return acc;
}, {} as Record<string, typeof countries>);

/* ================= TOP BROKER CATEGORIES ================= */
const brokerCategories = [
    { label: "Best Forex Brokers", href: "best-forex-brokers" },
    { label: "ECN Brokers", href: "ecn-brokers" },
    { label: "Low Spread Brokers", href: "low-spread-brokers" },
    { label: "High Leverage Brokers", href: "high-leverage-brokers" },
    {
        label: "Beginner-Friendly Brokers",
        href: "best-forex-brokers-for-beginners",
    },
    {
        label: "Fast Withdrawal Brokers",
        href: "fast-withdrawal-forex-brokers",
    },
];

export default function Footer() {
    const pathname = usePathname() || "/";

    const firstSegment = pathname.split("/")[1] || "";
    const lang = SUPPORTED_LANGS.has(firstSegment) ? firstSegment : "en";
    const langPrefix = `/${lang}`;

    /* ================= ROUTES ================= */
    const homeHref = "/";
    const explorerHref = `${langPrefix}/explorer`;
    const compareHref = "/compare";
    const blogHref = "/blog";
    const brokersHref = "/brokers";
    const academyHref = `${langPrefix}/academy`;

    const academyWhatIsForexHref = `${langPrefix}/academy/what-is-forex`;
    const academyDemoHref = `${langPrefix}/academy/forex-demo-account`;
    const academyRiskHref = `${langPrefix}/academy/forex-risk-management`;

    return (
        <footer className="relative overflow-hidden border-t border-white/10 bg-black text-white">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-2 h-24 w-[14rem] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl sm:h-28 sm:w-[18rem] md:top-4 md:h-36 md:w-[22rem] lg:top-4 lg:h-40 lg:w-[26rem]" />
                <div className="absolute left-1/2 top-8 h-28 w-[16rem] -translate-x-1/2 rounded-full bg-blue-500/8 blur-3xl sm:h-32 sm:w-[20rem] md:top-10 md:h-40 md:w-[26rem] lg:top-10 lg:h-44 lg:w-[30rem]" />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">
                {/* ================= MOBILE / TABLET VERSION ================= */}
                <div className="lg:hidden">
                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 scale-150 rounded-full bg-cyan-400/10 blur-3xl" />

                            <Image
                                src="/footer-logo.png"
                                alt="Velmenora"
                                width={760}
                                height={190}
                                priority
                                className="relative h-auto w-[240px] sm:w-[320px]"
                            />
                        </div>

                        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                            A cleaner way to compare forex brokers, learn trading step by step,
                            and make better decisions with more clarity.
                        </p>

                        <div className="mt-5 inline-flex rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                            Trusted across key forex markets
                        </div>

                        <div className="mx-auto mt-8 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-cyan-400/35 to-transparent" />
                    </div>

                    <div className="mx-auto mt-14 grid gap-10 md:grid-cols-2">
                        <div className="text-center md:text-left">
                            <h4 className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-cyan-200/80">
                                Markets
                            </h4>

                            <div className="grid gap-8 sm:grid-cols-2">
                                {DISPLAY_CLUSTERS.map((cluster) => {
                                    const list = grouped[cluster];
                                    if (!list) return null;

                                    return (
                                        <div key={cluster}>
                                            <h5 className="mb-2 text-base font-semibold text-white">
                                                {cluster.replaceAll("_", " ")}
                                            </h5>

                                            <ul className="space-y-2 text-sm text-white/55">
                                                {list.slice(0, 3).map((c) => (
                                                    <li key={c.code}>
                                                        <Link
                                                            href={`/blog/best-brokers-in-${c.slug}`}
                                                            className="transition hover:text-cyan-300"
                                                        >
                                                            {c.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h4 className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-cyan-200/80">
                                Quick Links
                            </h4>

                            <ul className="space-y-4 text-sm text-white/55">
                                <li>
                                    <Link href={homeHref} className="transition hover:text-cyan-300">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href={explorerHref} className="transition hover:text-cyan-300">
                                        Broker Explorer
                                    </Link>
                                </li>
                                <li>
                                    <Link href={compareHref} className="transition hover:text-cyan-300">
                                        Compare Brokers
                                    </Link>
                                </li>
                                <li>
                                    <Link href={academyHref} className="transition hover:text-cyan-300">
                                        Forex Academy
                                    </Link>
                                </li>
                                <li>
                                    <Link href={blogHref} className="transition hover:text-cyan-300">
                                        Trading Guides
                                    </Link>
                                </li>
                                <li>
                                    <Link href={brokersHref} className="transition hover:text-cyan-300">
                                        All Brokers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mx-auto mt-14 max-w-6xl border-t border-white/10 pt-8">
                        <div className="mb-4 text-center text-xs font-medium uppercase tracking-[0.22em] text-white/35">
                            Top Broker Categories
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            {brokerCategories.map((item) => (
                                <Link
                                    key={item.href}
                                    href={`/blog/${item.href}`}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/60 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-300"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mx-auto mt-10 max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7">
                        <div className="flex flex-col gap-6">
                            <div className="max-w-xl">
                                <div className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                                    Learn smarter
                                </div>
                                <h4 className="mt-2 text-xl font-semibold text-white">
                                    Build skill before you increase risk
                                </h4>
                                <p className="mt-2 text-sm leading-7 text-white/60">
                                    Use the academy to understand the basics, practice on demo, and
                                    improve risk control before making bigger decisions.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={academyWhatIsForexHref}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:border-cyan-400/20 hover:text-cyan-300"
                                >
                                    Learn Forex Basics
                                </Link>

                                <Link
                                    href={academyDemoHref}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:border-cyan-400/20 hover:text-cyan-300"
                                >
                                    Practice on Demo
                                </Link>

                                <Link
                                    href={academyRiskHref}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:border-cyan-400/20 hover:text-cyan-300"
                                >
                                    Risk Management
                                </Link>

                                <Link
                                    href={explorerHref}
                                    className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-300"
                                >
                                    Explore Brokers
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto mt-12 max-w-5xl border-t border-white/10 pt-8 text-center">
                        <p className="text-sm leading-8 text-white/35">
                            Trading forex carries a high level of risk and may not be suitable
                            for all investors. Make sure you understand the risks involved
                            before trading.
                        </p>
                    </div>

                    <div className="mx-auto mt-8 max-w-3xl text-center">
                        <div className="flex items-center justify-center gap-6">
                            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/15 sm:w-24" />
                            <p className="text-xs tracking-[0.2em] text-white/35">
                                © {new Date().getFullYear()} Velmenora. All rights reserved.
                            </p>
                            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/15 sm:w-24" />
                        </div>
                    </div>
                </div>

                {/* ================= DESKTOP VERSION ================= */}
                <div className="hidden lg:block">
                    {/* LOGO */}
                    <div className="mx-auto max-w-6xl text-center">
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 scale-110 rounded-full bg-cyan-400/8 blur-2xl" />
                            <div className="absolute h-10 w-40 rounded-full bg-blue-500/8 blur-2xl" />

                            <Image
                                src="/footer-logo.png"
                                alt="Velmenora"
                                width={760}
                                height={190}
                                priority
                                className="relative h-auto w-[220px] xl:w-[270px]"
                            />
                        </div>

                        <div className="mx-auto mt-4 h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent" />
                    </div>

                    {/* TOP 3 COLUMNS */}
                    <div className="mx-auto mt-8 max-w-6xl">
                        <div className="flex items-start justify-between gap-14 xl:gap-20">
                            {/* COLUMN 1 */}
                            <div className="min-w-0 flex-1 text-left">
                                <h4 className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-200/80">
                                    Markets
                                </h4>

                                <div className="space-y-8">
                                    {DISPLAY_CLUSTERS.slice(0, 2).map((cluster) => {
                                        const list = grouped[cluster];
                                        if (!list) return null;

                                        return (
                                            <div key={cluster}>
                                                <h5 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.02em] text-white">
                                                    {cluster.replaceAll("_", " ")}
                                                </h5>

                                                <ul className="space-y-2.5 text-[14px] text-white/60">
                                                    {list.slice(0, 3).map((c) => (
                                                        <li key={c.code}>
                                                            <Link
                                                                href={`/blog/best-brokers-in-${c.slug}`}
                                                                className="transition hover:text-cyan-300"
                                                            >
                                                                {c.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* COLUMN 2 */}
                            <div className="min-w-0 flex-1 text-left">
                                <h4 className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-200/80">
                                    Markets
                                </h4>

                                <div className="space-y-8">
                                    {DISPLAY_CLUSTERS.slice(2, 4).map((cluster) => {
                                        const list = grouped[cluster];
                                        if (!list) return null;

                                        return (
                                            <div key={cluster}>
                                                <h5 className="mb-3 text-[13px] font-semibold uppercase text-white">
                                                    {cluster.replaceAll("_", " ")}
                                                </h5>

                                                <ul className="space-y-2 text-[13px] text-white/55">
                                                    {list.slice(0, 3).map((c) => (
                                                        <li key={c.code}>
                                                            <Link
                                                                href={`/blog/best-brokers-in-${c.slug}`}
                                                                className="transition hover:text-cyan-300"
                                                            >
                                                                {c.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* COLUMN 3 */}
                            <div className="min-w-[260px] border-l border-white/8 pl-10 xl:pl-12 text-left">
                                <h4 className="mb-6 text-[11px] font-medium uppercase tracking-[0.35em] text-cyan-200/80">
                                    Quick Links
                                </h4>

                                <ul className="space-y-4.5 text-[14px] text-white/60">
                                    <li>
                                        <Link href={homeHref} className="transition hover:text-cyan-300">
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={explorerHref} className="transition hover:text-cyan-300">
                                            Broker Explorer
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={compareHref} className="transition hover:text-cyan-300">
                                            Compare Brokers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={academyHref} className="transition hover:text-cyan-300">
                                            Forex Academy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={blogHref} className="transition hover:text-cyan-300">
                                            Trading Guides
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={brokersHref} className="transition hover:text-cyan-300">
                                            All Brokers
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* CATEGORIES */}
                        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-7">
                            <div className="mb-5 text-center text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
                                Top Broker Categories
                            </div>

                            <div className="flex flex-wrap justify-center gap-3">
                                {brokerCategories.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={`/blog/${item.href}`}
                                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/60 transition hover:border-cyan-400/20 hover:bg-cyan-400/10 hover:text-cyan-300"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* LEARN BOX */}
                        <div className="mx-auto mt-8 max-w-6xl rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                            <div className="flex items-center justify-between gap-8">
                                <div className="max-w-lg">
                                    <div className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                                        Learn smarter
                                    </div>
                                    <h4 className="mt-2 text-lg font-semibold text-white">
                                        Build skill before you increase risk
                                    </h4>
                                    <p className="mt-2 text-sm leading-7 text-white/60">
                                        Use the academy to understand the basics, practice on demo, and
                                        improve risk control before making bigger decisions.
                                    </p>
                                </div>

                                <div className="flex max-w-[500px] flex-wrap justify-end gap-3">
                                    <Link
                                        href={academyWhatIsForexHref}
                                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:border-cyan-400/20 hover:text-cyan-300"
                                    >
                                        Learn Forex Basics
                                    </Link>

                                    <Link
                                        href={academyDemoHref}
                                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:border-cyan-400/20 hover:text-cyan-300"
                                    >
                                        Practice on Demo
                                    </Link>

                                    <Link
                                        href={academyRiskHref}
                                        className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:border-cyan-400/20 hover:text-cyan-300"
                                    >
                                        Risk Management
                                    </Link>

                                    <Link
                                        href={explorerHref}
                                        className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-300"
                                    >
                                        Explore Brokers
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* RISK TEXT */}
                        <div className="mx-auto mt-10 max-w-4xl border-t border-white/10 pt-6 text-center">
                            <p className="text-sm leading-8 text-white/35">
                                Trading forex carries a high level of risk and may not be suitable
                                for all investors. Make sure you understand the risks involved
                                before trading.
                            </p>
                        </div>

                        {/* COPYRIGHT */}
                        <div className="mx-auto mt-6 max-w-4xl text-center">
                            <div className="flex items-center justify-center gap-8">
                                <div className="h-px w-20 bg-gradient-to-r from-transparent to-white/15" />
                                <p className="text-xs tracking-[0.2em] text-white/35">
                                    © {new Date().getFullYear()} Velmenora. All rights reserved.
                                </p>
                                <div className="h-px w-20 bg-gradient-to-l from-transparent to-white/15" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}