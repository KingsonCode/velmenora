/* =========================
   GLOBAL LANGUAGE SYSTEM
========================= */
export const SUPPORTED_LANGS = ["en", "ar", "de", "fr"] as const;

export type Lang = (typeof SUPPORTED_LANGS)[number];

/* =========================
   VALIDATION
========================= */
export function isValidLang(lang?: string): lang is Lang {
    return !!lang && SUPPORTED_LANGS.includes(lang as Lang);
}

/* =========================
   SAFE LANG RESOLVER
========================= */
export function resolveLang(lang?: string): Lang {
    if (isValidLang(lang)) return lang;
    return "en";
}

/* =========================
   GENERIC CONTENT GETTER
   (Reusable for all components)
========================= */
export function getContent<T>(
    content: Record<Lang, T>,
    lang?: string
): T {
    const safeLang = resolveLang(lang);
    return content[safeLang];
}