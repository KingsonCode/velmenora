"use client";

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

export default function Footer() {
    const pathname = usePathname();
    const geo = resolveGeo();
    const firstSegment = pathname?.split("/")[1] || "";
    const langPrefix = SUPPORTED_LANGS.has(firstSegment)
        ? `/${firstSegment}`
        : "";
    const compareHref = langPrefix
        ? `${langPrefix}/best-forex-brokers`
        : "/compare";

    return (
        <footer className="bg-black border-t border-white/10 text-white">

            <div className="max-w-7xl mx-auto px-6 py-14">

                {/* 🔥 TOP GRID */}
                <div className="grid md:grid-cols-5 gap-10">

                    {/* ================= BRAND ================= */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">
                            Velmenora
                        </h3>

                        <p className="text-sm text-gray-400 mb-4">
                            Compare the best forex brokers globally and trade with confidence.
                        </p>

                        {/* 🔥 TRUST SIGNAL */}
                        <div className="text-xs text-gray-500">
                            Trusted by traders in {geo.meta?.name || "your region"}
                        </div>
                    </div>

                    {/* ================= GEO CLUSTERS ================= */}
                    {Object.entries(grouped).map(([cluster, list]) => (
                        <div key={cluster}>
                            <h4 className="text-sm font-semibold mb-3">
                                {cluster}
                            </h4>

                            <ul className="space-y-2 text-sm text-gray-400">
                                {list.slice(0, 6).map((c) => (
                                    <li key={c.code}>
                                        <a
                                            href={`/blog/best-brokers-in-${c.slug}`}
                                            className="hover:text-white transition"
                                        >
                                            {c.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* ================= QUICK LINKS ================= */}
                    <div>
                        <h4 className="text-sm font-semibold mb-3">
                            Quick Links
                        </h4>

                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>
                                <a href={compareHref} className="hover:text-white">
                                    Compare Brokers
                                </a>
                            </li>
                            <li>
                                <a href="/blog" className="hover:text-white">
                                    Trading Guides
                                </a>
                            </li>
                            <li>
                                <a href="/brokers" className="hover:text-white">
                                    All Brokers
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* ================= SEO INTERNAL LINKS (HIDDEN POWER) ================= */}
                <div className="mt-12 border-t border-white/10 pt-6">

                    <div className="text-xs text-gray-500 mb-4 text-center">
                        Popular Markets
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-400">
                        {countries.slice(0, 20).map((c) => (
                            <a
                                key={c.code}
                                href={`/blog/best-brokers-in-${c.slug}`}
                                className="hover:text-white"
                            >
                                {c.name}
                            </a>
                        ))}
                    </div>

                </div>

                {/* ================= LEGAL ================= */}
                <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500 space-y-2">

                    <p>
                        © {new Date().getFullYear()} Velmenora. All rights reserved.
                    </p>

                    <p className="max-w-2xl mx-auto">
                        Trading forex carries a high level of risk and may not be suitable for all investors.
                        Ensure you understand the risks involved before trading.
                    </p>

                </div>

            </div>

        </footer>
    );
}
