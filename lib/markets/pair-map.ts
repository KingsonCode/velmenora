export type MarketPair =
    | "eurusd"
    | "gbpusd"
    | "usdjpy"
    | "xauusd"
    | "btcusd"
    | "ethusd";

export const PAIR_EVENT_MAP: Record<
    MarketPair,
    {
        countries?: string[];
        keywords: string[];
        categories: string[];
    }
> = {
    eurusd: {
        countries: ["Euro Area", "Germany", "France", "United States"],
        keywords: ["ECB", "Fed", "CPI", "NFP", "USD", "EUR", "interest rate"],
        categories: [
            "Interest Rate Decision",
            "Inflation Rate",
            "Non Farm Payrolls",
            "GDP Growth Rate",
            "Manufacturing PMI",
            "Services PMI",
        ],
    },
    gbpusd: {
        countries: ["United Kingdom", "United States"],
        keywords: ["BOE", "Fed", "CPI", "GDP", "GBP", "USD"],
        categories: [
            "Interest Rate Decision",
            "Inflation Rate",
            "GDP Growth Rate",
            "Manufacturing PMI",
            "Services PMI",
            "Non Farm Payrolls",
        ],
    },
    usdjpy: {
        countries: ["Japan", "United States"],
        keywords: ["BOJ", "Fed", "CPI", "USD", "JPY", "yield"],
        categories: [
            "Interest Rate Decision",
            "Inflation Rate",
            "GDP Growth Rate",
            "Industrial Production",
            "Retail Sales",
            "Non Farm Payrolls",
        ],
    },
    xauusd: {
        countries: ["United States"],
        keywords: ["gold", "Fed", "inflation", "yield", "USD", "rates"],
        categories: [
            "Interest Rate Decision",
            "Inflation Rate",
            "Non Farm Payrolls",
            "GDP Growth Rate",
            "Retail Sales",
        ],
    },
    btcusd: {
        countries: ["United States"],
        keywords: ["bitcoin", "crypto", "ETF", "Fed", "USD", "risk sentiment"],
        categories: [
            "Interest Rate Decision",
            "Inflation Rate",
            "Non Farm Payrolls",
            "GDP Growth Rate",
        ],
    },
    ethusd: {
        countries: ["United States"],
        keywords: ["ethereum", "crypto", "ETF", "Fed", "USD", "risk sentiment"],
        categories: [
            "Interest Rate Decision",
            "Inflation Rate",
            "Non Farm Payrolls",
            "GDP Growth Rate",
        ],
    },
};