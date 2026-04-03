// 📁 /lib/templates.ts

type Template = {
    type: string;
    generateTitle: (country: string) => string;
    generateDescription: (country: string) => string;
    keywords: (country: string) => string[];
};

export const templates: Template[] = [
    /* =========================================================
       🔥 1. LEGALITY PAGE (HIGH TRUST INTENT)
    ========================================================= */
    {
        type: "is-exness-legal",
        generateTitle: (country) =>
            `Is Exness Legal in ${country}? (2026 Full Guide + Safety Check)`,

        generateDescription: (country) =>
            `Is Exness allowed in ${country}? Learn about regulations, safety, withdrawal reliability, and whether traders can legally use Exness in ${country}.`,

        keywords: (country) => [
            `Is Exness legal in ${country}`,
            `Exness ${country} regulation`,
            `Can I use Exness in ${country}`,
            `Exness safe ${country}`,
        ],
    },

    /* =========================================================
       🔥 2. BEST BROKERS (MONEY PAGE 💰)
    ========================================================= */
    {
        type: "best-brokers",
        generateTitle: (country) =>
            `Best Forex Brokers in ${country} (2026) — Low Spreads & Fast Withdrawals`,

        generateDescription: (country) =>
            `Looking for the best forex brokers in ${country}? Compare top platforms with low spreads, instant withdrawals, and trusted regulation for ${country} traders.`,

        keywords: (country) => [
            `best forex brokers in ${country}`,
            `top brokers ${country}`,
            `forex trading ${country}`,
            `low spread brokers ${country}`,
        ],
    },

    /* =========================================================
       🔥 3. HOW TO TRADE (BEGINNER FUNNEL)
    ========================================================= */
    {
        type: "how-to-trade",
        generateTitle: (country) =>
            `How to Start Forex Trading in ${country} (Beginner Guide 2026)`,

        generateDescription: (country) =>
            `Step-by-step guide to start forex trading in ${country}. Learn how to open an account, deposit money, and trade safely as a beginner.`,

        keywords: (country) => [
            `how to trade forex in ${country}`,
            `forex beginners ${country}`,
            `start trading ${country}`,
            `forex guide ${country}`,
        ],
    },

    /* =========================================================
       🔥 4. DEPOSIT METHODS (VERY HIGH CONVERSION)
    ========================================================= */
    {
        type: "deposit-methods",
        generateTitle: (country) =>
            `Best Deposit Methods for Forex Trading in ${country} (2026)`,

        generateDescription: (country) =>
            `Discover the best ways to deposit money for forex trading in ${country}, including mobile money, bank transfer, and instant payment options.`,

        keywords: (country) => [
            `deposit forex ${country}`,
            `mobile money forex ${country}`,
            `mpesa forex ${country}`,
            `forex payments ${country}`,
        ],
    },

    /* =========================================================
       🔥 5. WITHDRAWAL GUIDE (TRUST + MONEY)
    ========================================================= */
    {
        type: "withdraw-money",
        generateTitle: (country) =>
            `How to Withdraw Money from Forex in ${country} (Fast & Safe)`,

        generateDescription: (country) =>
            `Learn how to withdraw money from forex brokers in ${country} using the fastest and safest methods available to local traders.`,

        keywords: (country) => [
            `withdraw forex ${country}`,
            `forex withdrawal ${country}`,
            `how to withdraw exness ${country}`,
            `get money from forex ${country}`,
        ],
    },

    /* =========================================================
       🔥 6. EXNESS REVIEW (HIGH CONVERSION PAGE)
    ========================================================= */
    {
        type: "exness-review",
        generateTitle: (country) =>
            `Exness Review in ${country} (2026) — Fees, Spreads & Withdrawal Tested`,

        generateDescription: (country) =>
            `Honest Exness review for ${country} traders. See spreads, fees, withdrawal speed, and whether Exness is worth using in ${country}.`,

        keywords: (country) => [
            `exness review ${country}`,
            `exness fees ${country}`,
            `exness spreads ${country}`,
            `exness withdrawal ${country}`,
        ],
    },
];