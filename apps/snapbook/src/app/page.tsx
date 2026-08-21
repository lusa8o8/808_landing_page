import Link from "next/link";
import { tenantFixtures } from "@808/snapbook-prototype";

export default function PrototypeIndex() {
  return (
    <main className="index-shell">
      <p className="eyebrow">SnapBook · S1 product prototype</p>
      <h1>One booking journey, configured for different businesses.</h1>
      <p className="lede">
        These fictional fixtures prove the reusable full-page and embedded shells. Nothing here sends,
        stores, or confirms a real booking.
      </p>
      <div className="fixture-grid">
        {tenantFixtures.map((tenant) => (
          <article className="fixture-card" key={tenant.slug}>
            <p className="fixture-location">{tenant.location}</p>
            <h2>{tenant.name}</h2>
            <p>
              {tenant.services.length} services · Provider choice{" "}
              {tenant.capabilities.providerPreference ? "enabled" : "skipped"}
            </p>
            <div className="link-row">
              <Link href={`/book/${tenant.slug}`}>Open full page</Link>
              <Link href={`/embed/${tenant.slug}`}>Open embed</Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
