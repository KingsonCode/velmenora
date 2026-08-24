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

test("blog metadata preserves apex canonical and authorship", () => {
  const source = read("app/blog/[slug]/page.tsx");

  assert.match(
    source,
    /https:\/\/velmenora\.com\/blog\//,
  );
  assert.match(source, /Velmenora Research/);
  assert.match(source, /publisher: "Velmenora"/);
  assert.doesNotMatch(
    source,
    /https:\/\/www\.velmenora\.com/,
  );
});

test("manual and programmatic posts expose BlogPosting schema", () => {
  const source = read("app/blog/[slug]/page.tsx");

  assert.match(source, /"@type": "BlogPosting"/);
  assert.match(source, /headline: post\.title/);
  assert.match(source, /datePublished: publishedDate/);
  assert.match(source, /dateModified: publishedDate/);
  assert.match(source, /Velmenora Research/);
  assert.match(source, /mainEntityOfPage/);
});

test("category fallbacks use CollectionPage rather than fake articles", () => {
  const source = read("app/blog/[slug]/page.tsx");

  assert.match(
    source,
    /isCategorySlug\(post\.slug\)/,
  );
  assert.match(source, /"@type": "CollectionPage"/);
});

test("blog template exposes visible and structured breadcrumbs", () => {
  const source = read("app/blog/[slug]/page.tsx");

  assert.match(source, /"@type": "BreadcrumbList"/);
  assert.match(source, /velmenora-blog-structured-data/);
  assert.match(source, /type="application\/ld\+json"/);
  assert.ok(source.includes('href="/"'));
  assert.ok(source.includes('href="/blog"'));
});
