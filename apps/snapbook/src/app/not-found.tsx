import Link from "next/link";

export default function NotFound() {
  return (
    <main className="index-shell">
      <p className="eyebrow">SnapBook prototype</p>
      <h1>That fixture does not exist.</h1>
      <p className="lede">Only reviewed fictional tenants are available in this build.</p>
      <Link className="standalone-link" href="/">
        View prototype fixtures
      </Link>
    </main>
  );
}
