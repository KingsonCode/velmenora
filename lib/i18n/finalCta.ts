import { Lang, getContent } from "./common";

/* =========================
   TYPE
========================= */
export type FinalCTAContent = {
    headline_1: string;
    headline_2: string;

    sub: string;

    primary: string;
    secondary: string;

    compare: string;
    learn: string;

    trust_1: string;
    trust_2: string;
    trust_3: string;
};

/* =========================
   CONTENT
========================= */
const content: Record<Lang, FinalCTAContent> = {
    en: {
        headline_1: "Start Trading with",
        headline_2: "Today",

        sub: "Trade with a verified broker offering fast withdrawals, low spreads, and powerful trading platforms.",

        primary: "🚀 Open Account",
        secondary: "Start Trading Now",

        compare: "🔍 Compare Brokers",
        learn: "🎓 Learn Forex First",

        trust_1: "✔ No Hidden Fees",
        trust_2: "✔ Fast Withdrawals",
        trust_3: "✔ Trusted by Traders",
    },

    ar: {
        headline_1: "ابدأ التداول مع",
        headline_2: "اليوم",

        sub: "تداول مع وسيط موثوق وسحوبات سريعة.",

        primary: "🚀 فتح حساب",
        secondary: "ابدأ التداول الآن",

        compare: "🔍 قارن الوسطاء",
        learn: "🎓 تعلم الفوركس",

        trust_1: "✔ بدون رسوم مخفية",
        trust_2: "✔ سحب سريع",
        trust_3: "✔ موثوق",
    },

    de: {
        headline_1: "Starte Trading mit",
        headline_2: "heute",

        sub: "Handle mit einem zuverlässigen Broker.",

        primary: "🚀 Konto eröffnen",
        secondary: "Jetzt traden",

        compare: "🔍 Broker vergleichen",
        learn: "🎓 Forex lernen",

        trust_1: "✔ Keine versteckten Gebühren",
        trust_2: "✔ Schnelle Auszahlungen",
        trust_3: "✔ Vertrauenswürdig",
    },

    fr: {
        headline_1: "Commencez à trader avec",
        headline_2: "aujourd'hui",

        sub: "Tradez avec un broker fiable.",

        primary: "🚀 Ouvrir un compte",
        secondary: "Commencer à trader",

        compare: "🔍 Comparer les brokers",
        learn: "🎓 Apprendre le Forex",

        trust_1: "✔ Sans frais cachés",
        trust_2: "✔ Retraits rapides",
        trust_3: "✔ Fiable",
    },
};

export function getFinalCTAContent(lang?: string) {
    return getContent(content, lang);
}