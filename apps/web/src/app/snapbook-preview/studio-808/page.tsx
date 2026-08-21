import type { Metadata } from "next";
import { BookingExperience, getTenantFixture } from "@808/snapbook-prototype";

export const metadata: Metadata = {
  title: "Studio 808 SnapBook preview",
  description: "A fictional, fixture-backed preview of the SnapBook booking journey.",
  robots: { index: false, follow: false },
};

export default function Studio808PreviewPage() {
  const tenant = getTenantFixture("studio-808");

  if (!tenant) {
    throw new Error("The reviewed Studio 808 preview fixture is missing");
  }

  return <BookingExperience mode="embed" showScenarioControls={false} tenant={tenant} />;
}
