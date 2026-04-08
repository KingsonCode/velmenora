type GeneratedPost = {
    slug: string;
    title: string;
    description: string;
    country?: string;
    content: string;
};

/* ================= HELPERS ================= */

/* Extract country kutoka slug */
function extractCountry(slug: string): string {
    const parts = slug.split("-in-");
    return parts[1] || "global";
}

/* Format title */
function formatTitle(slug: string): string {
    return slug
        .replace(/-/g, " ")
        .replace(/\bin\b/, "in")
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

/* Detect type */
function detectType(slug: string): string {
    if (slug.includes("best-brokers")) return "best";
    if (slug.includes("low-spread")) return "low-spread";
    if (slug.includes("high-leverage")) return "high-leverage";
    if (slug.includes("how-to-trade")) return "guide";
    if (slug.includes("trading-guide")) return "guide";
    return "general";
}

/* ================= MAIN ENGINE ================= */

export function generateProgrammaticPost(slug: string): GeneratedPost | null {
    if (!slug) return null;

    const country = extractCountry(slug);
    const title = formatTitle(slug);
    const type = detectType(slug);

    let intro = "";
    let body = "";

    /* ================= CONTENT VARIANTS ================= */

    if (type === "best") {
        intro = `Looking for the best forex brokers in ${country}? In this guide, we compare top platforms based on spreads, withdrawals, and reliability.`;

        body = `
      <h2>Top Forex Brokers in ${country}</h2>
      <ul>
        <li><strong>Exness</strong> – Instant withdrawals & ultra-low spreads</li>
        <li><strong>XM</strong> – Best for beginners & bonuses</li>
        <li><strong>Deriv</strong> – Flexible trading & synthetic indices</li>
      </ul>

      <p>These brokers are popular among traders in ${country} due to reliability and fast execution.</p>
    `;
    }

    else if (type === "low-spread") {
        intro = `Finding low spread forex brokers in ${country} is essential for reducing trading costs.`;

        body = `
      <h2>Lowest Spread Brokers</h2>
      <p>Top brokers offer spreads starting from 0.0 pips, making them ideal for scalping and high-frequency trading.</p>
    `;
    }

    else if (type === "high-leverage") {
        intro = `High leverage forex brokers in ${country} allow traders to control larger positions with small capital.`;

        body = `
      <h2>High Leverage Brokers</h2>
      <p>Some brokers offer leverage up to 1:2000, giving traders more flexibility in capital management.</p>
    `;
    }

    else if (type === "guide") {
        intro = `This beginner-friendly guide explains how to start forex trading in ${country}.`;

        body = `
      <h2>Step-by-Step Guide</h2>
      <ol>
        <li>Choose a regulated broker</li>
        <li>Open a trading account</li>
        <li>Deposit funds securely</li>
        <li>Start trading with a strategy</li>
      </ol>
    `;
    }

    else {
        intro = `Learn about forex trading opportunities in ${country}.`;

        body = `
      <p>Discover brokers, strategies, and practical tips to succeed in forex trading.</p>
    `;
    }

    /* ================= FINAL CONTENT ================= */

    const content = `
    <h1>${title}</h1>

    <p>${intro}</p>

    ${body}

    <!-- 🔥 INTERNAL LINKS CLUSTER -->
    <h2>Related Guides</h2>
    <ul>
      <li>
        <a href="/blog/best-brokers-in-${country}">
          Best Forex Brokers in ${country}
        </a>
      </li>
      <li>
        <a href="/blog/low-spread-brokers-in-${country}">
          Low Spread Brokers in ${country}
        </a>
      </li>
      <li>
        <a href="/blog/high-leverage-brokers-in-${country}">
          High Leverage Brokers in ${country}
        </a>
      </li>
      <li>
        <a href="/blog/how-to-trade-forex-in-${country}">
          How to Trade Forex in ${country}
        </a>
      </li>
    </ul>

    <!-- 🔥 EDUCATIONAL SECTION -->
    <h2>How to Choose a Forex Broker</h2>
    <ul>
      <li>Regulation & safety</li>
      <li>Spreads & commissions</li>
      <li>Deposit & withdrawal speed</li>
      <li>Trading platforms (MT4, MT5)</li>
    </ul>

    <!-- 🔥 CTA (HIGH CONVERSION) -->
    <div style="margin:25px 0;padding:20px;border:1px solid #ddd;border-radius:12px;background:#f9f9f9;">
      <strong>🚀 Ready to start trading?</strong><br/><br/>
      Compare trusted brokers available in ${country} and choose the best platform for your strategy.<br/><br/>
      <a href="/compare" style="color:blue;font-weight:bold;">
        Compare Forex Brokers →
      </a>
    </div>

    <!-- 🔥 CONCLUSION -->
    <h2>Conclusion</h2>
    <p>
      Choosing the right forex broker in ${country} is crucial for long-term success.
      Focus on safety, trading conditions, and withdrawal reliability before making your decision.
    </p>
  `;

    return {
        slug,
        title,
        description: `Complete guide to ${title}. Compare forex brokers in ${country} and start trading today.`,
        country,
        content,
    };
}