import type { SnapbookTenant } from "./tenant-config.ts";

export type BookingStep =
  | "services"
  | "provider"
  | "times"
  | "more-dates"
  | "details"
  | "review"
  | "result"
  | "returning"
  | "reschedule"
  | "cancel"
  | "cancelled"
  | "unavailable"
  | "conflict"
  | "failure";

export type BookingOutcome = "request-received" | "rescheduled" | "cancelled" | null;
export type SlotSource = "suggested" | "later" | null;

export type BookingState = {
  outcome: BookingOutcome;
  providerId: "any" | string | null;
  replacementSlotId: string | null;
  serviceIds: readonly string[];
  slotId: string | null;
  slotSource: SlotSource;
  step: BookingStep;
  upcomingSlotId: string | null;
};

export type BookingEvent =
  | { type: "TOGGLE_SERVICE"; serviceId: string }
  | { type: "CONTINUE_SERVICES" }
  | { type: "SELECT_PROVIDER"; providerId: string }
  | { type: "SELECT_ANY_PROVIDER" }
  | { type: "SELECT_SLOT"; slotId: string }
  | { type: "SHOW_MORE_DATES" }
  | { type: "CONTINUE_DETAILS" }
  | { type: "SUBMIT_REQUEST" }
  | { type: "OPEN_RETURNING" }
  | { type: "BOOK_AGAIN" }
  | { type: "OPEN_RESCHEDULE" }
  | { type: "SELECT_REPLACEMENT"; slotId: string }
  | { type: "CONFIRM_RESCHEDULE" }
  | { type: "OPEN_CANCEL" }
  | { type: "CONFIRM_CANCEL" }
  | { type: "RETRY" }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "LOAD_SCENARIO"; scenario: "returning" | "unavailable" | "conflict" | "failure" };

export function createInitialBookingState(tenant: SnapbookTenant): BookingState {
  return {
    step: "services",
    serviceIds: [],
    providerId: tenant.capabilities.providerPreference ? null : "any",
    slotId: null,
    slotSource: null,
    replacementSlotId: null,
    upcomingSlotId: tenant.upcoming.slotId,
    outcome: null,
  };
}

function assertStep(state: BookingState, event: BookingEvent, ...allowed: BookingStep[]): void {
  if (!allowed.includes(state.step)) {
    throw new Error(`${event.type} is not allowed from ${state.step}`);
  }
}

function assertService(tenant: SnapbookTenant, serviceId: string): void {
  if (!tenant.services.some((service) => service.id === serviceId)) {
    throw new Error(`Unknown service: ${serviceId}`);
  }
}

function assertProvider(tenant: SnapbookTenant, state: BookingState, providerId: string): void {
  const provider = tenant.providers.find((candidate) => candidate.id === providerId);
  if (
    !provider ||
    state.serviceIds.length === 0 ||
    !state.serviceIds.every((serviceId) => provider.serviceIds.includes(serviceId))
  ) {
    throw new Error(`Provider ${providerId} cannot serve the selected service stack`);
  }
}

function fixtureScenario(tenant: SnapbookTenant, scenario: "returning" | "unavailable" | "conflict" | "failure"): BookingState {
  const base = createInitialBookingState(tenant);

  if (scenario === "returning") {
    return {
      ...base,
      step: "returning",
      serviceIds: [tenant.usualServiceId],
      providerId: "any",
    };
  }

  return {
    ...base,
    step: scenario,
    serviceIds: [tenant.usualServiceId],
    providerId: "any",
    slotId: scenario === "conflict" || scenario === "failure" ? tenant.suggestedSlots[0]?.id ?? null : null,
    slotSource: scenario === "conflict" || scenario === "failure" ? "suggested" : null,
  };
}

export function transitionBooking(
  state: BookingState,
  event: BookingEvent,
  tenant: SnapbookTenant,
): BookingState {
  switch (event.type) {
    case "TOGGLE_SERVICE": {
      assertStep(state, event, "services");
      assertService(tenant, event.serviceId);

      const selected = new Set(state.serviceIds);
      if (selected.has(event.serviceId)) selected.delete(event.serviceId);
      else selected.add(event.serviceId);

      return {
        ...state,
        serviceIds: tenant.services
          .map((service) => service.id)
          .filter((serviceId) => selected.has(serviceId)),
        providerId: tenant.capabilities.providerPreference ? null : "any",
        slotId: null,
        slotSource: null,
        outcome: null,
      };
    }
    case "CONTINUE_SERVICES": {
      assertStep(state, event, "services");
      if (state.serviceIds.length === 0) {
        throw new Error("At least one service must be selected");
      }
      return {
        ...state,
        step: tenant.capabilities.providerPreference ? "provider" : "times",
        providerId: tenant.capabilities.providerPreference ? null : "any",
      };
    }
    case "SELECT_PROVIDER": {
      assertStep(state, event, "provider");
      assertProvider(tenant, state, event.providerId);
      return { ...state, step: "times", providerId: event.providerId };
    }
    case "SELECT_ANY_PROVIDER": {
      assertStep(state, event, "provider");
      return { ...state, step: "times", providerId: "any" };
    }
    case "SELECT_SLOT": {
      assertStep(state, event, "times", "more-dates");
      const slots = state.step === "times" ? tenant.suggestedSlots : tenant.laterSlots;
      if (!slots.some((slot) => slot.id === event.slotId)) {
        throw new Error(`Unknown slot for ${state.step}: ${event.slotId}`);
      }
      return {
        ...state,
        step: "details",
        slotId: event.slotId,
        slotSource: state.step === "times" ? "suggested" : "later",
      };
    }
    case "SHOW_MORE_DATES": {
      assertStep(state, event, "times", "unavailable");
      return { ...state, step: "more-dates", slotId: null, slotSource: null };
    }
    case "CONTINUE_DETAILS": {
      assertStep(state, event, "details");
      return { ...state, step: "review" };
    }
    case "SUBMIT_REQUEST": {
      assertStep(state, event, "review");
      return { ...state, step: "result", outcome: "request-received" };
    }
    case "OPEN_RETURNING": {
      assertStep(state, event, "result", "cancelled");
      return { ...state, step: "returning" };
    }
    case "BOOK_AGAIN": {
      assertStep(state, event, "returning");
      return {
        ...state,
        step: "times",
        serviceIds: [tenant.usualServiceId],
        providerId: "any",
        slotId: null,
        slotSource: null,
        outcome: null,
      };
    }
    case "OPEN_RESCHEDULE": {
      assertStep(state, event, "returning");
      return { ...state, step: "reschedule", replacementSlotId: null, outcome: null };
    }
    case "SELECT_REPLACEMENT": {
      assertStep(state, event, "reschedule");
      if (!tenant.replacementSlots.some((slot) => slot.id === event.slotId)) {
        throw new Error(`Unknown replacement slot: ${event.slotId}`);
      }
      return { ...state, replacementSlotId: event.slotId };
    }
    case "CONFIRM_RESCHEDULE": {
      assertStep(state, event, "reschedule");
      if (!state.replacementSlotId) {
        throw new Error("A replacement slot must be selected");
      }
      return {
        ...state,
        step: "returning",
        upcomingSlotId: state.replacementSlotId,
        replacementSlotId: null,
        outcome: "rescheduled",
      };
    }
    case "OPEN_CANCEL": {
      assertStep(state, event, "returning");
      return { ...state, step: "cancel", outcome: null };
    }
    case "CONFIRM_CANCEL": {
      assertStep(state, event, "cancel");
      return { ...state, step: "cancelled", outcome: "cancelled" };
    }
    case "RETRY": {
      assertStep(state, event, "conflict", "failure");
      return state.step === "conflict"
        ? { ...state, step: "times", slotId: null, slotSource: null }
        : { ...state, step: "review" };
    }
    case "BACK": {
      if (state.step === "provider") return { ...state, step: "services", providerId: null };
      if (state.step === "times") {
        return {
          ...state,
          step: tenant.capabilities.providerPreference ? "provider" : "services",
        };
      }
      if (state.step === "more-dates") return { ...state, step: "times" };
      if (state.step === "details") {
        return { ...state, step: state.slotSource === "later" ? "more-dates" : "times" };
      }
      if (state.step === "review") return { ...state, step: "details" };
      if (state.step === "reschedule" || state.step === "cancel") {
        return { ...state, step: "returning", replacementSlotId: null };
      }
      throw new Error(`BACK is not allowed from ${state.step}`);
    }
    case "RESET":
      return createInitialBookingState(tenant);
    case "LOAD_SCENARIO":
      return fixtureScenario(tenant, event.scenario);
  }
}
