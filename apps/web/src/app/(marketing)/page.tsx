import { LandingPage } from "@/components/landing-page";
import { siteConfig } from "@/content/site";
import { buildOrganizationJsonLd, serializeJsonLd } from "@/lib/seo";

export default function HomePage() {
  const organizationJsonLd = buildOrganizationJsonLd({
    name: siteConfig.name,
    siteUrl: siteConfig.siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.whatsappDisplay,
    location: siteConfig.location,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
      />
      <LandingPage />
    </>
  );
}
