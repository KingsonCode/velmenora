import MarketNews from "@/components/market/MarketNews";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getNews(pair: string) {
    try {
        const res = await fetch(
            `${getBaseUrl()}/api/market-news/${pair}`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch news: ${res.status}`);
        }

        return await res.json();
    } catch {
        return [];
    }
}

export default async function NewsSection({ pair }: { pair: string }) {
    const news = await getNews(pair);

    return <MarketNews news={news} pair={pair} />;
}