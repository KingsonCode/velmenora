type Broker = {
    name: string;
    slug: string;
    rating: number;
    features: string[];
    affiliateLink: string;
    tags: string[];
    priority?: string[];
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
        priority: ["tanzania", "kenya", "uganda", "ghana", "nigeria"],
    },
    {
        name: "XM",
        slug: "xm",
        rating: 4.7,
        features: ["Beginner friendly", "Bonuses", "MT4/MT5"],
        affiliateLink: "/go/xm",
        tags: ["best", "beginner", "guide"],
        priority: ["kenya", "nigeria", "ghana"],
    },
    {
        name: "Deriv",
        slug: "deriv",
        rating: 4.6,
        features: ["Synthetic indices", "Flexible trading", "Low deposit"],
        affiliateLink: "/go/deriv",
        tags: ["best", "guide"],
        priority: ["tanzania", "kenya", "uganda"],
    },
];

/* ================= DETECT PAGE INTENT ================= */

function detectIntent(slug: string): string {
    if (slug.includes("best-brokers")) return "best";
    if (slug.includes("low-spread")) return "low-spread";
    if (slug.includes("high-leverage")) return "high-leverage";

    if (
        slug.includes("how-to-trade") ||
        slug.includes("forex-trading-guide")
    ) {
        return "guide";
    }

    if (slug.includes("beginners")) return "beginner";

    return "best";
}

/* ================= SMART BROKER SELECTOR ================= */

function selectBrokers(slug: string, country: string): Broker[] {
    const intent = detectIntent(slug);

    let filtered = BROKERS.filter((broker) =>
        broker.tags.includes(intent)
    );

    if (filtered.length === 0) {
        filtered = BROKERS.filter((broker) =>
            broker.tags.includes("best")
        );
    }

    filtered = filtered.sort((a, b) => {
        const aPriority = a.priority?.includes(country) ? 1 : 0;
        const bPriority = b.priority?.includes(country) ? 1 : 0;

        if (aPriority !== bPriority) {
            return bPriority - aPriority;
        }

        return b.rating - a.rating;
    });

    return filtered.slice(0, 3);
}

/* ================= CARD TEMPLATE ================= */

function renderBrokerCard(broker: Broker, slug: string): string {
    return `
    <div style="border:1px solid rgba(255,255,255,0.10); background:rgba(255,255,255,0.03); padding:20px; border-radius:20px; margin:20px 0;">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:12px;">
            <h3 style="margin:0; font-size:22px; color:white;">
                ${broker.name}
            </h3>

            <span style="display:inline-block; padding:6px 12px; border-radius:999px; background:rgba(250,204,21,0.12); color:#fde68a; font-size:14px; font-weight:600;">
                ⭐ ${broker.rating}
            </span>
        </div>

        <ul style="margin:0 0 16px 18px; padding:0; color:#cbd5e1; line-height:1.8;">
            ${broker.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>

        <a
            href="${broker.affiliateLink}?src=blog&slug=${slug}&broker=${broker.slug}"
            data-track="broker-click"
            style="display:inline-block; padding:12px 18px; background:#facc15; color:#000; border-radius:12px; text-decoration:none; font-weight:700;"
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

    if (brokers.length === 0) return content;

    const cardsHTML = `
    <section style="margin:32px 0;">
        <div style="margin-bottom:16px;">
            <h2 style="color:white; font-size:28px; margin-bottom:8px;">
                Recommended Brokers
            </h2>
            <p style="color:#94a3b8; margin:0;">
                These brokers match this guide’s trading intent and market focus.
            </p>
        </div>

        <div>
            ${brokers.map((broker) => renderBrokerCard(broker, slug)).join("")}
        </div>
    </section>
    `;

    let updated = content;

    const firstH2Index = updated.indexOf("</h2>");
    if (firstH2Index !== -1) {
        updated =
            updated.slice(0, firstH2Index + 5) +
            cardsHTML +
            updated.slice(firstH2Index + 5);
    }

    updated = updated.replace(
        /<h2>Conclusion<\/h2>/i,
        `${cardsHTML}<h2>Conclusion</h2>`
    );

    return updated;
}