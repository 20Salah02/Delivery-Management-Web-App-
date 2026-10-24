import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductsView } from "@/components/products/ProductsView";
import { LoadError } from "@/components/ui/LoadError";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, ZONE_COLUMNS, toProducts, toZone, type Zone } from "@/lib/types";

export const metadata: Metadata = { title: "Products" };

async function ProductsContent() {
  const supabase = await createClient();
  const [zonesRes, productsRes] = await Promise.all([
    supabase.from("zones").select(ZONE_COLUMNS).order("name"),
    supabase.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false }),
  ]);

  if (zonesRes.error || productsRes.error) return <LoadError what="products" />;

  return (
    <ProductsView
      zones={((zonesRes.data ?? []) as Zone[]).map(toZone)}
      products={toProducts(productsRes.data ?? [])}
    />
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)]" aria-hidden="true">
      <div className="h-96 animate-pulse rounded-3xl bg-gray-200" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 animate-pulse rounded-3xl bg-gray-200" />
        <div className="h-48 animate-pulse rounded-3xl bg-gray-200" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Products" description="Your menu — priced in MAD, available zone by zone." />
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent />
      </Suspense>
    </>
  );
}
