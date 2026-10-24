import { Suspense } from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { PageHeader } from "@/components/PageHeader";
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

async function DashboardContent() {
  const supabase = await createClient();
  const [zonesRes, productsRes, ordersRes] = await Promise.all([
    supabase.from("zones").select(ZONE_COLUMNS).order("name"),
    supabase.from("products").select(PRODUCT_COLUMNS).order("name"),
    supabase.from("orders").select(ORDER_COLUMNS).order("created_at", { ascending: false }),
  ]);

  if (zonesRes.error || productsRes.error || ordersRes.error) return <LoadError what="dashboard" />;

  return (
    <DashboardView
      zones={((zonesRes.data ?? []) as Zone[]).map(toZone)}
      products={toProducts(productsRes.data ?? [])}
      orders={toOrders(ordersRes.data ?? [])}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-gray-200" />
        ))}
      </div>
      <div className="h-16 animate-pulse rounded-3xl bg-gray-200" />
      <div className="h-[50vh] animate-pulse rounded-3xl bg-gray-200" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" description="Your zones, products and orders at a glance." />
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </>
  );
}
