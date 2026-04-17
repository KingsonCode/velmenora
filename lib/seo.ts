import { getAllBrokers } from "./brokers";
import { Feature, Intent } from "./types/broker";
import { weightedPick } from "@/lib/utils/pick";

/* ================= CORE ================= */

export const BRAND = "Velmenora";
export const BASE_URL = "https://www.velmenora.com";
const YEAR = new Date().getFullYear();

/* ================= CORE TITLE ================= */

export function generateTitle(base: string): string {
    return `${base} | ${BRAND}`;
}

/* ================= META ================= */

export function generateDescription(text: string): string {
    return `${text} — Compare top forex brokers, features, fees, and withdrawal options on ${BRAND}.`;
}

/* ================= CANONICAL ================= */

export function generateCanonical(path: string): string {
    return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* ================= SLUG HELPERS ================= */

export function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function getReviewSlug(slug: string): string {
    return `${slug}-review`;
}

export function getComparisonSlug(a: string, b: string): string {
    const [x, y] = a < b ? [a, b] : [b, a];
    return `${x}-vs-${y}`;
}

export function getCountrySlug(name: string): string {
    return `best-brokers-in-${slugify(name)}`;
}

/* ================= TITLE BUILDERS ================= */

export function buildComparisonTitle(a: string, b: string): string {
    return generateTitle(
        `${a} vs ${b} – Which Broker is Better in ${YEAR}?`
    );
}

export function buildCountryTitle(country: string): string {
    return generateTitle(
        `Best Forex Brokers in ${country} (${YEAR})`
    );
}

export function buildReviewTitle(name: string): string {
    return generateTitle(
        `${name} Review ${YEAR} – Is It Safe or Scam?`
    );
}

/* ================= META BUILDERS ================= */

export function buildComparisonDescription(a: string, b: string): string {
    return generateDescription(
        `Compare ${a} vs ${b}: spreads, fees, withdrawals, platforms, and features`
    );
}

export function buildCountryDescription(country: string): string {
    return generateDescription(
        `Best forex brokers available in ${country} with local payments, low spreads, and fast withdrawals`
    );
}

export function buildReviewDescription(name: string): string {
    return generateDescription(
        `${name} review covering regulation, spreads, deposit, withdrawal speed, and user experience`
    );
}

/* ================= CTA ENGINE (NEW 🔥) ================= */

export function buildCTA(): string {
    return weightedPick([
        { value: "Start Trading Now", weight: 5 },
        { value: "Open Free Account", weight: 3 },
        { value: "Try Demo First", weight: 2 },
    ]);
}

/* ================= INDEXING (PROGRAMMATIC) ================= */

export function buildFeatureIndex(): Record<Feature, string[]> {
    const map = {} as Record<Feature, string[]>;

    for (const broker of getAllBrokers()) {
        for (const feature of broker.features) {
            if (!map[feature]) map[feature] = [];
            map[feature].push(broker.slug);
        }
    }

    return map;
}

export function buildIntentIndex(): Record<Intent, string[]> {
    const map = {} as Record<Intent, string[]>;

    for (const broker of getAllBrokers()) {
        if (broker.intent) {
            for (const intent of broker.intent) {
                if (!map[intent]) map[intent] = [];
                map[intent].push(broker.slug);
            }
        }
    }

    return map;
}

/* ================= KEYWORD HELPERS ================= */

export function buildKeyword(base: string, modifier?: string): string {
    return modifier ? `${base} ${modifier}` : base;
}

/* ================= BREADCRUMB ================= */

export function buildBreadcrumbs(
    path: string[]
): { name: string; href: string }[] {
    const crumbs: { name: string; href: string }[] = [];

    path.reduce((acc, cur) => {
        const href = `${acc}/${cur}`;
        crumbs.push({
            name: cur.replace(/-/g, " "),
            href,
        });
        return href;
    }, "");

    return crumbs;
}