import assert from "node:assert/strict";
import test from "node:test";

import { tenantFixtures } from "../domain/fixtures.ts";
import { buildTenantManifest } from "./tenant-manifest.ts";

test("each tenant has a stable distinct install identity within the booking scope", () => {
  const manifests = tenantFixtures.map(buildTenantManifest);

  assert.equal(new Set(manifests.map((manifest) => manifest.id)).size, tenantFixtures.length);
  for (const [index, tenant] of tenantFixtures.entries()) {
    const manifest = manifests[index]!;
    assert.equal(manifest.id, `/book/${tenant.slug}`);
    assert.equal(manifest.start_url, `/book/${tenant.slug}`);
    assert.equal(manifest.scope, "/book/");
    assert.ok(manifest.start_url.startsWith(manifest.scope));
    assert.equal(manifest.theme_color, tenant.theme.accent);
    assert.equal(manifest.background_color, tenant.theme.surface);
    assert.equal(manifest.icons[0]?.src, "/icon.svg");
  }
});
