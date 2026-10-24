import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductList } from "@/components/products/ProductList";
import { createClient } from "@/lib/supabase/server";
import { PRODUCT_COLUMNS, ZONE_COLUMNS, toProducts, type Zone } from "@/lib/types";

export const metadata: Metadata = { title: "Products" };

function NoZonesCard() {
  return (
    <section className="animate-fade-up rounded-3xl bg-linear-to-br from-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/25">
      <div aria-hidden="true" className="text-4xl">
        🗺️
      </div>
      <h2 className="mt-3 text-lg font-bold">Create a zone first</h2>
      <p className="mt-1 text-sm text-orange-50">
        Products are sold inside delivery zones. Draw your first zone on the map, then come back to add
        products.
      </p>
      <Link
        href="/zones"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-auto"
      >
        Go to Zones →
      </Link>
    </section>
  );
}

async function ProductsContent() {
  const supabase = await createClient();
  const [zonesRes, productsRes] = await Promise.all([
    supabase.from("zones").select(ZONE_COLUMNS).order("name"),
    supabase.from("products").select(PRODUCT_COLUMNS).order("created_at", { ascending: false }),
  ]);

  if (zonesRes.error || productsRes.error) {
    return (
      <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Couldn&apos;t load your products. Refresh the page to try again.
      </p>
    );
  }

  const zones = (zonesRes.data ?? []) as Zone[];
  const products = toProducts(productsRes.data ?? []);

  return (
    <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
      <div className="lg:sticky lg:top-20">
        {zones.length > 0 ? <ProductForm zones={zones} /> : <NoZonesCard />}
      </div>
      <ProductList products={products} zones={zones} />
    </div>
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
