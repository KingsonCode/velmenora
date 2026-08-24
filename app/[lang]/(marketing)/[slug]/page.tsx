import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SafePage from "@/components/pages/SafePage";
import GeoPage from "@/components/pages/GeoPage";
import PaymentPage from "@/components/pages/PaymentPage";
import { resolveProgrammaticPage } from "@/lib/programmatic/resolveProgrammaticPage";
import {
    generateProgrammaticStaticParams,
    PROGRAMMATIC_SUPPORTED_LANGS,
} from "@/lib/programmatic/staticSlugs";

type Lang = (typeof PROGRAMMATIC_SUPPORTED_LANGS)[number];

type PageProps = {
    params: Promise<{
        lang: string;
        slug: string;
    }>;
};

export const dynamicParams = false;

function isValidLang(value: string): value is Lang {
    return (PROGRAMMATIC_SUPPORTED_LANGS as readonly string[]).includes(value);
}

function getBaseUrl(): string {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || "https://velmenora.com";
    return raw.replace(/\/+$/, "");
}

function buildDescription(
    page: ReturnType<typeof resolveProgrammaticPage>
): string {
    if (!page) {
        return "Compare forex brokers, trading platforms, and funding options.";
    }

    switch (page.type) {
        case "safe":
            return `Find out whether ${page.broker.name} is safe in ${page.country.name}, including trust factors, practical risks, and broker reliability.`;

        case "geo":
            return `Compare the best forex brokers in ${page.country.name}, including platforms, spreads, trading features, and funding convenience.`;

        case "payment":
            return `Explore forex brokers that support ${page.payment} in ${page.country.name}, including deposits, withdrawals, and trading access.`;

        default:
            return "Compare forex brokers, trading platforms, and funding options.";
    }
}

function buildAlternates(slug: string): Record<string, string> {
    const languages: Record<string, string> = {};

    for (const lang of PROGRAMMATIC_SUPPORTED_LANGS) {
        languages[lang] = `/${lang}/country/${slug}`;
    }

    languages["x-default"] = `/en/${slug}`;

    return languages;
}

export async function generateStaticParams() {
    return generateProgrammaticStaticParams();
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { lang, slug } = await params;

    if (!isValidLang(lang)) {
        return {};
    }

    const page = resolveProgrammaticPage(slug);

    if (!page) {
        return {};
    }

    const baseUrl = getBaseUrl();
    const title = `${page.title} | Velmenora`;
    const description = buildDescription(page);
    const canonical = `${baseUrl}/${lang}/country/${slug}`;
    const alternates = buildAlternates(slug);

    return {
        title,
        description,
        alternates: {
            canonical,
            languages: Object.fromEntries(
                Object.entries(alternates).map(([key, value]) => [
                    key,
                    `${baseUrl}${value}`,
                ])
            ),
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "Velmenora",
            type: "article",
            images: [
                {
                    url: `${baseUrl}/og-default.jpg`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`${baseUrl}/og-default.jpg`],
        },
    };
}

export default async function ProgrammaticPage({ params }: PageProps) {
    const { lang, slug } = await params;

    if (!isValidLang(lang)) {
        notFound();
    }

    const page = resolveProgrammaticPage(slug);

    if (!page) {
        notFound();
    }

    switch (page.type) {
        case "safe":
            return (
                <SafePage
                    lang={lang}
                    slug={slug}
                    country={page.country}
                    broker={page.broker}
                />
            );

        case "geo":
            return <GeoPage lang={lang} slug={slug} country={page.country} />;

        case "payment":
            return (
                <PaymentPage
                    lang={lang}
                    slug={slug}
                    country={page.country}
                    payment={page.payment}
                />
            );

        default:
            notFound();
    }
}