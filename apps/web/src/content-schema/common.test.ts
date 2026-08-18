import assert from "node:assert/strict";
import test from "node:test";

import { defineMarketingServices, defineSiteConfig } from "./common.ts";

test("site configuration rejects non-HTTPS public URLs", () => {
  assert.throws(
    () =>
      defineSiteConfig({
        name: "Example",
        shortName: "Example",
        description: "Example description",
        siteUrl: "http://example.com",
        locale: "en_ZM",
        location: "Lusaka, Zambia",
        email: "hello@example.com",
        whatsappDisplay: "+260 000 000 000",
        whatsappHref: "https://wa.me/260000000000",
        navigation: [],
      }),
    /must use HTTPS/,
  );
});

test("marketing services reject duplicate slugs", () => {
  assert.throws(
    () =>
      defineMarketingServices([
        {
          slug: "booking-systems",
          label: "Booking systems",
          description: "First description",
          status: "draft",
        },
        {
          slug: "booking-systems",
          label: "Another booking service",
          description: "Second description",
          status: "published",
        },
      ]),
    /duplicate slug/,
  );
});
