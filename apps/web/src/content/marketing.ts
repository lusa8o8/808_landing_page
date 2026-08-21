import { defineMarketingServices, defineProcessSteps } from "@/content-schema/common";

export const marketingServices = defineMarketingServices([
  {
    slug: "booking-systems",
    label: "Booking systems",
    description:
      "SnapBook lets customers choose a service and request a time without back-and-forth messages.",
    intro:
      "SnapBook is included with every 808 website. It gives customers one place to choose a service and request a time. If you need deposits, calendar connections or extra booking steps, we agree on those before we build them.",
    bestFor:
      "Businesses that take appointments and want fewer booking details spread across calls and messages.",
    outcomes: [
      "Give customers one place to request an appointment.",
      "Keep the service, time and contact details together.",
      "Tell customers what happens after they send a request.",
      "Make confirmations and follow-up easier for your team.",
    ],
    deliverables: [
      "A booking page that works well on a phone.",
      "The services, locations and contact details customers need before requesting a time.",
      "The booking rules and available times you confirm.",
      "A clear confirmation message that tells the customer what happens next.",
    ],
    boundaries: [
      "Every website includes a standard SnapBook setup. Deposits, calendar connections and custom booking steps need a separate quote.",
      "If customers pay online, the payment account belongs to your business and the money goes directly to that account.",
      "Clinical, legal and other regulated records must stay in software designed for that information.",
    ],
    faqs: [
      {
        question: "Is this a full scheduling platform?",
        answer:
          "SnapBook can start with appointment requests. If your business needs live calendars, staff schedules or connections to other software, we agree on what to add before the build starts.",
      },
      {
        question: "Can customers pay a deposit?",
        answer:
          "Yes, when deposits are included in the agreed build. The payment account belongs to your business, and customer money does not pass through 808.",
      },
      {
        question: "Does this replace WhatsApp?",
        answer:
          "Not necessarily. Customers can start on the booking page and your team can still use WhatsApp for questions, confirmations or follow-up.",
      },
    ],
    status: "published",
  },
  {
    slug: "local-search-and-maps",
    label: "Local search and maps",
    description:
      "Keep your services, hours, location, phone number and website clear when nearby customers search.",
    intro:
      "Help customers see the right services, hours, location, directions and contact details when they find your business online.",
    bestFor:
      "Businesses whose customers check the location, opening hours, services or phone number before visiting or making contact.",
    outcomes: [
      "Show the same important business details wherever customers look.",
      "Give customers a clear way to call, message or visit your website.",
      "Make opening hours, directions and the area you serve easier to understand.",
      "Connect your website to the public profiles your business uses.",
    ],
    deliverables: [
      "A check of the public business information you give us.",
      "Clear hours, location, directions, service area and contact details on your website.",
      "Links between your website and the map or directory profiles your business uses.",
      "Help identifying missing or incorrect details on profiles you control.",
    ],
    boundaries: [
      "Google and other platforms control search placement and map rankings. We cannot guarantee a position.",
      "You confirm your services, hours, location and contact details before they are published and tell us when they change.",
      "Each platform decides whether it will verify, display or restrict a business profile.",
    ],
    faqs: [
      {
        question: "Can you guarantee that my business ranks first?",
        answer:
          "No. We can make the information you control clearer and more consistent, but Google and other platforms decide how search and map results are ordered.",
      },
      {
        question: "Do I need a physical storefront?",
        answer:
          "Not always. It depends on whether customers visit you, you travel to customers or you work remotely. Each platform also has its own rules about which businesses can create a profile.",
      },
      {
        question: "Will you change my listings without approval?",
        answer:
          "No. You confirm the business details and requested changes first. We only access the profiles included in the work you approve.",
      },
    ],
    status: "published",
  },
  {
    slug: "service-and-pricing-pages",
    label: "Landing and service pages",
    description:
      "Put your services, prices or quote process, location and contact details in one easy place.",
    intro:
      "Put your services, prices or quote instructions, location and contact options on one page that is easy to use on a phone.",
    bestFor:
      "Businesses whose customers often ask what is offered, what it costs, what is included or how to get started.",
    outcomes: [
      "Help customers understand and compare services before contacting you.",
      "Answer common questions about prices, what is included and what happens next.",
      "Keep your current services and contact details in one place.",
      "Give customers a clear way to book, call, email or send a message.",
    ],
    deliverables: [
      "A clear list of the services and business details you confirm.",
      "Fixed prices, starting prices or instructions for requesting a quote.",
      "Plain explanations of each service, what is included and common questions.",
      "Clear buttons for booking, calling, emailing or using WhatsApp.",
    ],
    boundaries: [
      "You decide which prices and service details can appear on the website and confirm them before publication.",
      "If a service needs a consultation before it can be priced, the page will tell customers how to request a quote.",
      "Online checkout, subscriptions and customer accounts need a separate quote unless they are already included in the agreed build.",
    ],
    faqs: [
      {
        question: "Do I have to publish every price?",
        answer:
          "No. The page can show a fixed price, a starting price, a range or a button for requesting a quote. You choose what customers should see.",
      },
      {
        question: "Who supplies the service information?",
        answer:
          "You give us the services, prices, hours, location and contact details, then confirm them before publication. We turn that information into a clear page and point out anything a customer may not understand.",
      },
      {
        question: "Can the catalogue change later?",
        answer:
          "Yes. Reasonable corrections to existing business details are included in routine maintenance for the first 365 days. New pages, redesigns, software connections and large feature or content changes need a separate quote.",
      },
    ],
    status: "published",
  },
]);

const publishedServicePriority: Record<string, number> = {
  "service-and-pricing-pages": 0,
  "booking-systems": 1,
  "local-search-and-maps": 2,
};

export const publishedServices = marketingServices
  .filter((service) => service.status === "published")
  .sort(
    (first, second) =>
      (publishedServicePriority[first.slug] ?? Number.MAX_SAFE_INTEGER) -
      (publishedServicePriority[second.slug] ?? Number.MAX_SAFE_INTEGER),
  );

export function getPublishedService(slug: string) {
  return publishedServices.find((service) => service.slug === slug);
}

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
    heading: "We check the numbers",
    body: "Tell us what a customer usually spends and how often they return. We use that to check whether the website is worth the investment.",
  },
  {
    number: "02",
    heading: "We build what your business needs",
    body: "You confirm your services, prices, hours, location and contact details. We turn them into a clear website and booking setup.",
  },
  {
    number: "03",
    heading: "You launch ready for customers",
    body: "Your website goes live with clear ways to call, message or book. Your domain and content remain yours. SnapBook, hosting and routine maintenance are included for the first 365 days at no additional cost.",
  },
]);
