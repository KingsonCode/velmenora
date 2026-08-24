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

const landing = read("app/[lang]/academy/page.tsx");
const foundation = read("app/[lang]/academy/what-is-forex/page.tsx");
const engine = read("app/[lang]/academy/_lib/academy-seo.tsx");
const broker = read("app/[lang]/brokers/[broker]/page.tsx");
const blog = read("app/blog/[slug]/page.tsx");
const indexing = read("lib/seo/indexing.ts");

test("Academy titles bypass duplicate root branding", () => {
  assert.ok(
    landing.includes("title: { absolute: ACADEMY_TITLE }"),
  );
  assert.ok(
    foundation.includes("title: { absolute: ACADEMY_TITLE }"),
  );
});

test("shared guide titles bypass duplicate branding", () => {
  assert.ok(
    engine.includes("title: { absolute: page.title }"),
  );
  assert.ok(
    !engine.includes("return {\n        title: page.title,"),
  );
});

test("blog titles retain one intentional brand suffix", () => {
  assert.ok(blog.includes("${post.title} | Velmenora"));
  assert.ok(blog.includes("title: { absolute: title }"));
  assert.ok(
    blog.includes(
      'absolute: "Blog Post Not Found | Velmenora"',
    ),
  );
});

test("child routes respect Vercel preview indexing safety", () => {
  for (const source of [landing, foundation, engine, broker]) {
    assert.ok(source.includes("IS_INDEXABLE_DEPLOYMENT"));
  }

  assert.ok(
    landing.includes(
      'index: lang === "en" && IS_INDEXABLE_DEPLOYMENT',
    ),
  );
  assert.ok(
    foundation.includes(
      'index: lang === "en" && IS_INDEXABLE_DEPLOYMENT',
    ),
  );
  assert.ok(
    engine.includes(
      'index: lang === "en" && IS_INDEXABLE_DEPLOYMENT',
    ),
  );
  assert.ok(
    broker.includes("index: IS_INDEXABLE_DEPLOYMENT"),
  );
});

test("indexing helper blocks preview and development", () => {
  assert.ok(indexing.includes('NODE_ENV === "production"'));
  assert.ok(indexing.includes('VERCEL_ENV !== "preview"'));
  assert.ok(indexing.includes('VERCEL_ENV !== "development"'));
});
