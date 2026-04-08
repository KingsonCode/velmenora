// 📁 /lib/templates.ts

import type { Country } from "./countries";

/* =========================================================
   🔥 TEMPLATE TYPE (FULL POWER)
========================================================= */
export type Template = {
    type: string;
    generateTitle: (country: Country) => string;
    generateDescription: (country: Country) => string;
    keywords: (country: Country) => string[];
};

/* =========================================================
   🔥 TEMPLATES (PRO MAX — SEO + MONEY)
========================================================= */
export const templates: Template[] = [
    /* =========================================================
       🔥 1. LEGALITY PAGE (HIGH TRUST INTENT)
    ========================================================= */
    {
        type: "is-exness-legal",

        generateTitle: (c) =>
            `Is Exness Legal in ${c.name}? (2026 Full Guide + Safety Check)`,

        generateDescription: (c) =>
            `Is Exness allowed in ${c.name}? Learn about regulations, safety, withdrawal reliability, and whether traders can legally use Exness in ${c.name}.`,

        keywords: (c) => [
            `Is Exness legal in ${c.name}`,
            `Exness ${c.name} regulation`,
            `Can I use Exness in ${c.name}`,
            `Exness safe ${c.name}`,
        ],
    },

    /* =========================================================
       🔥 2. BEST BROKERS (MONEY PAGE 💰)
    ========================================================= */
    {
        type: "best-brokers",

        generateTitle: (c) =>
            `Best Forex Brokers in ${c.name} (2026) — Low Spreads & Fast Withdrawals`,

        generateDescription: (c) =>
            `Looking for the best forex brokers in ${c.name}? Compare top platforms with low spreads, instant withdrawals, and trusted regulation for ${c.name} traders.`,

        keywords: (c) => [
            `best forex brokers in ${c.name}`,
            `top brokers ${c.name}`,
            `forex trading ${c.name}`,
            `low spread brokers ${c.name}`,
        ],
    },

    /* =========================================================
       🔥 3. HOW TO TRADE (BEGINNER FUNNEL)
    ========================================================= */
    {
        type: "how-to-trade",

        generateTitle: (c) =>
            `How to Start Forex Trading in ${c.name} (Beginner Guide 2026)`,

        generateDescription: (c) =>
            `Step-by-step guide to start forex trading in ${c.name}. Learn how to open an account, deposit money, and trade safely as a beginner.`,

        keywords: (c) => [
            `how to trade forex in ${c.name}`,
            `forex beginners ${c.name}`,
            `start trading ${c.name}`,
            `forex guide ${c.name}`,
        ],
    },

    /* =========================================================
       🔥 4. DEPOSIT METHODS (VERY HIGH CONVERSION)
    ========================================================= */
    {
        type: "deposit-methods",

        generateTitle: (c) =>
            `Best Deposit Methods for Forex Trading in ${c.name} (2026)`,

        generateDescription: (c) =>
            `Discover the best ways to deposit money for forex trading in ${c.name}, including mobile money, bank transfer, and instant payment options.`,

        keywords: (c) => [
            `deposit forex ${c.name}`,
            `mobile money forex ${c.name}`,
            `mpesa forex ${c.name}`,
            `forex payments ${c.name}`,
        ],
    },

    /* =========================================================
       🔥 5. WITHDRAWAL GUIDE (TRUST + MONEY)
    ========================================================= */
    {
        type: "withdraw-money",

        generateTitle: (c) =>
            `How to Withdraw Money from Forex in ${c.name} (Fast & Safe)`,

        generateDescription: (c) =>
            `Learn how to withdraw money from forex brokers in ${c.name} using the fastest and safest methods available to local traders.`,

        keywords: (c) => [
            `withdraw forex ${c.name}`,
            `forex withdrawal ${c.name}`,
            `how to withdraw exness ${c.name}`,
            `get money from forex ${c.name}`,
        ],
    },

    /* =========================================================
       🔥 6. EXNESS REVIEW (HIGH CONVERSION PAGE)
    ========================================================= */
    {
        type: "exness-review",

        generateTitle: (c) =>
            `Exness Review in ${c.name} (2026) — Fees, Spreads & Withdrawal Tested`,

        generateDescription: (c) =>
            `Honest Exness review for ${c.name} traders. See spreads, fees, withdrawal speed, and whether Exness is worth using in ${c.name}.`,

        keywords: (c) => [
            `exness review ${c.name}`,
            `exness fees ${c.name}`,
            `exness spreads ${c.name}`,
            `exness withdrawal ${c.name}`,
        ],
    },
];