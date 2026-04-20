import MarketSentiment from "@/components/market/MarketSentiment";
import { getBaseUrl } from "@/lib/getBaseUrl";
import type { Lang } from "@/lib/i18n";

type SentimentData = {
    bull: number;
    bear: number;
};

type Props = {
    pair: string;
    lang: Lang;
};

async function getSentiment(pair: string): Promise<SentimentData> {
    try {
        const res = await fetch(`${getBaseUrl()}/api/market-sentiment/${pair}`, {
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch sentiment: ${res.status}`);
        }

        const data = await res.json();

        if (
            !data ||
            typeof data.bull !== "number" ||
            typeof data.bear !== "number"
        ) {
            return { bull: 50, bear: 50 };
        }

        return data;
    } catch {
        return { bull: 50, bear: 50 };
    }
}

export default async function SentimentSection({ pair, lang }: Props) {
    const sentiment = await getSentiment(pair);

    return (
        <MarketSentiment
            pair={pair}
            lang={lang}
            sentiment={sentiment}
        />
    );
}