/* =========================================================
   🔥 TYPE (CLEAN + SCALABLE)
========================================================= */

export type Broker = {
    name: string;
    slug: string;
    description: string;
    features: string[];
    rating: number;
    badge?: string;
};


/* =========================================================
   🔥 DATA
========================================================= */

export const brokers: Broker[] = [
    {
        name: "Exness",
        slug: "exness",
        description: "Ultra-fast withdrawals and tight spreads.",
        features: [
            "Instant withdrawals",
            "Low spreads",
            "Trusted globally",
        ],
        rating: 4.8,
        badge: "Top Choice",
    },
    {
        name: "Deriv",
        slug: "deriv",
        description: "Simple platform for beginners.",
        features: [
            "Beginner friendly",
            "Low deposit",
            "Multiple markets",
        ],
        rating: 4.5,
        badge: "Best for Beginners",
    },
];