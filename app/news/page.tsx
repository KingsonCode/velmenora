import { Suspense } from "react";
import ClientNews from "@/components/ClientNews";
import { News } from "@/types/news";

/* 🔥 BASE URL RESOLVER (PRO SAFE) */
function getBaseUrl() {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}

/* 🔥 SERVER FETCH (ROBUST + PRODUCTION SAFE) */
async function getNews(): Promise<News[]> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/news`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Fetch failed: ${res.status}`);
        }

        const data = await res.json();

        /* 🔥 SAFETY VALIDATION */
        if (!Array.isArray(data)) return [];

        return data;
    } catch (error) {
        console.error("News fetch error:", error);
        return [];
    }
}

/* 🔥 EMPTY STATE COMPONENT */
function EmptyState() {
    return (
        <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No market news available</p>
            <p className="text-sm mt-2">
                Try refreshing or check back later.
            </p>
        </div>
    );
}

/* 🔥 PAGE */
export default async function NewsPage() {
    const news = await getNews();

    return (
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-10">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Market News Explorer
                </h1>

                <p className="text-gray-400 mt-2 max-w-2xl">
                    Real-time forex, crypto, stocks, and macroeconomic insights for traders.
                </p>
            </div>

            {/* CONTENT */}
            <Suspense fallback={<p className="text-gray-400">Loading market data...</p>}>
                {news.length > 0 ? (
                    <ClientNews news={news} />
                ) : (
                    <EmptyState />
                )}
            </Suspense>

        </div>
    );
}