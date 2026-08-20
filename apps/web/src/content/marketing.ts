import { defineMarketingServices, defineProcessSteps } from "@/content-schema/common";

export const marketingServices = defineMarketingServices([
  {
    slug: "booking-systems",
    label: "Booking systems",
    description: "Let clients request or reserve time without relying on DMs or missed calls.",
    intro:
      "Create one clear path from customer interest to an appointment request, with the right information collected before your team follows up.",
    bestFor:
      "Appointment-led service businesses that have capacity to grow and want a more consistent alternative to scattered calls and messages.",
    outcomes: [
      "Give customers one obvious place to request time.",
      "Reduce booking details scattered across calls and direct messages.",
      "Set expectations before a customer contacts your team.",
      "Create a consistent handoff for confirmation and follow-up.",
    ],
    deliverables: [
      "A mobile-friendly appointment or enquiry flow.",
      "The service, location, and contact details customers need before requesting time.",
      "Business rules and availability agreed for the project scope.",
      "Clear confirmation and next-step messaging.",
    ],
    boundaries: [
      "The exact booking flow is scoped around the way your business actually operates.",
      "If customer payments are included, funds use your approved payment provider and go directly to your business.",
      "Clinical, legal, and other regulated records stay in systems designed for that information.",
    ],
    faqs: [
      {
        question: "Is this a full scheduling platform?",
        answer:
          "It can begin as a focused appointment-request flow or include deeper scheduling features when they are justified and agreed in scope. Required integrations are assessed before the build starts.",
      },
      {
        question: "Can customers pay a deposit?",
        answer:
          "Where the agreed solution supports deposits, the payment connection belongs to your business and customer funds go to your provider rather than through 808.",
      },
      {
        question: "Does this replace WhatsApp?",
        answer:
          "Not necessarily. WhatsApp can remain a contact or confirmation channel while the booking page collects consistent information and gives customers a clearer starting point.",
      },
    ],
    status: "published",
  },
  {
    slug: "local-search-and-maps",
    label: "Local search and maps",
    description: "Help nearby customers find accurate business information when they search locally.",
    intro:
      "Make your location, services, hours, and contact path easier to understand when a nearby customer is deciding where to go next.",
    bestFor:
      "Service businesses that depend on customers finding a location, comparing options, or confirming essential details before making contact.",
    outcomes: [
      "Present consistent business and location information.",
      "Give local visitors a clear next step from discovery to contact.",
      "Reduce uncertainty around hours, service area, and directions.",
      "Connect your website and relevant public listings coherently.",
    ],
    deliverables: [
      "A review of the public business information supplied for the project.",
      "Clear location, service-area, hours, and contact presentation on your site.",
      "Links and structured details that support relevant map and directory profiles.",
      "Guidance for correcting or completing business-controlled listing information.",
    ],
    boundaries: [
      "Search placement and map ranking are controlled by third-party platforms and are never guaranteed.",
      "You approve the business facts before publication and remain responsible for keeping them current.",
      "Verification, moderation, and eligibility decisions remain subject to each platform's rules.",
    ],
    faqs: [
      {
        question: "Can you guarantee that my business ranks first?",
        answer:
          "No. We improve the clarity and consistency of the information you control, but no legitimate provider can guarantee a particular organic or map position.",
      },
      {
        question: "Do I need a physical storefront?",
        answer:
          "Not always. The right setup depends on whether customers visit you, you serve an area, or you operate remotely, as well as the eligibility rules of each listing platform.",
      },
      {
        question: "Will you change my listings without approval?",
        answer:
          "No. Business facts and requested changes are reviewed with you, and access to third-party profiles is handled only within the agreed scope.",
      },
    ],
    status: "published",
  },
  {
    slug: "service-and-pricing-pages",
    label: "Landing and service pages",
    description:
      "Give customers one clear place to understand your business, your services, and what to do next.",
    intro:
      "Turn a scattered list of offers into a clear customer-facing service catalogue, with pricing or quotation language that fits how your business sells.",
    bestFor:
      "Service businesses whose customers repeatedly ask what is offered, what it costs, what is included, or how to begin.",
    outcomes: [
      "Help customers understand and compare services before contacting you.",
      "Reduce repetitive questions about scope, price, and next steps.",
      "Create a consistent source of truth for your current offer.",
      "Guide qualified visitors toward the right contact action.",
    ],
    deliverables: [
      "A structured service catalogue based on business facts you approve.",
      "Fixed-price, starting-price, or request-a-quote presentation as appropriate.",
      "Service-specific explanations, inclusions, and frequently asked questions.",
      "Clear calls to action for booking, enquiry, email, or WhatsApp.",
    ],
    boundaries: [
      "You decide which prices can be published and approve every commercial fact.",
      "Complex quotations remain a conversation rather than being forced into a fixed public price.",
      "Online checkout, subscriptions, or customer portals are separate scope unless explicitly agreed.",
    ],
    faqs: [
      {
        question: "Do I have to publish every price?",
        answer:
          "No. We can use fixed prices, starting prices, ranges, or a request-a-quote path depending on how reliably the service can be priced before consultation.",
      },
      {
        question: "Who supplies the service information?",
        answer:
          "You supply and approve the business facts. We structure them into a clear page and identify gaps or questions that would otherwise confuse a customer.",
      },
      {
        question: "Can the catalogue change later?",
        answer:
          "Yes. The update and support path is agreed with you so that published services and prices do not silently become outdated.",
      },
    ],
    status: "published",
  },
]);

export const publishedServices = marketingServices.filter(
  (service) => service.status === "published",
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
