// /lib/geo/index.ts

/**
 * ==============================
 * 🌍 GEO SYSTEM PUBLIC API
 * ==============================
 *
 * ✅ Single source of truth
 * ✅ Fully typed
 * ✅ Clean (no legacy)
 * ✅ Safe helpers for UI + SEO
 *
 * 👉 Always import from "@/lib/geo"
 */

/* =========================================================
   📦 INTERNAL IMPORTS
========================================================= */

import { COUNTRY_META, getCountryMeta } from "./countries";
import type { CountryMeta } from "./countries";

/* =========================================================
   🧩 CLUSTERS
========================================================= */

export { CLUSTERS } from "./clusters";

export type {
    Cluster,
    ClusterConfig,
    BrokerPriority
} from "./clusters";

/* =========================================================
   🌍 COUNTRIES
========================================================= */

export {
    COUNTRY_TO_CLUSTER,
    COUNTRY_META,
    getCountryMeta,
    getClusterByCountry,
    normalizeCountryCode
} from "./countries";

export type {
    CountryCode,
    CountryMeta
} from "./countries";

/* =========================================================
   ⚙️ RESOLVER (CORE ENGINE)
========================================================= */

export { resolveGeo } from "./resolver";

export type { GeoResult } from "./resolver";

/* =========================================================
   🧯 COMPAT + UI HELPERS (SAFE & TYPED)
========================================================= */

/**
 * All countries (array form)
 */
export const countries: CountryMeta[] = Object.values(COUNTRY_META);

/**
 * Find country by slug (SEO pages)
 */
export function getCountryBySlug(slug: string): CountryMeta | undefined {
    return countries.find((c) => c.slug === slug);
}

/**
 * Find country by code
 */
export function getCountryByCode(code?: string): CountryMeta | null {
    return getCountryMeta(code);
}

/**
 * Simple SEO generator (can be upgraded later)
 */
export function generateSEO(country: CountryMeta) {
    return {
        title: `Best Forex Brokers in ${country.name} (2026)`,
        description: `Trade forex in ${country.name} with fast withdrawals, low spreads, and trusted brokers.`,
        keywords: [
            `forex brokers ${country.name}`,
            `best forex ${country.name}`,
            `trade forex ${country.name}`
        ],
    };
}
