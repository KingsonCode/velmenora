/* =========================
   CORE (single source)
========================= */
export {
    SUPPORTED_LANGS,
    type Lang,
    isValidLang,
    resolveLang,
    getContent,
} from "./common";

/* =========================
   FEATURES
========================= */
export { getHeroContent } from "./hero";
export { getWhyContent } from "./why";
export { getLearnContent } from "./learn";
export { getTopBrokersContent } from "./topBrokers";
export { getNewsContent } from "./news";
export { getFinalCTAContent } from "./finalCta";