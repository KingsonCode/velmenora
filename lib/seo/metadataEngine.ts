import type { Metadata } from "next";
import {
    buildBlogTitle,
    buildComparisonDescription,
    buildComparisonTitle,
    buildMoneyPageDescription,
    buildMoneyPageTitle,
    buildReviewDescription,
    buildReviewTitle,
} from "@/lib/seo/ctrEngine";

const BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/+$/, "") ||
    "https://velmenora.com";

type Intent =
    | "best"
    | "low-spread"
    | "high-leverage"
    | "beginner"
    | "guide";

export function buildMoneyPageMetadata(params: {
    intent: Intent;
    countryName: string;
    pathname: string;
}): Metadata {
    const title = buildMoneyPageTitle({
        intent: params.intent,
        countryName: params.countryName,
    });

    const description = buildMoneyPageDescription({
        intent: params.intent,
        countryName: params.countryName,
    });

    const url = `${BASE_URL}${params.pathname}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Velmenora",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export function buildReviewMetadata(params: {
    brokerName: string;
    pathname: string;
}): Metadata {
    const title = buildReviewTitle(params.brokerName);
    const description = buildReviewDescription(params.brokerName);
    const url = `${BASE_URL}${params.pathname}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Velmenora",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export function buildComparisonMetadata(params: {
    brokerAName: string;
    brokerBName: string;
    pathname: string;
}): Metadata {
    const title = buildComparisonTitle(
        params.brokerAName,
        params.brokerBName
    );
    const description = buildComparisonDescription(
        params.brokerAName,
        params.brokerBName
    );
    const url = `${BASE_URL}${params.pathname}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Velmenora",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

export function buildBlogMetadata(params: {
    intent: Intent;
    countryName?: string;
    pathname: string;
    keyword?: string;
}): Metadata {
    const title = buildBlogTitle({
        intent: params.intent,
        ...(params.countryName ? { countryName: params.countryName } : {}),
        ...(params.keyword ? { keyword: params.keyword } : {}),
    });

    const description = params.countryName
        ? buildMoneyPageDescription({
            intent: params.intent,
            countryName: params.countryName,
        })
        : "Explore forex broker comparisons, trading guides, platform reviews, and educational content from Velmenora.";

    const url = `${BASE_URL}${params.pathname}`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: "Velmenora",
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}