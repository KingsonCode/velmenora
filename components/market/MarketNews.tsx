"use client";

import Link from "next/link";

type NewsItem = {
    title: string;
    summary: string;
    time?: string;
    source?: string;
    url?: string;
};

type Props = {
    news?: NewsItem[];
    pair: string;
};

export default function MarketNews({ news = [], pair }: Props) {
    /* ✅ HARD NARROWING */
    if (!Array.isArray(news) || news.length === 0) {
        return null;
    }

    /* 🔥 SAFE DESTRUCTURING */
    const [featured, ...rest] = news;

    /* 🚨 FINAL GUARD (TS FULL TRUST) */
    if (!featured) return null;

    const visible = rest.slice(0, 5); // unaweza adjust limit

    return (
        <div className="space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                    Latest {pair} News
                </h2>
                <span className="text-xs text-gray-500">
                    Updated live
                </span>
            </div>

            {/* 🔥 FEATURED */}
            <Link href={featured.url ?? "#"}>
                <div className="p-5 rounded-xl border border-gray-800 bg-[#0B0F1A] hover:border-gray-700 transition cursor-pointer">

                    <p className="text-lg font-semibold">
                        {featured.title}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                        {featured.summary}
                    </p>

                    <div className="flex gap-3 mt-3 text-xs text-gray-500">
                        {featured.source && <span>{featured.source}</span>}
                        {featured.source && featured.time && <span>•</span>}
                        {featured.time && <span>{featured.time}</span>}
                    </div>

                </div>
            </Link>

            {/* 📰 LIST */}
            {visible.length > 0 && (
                <div className="space-y-3">
                    {visible.map((n, i) => (
                        <Link key={i} href={n.url ?? "#"}>
                            <div className="p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition cursor-pointer bg-black">

                                <p className="text-sm font-medium">
                                    {n.title}
                                </p>

                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                    {n.summary}
                                </p>

                                <div className="flex gap-2 mt-2 text-[11px] text-gray-500">
                                    {n.source && <span>{n.source}</span>}
                                    {n.source && n.time && <span>•</span>}
                                    {n.time && <span>{n.time}</span>}
                                </div>

                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* CTA */}
            <Link href={`/news/${pair.toLowerCase()}`}>
                <button className="w-full border border-gray-700 hover:border-white text-sm py-2 rounded-lg transition">
                    View more {pair} news →
                </button>
            </Link>

        </div>
    );
}