import { Lang, getContent } from "./common";

/* =========================
   TYPE (STRICT)
========================= */
export type TopBrokersContent = {
    title: string;
    subtitle: string;

    best: string;
    ranked: string;
    rating: string;

    open: string;
    details: string;
    viewAll: string;

    empty: string;

    highlightTop: string;
};

/* =========================
   BASE CONTENT (GLOBAL)
========================= */
const baseContent: Record<Lang, TopBrokersContent> = {
    en: {
        title: "🔥 Top Forex Brokers",
        subtitle:
            "Compare the best brokers with fast withdrawals, low spreads, and trusted platforms.",

        best: "🏆 Best Overall",
        ranked: "Ranked Broker",
        rating: "Rating",

        open: "Open Account",
        details: "View Details",
        viewAll: "🔍 View All Brokers",

        empty: "No brokers available in your region yet.",

        highlightTop: "⭐ Highest Rated Broker",
    },

    ar: {
        title: "🔥 أفضل وسطاء الفوركس",
        subtitle: "قارن أفضل الوسطاء بسهولة وثقة.",

        best: "🏆 الأفضل",
        ranked: "الترتيب",
        rating: "التقييم",

        open: "فتح حساب",
        details: "عرض التفاصيل",
        viewAll: "🔍 عرض جميع الوسطاء",

        empty: "لا يوجد وسطاء متاحون في منطقتك حالياً.",

        highlightTop: "⭐ الأعلى تقييماً",
    },

    de: {
        title: "🔥 Top Forex Broker",
        subtitle: "Vergleiche die besten Broker einfach.",

        best: "🏆 Bester Broker",
        ranked: "Rang",
        rating: "Bewertung",

        open: "Konto eröffnen",
        details: "Details ansehen",
        viewAll: "🔍 Alle Broker anzeigen",

        empty: "Keine Broker in deiner Region verfügbar.",

        highlightTop: "⭐ Höchstbewertet",
    },

    fr: {
        title: "🔥 Meilleurs brokers Forex",
        subtitle: "Comparez les meilleurs brokers facilement.",

        best: "🏆 Meilleur",
        ranked: "Classé",
        rating: "Note",

        open: "Ouvrir un compte",
        details: "Voir détails",
        viewAll: "🔍 Voir tous les brokers",

        empty: "Aucun broker disponible dans votre région.",

        highlightTop: "⭐ Le mieux noté",
    },
};

/* =========================
   COUNTRY TITLE ENGINE 🔥
========================= */
function getCountryTitle(base: string, country?: string) {
    if (!country || country === "global") return base;

    const formatted =
        country.charAt(0).toUpperCase() + country.slice(1);

    return `${base} in ${formatted}`;
}

/* =========================
   MAIN GETTER (SMART)
========================= */
export function getTopBrokersContent(
    lang?: string,
    country?: string
): TopBrokersContent {
    const t = getContent(baseContent, lang);

    return {
        ...t,
        title: getCountryTitle(t.title, country),
    };
}