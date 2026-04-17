import { getAllBrokers } from "@/lib/brokers";

/* =========================================================
   🔥 TYPES
========================================================= */

type Options = {
    limit?: number;
    country?: string; // future GEO expansion
};

/* =========================================================
   🔥 CACHE
========================================================= */

let cachedSlugs: string[] | null = null;

/* =========================================================
   🔥 CORE GENERATOR
========================================================= */

function generateCompareSlugs(): string[] {
    const brokers = getAllBrokers();

    const slugs: string[] = [];

    for (let i = 0; i < brokers.length; i++) {
        const brokerA = brokers[i];
        if (!brokerA) continue; // 🛡️ TS safety

        for (let j = i + 1; j < brokers.length; j++) {
            const brokerB = brokers[j];
            if (!brokerB) continue; // 🛡️ TS safety

            const a = brokerA.slug;
            const b = brokerB.slug;

            /* 🔒 SORT FOR CONSISTENCY */
            const [first, second] = [a, b].sort();

            slugs.push(`${first}-vs-${second}`);
        }
    }

    return slugs;
}

/* =========================================================
   🔥 PUBLIC API
========================================================= */

export function getCompareSlugs(options?: Options): string[] {
    /* ⚡ CACHE */
    if (!cachedSlugs) {
        cachedSlugs = generateCompareSlugs();
    }

    let result = cachedSlugs;

    /* 🔥 LIMIT CONTROL */
    if (options?.limit) {
        result = result.slice(0, options.limit);
    }

    return result;
}