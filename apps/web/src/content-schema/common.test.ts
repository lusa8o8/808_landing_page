import assert from "node:assert/strict";
import test from "node:test";

import { defineMarketingServices, defineSiteConfig } from "./common.ts";

function serviceFixture(slug: string) {
  return {
    slug,
    label: "Booking systems",
    description: "A service description",
    intro: "A longer introduction",
    bestFor: "Appointment-led service businesses",
    outcomes: ["A clear customer outcome"],
    deliverables: ["A scoped deliverable"],
    boundaries: ["A clear boundary"],
    faqs: [{ question: "A question?", answer: "A direct answer." }],
    status: "published" as const,
  };
}

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
        serviceFixture("booking-systems"),
        { ...serviceFixture("booking-systems"), label: "Another booking service" },
      ]),
    /duplicate slug/,
  );
});

test("marketing services reject incomplete publishable records", () => {
  assert.throws(
    () => defineMarketingServices([{ ...serviceFixture("booking-systems"), outcomes: [] }]),
    /outcomes must contain at least one item/,
  );
});
