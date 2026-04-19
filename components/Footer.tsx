"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { countries, resolveGeo } from "@/lib/geo";

const SUPPORTED_LANGS = new Set(["en", "de", "fr", "ar"]);

/* ================= GROUP COUNTRIES ================= */
const grouped = countries.reduce((acc, c) => {
    const clusterList = acc[c.cluster] ?? ([] as typeof countries);
    clusterList.push(c);
    acc[c.cluster] = clusterList;
    return acc;
}, {} as Record<string, typeof countries>);

/* ================= TOP BROKER CATEGORIES ================= */
const brokerCategories = [
    {
        label: "Best Forex Brokers",
        href: "best-forex-brokers",
    },
    {
        label: "ECN Brokers",
        href: "ecn-brokers",
    },
    {
        label: "Low Spread Brokers",
        href: "low-spread-brokers",
    },
    {
        label: "High Leverage Brokers",
        href: "high-leverage-brokers",
    },
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
    const geo = resolveGeo();

    const firstSegment = pathname.split("/")[1] || "";
    const hasLangPrefix = SUPPORTED_LANGS.has(firstSegment);
    const langPrefix = hasLangPrefix ? `/${firstSegment}` : "/en";

    const homeHref = langPrefix;
    const explorerHref = `${langPrefix}/explorer`;
    const compareHref = `${langPrefix}/compare`;
    const blogHref = `${langPrefix}/blog`;
    const brokersHref = `${langPrefix}/brokers`;
    const academyHref = `${langPrefix}/academy`;

    return (
        <footer className="border-t border-white/10 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6 py-14">
                {/* TOP GRID */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
                    {/* BRAND */}
                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-lg font-bold">
                            Velmenora
                        </h3>

                        <p className="mb-4 max-w-sm text-sm text-gray-400">
                            Compare trusted forex brokers, learn trading step by step,
                            and choose the right platform for your goals and region.
                        </p>

                        <div className="text-xs text-gray-500">
                            Trusted by traders in {geo.meta?.name || "your region"}
                        </div>
                    </div>

                    {/* GEO CLUSTERS */}
                    {Object.entries(grouped)
                        .slice(0, 3)
                        .map(([cluster, list]) => (
                            <div key={cluster}>
                                <h4 className="mb-3 text-sm font-semibold">
                                    {cluster.replaceAll("_", " ")}
                                </h4>

                                <ul className="space-y-2 text-sm text-gray-400">
                                    {list.slice(0, 6).map((c) => (
                                        <li key={c.code}>
                                            <Link
                                                href={`${langPrefix}/blog/best-brokers-in-${c.slug}`}
                                                className="transition hover:text-white"
                                            >
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                    {/* QUICK LINKS */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold">
                            Quick Links
                        </h4>

                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <Link href={homeHref} className="transition hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href={explorerHref} className="transition hover:text-white">
                                    Broker Explorer
                                </Link>
                            </li>
                            <li>
                                <Link href={compareHref} className="transition hover:text-white">
                                    Compare Brokers
                                </Link>
                            </li>
                            <li>
                                <Link href={academyHref} className="transition hover:text-white">
                                    Forex Academy
                                </Link>
                            </li>
                            <li>
                                <Link href={blogHref} className="transition hover:text-white">
                                    Trading Guides
                                </Link>
                            </li>
                            <li>
                                <Link href={brokersHref} className="transition hover:text-white">
                                    All Brokers
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* TOP BROKER CATEGORIES */}
                <div className="mt-12 border-t border-white/10 pt-6">
                    <div className="mb-4 text-center text-xs text-gray-500">
                        Top Broker Categories
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
                        {brokerCategories.map((item) => (
                            <Link
                                key={item.href}
                                href={`${langPrefix}/blog/${item.href}`}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10 hover:text-white"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* POPULAR MARKETS */}
                <div className="mt-10 border-t border-white/10 pt-6">
                    <div className="mb-4 text-center text-xs text-gray-500">
                        Popular Markets
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
                        {countries.slice(0, 20).map((c) => (
                            <Link
                                key={c.code}
                                href={`${langPrefix}/blog/best-brokers-in-${c.slug}`}
                                className="transition hover:text-white"
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* LEARNING + CONVERSION STRIP */}
                <div className="mt-10 border-t border-white/10 pt-6">
                    <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:gap-6">
                        <Link
                            href={`${langPrefix}/academy/what-is-forex`}
                            className="text-sm text-gray-400 transition hover:text-white"
                        >
                            Learn Forex Basics
                        </Link>

                        <Link
                            href={`${langPrefix}/academy/forex-demo-account`}
                            className="text-sm text-gray-400 transition hover:text-white"
                        >
                            Practice on Demo
                        </Link>

                        <Link
                            href={`${langPrefix}/academy/forex-risk-management`}
                            className="text-sm text-gray-400 transition hover:text-white"
                        >
                            Learn Risk Management
                        </Link>

                        <Link
                            href={explorerHref}
                            className="text-sm text-gray-400 transition hover:text-white"
                        >
                            Explore Brokers
                        </Link>
                    </div>
                </div>

                {/* LEGAL */}
                <div className="mt-10 border-t border-white/10 pt-6 space-y-2 text-center text-xs text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Velmenora. All rights reserved.
                    </p>

                    <p className="mx-auto max-w-2xl">
                        Trading forex carries a high level of risk and may not be suitable for all investors.
                        Ensure you understand the risks involved before trading.
                    </p>
                </div>
            </div>
        </footer>
    );
}