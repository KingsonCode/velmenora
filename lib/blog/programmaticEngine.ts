/* =========================================================
   🔥 IMPORTS
========================================================= */
import { BLOG_COUNTRIES, getBlogCountryBySlug } from "./countryRegistry";
import { injectBrokerCards } from "./brokerCards";
import {
  injectInternalLinks,
  appendRelatedLinksBlock,
} from "./internalLinks";


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

function buildContent(type: string, countryName: string): string {
  switch (type) {
    case "best":
      return `
<h2>Best Forex Brokers in ${countryName}</h2>
<p>Choosing the right broker in ${countryName} depends on regulation, withdrawals, spreads, leverage, and platform quality.</p>

<h2>What to Look For</h2>
<p>Focus on broker trust, deposit methods, fast withdrawals, platform stability, and trading costs before opening an account.</p>

<h2>Who This Is Best For</h2>
<p>This guide helps traders in ${countryName} compare leading brokers and choose the best fit for their trading goals.</p>

<h2>Conclusion</h2>
<p>The best forex broker in ${countryName} will balance safety, cost efficiency, and ease of use.</p>
`;
    case "low-spread":
      return `
<h2>Low Spread Forex Brokers in ${countryName}</h2>
<p>Low spread brokers matter most for scalpers, day traders, and anyone trying to reduce transaction costs.</p>

<h2>Why Spreads Matter</h2>
<p>Tighter spreads can improve execution efficiency, especially if you trade frequently or use short-term strategies.</p>

<h2>What to Compare</h2>
<p>Check raw spreads, commission structure, execution quality, and platform reliability before choosing a broker.</p>

<h2>Conclusion</h2>
<p>The right low spread broker in ${countryName} should combine pricing efficiency with strong execution and trust.</p>
`;
    case "high-leverage":
      return `
<h2>High Leverage Forex Brokers in ${countryName}</h2>
<p>High leverage can increase market exposure, but it also increases risk significantly.</p>

<h2>Important Risk Notes</h2>
<p>Before using leverage, traders should understand margin requirements, stop-loss discipline, and position sizing.</p>

<h2>How to Compare Brokers</h2>
<p>Look at leverage limits, margin call policy, available instruments, and execution conditions.</p>

<h2>Conclusion</h2>
<p>The best high leverage broker in ${countryName} is one that offers flexibility without compromising reliability.</p>
`;
    case "guide":
      return `
<h2>How to Trade Forex in ${countryName}</h2>
<p>Forex trading starts with learning the market, choosing a broker, opening an account, and using clear risk management.</p>

<h2>Step-by-Step Basics</h2>
<p>Start with a demo account, understand currency pairs, learn lot sizing, and practice with a structured trading plan.</p>

<h2>Choosing a Broker</h2>
<p>In ${countryName}, compare brokers based on withdrawals, platform quality, support, spreads, and trading tools.</p>

<h2>Conclusion</h2>
<p>Successful forex trading in ${countryName} depends on discipline, education, and choosing the right broker.</p>
`;
    case "beginner":
      return `
<h2>Forex Brokers for Beginners in ${countryName}</h2>
<p>Beginner traders need simple platforms, educational tools, low minimum deposits, and reliable support.</p>

<h2>What Beginners Should Prioritize</h2>
<p>Look for easy onboarding, clear account types, low trading friction, and good learning materials.</p>

<h2>How to Start Safely</h2>
<p>Use a demo account first and focus on learning risk management before increasing position size.</p>

<h2>Conclusion</h2>
<p>The best beginner broker in ${countryName} is one that helps you learn while keeping trading simple.</p>
`;
    case "apps":
      return `
<h2>Best Forex Trading Apps in ${countryName}</h2>
<p>Mobile trading apps are important for monitoring positions, charting, and executing trades on the go.</p>

<h2>What Makes a Good App</h2>
<p>Good apps offer stable execution, clear charting, fast login, and smooth account management.</p>

<h2>How to Compare</h2>
<p>Review app reliability, order speed, chart tools, and mobile usability before choosing a broker.</p>

<h2>Conclusion</h2>
<p>The best forex trading app in ${countryName} should make trading easier without sacrificing control.</p>
`;
    default:
      return `
<h2>Forex Trading in ${countryName}</h2>
<p>This page provides educational forex content tailored for traders in ${countryName}.</p>
`;
  }
}

/* =========================================================
   🔥 SINGLE PROGRAMMATIC POST
========================================================= */

export function generateProgrammaticPost(
  slug: string
): ProgrammaticPost | null {
  const meta = getKeywordMeta(slug);

  if (!meta) return null;

  const country = getBlogCountryBySlug(meta.country);
  const countryName = country?.name || titleCaseCountry(meta.country);

  const rawContent = buildContent(meta.type, countryName);
  const contentWithLinks = injectInternalLinks(rawContent, meta.country, slug);
  const contentWithBrokers = injectBrokerCards(
    contentWithLinks,
    slug,
    meta.country
  );
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