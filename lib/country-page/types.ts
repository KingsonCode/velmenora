import type { Broker } from "@/lib/types/broker";

/* ================= CORE ================= */

export type CountryPageInput = {
    countryCode: string;
    countryName: string;
    countrySlug: string;
    brokers: Broker[];
};

/* ================= BROKER UI ================= */

export type BrokerHighlight = {
    label: string;
    value: string;
};

export type BrokerComparisonRow = {
    slug: string;
    name: string;
    rating: string;
    minDeposit: string;
    platforms: string;
    payments: string;
    bestFor: string;
};

export type TopBrokerStripItem = {
    rank: number;
    slug: string;
    name: string;
    rating: string;
    minDeposit: string;
    badge: string | null;
};

/* ================= COUNTRY UI ================= */

export type CountryHighlightCard = {
    key: string;
    title: string;
    broker: Broker | null;
    reason: string;
};

/* ================= SUMMARY ================= */

export type TopBrokerSummary = {
    title: string;
    subtitle: string;
};

/* ================= FAQ ================= */

export type ConversionFAQ = {
    question: string;
    answer: string;
};

/* ================= BUILT OUTPUT ================= */

export type BuiltCountryPageData = {
    rankedBrokers: Broker[];
    topBroker: Broker | null;
    topBrokerSummary: TopBrokerSummary | null;
    topBrokerStrip: TopBrokerStripItem[];
    countryHighlights: CountryHighlightCard[];
    comparisonRows: BrokerComparisonRow[];
    faq: ConversionFAQ[];
};