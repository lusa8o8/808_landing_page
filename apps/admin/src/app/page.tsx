export default function AdminHomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-xl rounded-2xl border border-black/10 bg-white p-10 shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#1f4e5f]">
          808 Digital Systems
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Admin application scaffold</h1>
        <p className="mt-4 leading-7 text-black/60">
          Authentication and operational workflows are intentionally deferred until the admin
          security phase. This deployment must remain private and non-indexable.
        </p>
      </div>
    </main>
  );
}
