import MarketNews from "@/components/market/MarketNews";
import type { Lang } from "@/lib/i18n";

type Props = {
    pair: string;
    lang: Lang;
    symbol?: string;
    marketName?: string;
    category?: string;
};

export default async function NewsSection({
    pair,
    lang,
    symbol,
    marketName,
    category,
}: Props) {
    return (
        <MarketNews
            pair={pair}
            lang={lang}
            {...(symbol ? { symbol } : {})}
            {...(marketName ? { marketName } : {})}
            {...(category ? { category } : {})}
        />
    );
}