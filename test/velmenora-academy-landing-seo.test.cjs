const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(
  path.join(root, "app/[lang]/academy/page.tsx"),
  "utf8",
);

test("Academy landing has canonical and index-safe metadata", () => {
  assert.match(source, /export async function generateMetadata/);
  assert.match(source, /canonical: ACADEMY_CANONICAL/);
  assert.match(source, /index: lang === "en" && IS_INDEXABLE_DEPLOYMENT/);
  assert.match(source, /follow: IS_INDEXABLE_DEPLOYMENT/);
});

test("Academy landing exposes official social metadata", () => {
  assert.match(source, /openGraph:/);
  assert.match(source, /twitter:/);
  assert.match(source, /siteName: "Velmenora"/);
  assert.match(source, /summary_large_image/);
});

test("Academy landing emits collection and discovery schema", () => {
  assert.match(source, /"@type": "CollectionPage"/);
  assert.match(source, /"@type": "ItemList"/);
  assert.match(source, /"@type": "BreadcrumbList"/);
  assert.match(source, /academyGuides\.map\(\(guide, index\)/);
  assert.match(source, /velmenora-academy-landing-structured-data/);
});

test("only the English Academy landing emits indexable schema", () => {
  assert.match(source, /lang === "en" \? \(/);
  assert.doesNotMatch(source, /languages:/);
});

test("Academy landing preserves a visible financial-risk notice", () => {
  assert.match(source, /Academy education disclaimer/);
  assert.match(source, /should not be considered financial advice/);
  assert.match(source, /Forex trading[\s\S]*substantial risk/);
});
