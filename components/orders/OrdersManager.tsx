"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { nearestMatchingZone } from "@/lib/geo";
import type { Product, Zone } from "@/lib/types";
import { OrderForm } from "./OrderForm";

const OrderMap = dynamic(() => import("./OrderMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
});

export function OrdersManager({ zones, products }: { zones: Zone[]; products: Product[] }) {
  const [productId, setProductId] = useState("");
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);

  const product = products.find((p) => p.id === productId) ?? null;
  const availableZoneIds = useMemo(() => product?.zone_ids ?? [], [product]);

  // Client-side preview only; the server action re-checks everything.
  const match = useMemo(() => {
    if (!picked || !product) return null;
    const productZones = zones.filter((z) => availableZoneIds.includes(z.id));
    return nearestMatchingZone(picked.lat, picked.lng, productZones);
  }, [picked, product, zones, availableZoneIds]);

  return (
    <div className="grid gap-6 md:landscape:grid-cols-[minmax(0,1fr)_340px] lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <section aria-label="Delivery map" className="min-w-0 md:landscape:sticky md:landscape:top-20">
        <div className="relative z-0 h-[50vh] w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm ring-1 ring-black/5 md:h-[60vh] lg:h-[70vh]">
          <OrderMap
            zones={zones}
            availableZoneIds={availableZoneIds}
            matchedZoneId={match?.id ?? null}
            picked={picked}
            onPick={(lat, lng) => setPicked({ lat, lng })}
          />
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 px-1 text-xs font-medium text-gray-500" aria-label="Map legend">
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-full border-2 border-orange-500 bg-orange-500/30" />
            {product ? `Delivers ${product.name}` : "Pick a product to highlight its zones"}
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="size-3 rounded-full border-2 border-dashed border-gray-400" />
            Other zones
          </li>
        </ul>
      </section>

      <OrderForm
        products={products}
        productId={productId}
        onProductChange={setProductId}
        picked={picked}
        onClearPick={() => setPicked(null)}
        match={match ? { name: match.name, distanceKm: match.distanceKm } : null}
        onSaved={() => {
          setProductId("");
          setPicked(null);
        }}
      />
    </div>
  );
}
