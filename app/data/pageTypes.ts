export type PageType = {
    key: string;
    title: (country: string) => string;
    description: (country: string) => string;
};

export const pageTypes: PageType[] = [
    {
        key: "best-brokers-in",
        title: (country) => `Best Forex Brokers in ${country} (2026)`,
        description: (country) =>
            `Discover the best forex brokers in ${country} with low spreads, fast withdrawals, and high trust ratings.`,
    },
    {
        key: "how-to-trade-in",
        title: (country) => `How to Start Forex Trading in ${country}`,
        description: (country) =>
            `Beginner-friendly guide to start forex trading in ${country}, including platforms, brokers, and strategies.`,
    },
    {
        key: "is-exness-legit-in",
        title: (country) => `Is Exness Legit in ${country}? Full Review`,
        description: (country) =>
            `Is Exness safe in ${country}? Learn about regulation, withdrawals, and user experience.`,
    },
    {
        key: "forex-trading-guide",
        title: (country) => `Forex Trading Guide for ${country}`,
        description: (country) =>
            `Complete forex trading guide for ${country}: brokers, tips, and how to get started.`,
    },
];