import { COUNTRY_META, type CountryMeta } from "@/lib/geo/countries";
import { getAllBrokers } from "@/lib/brokers";
import { COUNTRY_PAYMENT_MAP } from "@/lib/programmatic/paymentMap";

export const PROGRAMMATIC_SUPPORTED_LANGS = ["en", "de", "fr", "ar"] as const;
export type SupportedLang = (typeof PROGRAMMATIC_SUPPORTED_LANGS)[number];

export type ProgrammaticStaticParam = {
    lang: SupportedLang;
    slug: string;
};

function getAllCountries(): CountryMeta[] {
    return Object.values(COUNTRY_META).filter(
        (country): country is CountryMeta => Boolean(country?.slug && country?.name)
    );
}

function normalizeSlugPart(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function getAllValidBrokers() {
    return getAllBrokers().filter(
        (broker) => Boolean(broker?.slug && broker?.name)
    );
}

export function generateSafeSlugs(): string[] {
    const countries = getAllCountries();
    const brokers = getAllValidBrokers();
    const slugs = new Set<string>();

    for (const country of countries) {
        for (const broker of brokers) {
            slugs.add(`is-${broker.slug}-safe-in-${country.slug}`);
        }
    }

    return Array.from(slugs).sort();
}

export function generateGeoSlugs(): string[] {
    const countries = getAllCountries();
    const slugs = new Set<string>();

    for (const country of countries) {
        slugs.add(`best-forex-brokers-in-${country.slug}`);
    }

    return Array.from(slugs).sort();
}

export function generatePaymentSlugs(): string[] {
    const countries = getAllCountries();
    const slugs = new Set<string>();

    for (const country of countries) {
        const payments = COUNTRY_PAYMENT_MAP[country.slug] ?? [];

        for (const payment of payments) {
            slugs.add(
                `forex-brokers-with-${normalizeSlugPart(payment)}-in-${country.slug}`
            );
        }
    }

    return Array.from(slugs).sort();
}

export function generateProgrammaticSlugs(): string[] {
    return Array.from(
        new Set([
            ...generateSafeSlugs(),
            ...generateGeoSlugs(),
            ...generatePaymentSlugs(),
        ])
    ).sort();
}

export function generateProgrammaticStaticParams(): ProgrammaticStaticParam[] {
    const slugs = generateProgrammaticSlugs();

    return PROGRAMMATIC_SUPPORTED_LANGS.flatMap((lang) =>
        slugs.map((slug) => ({ lang, slug }))
    );
}