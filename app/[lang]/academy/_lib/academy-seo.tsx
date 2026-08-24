import type { Metadata } from "next";
import type { ReactNode } from "react";

const BASE_URL = "https://velmenora.com";

const ACADEMY_SEO_PAGES = {
    "forex-for-beginners": {
        title:
            "Forex for Beginners: Complete Starter Guide | Velmenora",
        headline:
            "Forex Trading for Beginners",
        description:
            "Learn forex trading fundamentals, demo practice, common beginner mistakes, essential terminology, and responsible risk management.",
        teaches: [
            "Forex trading fundamentals",
            "Demo account practice",
            "Common beginner mistakes",
            "Basic risk management",
        ],
    },
    "how-to-trade-forex": {
        title:
            "How to Trade Forex Step by Step | Velmenora",
        headline:
            "How to Trade Forex",
        description:
            "Learn a structured forex trading process covering market analysis, entries, execution, stop loss planning, and capital protection.",
        teaches: [
            "Market analysis",
            "Trade entry planning",
            "Order execution",
            "Stop loss and capital protection",
        ],
    },
    "forex-risk-management": {
        title:
            "Forex Risk Management Guide | Velmenora",
        headline:
            "Forex Risk Management",
        description:
            "Learn position sizing, stop loss planning, drawdown control, leverage risks, and responsible capital-protection principles.",
        teaches: [
            "Position sizing",
            "Stop loss planning",
            "Drawdown control",
            "Responsible leverage management",
        ],
    },
    "forex-demo-account": {
        title:
            "Forex Demo Account Guide for Beginners | Velmenora",
        headline:
            "Forex Demo Account Guide",
        description:
            "Learn how forex demo accounts work, how to practise order execution, test discipline, and prepare carefully before live trading.",
        teaches: [
            "Demo account setup",
            "Order execution practice",
            "Trading discipline",
            "Careful transition to live trading",
        ],
    },
} as const;

export type AcademySeoSlug =
    keyof typeof ACADEMY_SEO_PAGES;

function buildCanonical(slug: AcademySeoSlug) {
    return BASE_URL + "/en/academy/" + slug;
}

export function buildAcademyMetadata(
    slug: AcademySeoSlug,
    lang: string
): Metadata {
    const page = ACADEMY_SEO_PAGES[slug];
    const canonical = buildCanonical(slug);

    const supportedLanguage =
        ["en", "ar", "de", "fr"].includes(lang);

    return {
        title: page.title,
        description: page.description,
        authors: [
            {
                name: "Velmenora Research",
                url: BASE_URL + "/",
            },
        ],
        publisher: "Velmenora",
        alternates: {
            canonical,
            languages: {
                en: canonical,
                "x-default": canonical,
            },
        },
        openGraph: {
            type: "article",
            title: page.title,
            description: page.description,
            url: canonical,
            siteName: "Velmenora",
            locale: "en_US",
            images: [
                {
                    url: BASE_URL + "/og-default.jpg",
                    width: 1200,
                    height: 630,
                    alt: page.headline + " — Velmenora Academy",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: page.title,
            description: page.description,
            images: [BASE_URL + "/og-default.jpg"],
        },
        robots: {
            index: lang === "en",
            follow: supportedLanguage,
        },
    };
}

function buildStructuredData(
    slug: AcademySeoSlug
) {
    const page = ACADEMY_SEO_PAGES[slug];
    const canonical = buildCanonical(slug);
    const breadcrumbId = canonical + "#breadcrumb";

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "LearningResource",
                "@id": canonical + "#learning-resource",
                url: canonical,
                name: page.title,
                headline: page.headline,
                description: page.description,
                inLanguage: "en",
                isAccessibleForFree: true,
                learningResourceType: "Beginner guide",
                educationalLevel: "Beginner",
                teaches: page.teaches,
                author: {
                    "@id": BASE_URL + "/#organization",
                },
                publisher: {
                    "@id": BASE_URL + "/#organization",
                },
                isPartOf: {
                    "@id": BASE_URL + "/#website",
                },
                breadcrumb: {
                    "@id": breadcrumbId,
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": breadcrumbId,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: BASE_URL + "/",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Forex Academy",
                        item: BASE_URL + "/en/academy",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: page.headline,
                        item: canonical,
                    },
                ],
            },
        ],
    };
}

export function AcademySeoRoute({
    slug,
    children,
}: {
    slug: AcademySeoSlug;
    children: ReactNode;
}) {
    const structuredData =
        buildStructuredData(slug);

    return (
        <>
            <script
                id={"velmenora-academy-" + slug + "-structured-data"}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        structuredData
                    ).replace(/</g, "\\u003c"),
                }}
            />
            {children}
        </>
    );
}
