type Intent =
    | "best"
    | "low-spread"
    | "high-leverage"
    | "beginner"
    | "guide";

type SeoInput = {
    intent: Intent;
    countryName?: string;
    brokerName?: string;
    brokerAName?: string;
    brokerBName?: string;
    year?: number;
};

function getYear(year?: number) {
    return year ?? new Date().getFullYear();
}

export function buildMoneyPageTitle(input: SeoInput): string {
    const year = getYear(input.year);
    const country = input.countryName ?? "your country";

    switch (input.intent) {
        case "best":
            return `Best Forex Brokers in ${country} (${year}) – Low Spreads & Fast Withdrawals`;
        case "low-spread":
            return `Lowest Spread Forex Brokers in ${country} (${year}) – Compare Top Picks`;
        case "high-leverage":
            return `Best High Leverage Forex Brokers in ${country} (${year}) – Top Options Compared`;
        case "beginner":
            return `Best Forex Brokers for Beginners in ${country} (${year}) – Easy Start Guide`;
        case "guide":
            return `Forex Trading in ${country} (${year}) – Beginner Guide, Brokers & Tips`;
        default:
            return `Best Forex Brokers in ${country} (${year})`;
    }
}

export function buildMoneyPageDescription(input: SeoInput): string {
    const country = input.countryName ?? "your country";

    switch (input.intent) {
        case "best":
            return `Compare the best forex brokers in ${country}. Find low spreads, fast withdrawals, reliable platforms, and trusted broker options for active traders.`;
        case "low-spread":
            return `Looking for the lowest spread forex brokers in ${country}? Compare trading costs, execution speed, and top broker options for scalping and active trading.`;
        case "high-leverage":
            return `Explore the best high leverage forex brokers in ${country}. Compare leverage, trading conditions, withdrawals, and broker features before you sign up.`;
        case "beginner":
            return `Find beginner-friendly forex brokers in ${country}. Compare simple platforms, low minimum deposits, education, and easy payment methods.`;
        case "guide":
            return `Learn how forex trading works in ${country}. Compare brokers, understand spreads and payments, and choose the right platform for your goals.`;
        default:
            return `Compare forex brokers in ${country} and find the right platform for your trading needs.`;
    }
}

export function buildReviewTitle(brokerName: string, year?: number): string {
    return `${brokerName} Review (${getYear(year)}) – Spreads, Withdrawals, Fees & Trust`;
}

export function buildReviewDescription(brokerName: string): string {
    return `Read our ${brokerName} review covering spreads, minimum deposit, withdrawals, platforms, features, and overall broker reliability before you open an account.`;
}

export function buildComparisonTitle(
    brokerAName: string,
    brokerBName: string,
    year?: number
): string {
    return `${brokerAName} vs ${brokerBName} (${getYear(year)}) – Which Broker Is Better?`;
}

export function buildComparisonDescription(
    brokerAName: string,
    brokerBName: string
): string {
    return `Compare ${brokerAName} vs ${brokerBName} on spreads, fees, platforms, withdrawals, and trading features to find the better broker for your strategy.`;
}

export function buildBlogTitle(input: SeoInput & { keyword?: string }): string {
    const year = getYear(input.year);
    const country = input.countryName;

    if (input.keyword) {
        return `${input.keyword} (${year}) – Velmenora`;
    }

    if (country) {
        switch (input.intent) {
            case "best":
                return `Best Forex Brokers in ${country} (${year}) – Expert Picks`;
            case "low-spread":
                return `Low Spread Brokers in ${country} (${year}) – Best Choices`;
            case "high-leverage":
                return `High Leverage Brokers in ${country} (${year}) – Top Picks`;
            case "beginner":
                return `Forex for Beginners in ${country} (${year}) – Best Brokers & Tips`;
            case "guide":
                return `Forex Trading Guide in ${country} (${year}) – What You Need to Know`;
        }
    }

    return `Forex Trading Blog (${year}) – Velmenora`;
}