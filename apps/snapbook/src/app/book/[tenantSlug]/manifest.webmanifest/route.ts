import { getTenantFixture, tenantFixtureParams } from "../../../../domain/fixtures.ts";
import { buildTenantManifest } from "../../../../pwa/tenant-manifest.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return tenantFixtureParams();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tenantSlug: string }> },
) {
  const { tenantSlug } = await params;
  const tenant = getTenantFixture(tenantSlug);

  if (!tenant) return new Response("Not found", { status: 404 });

  return Response.json(buildTenantManifest(tenant), {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/manifest+json",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
