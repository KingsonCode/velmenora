"use client";

import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import Link from "next/link";
import { getNewsContent, Lang } from "@/lib/i18n";

/* ================= TYPES ================= */
type Props = {
    lang?: Lang;
};

/* ================= COMPONENT ================= */
export default function NewsSection({ lang = "en" }: Props) {
    const t = getNewsContent(lang);

    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/news")
            .then((res) => res.json())
            .then((data) => {
                setNews(data.slice(0, 3));
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">

            {/* 🔥 HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {t.title}
                </h2>

                <Link
                    href={`/${lang}/country/news`}
                    className="text-sm text-blue-400 hover:underline"
                >
                    {t.viewAll}
                </Link>
            </div>

            {/* ⚡ LOADING */}
            {loading && (
                <div className="text-center text-gray-400 py-10">
                    {t.loading}
                </div>
            )}

            {/* ❌ EMPTY */}
            {!loading && news.length === 0 && (
                <div className="text-center text-gray-400 py-10">
                    {t.empty}
                </div>
            )}

            {/* 📰 GRID */}
            {!loading && news.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6">
                    {news.map((item) => (
                        <NewsCard key={item.id} item={item} />
                    ))}
                </div>
            )}

        </div>
    );
}