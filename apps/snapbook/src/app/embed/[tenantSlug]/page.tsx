import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingExperience } from "../../../components/booking-experience.tsx";
import { getTenantFixture, tenantFixtureParams } from "../../../domain/fixtures.ts";

export const dynamicParams = false;

export function generateStaticParams() {
  return tenantFixtureParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}): Promise<Metadata> {
  const { tenantSlug } = await params;
  const tenant = getTenantFixture(tenantSlug);

  return {
    title: tenant ? `${tenant.name} booking embed · Prototype` : "SnapBook fixture",
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const tenant = getTenantFixture(tenantSlug);

  if (!tenant) notFound();

  return <BookingExperience mode="embed" tenant={tenant} />;
}
