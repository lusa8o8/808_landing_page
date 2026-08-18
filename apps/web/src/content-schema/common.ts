export type PublicationStatus = "draft" | "published";

export interface NavigationItem {
  href: string;
  label: string;
}

export interface SiteConfig {
  description: string;
  email: string;
  locale: string;
  location: string;
  name: string;
  navigation: readonly NavigationItem[];
  shortName: string;
  siteUrl: string;
  whatsappDisplay: string;
  whatsappHref: string;
}

export interface MarketingService {
  bestFor: string;
  boundaries: readonly string[];
  description: string;
  deliverables: readonly string[];
  faqs: readonly ServiceFaq[];
  intro: string;
  label: string;
  outcomes: readonly string[];
  slug: string;
  status: PublicationStatus;
}

export interface ServiceFaq {
  answer: string;
  question: string;
}

export interface ProcessStep {
  body: string;
  heading: string;
  number: string;
}

function assertNonEmptyString(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${field} must not be empty`);
  }
}

function assertAbsoluteUrl(value: string, field: string): void {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${field} must be an absolute URL`);
  }

  if (url.protocol !== "https:") {
    throw new Error(`${field} must use HTTPS`);
  }
}

function assertInternalHref(value: string, field: string): void {
  if (!value.startsWith("/")) {
    throw new Error(`${field} must be an internal path`);
  }
}

function assertSlug(value: string, field: string): void {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${field} must be a lowercase URL slug`);
  }
}

function assertNonEmptyStringList(values: readonly string[], field: string): void {
  if (values.length === 0) {
    throw new Error(`${field} must contain at least one item`);
  }

  for (const [index, value] of values.entries()) {
    assertNonEmptyString(value, `${field}[${index}]`);
  }
}

export function defineSiteConfig(config: SiteConfig): Readonly<SiteConfig> {
  assertNonEmptyString(config.name, "site.name");
  assertNonEmptyString(config.shortName, "site.shortName");
  assertNonEmptyString(config.description, "site.description");
  assertNonEmptyString(config.location, "site.location");
  assertNonEmptyString(config.locale, "site.locale");
  assertAbsoluteUrl(config.siteUrl, "site.siteUrl");
  assertAbsoluteUrl(config.whatsappHref, "site.whatsappHref");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    throw new Error("site.email must be a valid public email address");
  }

  const navigationLabels = new Set<string>();

  for (const [index, item] of config.navigation.entries()) {
    assertNonEmptyString(item.label, `site.navigation[${index}].label`);
    assertInternalHref(item.href, `site.navigation[${index}].href`);

    if (navigationLabels.has(item.label)) {
      throw new Error(`site.navigation contains duplicate label: ${item.label}`);
    }

    navigationLabels.add(item.label);
  }

  return Object.freeze({
    ...config,
    navigation: Object.freeze(config.navigation.map((item) => Object.freeze({ ...item }))),
  });
}

export function defineMarketingServices(
  services: readonly MarketingService[],
): readonly Readonly<MarketingService>[] {
  const slugs = new Set<string>();

  for (const [index, service] of services.entries()) {
    assertSlug(service.slug, `services[${index}].slug`);
    assertNonEmptyString(service.label, `services[${index}].label`);
    assertNonEmptyString(service.description, `services[${index}].description`);
    assertNonEmptyString(service.intro, `services[${index}].intro`);
    assertNonEmptyString(service.bestFor, `services[${index}].bestFor`);
    assertNonEmptyStringList(service.outcomes, `services[${index}].outcomes`);
    assertNonEmptyStringList(service.deliverables, `services[${index}].deliverables`);
    assertNonEmptyStringList(service.boundaries, `services[${index}].boundaries`);

    if (service.faqs.length === 0) {
      throw new Error(`services[${index}].faqs must contain at least one item`);
    }

    const faqQuestions = new Set<string>();

    for (const [faqIndex, faq] of service.faqs.entries()) {
      assertNonEmptyString(faq.question, `services[${index}].faqs[${faqIndex}].question`);
      assertNonEmptyString(faq.answer, `services[${index}].faqs[${faqIndex}].answer`);

      if (faqQuestions.has(faq.question)) {
        throw new Error(`services[${index}].faqs contains duplicate question: ${faq.question}`);
      }

      faqQuestions.add(faq.question);
    }

    if (slugs.has(service.slug)) {
      throw new Error(`services contains duplicate slug: ${service.slug}`);
    }

    slugs.add(service.slug);
  }

  return Object.freeze(
    services.map((service) =>
      Object.freeze({
        ...service,
        outcomes: Object.freeze([...service.outcomes]),
        deliverables: Object.freeze([...service.deliverables]),
        boundaries: Object.freeze([...service.boundaries]),
        faqs: Object.freeze(service.faqs.map((faq) => Object.freeze({ ...faq }))),
      }),
    ),
  );
}

export function defineProcessSteps(
  steps: readonly ProcessStep[],
): readonly Readonly<ProcessStep>[] {
  const numbers = new Set<string>();

  for (const [index, step] of steps.entries()) {
    assertNonEmptyString(step.number, `processSteps[${index}].number`);
    assertNonEmptyString(step.heading, `processSteps[${index}].heading`);
    assertNonEmptyString(step.body, `processSteps[${index}].body`);

    if (numbers.has(step.number)) {
      throw new Error(`processSteps contains duplicate number: ${step.number}`);
    }

    numbers.add(step.number);
  }

  return Object.freeze(steps.map((step) => Object.freeze({ ...step })));
}
