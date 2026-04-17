import { Lang, getContent } from "./common";

/* =========================
   TYPE
========================= */
export type NewsContent = {
    title: string;
    viewAll: string;
    loading: string;
    empty: string;
};

/* =========================
   CONTENT
========================= */
const content: Record<Lang, NewsContent> = {
    en: {
        title: "🔥 Live Market News",
        viewAll: "View all →",
        loading: "Loading news...",
        empty: "No news available right now.",
    },

    ar: {
        title: "🔥 أخبار السوق",
        viewAll: "عرض الكل →",
        loading: "جارٍ تحميل الأخبار...",
        empty: "لا توجد أخبار حالياً.",
    },

    de: {
        title: "🔥 Markt Nachrichten",
        viewAll: "Alle anzeigen →",
        loading: "Lade Nachrichten...",
        empty: "Keine Nachrichten verfügbar.",
    },

    fr: {
        title: "🔥 Actualités du marché",
        viewAll: "Voir tout →",
        loading: "Chargement...",
        empty: "Aucune actualité disponible.",
    },
};

export function getNewsContent(lang?: string) {
    return getContent(content, lang);
}