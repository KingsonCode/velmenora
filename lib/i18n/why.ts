import { Lang, getContent } from "./common";

/* =========================
   TYPE
========================= */
export type WhyContent = {
    title: string;
    brand: string;
    subtitle: string;

    trust_title: string;
    trust_desc: string;

    speed_title: string;
    speed_desc: string;

    learn_title: string;
    learn_desc: string;

    badge1: string;
    badge2: string;
    badge3: string;
};

/* =========================
   CONTENT
========================= */
const whyContent: Record<Lang, WhyContent> = {
    en: {
        title: "Why Traders Choose",
        brand: "Velmenora",
        subtitle:
            "We simplify forex trading by helping you find trusted brokers, compare features, and make smarter decisions — faster.",

        trust_title: "Verified & Trusted Brokers",
        trust_desc:
            "We only list regulated and reliable brokers with proven track records. No scams. No guesswork.",

        speed_title: "Fast & Smart Comparisons",
        speed_desc:
            "Instantly compare spreads, fees, platforms, and features — all in one place.",

        learn_title: "Beginner-Friendly Guides",
        learn_desc:
            "Learn forex step by step with simple guides and strategies.",

        badge1: "✔ 100% Free to Use",
        badge2: "✔ No Hidden Bias",
        badge3: "✔ Regularly Updated Data",
    },

    ar: {
        title: "لماذا يختار المتداولون",
        brand: "Velmenora",
        subtitle:
            "نُبسّط تداول الفوركس من خلال مساعدتك في العثور على وسطاء موثوقين.",

        trust_title: "وسطاء موثوقون",
        trust_desc:
            "نقوم بعرض الوسطاء المنظمين فقط بدون احتيال.",

        speed_title: "مقارنات سريعة",
        speed_desc:
            "قارن الرسوم والمنصات بسهولة وفي مكان واحد.",

        learn_title: "تعلم بسهولة",
        learn_desc:
            "تعلم الفوركس خطوة بخطوة مع أدلة مبسطة.",

        badge1: "✔ مجاني 100%",
        badge2: "✔ بدون تحيز",
        badge3: "✔ بيانات محدثة",
    },

    de: {
        title: "Warum Trader Velmenora wählen",
        brand: "Velmenora",
        subtitle:
            "Wir helfen dir, vertrauenswürdige Broker zu finden und smarter zu handeln.",

        trust_title: "Verifizierte Broker",
        trust_desc:
            "Nur regulierte und vertrauenswürdige Broker werden gelistet.",

        speed_title: "Schnelle Vergleiche",
        speed_desc:
            "Vergleiche Gebühren und Plattformen sofort.",

        learn_title: "Einsteigerfreundlich",
        learn_desc:
            "Lerne Forex Schritt für Schritt.",

        badge1: "✔ 100% kostenlos",
        badge2: "✔ Keine versteckten Bias",
        badge3: "✔ Regelmäßig aktualisiert",
    },

    fr: {
        title: "Pourquoi choisir Velmenora",
        brand: "Velmenora",
        subtitle:
            "Nous vous aidons à trouver des brokers fiables et à trader intelligemment.",

        trust_title: "Brokers vérifiés",
        trust_desc:
            "Nous listons uniquement des brokers fiables et régulés.",

        speed_title: "Comparaison rapide",
        speed_desc:
            "Comparez facilement les frais et plateformes.",

        learn_title: "Facile pour débutants",
        learn_desc:
            "Apprenez le forex étape par étape.",

        badge1: "✔ 100% gratuit",
        badge2: "✔ Sans biais",
        badge3: "✔ Données mises à jour",
    },
};

/* =========================
   GETTER
========================= */
export function getWhyContent(lang?: string): WhyContent {
    return getContent(whyContent, lang);
}