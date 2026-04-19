import MarketSentiment from "@/components/market/MarketSentiment";
import { getBaseUrl } from "@/lib/getBaseUrl";

async function getSentiment(pair: string) {
    try {
        const res = await fetch(
            `${getBaseUrl()}/api/market-sentiment/${pair}`,
            { next: { revalidate: 60 } }
        );

        if (!res.ok) {
            throw new Error(`Failed to fetch sentiment: ${res.status}`);
        }

        return await res.json();
    } catch {
        return { bull: 50, bear: 50 };
    }
}

export default async function SentimentSection({ pair }: { pair: string }) {
    const sentiment = await getSentiment(pair);

    return <MarketSentiment pair={pair} sentiment={sentiment} />;
}