export type BookingMode = "request" | "instant";
export type PricePresentation =
  | { kind: "fixed"; amount: number }
  | { kind: "from"; amount: number }
  | { kind: "quote"; label: string }
  | { kind: "hidden" };

export type SnapbookService = {
  description: string;
  durationMinutes: number;
  id: string;
  name: string;
  price: PricePresentation;
};

export type SnapbookProvider = {
  id: string;
  name: string;
  serviceIds: readonly string[];
};

export type SnapbookSlot = {
  dayLabel: string;
  id: string;
  timeLabel: string;
};

export type SnapbookTheme = {
  accent: string;
  signal: string;
  surface: string;
};

export type SnapbookTenant = {
  bookingMode: BookingMode;
  capabilities: {
    providerPreference: boolean;
  };
  location: string;
  name: string;
  policies: {
    cancellation: string;
    reschedule: string;
  };
  providers: readonly SnapbookProvider[];
  replacementSlots: readonly SnapbookSlot[];
  services: readonly SnapbookService[];
  slug: string;
  suggestedSlots: readonly SnapbookSlot[];
  laterSlots: readonly SnapbookSlot[];
  theme: SnapbookTheme;
  upcoming: {
    providerId?: string;
    serviceId: string;
    slotId: string;
  };
  usualServiceId: string;
};

function assertNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${field} must not be empty`);
  }
}

function assertUnique(values: readonly string[], field: string): void {
  const seen = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) {
      throw new Error(`${field} contains duplicate id: ${value}`);
    }
    seen.add(value);
  }
}

function assertThemeColour(value: string, field: string): void {
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`${field} must be a six-digit hex colour`);
  }
}

function freezePrice(price: PricePresentation): PricePresentation {
  return Object.freeze({ ...price });
}

export function defineTenantFixture(input: SnapbookTenant): Readonly<SnapbookTenant> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    throw new Error("tenant.slug must be a lowercase URL slug");
  }

  assertNonEmpty(input.name, "tenant.name");
  assertNonEmpty(input.location, "tenant.location");
  assertNonEmpty(input.policies.cancellation, "tenant.policies.cancellation");
  assertNonEmpty(input.policies.reschedule, "tenant.policies.reschedule");
  assertThemeColour(input.theme.accent, "tenant.theme.accent");
  assertThemeColour(input.theme.signal, "tenant.theme.signal");
  assertThemeColour(input.theme.surface, "tenant.theme.surface");

  if (input.services.length === 0) {
    throw new Error("tenant.services must contain at least one service");
  }

  assertUnique(
    input.services.map((service) => service.id),
    "tenant.services",
  );
  assertUnique(
    input.providers.map((provider) => provider.id),
    "tenant.providers",
  );

  const serviceIds = new Set(input.services.map((service) => service.id));
  const providerIds = new Set(input.providers.map((provider) => provider.id));

  for (const [index, service] of input.services.entries()) {
    assertNonEmpty(service.id, `tenant.services[${index}].id`);
    assertNonEmpty(service.name, `tenant.services[${index}].name`);
    assertNonEmpty(service.description, `tenant.services[${index}].description`);

    if (!Number.isInteger(service.durationMinutes) || service.durationMinutes <= 0) {
      throw new Error(`tenant.services[${index}].durationMinutes must be a positive integer`);
    }

    if (service.price.kind === "fixed" || service.price.kind === "from") {
      if (!Number.isFinite(service.price.amount) || service.price.amount < 0) {
        throw new Error(`tenant.services[${index}].price amount must be non-negative`);
      }
    }

    if (service.price.kind === "quote") {
      assertNonEmpty(service.price.label, `tenant.services[${index}].price.label`);
    }
  }

  for (const [index, provider] of input.providers.entries()) {
    assertNonEmpty(provider.id, `tenant.providers[${index}].id`);
    assertNonEmpty(provider.name, `tenant.providers[${index}].name`);

    if (provider.serviceIds.length === 0) {
      throw new Error(`tenant.providers[${index}].serviceIds must not be empty`);
    }

    assertUnique(provider.serviceIds, `tenant.providers[${index}].serviceIds`);
    for (const serviceId of provider.serviceIds) {
      if (!serviceIds.has(serviceId)) {
        throw new Error(`tenant.providers[${index}] references unknown service: ${serviceId}`);
      }
    }
  }

  if (input.capabilities.providerPreference && input.providers.length === 0) {
    throw new Error("provider preference requires at least one provider");
  }

  if (!serviceIds.has(input.usualServiceId)) {
    throw new Error("tenant.usualServiceId must reference a service");
  }

  if (!serviceIds.has(input.upcoming.serviceId)) {
    throw new Error("tenant.upcoming.serviceId must reference a service");
  }

  if (input.upcoming.providerId && !providerIds.has(input.upcoming.providerId)) {
    throw new Error("tenant.upcoming.providerId must reference a provider");
  }

  if (input.upcoming.providerId) {
    const upcomingProvider = input.providers.find((provider) => provider.id === input.upcoming.providerId);
    if (!upcomingProvider?.serviceIds.includes(input.upcoming.serviceId)) {
      throw new Error("tenant.upcoming.providerId cannot serve tenant.upcoming.serviceId");
    }
  }

  const slotGroups = [input.suggestedSlots, input.laterSlots, input.replacementSlots];
  const allSlots = slotGroups.flat();
  assertUnique(
    allSlots.map((slot) => slot.id),
    "tenant slots",
  );

  for (const [index, slot] of allSlots.entries()) {
    assertNonEmpty(slot.id, `tenant.slots[${index}].id`);
    assertNonEmpty(slot.dayLabel, `tenant.slots[${index}].dayLabel`);
    assertNonEmpty(slot.timeLabel, `tenant.slots[${index}].timeLabel`);
  }

  if (
    input.suggestedSlots.length === 0 ||
    input.laterSlots.length === 0 ||
    input.replacementSlots.length === 0
  ) {
    throw new Error("tenant fixtures require suggested, later, and replacement slots");
  }

  const upcomingSlotIds = new Set([...input.suggestedSlots, ...input.laterSlots].map((slot) => slot.id));
  if (!upcomingSlotIds.has(input.upcoming.slotId)) {
    throw new Error("tenant.upcoming.slotId must reference a suggested or later slot");
  }

  return Object.freeze({
    ...input,
    capabilities: Object.freeze({ ...input.capabilities }),
    policies: Object.freeze({ ...input.policies }),
    providers: Object.freeze(
      input.providers.map((provider) =>
        Object.freeze({ ...provider, serviceIds: Object.freeze([...provider.serviceIds]) }),
      ),
    ),
    replacementSlots: Object.freeze(input.replacementSlots.map((slot) => Object.freeze({ ...slot }))),
    services: Object.freeze(
      input.services.map((service) => Object.freeze({ ...service, price: freezePrice(service.price) })),
    ),
    suggestedSlots: Object.freeze(input.suggestedSlots.map((slot) => Object.freeze({ ...slot }))),
    laterSlots: Object.freeze(input.laterSlots.map((slot) => Object.freeze({ ...slot }))),
    theme: Object.freeze({ ...input.theme }),
    upcoming: Object.freeze({ ...input.upcoming }),
  });
}
