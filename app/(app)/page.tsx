import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

const STEPS = [
  { href: "/zones", title: "Create a zone", text: "Click the map to set a center and choose a radius." },
  { href: "/products", title: "Add a product", text: "Set a price and quantity, then assign it to zones." },
  { href: "/orders", title: "Place an order", text: "Pick an address inside a zone that has the product." },
] as const;

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Your zones, products and orders at a glance." />
      <section aria-labelledby="getting-started" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 id="getting-started" className="text-lg font-semibold">
          Get started in 3 steps
        </h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.href} className="min-w-0">
              <Link
                href={step.href}
                className="flex h-full gap-3 rounded-2xl border border-gray-100 p-4 transition hover:border-orange-200 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-500"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-medium">{step.title}</span>
                  <span className="block text-sm break-words text-gray-500">{step.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
