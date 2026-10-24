import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { OrdersView } from "@/components/orders/OrdersView";
import { LoadError } from "@/components/ui/LoadError";
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

async function OrdersContent() {
  const supabase = await createClient();
  const [zonesRes, productsRes, ordersRes] = await Promise.all([
    supabase.from("zones").select(ZONE_COLUMNS).order("name"),
    supabase.from("products").select(PRODUCT_COLUMNS).order("name"),
    supabase.from("orders").select(ORDER_COLUMNS).order("created_at", { ascending: false }),
  ]);

  if (zonesRes.error || productsRes.error || ordersRes.error) return <LoadError what="orders" />;

  return (
    <OrdersView
      zones={((zonesRes.data ?? []) as Zone[]).map(toZone)}
      products={toProducts(productsRes.data ?? [])}
      orders={toOrders(ordersRes.data ?? [])}
    />
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
