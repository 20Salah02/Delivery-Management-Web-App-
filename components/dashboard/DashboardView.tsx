import Link from "next/link";
import type { Order, Product, Zone } from "@/lib/types";
import { OverviewMapLoader } from "./OverviewMapLoader";
import { ZoneSummaryCard } from "./ZoneSummaryCard";

function StatCard({ label, value, icon, delay }: { label: string; value: number; icon: string; delay: number }) {
  return (
    <div
      className="animate-fade-up rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 md:p-5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-2xl bg-orange-100 text-lg">
        {icon}
      </span>
      <p className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );
}

function GettingStarted({ zones, products, orders }: { zones: number; products: number; orders: number }) {
  const steps = [
    { href: "/zones", title: "Create a zone", text: "Tap the map to set a center and choose a radius.", done: zones > 0 },
    { href: "/products", title: "Add a product", text: "Set price and quantity, then assign it to zones.", done: products > 0 },
    { href: "/orders", title: "Place an order", text: "Pick an address inside a zone that has the product.", done: orders > 0 },
  ];
  const current = steps.findIndex((s) => !s.done);

  return (
    <section aria-labelledby="getting-started" className="animate-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6">
      <h2 id="getting-started" className="text-lg font-bold">
        Welcome to QuickDrop 👋
      </h2>
      <p className="mt-0.5 text-sm text-gray-500">Three quick steps and you&apos;re delivering.</p>
      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {steps.map((step, i) => (
          <li key={step.href} className="min-w-0">
            <Link
              href={step.href}
              aria-current={i === current ? "step" : undefined}
              className={`flex h-full gap-3 rounded-2xl border p-4 transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-orange-500 ${
                i === current
                  ? "border-orange-300 bg-orange-50 shadow-sm"
                  : "border-gray-100 hover:border-orange-200 hover:bg-orange-50"
              }`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  step.done ? "bg-green-500 text-white" : i === current ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {step.done ? "✓" : i + 1}
              </span>
              <span className="min-w-0">
                <span className={`block font-semibold ${step.done ? "text-gray-400 line-through" : ""}`}>{step.title}</span>
                <span className="block text-sm wrap-anywhere text-gray-500">{step.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function DashboardView({ zones, products, orders }: { zones: Zone[]; products: Product[]; orders: Order[] }) {
  const needsSetup = zones.length === 0 || products.length === 0 || orders.length === 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <StatCard label="Zones" value={zones.length} icon="🗺️" delay={0} />
        <StatCard label="Products" value={products.length} icon="📦" delay={60} />
        <StatCard label="Orders" value={orders.length} icon="🧾" delay={120} />
      </div>

      <Link
        href="/orders"
        className="group flex min-h-16 w-full animate-fade-up items-center justify-between gap-4 rounded-3xl bg-linear-to-r from-orange-500 to-amber-500 px-6 py-4 text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        <span>
          <span className="block text-xl font-extrabold">New Order</span>
          <span className="block text-sm text-orange-50">Pick a product and drop the address</span>
        </span>
        <span aria-hidden="true" className="text-3xl transition group-hover:translate-x-1">
          🛵
        </span>
      </Link>

      {needsSetup && <GettingStarted zones={zones.length} products={products.length} orders={orders.length} />}

      {zones.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section aria-labelledby="overview-map" className="min-w-0 lg:sticky lg:top-20">
            <h2 id="overview-map" className="mb-3 text-xl font-bold">
              Overview
            </h2>
            <div className="relative z-0 h-[50vh] w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm ring-1 ring-black/5 md:h-[60vh] lg:h-[70vh]">
              <OverviewMapLoader zones={zones} orders={orders} />
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs font-medium text-gray-500" aria-label="Map legend">
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-3 rounded-full border-2 border-orange-500 bg-orange-500/30" />
                Zone
              </li>
              <li className="flex items-center gap-1.5">
                <span aria-hidden="true" className="size-3 rounded-full border-2 border-white bg-gray-900 shadow" />
                Order
              </li>
            </ul>
          </section>

          <section aria-labelledby="by-zone" className="min-w-0">
            <h2 id="by-zone" className="mb-3 text-xl font-bold">
              By zone
            </h2>
            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {zones.map((zone, i) => (
                <li key={zone.id} className="min-w-0 animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  <ZoneSummaryCard
                    zone={zone}
                    products={products.filter((p) => p.zone_ids.includes(zone.id))}
                    orders={orders.filter((o) => o.zone_id === zone.id)}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
