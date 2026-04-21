/* ================= CORE SECTIONS ================= */

export type ContentSection = {
    id: string;
    title: string;
    content: string;

    // 🔥 future extensibility
    variant?: "default" | "highlight" | "note";
};

/* ================= FAQ ================= */

export type FAQItem = {
    question: string;
    answer: string;
};

/* ================= CTA ================= */

export type CTAData = {
    title: string;
    description: string;
    href: string;
    label: string;

    // 🔥 future: style variations
    variant?: "primary" | "secondary";
};

/* ================= RELATED LINKS ================= */

export type RelatedLink = {
    href: string;
    label: string;
};

/* ================= BROKER CARDS ================= */

export type BrokerCardData = {
    slug: string;
    name: string;
    description?: string;
    href?: string;

    // 🔥 future scoring / ranking
    badge?: string; // e.g. "Top Pick", "Low Spread"
};

/* ================= JSON-LD SCHEMA ================= */

export type JsonLd =
    | Record<string, unknown>
    | Record<string, unknown>[];

/* ================= MAIN PAGE STRUCTURE ================= */

export type BuiltPageContent = {
    title: string;
    description: string;

    sections: ContentSection[];

    faq?: FAQItem[];

    cta?: CTAData | null;

    schema?: JsonLd;

    relatedLinks?: RelatedLink[];

    brokerCards?: BrokerCardData[];

    /* 🔥 future-proofing */
    noIndex?: boolean; // for experimental pages
};