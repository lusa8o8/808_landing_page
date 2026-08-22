import assert from "node:assert/strict";
import test from "node:test";

import {
  buildOrganizationJsonLd,
  buildRobotsFile,
  buildRobotsMetadata,
  buildSitemap,
  isIndexingEnabled,
  publicRoutePaths,
  serializeJsonLd,
} from "./seo.ts";

const siteUrl = "https://www.eightzeroeight.online";

test("indexing is enabled only by the exact true value", () => {
  assert.equal(isIndexingEnabled("true"), true);
  assert.equal(isIndexingEnabled("TRUE"), false);
  assert.equal(isIndexingEnabled("1"), false);
  assert.equal(isIndexingEnabled("false"), false);
  assert.equal(isIndexingEnabled(undefined), false);
});

test("disabled indexing emits noindex metadata without hiding it from crawlers", () => {
  assert.deepEqual(buildRobotsMetadata(false), {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  });
  assert.deepEqual(buildRobotsFile(siteUrl, false), {
    rules: { userAgent: "*", allow: "/" },
  });
  assert.deepEqual(buildSitemap(siteUrl, false), []);
});

test("enabled indexing advertises only the approved canonical routes", () => {
  const robots = buildRobotsFile(`${siteUrl}/`, true);
  const sitemap = buildSitemap(`${siteUrl}/`, true);

  assert.deepEqual(robots, {
    rules: { userAgent: "*", allow: "/" },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  });
  assert.deepEqual(
    sitemap.map((entry) => entry.url),
    publicRoutePaths.map((path) => `${siteUrl}${path === "/" ? "" : path}`),
  );
  assert.equal(new Set(sitemap.map((entry) => entry.url)).size, publicRoutePaths.length);
});

test("Organization JSON-LD contains only approved public facts", () => {
  const jsonLd = buildOrganizationJsonLd({
    email: "lusa@eightzeroeight.online",
    location: "Lusaka, Zambia",
    name: "Eightzeroeight Digital Systems",
    siteUrl,
    telephone: "0772427296",
  });

  assert.deepEqual(jsonLd, {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Eightzeroeight Digital Systems",
    url: siteUrl,
    email: "lusa@eightzeroeight.online",
    telephone: "0772427296",
    areaServed: { "@type": "City", name: "Lusaka" },
  });
  assert.equal("address" in jsonLd, false);
  assert.equal("review" in jsonLd, false);
  assert.equal("openingHours" in jsonLd, false);
});

test("JSON-LD serialization escapes opening angle brackets", () => {
  assert.equal(serializeJsonLd({ value: "</script>" }), '{"value":"\\u003c/script>"}');
});
