"use client";

import { useEffect, useState } from "react";
import NewsCard from "./NewsCard";

export default function NewsSection() {
    const [news, setNews] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/news")
            .then((res) => res.json())
            .then((data) => setNews(data.slice(0, 3)));
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-12 px-6">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    🔥 Live Market News
                </h2>

                <a
                    href="/news"
                    className="text-sm text-blue-400 hover:underline"
                >
                    View all →
                </a>
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-3 gap-6">
                {news.map((item) => (
                    <NewsCard key={item.id} item={item} />
                ))}
            </div>

        </div>
    );
}