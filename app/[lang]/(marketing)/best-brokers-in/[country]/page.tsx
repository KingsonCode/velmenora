import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
    getCountryPageData,
    resolveCountry,
} from "@/lib/countryEngine";

import {
    buildCountryTitle,
    generateCanonical,
} from "@/lib/seo";

import { PROGRAMMATIC_SUPPORTED_LANGS } from "@/lib/programmatic/staticSlugs";

/* ✅ NEW CLEAN COMPONENT */
import CountryMoneyPage from "@/components/pages/CountryMoneyPage";

/* ================= TYPES ================= */

type PageProps = {
    params: Promise<{
        lang: string;
        country: string;
    }>;
};

/* ================= STATIC PARAMS ================= */

const COUNTRIES = [
    "tanzania",
    "kenya",
    "nigeria",
    "south-africa",
    "uganda",
    "ghana",
    "india",
    "pakistan",
    "bangladesh",
    "uae",
    "saudi-arabia",
] as const;

export function generateStaticParams() {
    return PROGRAMMATIC_SUPPORTED_LANGS.flatMap((lang) =>
        COUNTRIES.map((country) => ({
            lang,
            country,
        }))
    );
}

/* ================= METADATA ================= */

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { country } = await params;

    const code = resolveCountry(country);
    const data = getCountryPageData(code);

    if (!data) return {};

    return {
        title: buildCountryTitle(data.name),
        description: `Best forex brokers in ${data.name} with fast withdrawals, low spreads, and local payment methods.`,
        alternates: {
            canonical: generateCanonical(`/best-brokers-in/${country}`),
        },
    };
}

/* ================= PAGE ================= */

export default async function Page({ params }: PageProps) {
    const { country } = await params;

    const code = resolveCountry(country);
    const data = getCountryPageData(code);

    if (!data?.brokers?.length) {
        notFound();
    }

    return (
        <CountryMoneyPage
            countryCode={code}
            countryName={data.name}
            countrySlug={country}
            brokers={data.brokers}
        />
    );
}