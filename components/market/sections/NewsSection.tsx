import MarketNews from "@/components/market/MarketNews";

async function getNews(pair: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/market-news/${pair}`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) throw new Error();
        return res.json();
    } catch {
        return [];
    }
}

export default async function NewsSection({ pair }: { pair: string }) {
    const news = await getNews(pair);

    return <MarketNews news={news} pair={pair} />;
}