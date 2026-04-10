import MarketSentiment from "@/components/market/MarketSentiment";

async function getSentiment(pair: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/market-sentiment/${pair}`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) throw new Error();
        return res.json();
    } catch {
        return { bull: 50, bear: 50 };
    }
}

export default async function SentimentSection({ pair }: { pair: string }) {
    const sentiment = await getSentiment(pair);

    return <MarketSentiment pair={pair} sentiment={sentiment} />;
}