export type CountryCode = "TZ" | "KE" | "NG" | "OTHER";

export type Funnel = {
    countryName: string;
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    brokers: string[];
    payments: string[];
    slug: string;
};

const GEO_FUNNEL: Record<CountryCode, Funnel> = {
    TZ: {
        countryName: "Tanzania",
        title: "Best Forex Brokers in Tanzania",
        description: "Trade forex in Tanzania using trusted brokers.",
        ctaText: "Start Trading in Tanzania",
        ctaLink: "/blog/best-brokers-in-tanzania",
        brokers: ["Exness", "Deriv"],
        payments: ["M-Pesa", "Tigo Pesa"],
        slug: "tanzania",
    },
    KE: {
        countryName: "Kenya",
        title: "Best Forex Brokers in Kenya",
        description: "Trade forex in Kenya using trusted brokers.",
        ctaText: "Start Trading in Kenya",
        ctaLink: "/blog/best-brokers-in-kenya",
        brokers: ["Exness", "XM"],
        payments: ["M-Pesa"],
        slug: "kenya",
    },
    NG: {
        countryName: "Nigeria",
        title: "Best Forex Brokers in Nigeria",
        description: "Trade forex in Nigeria using trusted brokers.",
        ctaText: "Start Trading in Nigeria",
        ctaLink: "/blog/best-brokers-in-nigeria",
        brokers: ["Exness", "OctaFX"],
        payments: ["Crypto"],
        slug: "nigeria",
    },
    OTHER: {
        countryName: "Worldwide",
        title: "Best Forex Brokers Worldwide",
        description: "Trade globally with trusted brokers.",
        ctaText: "Start Trading Now",
        ctaLink: "/blog",
        brokers: ["Exness"],
        payments: ["Card", "Crypto"],
        slug: "global",
    },
};

export function getFunnel(code?: string): Funnel {
    if (!code) return GEO_FUNNEL.OTHER;
    return GEO_FUNNEL[code as CountryCode] ?? GEO_FUNNEL.OTHER;
}