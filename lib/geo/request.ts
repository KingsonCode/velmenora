import { headers, cookies } from "next/headers";
import { resolveGeo, GeoResult } from "@/lib/geo";

/* ================= TYPES ================= */

type BuildRequestOptions = {
    /* 🔥 manual override (SEO / testing / bots) */
    country?: string;

    /* 🔥 allow query simulation */
    searchParams?: Record<string, string>;
};

/* ================= INTERNAL BUILDER ================= */

async function buildRequest(opts?: BuildRequestOptions) {
    const h = await headers();
    const c = await cookies();

    /* 🔥 build URL params safely */
    const searchParams = new URLSearchParams(
        opts?.searchParams || {}
    );

    return {
        headers: h,
        cookies: {
            get: (key: string) => {
                const cookie = c.get(key);
                return cookie ? { value: cookie.value } : undefined;
            },
        },
        nextUrl: {
            searchParams,
        },
    } as unknown; // controlled cast (safe boundary)
}

/* ================= MAIN ENTRY ================= */

/**
 * 🔥 Universal Geo Resolver (PRO MAX++)
 *
 * Usage:
 * const geo = await getGeo();
 */
export async function getGeo(
    opts?: BuildRequestOptions
): Promise<GeoResult> {
    try {
        /* 🔥 MANUAL MODE (SEO / static pages) */
        if (opts?.country) {
            return resolveGeo(opts.country);
        }

        /* 🔥 NORMAL MODE */
        const req = await buildRequest(opts);
        return resolveGeo(req as any);

    } catch (err) {
        /* 🔥 HARD FALLBACK (never break UI) */
        return resolveGeo();
    }
}