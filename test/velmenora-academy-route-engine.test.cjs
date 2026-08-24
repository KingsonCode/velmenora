const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

const engine = fs.readFileSync(
  path.join(
    root,
    "app/[lang]/academy/_lib/academy-seo.tsx",
  ),
  "utf8",
);

const slugs = [
  "forex-for-beginners",
  "how-to-trade-forex",
  "forex-risk-management",
  "forex-demo-account",
];

test("Academy SEO registry contains four distinct guides", () => {
  for (const slug of slugs) {
    assert.ok(
      engine.includes('"' + slug + '": {'),
      slug,
    );
  }

  const registryEnd = engine.indexOf("} as const;");

  assert.ok(registryEnd !== -1);

  const registry = engine.slice(0, registryEnd);

  assert.equal(
    (registry.match(/headline:/g) || []).length,
    4,
  );
});

test("Academy guide metadata is canonical and index safe", () => {
  assert.ok(
    engine.includes(
      'index: lang === "en"',
    ),
  );
  assert.ok(
    engine.includes(
      '"x-default": canonical',
    ),
  );
  assert.ok(
    engine.includes(
      'follow: supportedLanguage',
    ),
  );

  const languagesStart =
    engine.indexOf("languages: {");

  const languagesEnd =
    engine.indexOf(
      "openGraph:",
      languagesStart,
    );

  const languagesBlock =
    engine.slice(
      languagesStart,
      languagesEnd,
    );

  assert.doesNotMatch(
    languagesBlock,
    /\bar\s*:|\bde\s*:|\bfr\s*:/,
  );
});

test("Academy guide engine exposes official social metadata", () => {
  assert.ok(engine.includes("openGraph:"));
  assert.ok(engine.includes("twitter:"));
  assert.ok(
    engine.includes(
      'siteName: "Velmenora"',
    ),
  );
  assert.ok(
    engine.includes(
      'name: "Velmenora Research"',
    ),
  );
});

test("Academy guide engine emits safe educational schema", () => {
  assert.ok(
    engine.includes(
      '"@type": "LearningResource"',
    ),
  );
  assert.ok(
    engine.includes(
      '"@type": "BreadcrumbList"',
    ),
  );
  assert.ok(
    engine.includes(
      'educationalLevel: "Beginner"',
    ),
  );
  assert.ok(!engine.includes("AggregateRating"));
  assert.ok(!engine.includes("ratingCount"));
});

test("each Academy guide route is wired to the shared engine", () => {
  for (const slug of slugs) {
    const file = path.join(
      root,
      "app/[lang]/academy",
      slug,
      "layout.tsx",
    );

    const layout =
      fs.readFileSync(file, "utf8");

    assert.ok(
      layout.includes(
        'buildAcademyMetadata',
      ),
      slug,
    );

    assert.ok(
      layout.includes(
        'slug="' + slug + '"',
      ),
      slug,
    );
  }
});
