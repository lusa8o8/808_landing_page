import { defineTenantFixture } from "./tenant-config.ts";

const studio808 = defineTenantFixture({
  slug: "studio-808",
  name: "Studio 808",
  location: "Fictional Lusaka salon",
  bookingMode: "request",
  capabilities: { providerPreference: true },
  theme: {
    accent: "#26372d",
    signal: "#dca548",
    surface: "#f4efe3",
  },
  policies: {
    cancellation: "This fixture allows cancellation before the appointment starts.",
    reschedule: "This fixture allows a customer to choose another available time.",
  },
  services: [
    {
      id: "cut-finish",
      name: "Cut and finish",
      description: "A complete cut and finish appointment.",
      durationMinutes: 45,
      price: { kind: "fixed", amount: 180 },
    },
    {
      id: "shape-up",
      name: "Shape-up",
      description: "A short maintenance appointment.",
      durationMinutes: 20,
      price: { kind: "fixed", amount: 90 },
    },
    {
      id: "colour-consult",
      name: "Colour consultation",
      description: "A planning conversation before colour work.",
      durationMinutes: 60,
      price: { kind: "from", amount: 250 },
    },
  ],
  providers: [
    { id: "maya", name: "Maya", serviceIds: ["cut-finish", "shape-up", "colour-consult"] },
    { id: "nia", name: "Nia", serviceIds: ["cut-finish", "shape-up"] },
  ],
  suggestedSlots: [
    { id: "today-1430", dayLabel: "Today", timeLabel: "2:30 pm" },
    { id: "tomorrow-1000", dayLabel: "Tomorrow", timeLabel: "10:00 am" },
    { id: "thursday-1400", dayLabel: "Thursday", timeLabel: "2:00 pm" },
  ],
  laterSlots: [
    { id: "friday-0900", dayLabel: "Friday", timeLabel: "9:00 am" },
    { id: "friday-1530", dayLabel: "Friday", timeLabel: "3:30 pm" },
    { id: "saturday-1100", dayLabel: "Saturday", timeLabel: "11:00 am" },
  ],
  replacementSlots: [
    { id: "move-tomorrow-1400", dayLabel: "Tomorrow", timeLabel: "2:00 pm" },
    { id: "move-friday-1100", dayLabel: "Friday", timeLabel: "11:00 am" },
    { id: "move-saturday-1500", dayLabel: "Saturday", timeLabel: "3:00 pm" },
  ],
  usualServiceId: "cut-finish",
  upcoming: {
    serviceId: "shape-up",
    providerId: "maya",
    slotId: "tomorrow-1000",
  },
});

const northstarAdvisory = defineTenantFixture({
  slug: "northstar-advisory",
  name: "Northstar Advisory",
  location: "Fictional Lusaka professional service",
  bookingMode: "request",
  capabilities: { providerPreference: false },
  theme: {
    accent: "#1f3a5f",
    signal: "#e3b341",
    surface: "#f5f2ea",
  },
  policies: {
    cancellation: "This fixture allows cancellation before the session starts.",
    reschedule: "This fixture allows a customer to request another available session.",
  },
  services: [
    {
      id: "intro-session",
      name: "Introductory session",
      description: "A first conversation to understand what support may fit.",
      durationMinutes: 30,
      price: { kind: "quote", label: "Price agreed after the introductory session" },
    },
    {
      id: "planning-session",
      name: "Planning session",
      description: "A focused working session around an agreed topic.",
      durationMinutes: 60,
      price: { kind: "fixed", amount: 600 },
    },
  ],
  providers: [],
  suggestedSlots: [
    { id: "monday-0900", dayLabel: "Monday", timeLabel: "9:00 am" },
    { id: "monday-1330", dayLabel: "Monday", timeLabel: "1:30 pm" },
    { id: "tuesday-1100", dayLabel: "Tuesday", timeLabel: "11:00 am" },
  ],
  laterSlots: [
    { id: "wednesday-1000", dayLabel: "Wednesday", timeLabel: "10:00 am" },
    { id: "thursday-1500", dayLabel: "Thursday", timeLabel: "3:00 pm" },
    { id: "friday-1030", dayLabel: "Friday", timeLabel: "10:30 am" },
  ],
  replacementSlots: [
    { id: "move-wednesday-1400", dayLabel: "Wednesday", timeLabel: "2:00 pm" },
    { id: "move-thursday-0900", dayLabel: "Thursday", timeLabel: "9:00 am" },
  ],
  usualServiceId: "planning-session",
  upcoming: {
    serviceId: "intro-session",
    slotId: "monday-1330",
  },
});

export const tenantFixtures = Object.freeze([studio808, northstarAdvisory]);

export function getTenantFixture(slug: string) {
  return tenantFixtures.find((tenant) => tenant.slug === slug);
}

export function tenantFixtureParams() {
  return tenantFixtures.map((tenant) => ({ tenantSlug: tenant.slug }));
}
