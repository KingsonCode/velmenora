export type BlogPost = {
    slug: string;
    title: string;
    excerpt: string;
    country: string;
    keywords: string[];
};

export const blogPosts: BlogPost[] = [
    {
        slug: "is-exness-legit-in-nigeria",
        title: "Is Exness Legit in Nigeria?",
        excerpt:
            "Full review of Exness reliability, withdrawals, and trust in Nigeria.",
        country: "Nigeria",
        keywords: ["exness nigeria", "forex nigeria", "is exness safe"],
    },
    {
        slug: "how-to-start-forex-trading-in-kenya",
        title: "How to Start Forex Trading in Kenya",
        excerpt:
            "A beginner-friendly guide to starting forex trading in Kenya.",
        country: "Kenya",
        keywords: ["forex kenya", "mpesa forex", "trading kenya"],
    },
    {
        slug: "best-forex-brokers-in-tanzania",
        title: "Best Forex Brokers in Tanzania (2026)",
        excerpt:
            "Discover top brokers in Tanzania with low spreads and fast withdrawals.",
        country: "Tanzania",
        keywords: ["forex tanzania", "best brokers tz", "exness tanzania"],
    },
];