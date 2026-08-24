const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(
  path.resolve(
    __dirname,
    "../app/[lang]/brokers/[broker]/page.tsx",
  ),
  "utf8",
);

test("broker pages expose canonical and multilingual alternates", () => {
  assert.ok(source.includes("alternates:"));
  assert.ok(source.includes("canonical,"));
  assert.ok(source.includes("buildLanguageAlternates"));
  assert.ok(source.includes('"x-default"'));
  assert.ok(
    source.includes(
      '["en", "ar", "de", "fr"] as const',
    ),
  );
});

test("broker pages expose official social preview metadata", () => {
  assert.ok(source.includes("openGraph:"));
  assert.ok(source.includes("twitter:"));
  assert.ok(source.includes('siteName: "Velmenora"'));
  assert.ok(source.includes('card: "summary_large_image"'));
});

test("broker pages expose safe WebPage and breadcrumb schema", () => {
  assert.ok(source.includes('"@type": "WebPage"'));
  assert.ok(source.includes('"@type": "BreadcrumbList"'));
  assert.ok(
    source.includes(
      'id="velmenora-broker-structured-data"',
    ),
  );
  assert.ok(
    source.includes('type="application/ld+json"'),
  );
});

test("broker schema does not publish fabricated aggregate ratings", () => {
  assert.ok(!source.includes("AggregateRating"));
  assert.ok(!source.includes("ratingCount"));
  assert.ok(!source.includes("buildReviewSchema"));
});

test("broker pages expose visible navigation and financial disclosure", () => {
  assert.ok(source.includes('aria-label="Breadcrumb"'));
  assert.ok(source.includes('href="/brokers"'));
  assert.ok(
    source.includes(
      'aria-label="Broker review disclosure"',
    ),
  );
  assert.ok(
    source.includes(
      "Verify regulation, fees, platform terms",
    ),
  );
  assert.ok(
    !source.includes(
      "most trusted forex brokers globally",
    ),
  );
});
