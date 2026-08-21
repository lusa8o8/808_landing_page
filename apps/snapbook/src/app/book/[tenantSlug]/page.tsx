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

  if (!tenant) return {};

  return {
    title: `Book with ${tenant.name} · SnapBook prototype`,
    description: `Fixture-backed booking journey for ${tenant.name}.`,
    manifest: `/book/${tenant.slug}/manifest.webmanifest`,
    robots: { index: false, follow: false },
  };
}

export default async function BookPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const tenant = getTenantFixture(tenantSlug);

  if (!tenant) notFound();

  return <BookingExperience mode="full" tenant={tenant} />;
}
