/* =========================================================
   🔥 IMPORTS
========================================================= */
import { BLOG_COUNTRIES, getBlogCountryBySlug } from "./countryRegistry";
import { injectBrokerCards } from "./injectBrokerCards";
import {
  injectInternalLinks,
  appendRelatedLinksBlock,
} from "./internalLinks";
import { BlogCategory } from "@/lib/blog/categories";

/* =========================================================
   🔥 TYPES
========================================================= */

export type KeywordMeta = {
  slug: string;
  country: string;
  type: string;
};

export type ProgrammaticPost = {
  slug: string;
  title: string;
  description: string;
  date?: string;
  image?: string;
  country?: string;
  type?: string;
  content?: string;
};

/* =========================================================
   🔥 TEMPLATE ENGINE (SEO INTENTS)
========================================================= */

const TEMPLATES = [
  { prefix: "best-brokers-in-", type: "best" },
  { prefix: "low-spread-brokers-in-", type: "low-spread" },
  { prefix: "high-leverage-brokers-in-", type: "high-leverage" },
  { prefix: "how-to-trade-forex-in-", type: "guide" },
  { prefix: "forex-trading-guide-in-", type: "guide" },
  { prefix: "forex-brokers-for-beginners-in-", type: "beginner" },
  { prefix: "forex-trading-apps-in-", type: "apps" },
];

/* =========================================================
   🔥 TYPE → CATEGORY MAPPER (NEW CORE)
========================================================= */

function mapTypeToCategory(type: string): BlogCategory {
  switch (type) {
    case "low-spread":
      return "low-spread-brokers";

    case "high-leverage":
      return "high-leverage-brokers";

    case "beginner":
      return "best-forex-brokers-for-beginners";

    case "best":
      return "ecn-brokers";

    case "guide":
      return "ecn-brokers";

    case "apps":
      return "ecn-brokers";

    default:
      return "ecn-brokers";
  }
}

/* =========================================================
   🔥 CORE GENERATOR
========================================================= */

export function generateAllKeywords(): KeywordMeta[] {
  const results: KeywordMeta[] = [];

  for (const country of BLOG_COUNTRIES) {
    for (const template of TEMPLATES) {
      results.push({
        slug: `${template.prefix}${country.slug}`,
        country: country.slug,
        type: template.type,
      });
    }
  }

  return results;
}

/* =========================================================
   🔥 SLUG LIST (DEDUPED)
========================================================= */

export function generateAllSlugs(): string[] {
  const keywords = generateAllKeywords();
  const unique = new Set(keywords.map((k) => k.slug));

  return Array.from(unique);
}

/* =========================================================
   🔥 LOOKUP HELPERS
========================================================= */

export function getKeywordMeta(slug: string): KeywordMeta | null {
  const all = generateAllKeywords();
  return all.find((k) => k.slug === slug) || null;
}

/* =========================================================
   🔥 FILTERING
========================================================= */

export function generateSlugsByType(type: string): string[] {
  return generateAllKeywords()
    .filter((k) => k.type === type)
    .map((k) => k.slug);
}

export function generateSlugsByCountry(country: string): string[] {
  return generateAllKeywords()
    .filter((k) => k.country === country)
    .map((k) => k.slug);
}

/* =========================================================
   🔥 PAGINATION
========================================================= */

export function generatePaginatedSlugs(
  page: number,
  limit: number
): string[] {
  const all = generateAllSlugs();

  const start = (page - 1) * limit;
  const end = start + limit;

  return all.slice(start, end);
}

/* =========================================================
   🔥 RANDOM SAMPLING
========================================================= */

export function getRandomSlugs(count: number): string[] {
  const all = generateAllSlugs();

  return [...all]
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

/* =========================================================
   🔥 TITLE / DESCRIPTION BUILDERS
========================================================= */

function titleCaseCountry(slug: string): string {
  const found = getBlogCountryBySlug(slug);

  if (found) return found.name;

  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildTitle(type: string, countryName: string): string {
  switch (type) {
    case "best":
      return `Best Forex Brokers in ${countryName} (2026)`;

    case "low-spread":
      return `Low Spread Forex Brokers in ${countryName} (2026)`;

    case "high-leverage":
      return `High Leverage Forex Brokers in ${countryName} (2026)`;

    case "guide":
      return `How to Trade Forex in ${countryName} (2026)`;

    case "beginner":
      return `Best Forex Brokers for Beginners in ${countryName} (2026)`;

    case "apps":
      return `Best Forex Trading Apps in ${countryName} (2026)`;

    default:
      return `Forex Trading in ${countryName} (2026)`;
  }
}

function buildDescription(type: string, countryName: string): string {
  switch (type) {
    case "best":
      return `Compare the best forex brokers in ${countryName}, including spreads, leverage, payments, and platform features.`;

    case "low-spread":
      return `Discover low spread forex brokers in ${countryName} for scalping, day trading, and lower trading costs.`;

    case "high-leverage":
      return `Explore high leverage forex brokers in ${countryName} and learn about account features, risks, and trading conditions.`;

    case "guide":
      return `Learn how to trade forex in ${countryName} step by step, including broker selection, strategy basics, and risk management.`;

    case "beginner":
      return `Find beginner-friendly forex brokers in ${countryName} with simple platforms, education, and accessible account options.`;

    case "apps":
      return `Explore the best forex trading apps in ${countryName} for mobile trading, charting, and fast execution.`;

    default:
      return `Forex education and broker comparison content for traders in ${countryName}.`;
  }
}

/* =========================================================
   🔥 CONTENT ENGINE
========================================================= */

function buildContent(type: string, countryName: string): string {
  switch (type) {
    case "best":
    case "low-spread":
    case "high-leverage":
    case "guide":
    case "beginner":
    case "apps":
      return `
<h2>${buildTitle(type, countryName)}</h2>
<p>Forex trading in ${countryName} depends on choosing the right broker, managing risk, and understanding market conditions.</p>

<h2>Key Considerations</h2>
<p>Focus on spreads, execution speed, withdrawals, and platform reliability.</p>

<h2>Choosing the Right Broker</h2>
<p>Compare brokers carefully based on your trading style and goals.</p>

<h2>Conclusion</h2>
<p>The best broker in ${countryName} is one that aligns with your strategy and risk tolerance.</p>
`;

    default:
      return `
<h2>Forex Trading in ${countryName}</h2>
<p>This page provides educational forex content tailored for traders in ${countryName}.</p>
`;
  }
}

/* =========================================================
   🔥 SINGLE PROGRAMMATIC POST (FULL PIPELINE)
========================================================= */

export function generateProgrammaticPost(
  slug: string
): ProgrammaticPost | null {
  const meta = getKeywordMeta(slug);

  if (!meta) return null;

  const country = getBlogCountryBySlug(meta.country);
  const countryName =
    country?.name || titleCaseCountry(meta.country);

  const rawContent = buildContent(meta.type, countryName);

  const category = mapTypeToCategory(meta.type);

  /* 🔥 STEP 1 — INTERNAL SEO LINKS */
  const contentWithLinks = injectInternalLinks(
    rawContent,
    meta.country,
    slug
  );

  /* 🔥 STEP 2 — SMART BROKER ENGINE (NEW) */
  const contentWithBrokers = injectBrokerCards({
    content: contentWithLinks,
    category,
    slug,
    country: meta.country,
  });

  /* 🔥 STEP 3 — RELATED CLUSTER LINKS */
  const finalContent = appendRelatedLinksBlock(
    contentWithBrokers,
    meta.country,
    slug
  );

  return {
    slug,
    title: buildTitle(meta.type, countryName),
    description: buildDescription(meta.type, countryName),
    date: "2026-04-17",
    image: "/og-default.jpg",
    country: meta.country,
    type: meta.type,
    content: finalContent,
  };
}