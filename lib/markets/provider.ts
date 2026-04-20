const BASE_URL = "https://api.tradingeconomics.com";

export type TradingEconomicsRawItem = {
    CalendarId?: string | number;
    CalendarID?: string | number;
    Date?: string;
    Country?: string;
    Category?: string;
    Event?: string;
    Importance?: number | string;
    Actual?: string;
    Forecast?: string;
    Previous?: string;
    [key: string]: unknown;
};

function getCredentials() {
    const key = process.env.TRADING_ECONOMICS_KEY;
    const secret = process.env.TRADING_ECONOMICS_SECRET;

    if (!key || !secret) {
        throw new Error("Trading Economics credentials are missing.");
    }

    return { key, secret };
}

function getAuthQuery() {
    const { key, secret } = getCredentials();
    return `c=${encodeURIComponent(key)}:${encodeURIComponent(secret)}`;
}

function buildUrl(path: string, extraQuery = "") {
    const auth = getAuthQuery();
    const query = extraQuery ? `&${extraQuery}` : "";
    return `${BASE_URL}${path}?${auth}&f=json${query}`;
}

async function fetchTradingEconomics<T = unknown>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
        const res = await fetch(url, {
            next: { revalidate: 300 },
            signal: controller.signal,
            headers: {
                Accept: "application/json",
            },
        });

        if (!res.ok) {
            throw new Error(`Trading Economics request failed: ${res.status}`);
        }

        return (await res.json()) as T;
    } finally {
        clearTimeout(timeout);
    }
}

export function normalizeCountryPath(countries: string[]) {
    return countries
        .map((country) => country.trim())
        .filter(Boolean)
        .map(encodeURIComponent)
        .join(",");
}

export function toSafeArray(data: unknown): TradingEconomicsRawItem[] {
    return Array.isArray(data) ? (data as TradingEconomicsRawItem[]) : [];
}

export async function fetchEconomicCalendar() {
    const url = buildUrl("/calendar");
    return fetchTradingEconomics<unknown>(url);
}

export async function fetchCalendarByCountry(countries: string[]) {
    const joined = normalizeCountryPath(countries);

    if (!joined) {
        return [];
    }

    const url = buildUrl(`/calendar/country/${joined}`);
    return fetchTradingEconomics<unknown>(url);
}

export async function fetchLatestNews() {
    const url = buildUrl("/news");
    return fetchTradingEconomics<unknown>(url);
}