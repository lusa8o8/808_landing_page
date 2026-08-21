import { defineSiteConfig } from "@/content-schema/common";

export const siteConfig = defineSiteConfig({
  name: "Eightzeroeight Digital Systems",
  shortName: "808 Digital Systems",
  description:
    "Clear websites with included SnapBook booking for service businesses in Lusaka, Zambia.",
  siteUrl: "https://www.eightzeroeight.online",
  locale: "en_ZM",
  location: "Lusaka, Zambia",
  email: "lusa@eightzeroeight.online",
  whatsappDisplay: "+260 969 538 047",
  whatsappHref: "https://wa.me/260969538047",
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Calculator", href: "/calculator" },
    { label: "Contact", href: "/#contact" },
  ],
});
