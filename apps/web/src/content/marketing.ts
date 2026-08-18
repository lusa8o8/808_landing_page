import { defineMarketingServices, defineProcessSteps } from "@/content-schema/common";

export const marketingServices = defineMarketingServices([
  {
    slug: "booking-systems",
    label: "Booking systems",
    description: "Let clients request or reserve time without relying on DMs or missed calls.",
    status: "draft",
  },
  {
    slug: "local-search-and-maps",
    label: "Local search and maps",
    description: "Help nearby customers find accurate business information when they search locally.",
    status: "draft",
  },
  {
    slug: "service-and-pricing-pages",
    label: "Service and pricing pages",
    description: "Present what you offer, what it costs, and the next step in one clear place.",
    status: "draft",
  },
]);

export const audienceLabels = [
  "Clinics",
  "Professional services",
  "Guesthouses",
  "Salons and barbershops",
  "Schools",
  "Franchises",
] as const;

export const processSteps = defineProcessSteps([
  {
    number: "01",
    heading: "We run the numbers with you",
    body: "You tell us about your business. We calculate whether building a system makes financial sense before anything else.",
  },
  {
    number: "02",
    heading: "We build your system",
    body: "We turn approved business facts into a clear, practical system built around how your customers find and contact you.",
  },
  {
    number: "03",
    heading: "You launch with clear terms",
    body: "Your business content and domain remain yours. Any ongoing platform service, support, or handover is documented before you approve it.",
  },
]);
