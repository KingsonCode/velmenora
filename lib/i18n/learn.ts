import { Lang, getContent } from "./common";

/* =========================
   TYPE
========================= */
export type LearnContent = {
    title_1: string;
    highlight: string;
    subtitle: string;

    start_here: string;
    featured_title: string;
    featured_desc: string;

    trade_title: string;
    trade_desc: string;

    beginner_title: string;
    beginner_desc: string;

    cta: string;
};

/* =========================
   CONTENT (ALL LANGS LOCKED)
========================= */
const learnContent: Record<Lang, LearnContent> = {
    en: {
        title_1: "Learn Forex Trading the",
        highlight: "Right Way",
        subtitle:
            "Master forex step by step with beginner-friendly guides, strategies, and real trading insights.",

        start_here: "START HERE",
        featured_title: "What is Forex Trading?",
        featured_desc:
            "Understand how the forex market works, how traders make money, and why millions trade currencies daily.",

        trade_title: "How to Trade Forex",
        trade_desc:
            "Learn how to open trades, analyze charts, and manage risk like a pro.",

        beginner_title: "Forex for Beginners",
        beginner_desc:
            "Start your forex journey with simple strategies and easy explanations.",

        cta: "🎓 Go to Forex Academy",
    },

    ar: {
        title_1: "تعلم تداول الفوركس",
        highlight: "بالطريقة الصحيحة",
        subtitle:
            "تعلم الفوركس خطوة بخطوة مع استراتيجيات مبسطة ومفاهيم واضحة.",

        start_here: "ابدأ هنا",
        featured_title: "ما هو تداول الفوركس؟",
        featured_desc:
            "تعرف على كيفية عمل سوق الفوركس وكيف يحقق المتداولون الأرباح.",

        trade_title: "كيف تتداول الفوركس",
        trade_desc:
            "تعلم كيفية فتح الصفقات وتحليل السوق وإدارة المخاطر.",

        beginner_title: "الفوركس للمبتدئين",
        beginner_desc:
            "ابدأ رحلتك في الفوركس بأساليب سهلة.",

        cta: "🎓 اذهب إلى أكاديمية الفوركس",
    },

    de: {
        title_1: "Lerne Forex Trading auf die",
        highlight: "richtige Weise",
        subtitle:
            "Lerne Forex Schritt für Schritt mit einfachen Strategien und echten Einblicken.",

        start_here: "HIER STARTEN",
        featured_title: "Was ist Forex Trading?",
        featured_desc:
            "Verstehe den Forex-Markt und wie Trader Gewinne erzielen.",

        trade_title: "Wie man Forex handelt",
        trade_desc:
            "Lerne Trades zu eröffnen und Risiken zu managen.",

        beginner_title: "Forex für Anfänger",
        beginner_desc:
            "Starte einfach und verständlich in den Forex-Markt.",

        cta: "🎓 Zur Forex Akademie",
    },

    fr: {
        title_1: "Apprenez le trading Forex",
        highlight: "correctement",
        subtitle:
            "Maîtrisez le forex étape par étape avec des guides simples.",

        start_here: "COMMENCER ICI",
        featured_title: "Qu'est-ce que le Forex ?",
        featured_desc:
            "Comprenez le marché et comment les traders gagnent de l'argent.",

        trade_title: "Comment trader le Forex",
        trade_desc:
            "Apprenez à ouvrir des trades et gérer le risque.",

        beginner_title: "Forex pour débutants",
        beginner_desc:
            "Commencez facilement avec des explications simples.",

        cta: "🎓 Aller à l'académie Forex",
    },
};

/* =========================
   GETTER
========================= */
export function getLearnContent(lang?: string): LearnContent {
    return getContent(learnContent, lang);
}