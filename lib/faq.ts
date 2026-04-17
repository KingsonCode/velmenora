type FAQItem = {
    q: string;
    a: string;
};

/* ================= SAFE PICK (FINAL FIX) ================= */

function pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) {
        throw new Error("pick() received empty array");
    }

    return arr[Math.floor(Math.random() * arr.length)]!;
}

/* ================= COUNTRY FAQ ================= */

export function getFAQ(country: string): FAQItem[] {
    return [
        {
            q: `Is forex trading legal in ${country}?`,
            a: pick([
                `Yes, forex trading is legal in ${country}. Traders can access global markets using internationally regulated brokers.`,
                `Forex trading is permitted in ${country}, and traders can legally use offshore brokers to participate in global markets.`,
            ]),
        },

        {
            q: `What is the best forex broker in ${country}?`,
            a: pick([
                `Top brokers in ${country} include Exness and Deriv due to fast withdrawals, low spreads, and strong trading platforms.`,
                `Popular brokers in ${country} are Exness and Deriv, known for reliability, low spreads, and fast execution.`,
            ]),
        },

        {
            q: `How do I start forex trading in ${country}?`,
            a: pick([
                `To start trading in ${country}, register with a trusted broker, verify your account, deposit funds, and trade using MT4 or MT5.`,
                `Begin by choosing a regulated broker, completing verification, funding your account, and using trading platforms like MT4 or MT5.`,
            ]),
        },

        {
            q: `What payment methods are available in ${country}?`,
            a: pick([
                `Traders in ${country} can use mobile money, bank transfers, cards, and e-wallets depending on the broker.`,
                `Most brokers support mobile money, bank transfers, and digital wallets in ${country}, enabling fast deposits and withdrawals.`,
            ]),
        },

        {
            q: `How much money do I need to start trading in ${country}?`,
            a: pick([
                `You can start trading in ${country} with as little as $10 depending on the broker.`,
                `Many brokers allow traders in ${country} to start with low deposits, sometimes as low as $10.`,
            ]),
        },
    ];
}