import { COUNTRY_META, type CountryMeta } from "@/lib/geo/countries";
import { getAllBrokers } from "@/lib/brokers";
import { COUNTRY_PAYMENT_MAP } from "@/lib/programmatic/paymentMap";

export type ResolvedProgrammaticPage =
    | {
        type: "safe";
        slug: string;
        title: string;
        broker: {
            slug: string;
            name: string;
        };
        country: CountryMeta;
    }
    | {
        type: "geo";
        slug: string;
        title: string;
        country: CountryMeta;
    }
    | {
        type: "payment";
        slug: string;
        title: string;
        payment: string;
        country: CountryMeta;
    };

function getAllCountries(): CountryMeta[] {
    return Object.values(COUNTRY_META).filter(
        (country): country is CountryMeta => Boolean(country)
    );
}

function normalizeSlugPart(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function formatPaymentLabel(value: string): string {
    const normalized = normalizeSlugPart(value);

    const specialLabels: Record<string, string> = {
        mpesa: "M-Pesa",
        tigopesa: "Tigo Pesa",
        "airtel-money": "Airtel Money",
        "mobile-money": "Mobile Money",
        bkash: "bKash",
        nagad: "Nagad",
        upi: "UPI",
        eft: "EFT",
        bank: "Bank Transfer",
        card: "Credit/Debit Card",
        crypto: "Crypto",
    };

    return (
        specialLabels[normalized] ||
        normalized
            .split("-")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
    );
}

function getPaymentsByCountrySlug(countrySlug: string): string[] {
    return COUNTRY_PAYMENT_MAP[countrySlug] ?? [];
}

export function resolveProgrammaticPage(
    slug: string
): ResolvedProgrammaticPage | null {
    const normalizedSlug = slug.toLowerCase().trim();
    const countries = getAllCountries();
    const brokers = getAllBrokers();

    // ================= SAFE =================
    for (const country of countries) {
        for (const broker of brokers) {
            const safeSlug = `is-${broker.slug}-safe-in-${country.slug}`;

            if (normalizedSlug === safeSlug) {
                return {
                    type: "safe",
                    slug: normalizedSlug,
                    title: `Is ${broker.name} Safe in ${country.name}?`,
                    broker: {
                        slug: broker.slug,
                        name: broker.name,
                    },
                    country,
                };
            }
        }
    }

    // ================= GEO =================
    for (const country of countries) {
        const geoSlug = `best-forex-brokers-in-${country.slug}`;

        if (normalizedSlug === geoSlug) {
            return {
                type: "geo",
                slug: normalizedSlug,
                title: `Best Forex Brokers in ${country.name}`,
                country,
            };
        }
    }

    // ================= PAYMENT =================
    for (const country of countries) {
        const payments = getPaymentsByCountrySlug(country.slug);

        for (const payment of payments) {
            const paymentSlug = normalizeSlugPart(payment);
            const paymentPageSlug = `forex-brokers-with-${paymentSlug}-in-${country.slug}`;

            if (normalizedSlug === paymentPageSlug) {
                return {
                    type: "payment",
                    slug: normalizedSlug,
                    title: `Forex Brokers with ${formatPaymentLabel(payment)} in ${country.name}`,
                    payment,
                    country,
                };
            }
        }
    }

    return null;
}