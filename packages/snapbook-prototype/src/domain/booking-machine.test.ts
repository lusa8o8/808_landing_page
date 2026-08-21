import assert from "node:assert/strict";
import test from "node:test";

import { createInitialBookingState, transitionBooking } from "./booking-machine.ts";
import { tenantFixtures } from "./fixtures.ts";

const salon = tenantFixtures[0]!;
const advisory = tenantFixtures[1]!;

test("provider fixture follows the complete first-time request journey", () => {
  let state = createInitialBookingState(salon);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "cut-finish" }, salon);
  assert.equal(state.step, "services");
  state = transitionBooking(state, { type: "CONTINUE_SERVICES" }, salon);
  assert.equal(state.step, "provider");
  state = transitionBooking(state, { type: "SELECT_PROVIDER", providerId: "maya" }, salon);
  assert.equal(state.step, "times");
  state = transitionBooking(state, { type: "SELECT_SLOT", slotId: "today-1430" }, salon);
  state = transitionBooking(state, { type: "CONTINUE_DETAILS" }, salon);
  state = transitionBooking(state, { type: "SUBMIT_REQUEST" }, salon);
  assert.deepEqual({ step: state.step, outcome: state.outcome }, { step: "result", outcome: "request-received" });
});

test("provider selection is skipped when disabled", () => {
  let state = transitionBooking(
    createInitialBookingState(advisory),
    { type: "TOGGLE_SERVICE", serviceId: "intro-session" },
    advisory,
  );
  state = transitionBooking(state, { type: "CONTINUE_SERVICES" }, advisory);
  assert.equal(state.step, "times");
  assert.equal(state.providerId, "any");
});

test("later dates preserve the service and return to suggested times", () => {
  let state = createInitialBookingState(advisory);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "planning-session" }, advisory);
  state = transitionBooking(state, { type: "CONTINUE_SERVICES" }, advisory);
  state = transitionBooking(state, { type: "SHOW_MORE_DATES" }, advisory);
  assert.equal(state.step, "more-dates");
  state = transitionBooking(state, { type: "BACK" }, advisory);
  assert.equal(state.step, "times");
  assert.deepEqual(state.serviceIds, ["planning-session"]);
});

test("book again keeps the usual service and returns to time choice", () => {
  let state = transitionBooking(
    createInitialBookingState(salon),
    { type: "LOAD_SCENARIO", scenario: "returning" },
    salon,
  );
  state = transitionBooking(state, { type: "BOOK_AGAIN" }, salon);
  assert.equal(state.step, "times");
  assert.deepEqual(state.serviceIds, [salon.usualServiceId]);
});

test("reschedule requires a replacement and updates the fixture visit", () => {
  let state = transitionBooking(
    createInitialBookingState(salon),
    { type: "LOAD_SCENARIO", scenario: "returning" },
    salon,
  );
  state = transitionBooking(state, { type: "OPEN_RESCHEDULE" }, salon);
  assert.throws(() => transitionBooking(state, { type: "CONFIRM_RESCHEDULE" }, salon), /must be selected/);
  state = transitionBooking(state, { type: "SELECT_REPLACEMENT", slotId: "move-friday-1100" }, salon);
  state = transitionBooking(state, { type: "CONFIRM_RESCHEDULE" }, salon);
  assert.equal(state.step, "returning");
  assert.equal(state.upcomingSlotId, "move-friday-1100");
  assert.equal(state.outcome, "rescheduled");
});

test("cancellation requires explicit confirmation", () => {
  let state = transitionBooking(
    createInitialBookingState(advisory),
    { type: "LOAD_SCENARIO", scenario: "returning" },
    advisory,
  );
  state = transitionBooking(state, { type: "OPEN_CANCEL" }, advisory);
  assert.equal(state.step, "cancel");
  state = transitionBooking(state, { type: "CONFIRM_CANCEL" }, advisory);
  assert.deepEqual({ step: state.step, outcome: state.outcome }, { step: "cancelled", outcome: "cancelled" });
});

test("unavailable fixture continues to later dates", () => {
  let state = transitionBooking(
    createInitialBookingState(salon),
    { type: "LOAD_SCENARIO", scenario: "unavailable" },
    salon,
  );
  state = transitionBooking(state, { type: "SHOW_MORE_DATES" }, salon);
  assert.equal(state.step, "more-dates");
});

test("conflict retry clears the slot while preserving the service", () => {
  let state = transitionBooking(
    createInitialBookingState(salon),
    { type: "LOAD_SCENARIO", scenario: "conflict" },
    salon,
  );
  state = transitionBooking(state, { type: "RETRY" }, salon);
  assert.equal(state.step, "times");
  assert.deepEqual(state.serviceIds, [salon.usualServiceId]);
  assert.equal(state.slotId, null);
});

test("failure retry returns to the preserved review", () => {
  let state = transitionBooking(
    createInitialBookingState(advisory),
    { type: "LOAD_SCENARIO", scenario: "failure" },
    advisory,
  );
  state = transitionBooking(state, { type: "RETRY" }, advisory);
  assert.equal(state.step, "review");
  assert.equal(state.slotId, advisory.suggestedSlots[0]?.id);
});

test("impossible transitions throw and reset restores the tenant initial state", () => {
  const initial = createInitialBookingState(salon);
  assert.throws(() => transitionBooking(initial, { type: "SUBMIT_REQUEST" }, salon), /not allowed/);
  assert.throws(() => transitionBooking(initial, { type: "CONTINUE_SERVICES" }, salon), /At least one service/);
  const returning = transitionBooking(initial, { type: "LOAD_SCENARIO", scenario: "returning" }, salon);
  assert.deepEqual(transitionBooking(returning, { type: "RESET" }, salon), initial);
});

test("services can be stacked, removed, and continued explicitly", () => {
  let state = createInitialBookingState(salon);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "cut-finish" }, salon);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "shape-up" }, salon);
  assert.deepEqual(state.serviceIds, ["cut-finish", "shape-up"]);
  assert.equal(state.step, "services");

  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "cut-finish" }, salon);
  assert.deepEqual(state.serviceIds, ["shape-up"]);
  state = transitionBooking(state, { type: "CONTINUE_SERVICES" }, salon);
  assert.equal(state.step, "provider");
});

test("named providers must support every service in the stack", () => {
  let state = createInitialBookingState(salon);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "cut-finish" }, salon);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "colour-consult" }, salon);
  state = transitionBooking(state, { type: "CONTINUE_SERVICES" }, salon);

  assert.throws(
    () => transitionBooking(state, { type: "SELECT_PROVIDER", providerId: "nia" }, salon),
    /cannot serve the selected service stack/,
  );
  assert.equal(transitionBooking(state, { type: "SELECT_PROVIDER", providerId: "maya" }, salon).step, "times");
  assert.equal(transitionBooking(state, { type: "SELECT_ANY_PROVIDER" }, salon).step, "times");
});

test("back navigation preserves the selected service stack for editing", () => {
  let state = createInitialBookingState(advisory);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "intro-session" }, advisory);
  state = transitionBooking(state, { type: "TOGGLE_SERVICE", serviceId: "planning-session" }, advisory);
  state = transitionBooking(state, { type: "CONTINUE_SERVICES" }, advisory);
  state = transitionBooking(state, { type: "BACK" }, advisory);

  assert.equal(state.step, "services");
  assert.deepEqual(state.serviceIds, ["intro-session", "planning-session"]);
});
