import type { SnapbookTenant } from "../domain/tenant-config.ts";

export function buildTenantManifest(tenant: SnapbookTenant) {
  const startUrl = `/book/${tenant.slug}`;

  return {
    id: startUrl,
    name: `${tenant.name} bookings`,
    short_name: tenant.name,
    description: `Fixture-backed SnapBook prototype for ${tenant.name}.`,
    start_url: startUrl,
    scope: "/book/",
    display: "standalone",
    background_color: tenant.theme.surface,
    theme_color: tenant.theme.accent,
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable",
      },
    ],
  } as const;
}
