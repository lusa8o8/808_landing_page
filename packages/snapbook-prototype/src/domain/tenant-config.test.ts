import assert from "node:assert/strict";
import test from "node:test";

import { tenantFixtures } from "./fixtures.ts";
import { defineTenantFixture, type SnapbookTenant } from "./tenant-config.ts";

function mutableFixture(): SnapbookTenant {
  return structuredClone(tenantFixtures[0]) as SnapbookTenant;
}

test("reviewed fixtures are deeply frozen and have distinct slugs", () => {
  assert.equal(tenantFixtures.length, 2);
  assert.equal(new Set(tenantFixtures.map((tenant) => tenant.slug)).size, tenantFixtures.length);
  assert.ok(Object.isFrozen(tenantFixtures[0]));
  assert.ok(Object.isFrozen(tenantFixtures[0]?.services));
  assert.ok(Object.isFrozen(tenantFixtures[0]?.services[0]?.price));
  assert.ok(Object.isFrozen(tenantFixtures[0]?.providers[0]?.serviceIds));
});

test("rejects duplicate service identifiers", () => {
  const fixture = mutableFixture();
  fixture.services = [...fixture.services, structuredClone(fixture.services[0]!)];
  assert.throws(() => defineTenantFixture(fixture), /duplicate id/);
});

test("rejects a provider referencing an unknown service", () => {
  const fixture = mutableFixture();
  fixture.providers = [{ ...fixture.providers[0]!, serviceIds: ["missing-service"] }];
  assert.throws(() => defineTenantFixture(fixture), /references unknown service/);
});

test("rejects invalid theme values", () => {
  const fixture = mutableFixture();
  fixture.theme = { ...fixture.theme, accent: "forest" };
  assert.throws(() => defineTenantFixture(fixture), /six-digit hex colour/);
});

test("rejects an unknown upcoming slot", () => {
  const fixture = mutableFixture();
  fixture.upcoming = { ...fixture.upcoming, slotId: "missing-slot" };
  assert.throws(() => defineTenantFixture(fixture), /must reference a suggested or later slot/);
});

test("rejects an upcoming provider that cannot serve the upcoming service", () => {
  const fixture = mutableFixture();
  fixture.upcoming = { ...fixture.upcoming, serviceId: "colour-consult", providerId: "nia" };
  assert.throws(() => defineTenantFixture(fixture), /cannot serve/);
});
