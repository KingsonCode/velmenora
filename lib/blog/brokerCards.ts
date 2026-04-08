type Broker = {
    name: string;
    slug: string;
    rating: number;
    features: string[];
    affiliateLink: string;

    tags: string[]; // 🔥 muhimu kwa matching
    priority?: string[]; // 🔥 geo targeting
};

/* ================= BROKER DATABASE ================= */

const BROKERS: Broker[] = [
    {
        name: "Exness",
        slug: "exness",
        rating: 4.9,
        features: ["Instant withdrawals", "Low spreads", "High leverage"],
        affiliateLink: "/go/exness",
        tags: ["best", "low-spread", "high-leverage"],
        priority: ["tanzania", "kenya"],
    },
    {
        name: "XM",
        slug: "xm",
        rating: 4.7,
        features: ["Beginner friendly", "Bonuses", "MT4/MT5"],
        affiliateLink: "/go/xm",
        tags: ["best", "beginner"],
    },
    {
        name: "Deriv",
        slug: "deriv",
        rating: 4.6,
        features: ["Synthetic indices", "Flexible trading", "Low deposit"],
        affiliateLink: "/go/deriv",
        tags: ["best", "synthetic"],
    },
];

/* ================= DETECT PAGE INTENT ================= */

function detectIntent(slug: string): string {
    if (slug.includes("best-brokers")) return "best";
    if (slug.includes("low-spread")) return "low-spread";
    if (slug.includes("high-leverage")) return "high-leverage";
    if (slug.includes("how-to-trade")) return "guide";
    return "general";
}

/* ================= SMART BROKER SELECTOR ================= */

function selectBrokers(slug: string, country: string): Broker[] {
    const intent = detectIntent(slug);

    let filtered = BROKERS.filter((b) =>
        b.tags.includes(intent)
    );

    // fallback kama hakuna match
    if (filtered.length === 0) filtered = BROKERS;

    /* 🔥 GEO PRIORITY BOOST */
    filtered = filtered.sort((a, b) => {
        const aPriority = a.priority?.includes(country) ? 1 : 0;
        const bPriority = b.priority?.includes(country) ? 1 : 0;
        return bPriority - aPriority;
    });

    return filtered.slice(0, 3); // max 3 cards
}

/* ================= CARD TEMPLATE ================= */

function renderBrokerCard(
    broker: Broker,
    slug: string
): string {
    return `
    <div class="broker-card" style="border:1px solid #ddd;padding:16px;border-radius:12px;margin:20px 0;">
      
      <h3>${broker.name} ⭐ ${broker.rating}</h3>

      <ul>
        ${broker.features.map((f) => `<li>${f}</li>`).join("")}
      </ul>

      <a 
        href="${broker.affiliateLink}?src=blog&slug=${slug}&broker=${broker.slug}"
        data-track="broker-click"
        style="display:inline-block;margin-top:10px;padding:10px 15px;background:#007bff;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;"
      >
        Start Trading →
      </a>
    </div>
  `;
}

/* ================= MAIN INJECTION ================= */

export function injectBrokerCards(
    content: string,
    slug: string,
    country: string
): string {
    if (!content) return content;

    const brokers = selectBrokers(slug, country);

    const cardsHTML = `
    <div class="broker-cards">
      ${brokers.map((b) => renderBrokerCard(b, slug)).join("")}
    </div>
  `;

    let updated = content;

    /* 🎯 AFTER FIRST H2 */
    const firstH2Index = updated.indexOf("</h2>");
    if (firstH2Index !== -1) {
        updated =
            updated.slice(0, firstH2Index + 5) +
            cardsHTML +
            updated.slice(firstH2Index + 5);
    }

    /* 🎯 BEFORE CONCLUSION */
    updated = updated.replace(
        /<h2>Conclusion<\/h2>/i,
        `
    ${cardsHTML}
    <h2>Conclusion</h2>
    `
    );

    return updated;
}