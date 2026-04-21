import type { FAQItem, JsonLd, RelatedLink } from "./types";

const SUPPORTED_LANGS = ["en", "de", "fr", "ar"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

function isSupportedLang(value: string): value is SupportedLang {
    return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

function normalizeLang(lang?: string): SupportedLang {
    if (lang && isSupportedLang(lang)) {
        return lang;
    }

    return "en";
}

function normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.replace(/\/+$/, "");
}

function normalizePath(href: string): string {
    const cleaned = href.startsWith("/") ? href : `/${href}`;
    return cleaned.replace(/^\/(en|de|fr|ar)(?=\/|$)/, "") || "/";
}

function formatPaymentLabel(payment: string): string {
    const normalized = payment.toLowerCase().trim();

    const specialLabels: Record<string, string> = {
        mpesa: "M-Pesa",
        tigopesa: "Tigo Pesa",
        "airtel-money": "Airtel Money",
        "mobile-money": "Mobile Money",
        bank: "Bank Transfer",
        card: "Credit/Debit Card",
        crypto: "Crypto",
        eft: "EFT",
        upi: "UPI",
        bkash: "bKash",
        nagad: "Nagad",
    };

    return (
        specialLabels[normalized] ||
        normalized
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
    );
}

export function buildLocalizedHref(lang: string, href: string): string {
    const normalizedLang = normalizeLang(lang);
    const normalizedPath = normalizePath(href);

    if (normalizedPath === "/") {
        return `/${normalizedLang}`;
    }

    return `/${normalizedLang}${normalizedPath}`;
}

export function buildFAQSchema(faq: FAQItem[] = []): JsonLd | null {
    if (!faq.length) return null;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
            },
        })),
    };
}

export function buildBreadcrumbSchema(input: {
    baseUrl: string;
    lang: string;
    slug: string;
    title: string;
}): JsonLd {
    const baseUrl = normalizeBaseUrl(input.baseUrl);
    const lang = normalizeLang(input.lang);
    const slug = input.slug.replace(/^\/+/, "");

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${baseUrl}/${lang}`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: input.title,
                item: `${baseUrl}/${lang}/country/${slug}`,
            },
        ],
    };
}

export function buildRelatedLinks(input: {
    countrySlug: string;
    countryName: string;
    brokerSlug?: string;
    brokerName?: string;
    payment?: string;
}): RelatedLink[] {
    const { countrySlug, countryName, brokerSlug, brokerName, payment } = input;

    const links: RelatedLink[] = [
        {
            href: `/best-forex-brokers-in-${countrySlug}`,
            label: `Best Forex Brokers in ${countryName}`,
        },
        {
            href: "/brokers",
            label: "Compare Forex Brokers",
        },
    ];

    if (brokerSlug && brokerName) {
        links.push({
            href: `/brokers/${brokerSlug}`,
            label: `${brokerName} Review`,
        });
    }

    if (payment) {
        const paymentLabel = formatPaymentLabel(payment);

        links.push({
            href: `/forex-brokers-with-${payment}-in-${countrySlug}`,
            label: `Forex Brokers with ${paymentLabel} in ${countryName}`,
        });
    }

    const seen = new Set<string>();

    return links.filter((link) => {
        const key = `${link.href}::${link.label}`;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}