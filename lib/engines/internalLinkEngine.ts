type LinkInput = {
    country: string;
    intent: string;
};

export function buildInternalLinks({ country, intent }: LinkInput) {
    return [
        {
            label: `Best brokers in ${country}`,
            href: `/en/best-brokers-in/${country}`,
        },
        {
            label: `Low spread brokers in ${country}`,
            href: `/en/low-spread-brokers-in/${country}`,
        },
        {
            label: `High leverage brokers in ${country}`,
            href: `/en/high-leverage-brokers-in/${country}`,
        },
        {
            label: `Forex trading guide in ${country}`,
            href: `/en/forex-trading-guide-in/${country}`,
        },
    ];
}