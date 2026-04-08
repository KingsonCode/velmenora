export type Impact = "high" | "medium" | "low";

export type Category = "forex" | "crypto" | "stocks" | "gold";

export type News = {
    id: string;
    slug: string;

    title: string;
    excerpt: string;
    image: string;

    category: Category;
    impact: Impact;

    publishedAt: number;
};