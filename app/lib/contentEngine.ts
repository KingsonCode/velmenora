import { PageData } from "./generate";

type Content = {
    intro: string;
    body: string;
    sectionTitle: string;
};

export function generateContent(page: PageData): Content {
    const { type, country } = page;

    switch (type) {
        case "best-brokers":
            return {
                intro: `Discover the best forex brokers in ${country.name} with low spreads and fast withdrawals.`,
                body: `We reviewed top brokers available in ${country.name} based on reliability, fees, and platform performance.`,
                sectionTitle: `Top Forex Brokers in ${country.name}`,
            };

        case "legality":
            return {
                intro: `Forex trading in ${country.name} is growing rapidly as traders access global markets.`,
                body: `Most traders in ${country.name} use international brokers to trade legally and securely.`,
                sectionTitle: `Is Forex Trading Legal in ${country.name}?`,
            };

        case "how-to":
            return {
                intro: `Learn how to start forex trading in ${country.name} step by step.`,
                body: `Choose a broker, verify your account, deposit funds, and begin trading using MT4 or MT5.`,
                sectionTitle: `How to Start Forex Trading in ${country.name}`,
            };

        case "payments":
            return {
                intro: `Many traders in ${country.name} prefer brokers that support local payment methods.`,
                body: `Mobile money, bank transfers, and e-wallets are commonly used for deposits and withdrawals.`,
                sectionTitle: `Best Payment Methods for Forex in ${country.name}`,
            };

        default:
            return {
                intro: `Forex trading opportunities in ${country.name} continue to grow.`,
                body: `Find reliable brokers and strategies tailored for traders in ${country.name}.`,
                sectionTitle: `Forex Trading in ${country.name}`,
            };
    }
}