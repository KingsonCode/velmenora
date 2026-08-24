const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(
    path.join(root, relativePath),
    "utf8",
  );
}

test("homepage has apex canonical and social metadata", () => {
  const page = read("app/page.tsx");

  assert.match(
    page,
    /canonical: "https:\/\/velmenora\.com\/"/,
  );
  assert.match(
    page,
    /Compare Forex Brokers & Trading Platforms/,
  );
  assert.match(
    page,
    /url: "https:\/\/velmenora\.com\/"/,
  );
});

test("sitewide layout emits Organization and WebSite schema", () => {
  const layout = read("app/layout.tsx");
  const schema = read(
    "components/seo/VelmenoraSitewideJsonLd.tsx",
  );

  assert.match(layout, /VelmenoraSitewideJsonLd/);
  assert.match(schema, /"@type": "Organization"/);
  assert.match(schema, /"@type": "WebSite"/);
  assert.match(schema, /SearchAction/);
  assert.match(schema, /application\/ld\+json/);
  assert.match(
    schema,
    /https:\/\/velmenora\.com/,
  );
});

test("preview deployments are not indexable", () => {
  const layout = read("app/layout.tsx");
  const robots = read("app/robots.ts");

  assert.match(layout, /VERCEL_ENV !== "preview"/);
  assert.match(
    layout,
    /index: IS_INDEXABLE_DEPLOYMENT/,
  );
  assert.match(
    layout,
    /follow: IS_INDEXABLE_DEPLOYMENT/,
  );

  assert.match(
    robots,
    /const isProductionDeployment/,
  );
  assert.match(
    robots,
    /VERCEL_ENV !== "preview"/,
  );
  assert.match(
    robots,
    /if \(!isProductionDeployment\)/,
  );
});

test("legacy www canonical authority remains absent", () => {
  for (const relativePath of [
    "app/layout.tsx",
    "app/page.tsx",
    "app/robots.ts",
    "app/sitemap.ts",
    "lib/seo.ts",
    "lib/schemaEngine.ts",
    "lib/seo/metadataEngine.ts",
  ]) {
    assert.doesNotMatch(
      read(relativePath),
      /https:\/\/www\.velmenora\.com/,
      relativePath,
    );
  }
});
