const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(
  path.resolve(
    __dirname,
    "../app/[lang]/academy/what-is-forex/page.tsx",
  ),
  "utf8",
);

test("English Academy guide exposes canonical metadata", () => {
  assert.ok(source.includes("generateMetadata"));
  assert.ok(
    source.includes(
      "/en/academy/what-is-forex",
    ),
  );
  assert.ok(source.includes("alternates:"));
  assert.ok(source.includes("openGraph:"));
  assert.ok(source.includes("twitter:"));
  assert.ok(
    source.includes(
      'name: "Velmenora Research"',
    ),
  );
});

test("untranslated Academy routes are protected from duplicate indexing", () => {
  assert.ok(
    source.includes('index: lang === "en"'),
  );
  assert.ok(
    source.includes(
      '"x-default": ACADEMY_CANONICAL',
    ),
  );

  const languagesStart =
    source.indexOf("languages: {");

  const languagesEnd =
    source.indexOf("openGraph:", languagesStart);

  assert.ok(languagesStart !== -1);
  assert.ok(languagesEnd > languagesStart);

  const languagesBlock =
    source.slice(languagesStart, languagesEnd);

  assert.doesNotMatch(
    languagesBlock,
    /\bar\s*:|\bde\s*:|\bfr\s*:/,
  );
});

test("Academy guide exposes LearningResource and FAQ schema", () => {
  assert.ok(
    source.includes('"@type": "LearningResource"'),
  );
  assert.ok(
    source.includes('"@type": "FAQPage"'),
  );
  assert.ok(
    source.includes("mainEntity: faqs.map"),
  );
  assert.ok(
    source.includes(
      'id="velmenora-academy-structured-data"',
    ),
  );
  assert.ok(
    source.includes('type="application/ld+json"'),
  );
});

test("Academy guide exposes structured and visible breadcrumbs", () => {
  assert.ok(
    source.includes('"@type": "BreadcrumbList"'),
  );
  assert.ok(
    source.includes('aria-label="Breadcrumb"'),
  );
  assert.ok(source.includes("Forex Academy"));
  assert.ok(source.includes("What is Forex?"));
});

test("Academy guide preserves financial-risk education", () => {
  assert.ok(
    source.includes(
      "should not be considered financial advice",
    ),
  );
  assert.ok(
    source.includes(
      "Forex trading involves risk",
    ),
  );
  assert.ok(
    source.includes(
      "demo environment",
    ),
  );
  assert.ok(
    source.includes(
      'educationalLevel: "Beginner"',
    ),
  );
});
