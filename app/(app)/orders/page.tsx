import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { OrderList } from "@/components/orders/OrderList";
import { OrdersManager } from "@/components/orders/OrdersManager";
import { createClient } from "@/lib/supabase/server";
import {
  ORDER_COLUMNS,
  PRODUCT_COLUMNS,
  ZONE_COLUMNS,
  toOrders,
  toProducts,
  toZone,
  type Zone,
} from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

function SetupCard({ href, title, text, cta }: { href: string; title: string; text: string; cta: string }) {
  return (
    <section className="animate-fade-up rounded-3xl bg-linear-to-br from-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/25">
      <div aria-hidden="true" className="text-4xl">
        🛵
      </div>
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-orange-50">{text}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-auto"
      >
        {cta}
      </Link>
    </section>
  );
}

async function OrdersContent() {
  const supabase = await createClient();
  const [zonesRes, productsRes, ordersRes] = await Promise.all([
    supabase.from("zones").select(ZONE_COLUMNS).order("name"),
    supabase.from("products").select(PRODUCT_COLUMNS).order("name"),
    supabase.from("orders").select(ORDER_COLUMNS).order("created_at", { ascending: false }),
  ]);

  if (zonesRes.error || productsRes.error || ordersRes.error) {
    return (
      <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Couldn&apos;t load your orders. Refresh the page to try again.
      </p>
    );
  }

  const zones = ((zonesRes.data ?? []) as Zone[]).map(toZone);
  const products = toProducts(productsRes.data ?? []);
  const orders = toOrders(ordersRes.data ?? []);

  return (
    <>
      {zones.length === 0 ? (
        <SetupCard
          href="/zones"
          title="Create a delivery zone first"
          text="Orders are only accepted inside your zones. Draw one on the map to get started."
          cta="Go to Zones →"
        />
      ) : products.length === 0 ? (
        <SetupCard
          href="/products"
          title="Add a product first"
          text="Create a product and assign it to at least one zone, then come back to place orders."
          cta="Go to Products →"
        />
      ) : (
        <OrdersManager zones={zones} products={products} />
      )}
      <OrderList orders={orders} />
    </>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-[50vh] animate-pulse rounded-3xl bg-gray-200 md:h-[60vh] lg:h-[70vh]" />
      <div className="h-64 animate-pulse rounded-3xl bg-gray-200" />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Pick a product, tap the address — we check the zone for you." />
      <Suspense fallback={<OrdersSkeleton />}>
        <OrdersContent />
      </Suspense>
    </>
  );
}
