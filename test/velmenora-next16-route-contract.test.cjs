const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const country = read(
  "app/blog/best-brokers-in-[country]/page.tsx",
);

const news = read(
  "app/news/[slug]/page.tsx",
);

test("country metadata awaits Next 16 route params", () => {
  assert.match(country, /params: Promise<\{ country: string \}>/);
  assert.match(country, /const \{ country: countrySlug \} = await params/);
  assert.match(country, /getCountryBySlug\(countrySlug\)/);
});

test("country page is asynchronous under Next 16", () => {
  assert.match(country, /export default async function Page/);
  assert.equal(
    (country.match(/params: Promise<\{ country: string \}>/g) || []).length,
    2,
  );
});

test("news metadata awaits Next 16 route params", () => {
  assert.match(news, /params: Promise<\{ slug: string \}>/);
  assert.match(news, /const \{ slug \} = await params/);
  assert.match(news, /getNews\(slug\)/);
});

test("news page uses the asynchronous params contract", () => {
  assert.equal(
    (news.match(/params: Promise<\{ slug: string \}>/g) || []).length,
    2,
  );
  assert.equal(
    (news.match(/const \{ slug \} = await params/g) || []).length,
    2,
  );
});

test("route sources contain no synchronous inline params contracts", () => {
  const routeNames = new Set(["page.ts", "page.tsx", "layout.ts", "layout.tsx", "route.ts", "route.tsx"]);
  const violations = [];

  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }

      if (!routeNames.has(entry.name)) continue;

      const source = fs.readFileSync(absolute, "utf8");

      if (/params\s*:\s*\{[\s\S]{0,300}?\}/.test(source)) {
        violations.push(path.relative(root, absolute));
      }
    }
  }

  walk(path.join(root, "app"));
  assert.deepEqual(violations, []);
});
