"use client";

import { useMemo, useState } from "react";

import {
  createInitialBookingState,
  transitionBooking,
  type BookingEvent,
  type BookingState,
} from "./domain/booking-machine.ts";
import type {
  PricePresentation,
  SnapbookProvider,
  SnapbookService,
  SnapbookSlot,
  SnapbookTenant,
} from "./domain/tenant-config.ts";

type BookingExperienceProps = {
  mode: "embed" | "full";
  showScenarioControls?: boolean;
  tenant: SnapbookTenant;
};

function priceLabel(price: PricePresentation): string | null {
  if (price.kind === "fixed") return `K${price.amount.toLocaleString("en-ZM")}`;
  if (price.kind === "from") return `From K${price.amount.toLocaleString("en-ZM")}`;
  if (price.kind === "quote") return price.label;
  return null;
}

function findService(tenant: SnapbookTenant, id: string | null): SnapbookService | undefined {
  return tenant.services.find((service) => service.id === id);
}

function findServices(tenant: SnapbookTenant, ids: readonly string[]): SnapbookService[] {
  const selected = new Set(ids);
  return tenant.services.filter((service) => selected.has(service.id));
}

function serviceStackPrice(services: readonly SnapbookService[]): string | null {
  if (services.length === 0 || services.some((service) => service.price.kind === "hidden")) return null;
  if (services.some((service) => service.price.kind === "quote")) return "Price confirmed after review";

  const amount = services.reduce(
    (total, service) => total + (service.price.kind === "fixed" || service.price.kind === "from" ? service.price.amount : 0),
    0,
  );
  const prefix = services.some((service) => service.price.kind === "from") ? "From " : "";
  return `${prefix}K${amount.toLocaleString("en-ZM")}`;
}

function findProvider(tenant: SnapbookTenant, id: string | null): SnapbookProvider | undefined {
  return tenant.providers.find((provider) => provider.id === id);
}

function allSlots(tenant: SnapbookTenant): readonly SnapbookSlot[] {
  return [...tenant.suggestedSlots, ...tenant.laterSlots, ...tenant.replacementSlots];
}

function findSlot(tenant: SnapbookTenant, id: string | null): SnapbookSlot | undefined {
  return allSlots(tenant).find((slot) => slot.id === id);
}

function BackButton({ dispatch }: { dispatch: (event: BookingEvent) => void }) {
  return (
    <button className="text-button" onClick={() => dispatch({ type: "BACK" })} type="button">
      <span aria-hidden="true">←</span> Back
    </button>
  );
}

function ChoiceButton({
  children,
  detail,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  detail?: string | null;
  onClick: () => void;
  selected?: boolean;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`choice-button${selected ? " choice-button--selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span>{children}</span>
      {detail ? <small>{detail}</small> : null}
      <span aria-hidden="true" className="choice-arrow">{selected ? "✓" : "→"}</span>
    </button>
  );
}

function SlotGrid({
  onSelect,
  selectedId,
  slots,
}: {
  onSelect: (slotId: string) => void;
  selectedId?: string | null;
  slots: readonly SnapbookSlot[];
}) {
  return (
    <div className="slot-grid">
      {slots.map((slot) => (
        <button
          aria-pressed={selectedId === slot.id}
          className="slot-button"
          key={slot.id}
          onClick={() => onSelect(slot.id)}
          type="button"
        >
          <strong>{slot.dayLabel}</strong>
          <span>{slot.timeLabel}</span>
        </button>
      ))}
    </div>
  );
}

function Summary({ state, tenant }: { state: BookingState; tenant: SnapbookTenant }) {
  const services = findServices(tenant, state.serviceIds);
  const provider = findProvider(tenant, state.providerId);
  const slot = findSlot(tenant, state.slotId);
  const totalMinutes = services.reduce((total, service) => total + service.durationMinutes, 0);
  const stackPrice = serviceStackPrice(services);

  return (
    <dl className="summary-list">
      <div>
        <dt>{services.length === 1 ? "Service" : "Services"}</dt>
        <dd>
          {services.length > 0 ? (
            <ul className="summary-services">
              {services.map((service) => <li key={service.id}>{service.name}</li>)}
            </ul>
          ) : "Not selected"}
        </dd>
      </div>
      <div><dt>Duration</dt><dd>{totalMinutes} min</dd></div>
      {tenant.capabilities.providerPreference ? (
        <div><dt>Provider</dt><dd>{provider?.name ?? "No preference"}</dd></div>
      ) : null}
      <div><dt>Time</dt><dd>{slot ? `${slot.dayLabel}, ${slot.timeLabel}` : "Not selected"}</dd></div>
      {stackPrice ? (
        <div><dt>Price</dt><dd>{stackPrice}</dd></div>
      ) : null}
    </dl>
  );
}

function Journey({
  dispatch,
  state,
  tenant,
}: {
  dispatch: (event: BookingEvent) => void;
  state: BookingState;
  tenant: SnapbookTenant;
}) {
  const selectedServices = findServices(tenant, state.serviceIds);
  const selectedMinutes = selectedServices.reduce((total, service) => total + service.durationMinutes, 0);
  const selectedPrice = serviceStackPrice(selectedServices);
  const upcomingService = findService(tenant, tenant.upcoming.serviceId);
  const upcomingProvider = findProvider(tenant, tenant.upcoming.providerId ?? null);
  const upcomingSlot = findSlot(tenant, state.upcomingSlotId);

  switch (state.step) {
    case "services":
      return (
        <section aria-labelledby="service-heading">
          <p className="step-label">Choose a service</p>
          <h2 id="service-heading">What do you need?</h2>
          <p className="supporting-copy">Choose one service or stack a few together. Times come next.</p>
          <div className="choice-stack">
            {tenant.services.map((item) => {
              const selected = state.serviceIds.includes(item.id);
              return (
                <ChoiceButton
                  detail={`${item.durationMinutes} min${priceLabel(item.price) ? ` · ${priceLabel(item.price)}` : ""}`}
                  key={item.id}
                  onClick={() => dispatch({ type: "TOGGLE_SERVICE", serviceId: item.id })}
                  selected={selected}
                >
                  <strong>{item.name}</strong>
                  <span className="choice-description">{item.description}</span>
                </ChoiceButton>
              );
            })}
          </div>
          <div className="selection-bar" aria-live="polite">
            <span>
              {selectedServices.length === 0
                ? "Choose at least one service"
                : `${selectedServices.length} ${selectedServices.length === 1 ? "service" : "services"} · ${selectedMinutes} min`}
            </span>
            {selectedPrice ? <strong>{selectedPrice}</strong> : null}
          </div>
          <button
            className="primary-button full-width"
            disabled={selectedServices.length === 0}
            onClick={() => dispatch({ type: "CONTINUE_SERVICES" })}
            type="button"
          >
            Continue
          </button>
        </section>
      );
    case "provider": {
      const providers = tenant.providers.filter((provider) =>
        state.serviceIds.every((serviceId) => provider.serviceIds.includes(serviceId)),
      );
      return (
        <section aria-labelledby="provider-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">Choose a provider</p>
          <h2 id="provider-heading">Do you have a preference?</h2>
          <p className="supporting-copy">
            {providers.length > 0
              ? "Only providers who can handle your full service stack are shown."
              : "No single provider covers the full stack. Choose no preference and the business can arrange it."}
          </p>
          <div className="choice-stack">
            <ChoiceButton onClick={() => dispatch({ type: "SELECT_ANY_PROVIDER" })}>No preference</ChoiceButton>
            {providers.map((provider) => (
              <ChoiceButton key={provider.id} onClick={() => dispatch({ type: "SELECT_PROVIDER", providerId: provider.id })}>
                {provider.name}
              </ChoiceButton>
            ))}
          </div>
        </section>
      );
    }
    case "times":
      return (
        <section aria-labelledby="time-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">Choose a time</p>
          <h2 id="time-heading">What works for you?</h2>
          <p className="supporting-copy">A few useful options first—no calendar wall.</p>
          <SlotGrid slots={tenant.suggestedSlots} onSelect={(slotId) => dispatch({ type: "SELECT_SLOT", slotId })} />
          <button className="secondary-button full-width" onClick={() => dispatch({ type: "SHOW_MORE_DATES" })} type="button">
            See more dates
          </button>
        </section>
      );
    case "more-dates":
      return (
        <section aria-labelledby="more-dates-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">More dates</p>
          <h2 id="more-dates-heading">A few later options</h2>
          <SlotGrid slots={tenant.laterSlots} onSelect={(slotId) => dispatch({ type: "SELECT_SLOT", slotId })} />
        </section>
      );
    case "details":
      return (
        <section aria-labelledby="details-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">Your details</p>
          <h2 id="details-heading">One small step before review</h2>
          <div className="notice-card">
            <strong>This prototype collects nothing.</strong>
            <p>A live version would ask only for the minimum contact detail needed to respond to this request.</p>
          </div>
          <button className="primary-button full-width" onClick={() => dispatch({ type: "CONTINUE_DETAILS" })} type="button">
            Continue without entering details
          </button>
        </section>
      );
    case "review":
      return (
        <section aria-labelledby="review-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">Review</p>
          <h2 id="review-heading">Does this look right?</h2>
          <Summary state={state} tenant={tenant} />
          <button className="primary-button full-width" onClick={() => dispatch({ type: "SUBMIT_REQUEST" })} type="button">
            Preview request
          </button>
          <p className="fine-print">No request, message, or calendar event will be created.</p>
        </section>
      );
    case "result":
      return (
        <section className="centred-state" aria-labelledby="result-heading">
          <span className="status-mark" aria-hidden="true">✓</span>
          <p className="step-label">Preview complete</p>
          <h2 id="result-heading">This is where the request receipt appears.</h2>
          <p>No request was sent. A live request-mode tenant would show the response timing and next step here.</p>
          <button className="primary-button" onClick={() => dispatch({ type: "OPEN_RETURNING" })} type="button">
            Preview returning experience
          </button>
        </section>
      );
    case "returning":
      return (
        <section aria-labelledby="returning-heading">
          <p className="step-label">Welcome back</p>
          <h2 id="returning-heading">Your next visit</h2>
          {state.outcome === "rescheduled" ? <p className="status-banner" role="status">Preview rescheduled.</p> : null}
          <div className="upcoming-card">
            <strong>{upcomingService?.name}</strong>
            <span>{upcomingSlot ? `${upcomingSlot.dayLabel}, ${upcomingSlot.timeLabel}` : "Time unavailable"}</span>
            {upcomingProvider ? <small>with {upcomingProvider.name}</small> : null}
            <div className="inline-actions">
              <button className="text-button" onClick={() => dispatch({ type: "OPEN_RESCHEDULE" })} type="button">Reschedule</button>
              <button className="text-button danger-text" onClick={() => dispatch({ type: "OPEN_CANCEL" })} type="button">Cancel</button>
            </div>
          </div>
          <div className="usual-card">
            <span>Your usual</span>
            <strong>{findService(tenant, tenant.usualServiceId)?.name}</strong>
            <button className="primary-button" onClick={() => dispatch({ type: "BOOK_AGAIN" })} type="button">Book again</button>
          </div>
          <button className="secondary-button full-width" onClick={() => dispatch({ type: "RESET" })} type="button">Choose something else</button>
        </section>
      );
    case "reschedule":
      return (
        <section aria-labelledby="reschedule-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">Reschedule</p>
          <h2 id="reschedule-heading">Choose another time</h2>
          <SlotGrid selectedId={state.replacementSlotId} slots={tenant.replacementSlots} onSelect={(slotId) => dispatch({ type: "SELECT_REPLACEMENT", slotId })} />
          <button className="primary-button full-width" disabled={!state.replacementSlotId} onClick={() => dispatch({ type: "CONFIRM_RESCHEDULE" })} type="button">Preview reschedule</button>
          <p className="fine-print">{tenant.policies.reschedule}</p>
        </section>
      );
    case "cancel":
      return (
        <section aria-labelledby="cancel-heading">
          <BackButton dispatch={dispatch} />
          <p className="step-label">Cancel visit</p>
          <h2 id="cancel-heading">Are you sure?</h2>
          <p>{tenant.policies.cancellation}</p>
          <button className="danger-button full-width" onClick={() => dispatch({ type: "CONFIRM_CANCEL" })} type="button">Preview cancellation</button>
        </section>
      );
    case "cancelled":
      return (
        <section className="centred-state" aria-labelledby="cancelled-heading">
          <span className="status-mark quiet" aria-hidden="true">×</span>
          <p className="step-label">Preview cancelled</p>
          <h2 id="cancelled-heading">This visit would now be cancelled.</h2>
          <p>No real booking was changed.</p>
          <button className="secondary-button" onClick={() => dispatch({ type: "OPEN_RETURNING" })} type="button">Return home</button>
        </section>
      );
    case "unavailable":
      return (
        <section className="centred-state" aria-labelledby="unavailable-heading">
          <span className="status-mark quiet" aria-hidden="true">…</span>
          <p className="step-label">No suggested times</p>
          <h2 id="unavailable-heading">Nothing suitable here yet.</h2>
          <p>Try later dates without starting the journey again.</p>
          <button className="primary-button" onClick={() => dispatch({ type: "SHOW_MORE_DATES" })} type="button">See later dates</button>
        </section>
      );
    case "conflict":
      return (
        <section className="centred-state" aria-labelledby="conflict-heading">
          <span className="status-mark quiet" aria-hidden="true">↻</span>
          <p className="step-label">Time just changed</p>
          <h2 id="conflict-heading">Someone else took that time.</h2>
          <p>Your other choices stay intact. Pick another suggested time.</p>
          <button className="primary-button" onClick={() => dispatch({ type: "RETRY" })} type="button">Choose another time</button>
        </section>
      );
    case "failure":
      return (
        <section className="centred-state" aria-labelledby="failure-heading">
          <span className="status-mark quiet" aria-hidden="true">!</span>
          <p className="step-label">Could not finish</p>
          <h2 id="failure-heading">The request did not go through.</h2>
          <p>A live system would preserve your choices and let you try again.</p>
          <button className="primary-button" onClick={() => dispatch({ type: "RETRY" })} type="button">Return to review</button>
        </section>
      );
  }
}

export function BookingExperience({ mode, showScenarioControls = true, tenant }: BookingExperienceProps) {
  const initialState = useMemo(() => createInitialBookingState(tenant), [tenant]);
  const [state, setState] = useState(initialState);

  const dispatch = (event: BookingEvent) => {
    setState((current) => transitionBooking(current, event, tenant));
  };

  return (
    <main
      className={`booking-page booking-page--${mode}`}
      style={{
        "--snap-accent": tenant.theme.accent,
        "--snap-signal": tenant.theme.signal,
        "--snap-surface": tenant.theme.surface,
      } as React.CSSProperties}
    >
      <article className="booking-shell">
        <header className="tenant-header">
          <div>
            <strong>{tenant.name}</strong>
            <span>{tenant.location}</span>
          </div>
          <span className="prototype-badge">Prototype</span>
        </header>
        <div className="journey" aria-live="polite">
          <Journey dispatch={dispatch} state={state} tenant={tenant} />
        </div>
        <footer className="booking-footer">
          <span>Powered by SnapBook</span>
          <span>Nothing is submitted or stored</span>
        </footer>
      </article>
      {showScenarioControls ? (
        <details className="scenario-panel">
          <summary>Fixture scenarios</summary>
          <p>Prototype controls for reviewing non-happy paths.</p>
          <div className="scenario-actions">
            <button onClick={() => dispatch({ type: "LOAD_SCENARIO", scenario: "returning" })} type="button">Returning</button>
            <button onClick={() => dispatch({ type: "LOAD_SCENARIO", scenario: "unavailable" })} type="button">Unavailable</button>
            <button onClick={() => dispatch({ type: "LOAD_SCENARIO", scenario: "conflict" })} type="button">Conflict</button>
            <button onClick={() => dispatch({ type: "LOAD_SCENARIO", scenario: "failure" })} type="button">Failure</button>
            <button onClick={() => dispatch({ type: "RESET" })} type="button">Reset</button>
          </div>
        </details>
      ) : null}
    </main>
  );
}
