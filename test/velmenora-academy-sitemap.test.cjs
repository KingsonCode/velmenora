const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const robots = read("app/robots.ts");
const rootSitemap = read("app/sitemap.ts");
const sitemap = read("app/academy/sitemap.ts");

const expectedPaths = [
  "/en/academy",
  "/en/academy/what-is-forex",
  "/en/academy/forex-for-beginners",
  "/en/academy/forex-demo-account",
  "/en/academy/forex-risk-management",
  "/en/academy/how-to-trade-forex",
];

test("robots advertises the dedicated Academy sitemap", () => {
  assert.ok(
    robots.includes("`${BASE_URL}/academy/sitemap.xml`"),
  );
});

test("Academy sitemap contains exactly six English URLs", () => {
  for (const routePath of expectedPaths) {
    assert.ok(sitemap.includes(`"${routePath}"`));
  }

  assert.equal(
    (sitemap.match(/"\/en\/academy/g) || []).length,
    6,
  );
});

test("Academy sitemap excludes untranslated duplicate routes", () => {
  for (const lang of ["ar", "de", "fr"]) {
    assert.ok(!sitemap.includes(`"/${lang}/academy`));
  }
});

test("root sitemap no longer exposes the invalid unlocalized Academy URL", () => {
  assert.ok(
    !rootSitemap.includes('`${BASE_URL}/academy`'),
  );
});

test("Academy sitemap avoids fabricated last-modified timestamps", () => {
  assert.match(sitemap, /ACADEMY_PATHS\.map/);
  assert.doesNotMatch(sitemap, /lastModified: new Date/);
  assert.match(sitemap, /priority: index === 0 \? 0\.9 : 0\.8/);
});
