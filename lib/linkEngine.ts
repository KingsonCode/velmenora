import { getAllBrokers } from "./brokers";
import { getComparisonSlug, getReviewSlug } from "./seo";
import { scoreBroker } from "./rankingEngine";
import { CountryCode, Intent } from "./types/broker";

/* ================= TYPES ================= */

export type LinkItem = {
    title: string;
    href: string;
};

/* ================= UTILS ================= */

function unique<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

/* ================= REVIEW LINKS (SMART) ================= */

export function getReviewLinks(options?: {
    country?: CountryCode;
    intent?: Intent;
    limit?: number;
}): LinkItem[] {
    const list = getAllBrokers()
        .map((b) => ({
            broker: b,
            score: scoreBroker(b, options),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, options?.limit ?? 5);

    return list.map(({ broker }) => ({
        title: `${broker.name} Review`,
        href: `/${getReviewSlug(broker.slug)}`,
    }));
}

/* ================= COMPARISON LINKS (RANKED) ================= */

export function getComparisonLinks(options?: {
    country?: CountryCode;
    intent?: Intent;
    limit?: number;
}): LinkItem[] {
    const brokers = getAllBrokers();
    const links: { link: LinkItem; score: number }[] = [];

    for (let i = 0; i < brokers.length; i++) {
        const a = brokers[i];
        if (!a) continue;

        for (let j = i + 1; j < brokers.length; j++) {
            const b = brokers[j];
            if (!b) continue;

            const score =
                scoreBroker(a, options) +
                scoreBroker(b, options);

            links.push({
                link: {
                    title: `${a.name} vs ${b.name}`,
                    href: `/${getComparisonSlug(a.slug, b.slug)}`,
                },
                score,
            });
        }
    }

    return links
        .sort((a, b) => b.score - a.score)
        .slice(0, options?.limit ?? 5)
        .map((x) => x.link);
}

/* ================= COUNTRY LINKS (SMART LABELS) ================= */

const COUNTRY_NAMES: Record<CountryCode, string> = {
    TZ: "Tanzania",
    KE: "Kenya",
    NG: "Nigeria",
    ZA: "South Africa",
    UG: "Uganda",
    GH: "Ghana",
    GLOBAL: "Global",
};

export function getCountryLinks(): LinkItem[] {
    return Object.entries(COUNTRY_NAMES)
        .filter(([code]) => code !== "GLOBAL")
        .map(([code, name]) => ({
            title: `Best Brokers in ${name}`,
            href: `/best-brokers-in/${name.toLowerCase().replace(/\s+/g, "-")}`,
        }));
}

/* ================= RELATED COMPARISONS (CONTEXTUAL) ================= */

export function getRelatedComparisons(
    slug: string,
    options?: {
        country?: CountryCode;
        intent?: Intent;
    }
): LinkItem[] {
    const base = getAllBrokers().find((b) => b.slug === slug);
    if (!base) return [];

    const others = getAllBrokers().filter((b) => b.slug !== slug);

    return others
        .map((b) => ({
            broker: b,
            score: scoreBroker(b, options),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ broker }) => ({
            title: `${base.name} vs ${broker.name}`,
            href: `/${getComparisonSlug(base.slug, broker.slug)}`,
        }));
}

/* ================= RELATED REVIEWS ================= */

export function getRelatedReviews(
    slug: string,
    options?: {
        country?: CountryCode;
        intent?: Intent;
    }
): LinkItem[] {
    return getAllBrokers()
        .filter((b) => b.slug !== slug)
        .map((b) => ({
            broker: b,
            score: scoreBroker(b, options),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map(({ broker }) => ({
            title: `${broker.name} Review`,
            href: `/${getReviewSlug(broker.slug)}`,
        }));
}
