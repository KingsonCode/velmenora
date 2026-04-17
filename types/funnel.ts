import { Cluster } from "@/lib/geo";

/* ================= TYPES ================= */

/**
 * Supported languages
 */
export type Language = "en" | "ar" | "de" | "fr";

/**
 * Funnel intent (conversion targeting)
 */
export type Intent = "beginner" | "pro";

/* =========================
   🔥 CTA TYPE (REUSABLE)
========================= */
export type CTA = {
    primary: string;
    secondary?: string;
    link: string;
};

/* =========================
   🌍 CORE FUNNEL TYPE (PRO MAX++)
========================= */
export type Funnel = {
    /* ================= GEO ================= */

    /**
     * ISO country code (TZ, KE, etc)
     */
    country: string;

    /**
     * Human-readable country name
     */
    countryName?: string;

    /**
     * SEO slug (tanzania, kenya)
     */
    slug?: string;

    language: Language;
    cluster: Cluster;

    /* ================= SEO ================= */

    title: string;
    description: string;

    /* ================= 🔥 CONVERSION ================= */

    headline?: string;
    subheadline?: string;

    cta: CTA;

    /* ================= 📊 DATA ================= */

    /**
     * Ordered brokers (priority matters)
     */
    brokers: readonly string[];

    /**
     * Available payment methods
     */
    payments: readonly string[];

    /* ================= 🎯 TARGETING ================= */

    intent: Intent;

    /* ================= 🚀 EXTENSIONS ================= */

    /**
     * Currency (USD, ZAR, etc)
     */
    currency?: string;

    /**
     * Region / cluster label (Africa, Europe, etc)
     */
    region?: string;
};