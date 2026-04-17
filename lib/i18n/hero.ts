/* =========================
   LANGUAGE SYSTEM (GLOBAL)
========================= */
export const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

/* =========================
   TYPE (STRICT)
========================= */
export type HeroContent = {
    headline_1: string;
    highlight: string;
    headline_2: string;
    sub: string;
    explore: string;
    compare: string;
    trusted: string;
    reviews: string;
    unbiased: string;
};

/* =========================
   CONTENT (FULLY LOCKED)
========================= */
export const heroContent: Record<Lang, HeroContent> = {
    en: {
        headline_1: "Find & Compare the",
        highlight: "Best Forex Brokers",
        headline_2: "in Your Country",
        sub: "Discover trusted brokers, compare features, and trade with confidence — all in one powerful platform.",
        explore: "🚀 Explore Top Brokers",
        compare: "📊 Compare Brokers",
        trusted: "✔ Trusted by 10,000+ traders",
        reviews: "✔ Real user reviews",
        unbiased: "✔ No hidden bias",
    },

    ar: {
        headline_1: "ابحث وقارن بين",
        highlight: "أفضل وسطاء الفوركس",
        headline_2: "في بلدك",
        sub: "اكتشف وسطاء موثوقين وقارن الميزات وابدأ التداول بثقة.",
        explore: "🚀 استكشف الوسطاء",
        compare: "📊 قارن الوسطاء",
        trusted: "✔ موثوق من آلاف المتداولين",
        reviews: "✔ مراجعات حقيقية",
        unbiased: "✔ بدون تحيز",
    },

    de: {
        headline_1: "Finde & vergleiche die",
        highlight: "besten Forex Broker",
        headline_2: "in deinem Land",
        sub: "Vergleiche vertrauenswürdige Broker und handle sicher.",
        explore: "🚀 Top Broker entdecken",
        compare: "📊 Broker vergleichen",
        trusted: "✔ Über 10.000 Trader vertrauen uns",
        reviews: "✔ Echte Bewertungen",
        unbiased: "✔ Keine versteckten Bias",
    },

    fr: {
        headline_1: "Trouvez et comparez les",
        highlight: "meilleurs brokers Forex",
        headline_2: "dans votre pays",
        sub: "Comparez des brokers fiables et tradez en toute confiance.",
        explore: "🚀 Explorer les brokers",
        compare: "📊 Comparer les brokers",
        trusted: "✔ Plus de 10 000 traders nous font confiance",
        reviews: "✔ Avis réels",
        unbiased: "✔ Sans biais caché",
    },
};

/* =========================
   SAFE GETTER (VERY IMPORTANT)
========================= */
export function getHeroContent(lang?: string): HeroContent {
    if (!lang) return heroContent.en;

    if (SUPPORTED_LANGS.includes(lang as Lang)) {
        return heroContent[lang as Lang];
    }

    return heroContent.en;
}