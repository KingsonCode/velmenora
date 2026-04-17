import { resolveGeo } from "@/lib/geo";
import { getCountryByCode } from "@/lib/geo";

export function buildFunnel(countryCode?: string) {
    const geo = resolveGeo(countryCode);
    const countryData = getCountryByCode(geo.country ?? undefined);

    const isGlobal = geo.cluster === "GLOBAL" || !countryData;

    /* ================= COUNTRY ================= */
    const countryName = isGlobal
        ? "your region"
        : countryData.name;

    const countrySlug = isGlobal
        ? "global"
        : countryData.slug;

    /* ================= SEO ================= */
    const title = isGlobal
        ? "Best Forex Brokers Worldwide (2026)"
        : `Best Forex Brokers in ${countryName} (2026)`;

    const description = isGlobal
        ? "Trade forex globally with trusted brokers and secure platforms."
        : `Trade forex in ${countryName} with trusted brokers, fast withdrawals, and low spreads. Payments: ${geo.payments?.join(", ") || "Card, Bank Transfer"}.`;

    /* ================= 🧠 INTENT HEADLINES ================= */

    const headline =
        geo.intent === "beginner"
            ? `Start Forex Trading in ${countryName}`
            : `Trade Forex Like a Pro in ${countryName}`;

    const subheadline =
        geo.intent === "beginner"
            ? `Start with low deposit, easy platforms, and fast withdrawals. No experience needed.`
            : `Access raw spreads, fast execution, and professional trading platforms.`;

    /* ================= CTA ================= */

    const ctaText =
        geo.intent === "beginner"
            ? "Start Trading"
            : "Open Pro Account";

    const cta = {
        primary: ctaText,
        link: isGlobal
            ? "/brokers"
            : `/brokers/${countrySlug}`,
    };

    return {
        /* CORE */
        country: countryName,
        countryCode: geo.country,
        slug: countrySlug,

        language: geo.language,
        cluster: geo.cluster,

        /* SEO */
        title,
        description,

        /* 🔥 CONVERSION ENGINE */
        headline,
        subheadline,

        /* CTA */
        cta,

        /* MONEY ENGINE */
        brokers: geo.brokers,
        payments: geo.payments || [],

        /* INTENT */
        intent: geo.intent,
    };
}