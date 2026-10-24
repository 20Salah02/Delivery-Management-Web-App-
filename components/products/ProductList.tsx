"use client";

import { deleteProduct } from "@/app/(app)/products/actions";
import { EmptyState } from "@/components/PageHeader";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import type { Product, Zone } from "@/lib/types";
import { formatMAD } from "@/lib/validation";

export function ProductList({ products, zones }: { products: Product[]; zones: Zone[] }) {
  const zoneNames = new Map(zones.map((z) => [z.id, z.name]));

  return (
    <section aria-labelledby="your-products" className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <h2 id="your-products" className="text-xl font-bold">
          Your products
        </h2>
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-bold text-orange-700">
          {products.length}
        </span>
      </div>

      {products.length === 0 ? (
        <EmptyState icon="📦">No products yet — add your first one to start taking orders.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {products.map((product, i) => (
            <li
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              <ProductCard
                product={product}
                zones={product.zone_ids.flatMap((id) => {
                  const name = zoneNames.get(id);
                  return name ? [{ id, name }] : [];
                })}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ProductCard({
  product,
  zones,
}: {
  product: Product;
  zones: { id: string; name: string }[];
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-amber-500 text-lg font-bold text-white shadow-sm"
        >
          {product.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold break-words">{product.name}</h3>
          <p className="mt-0.5 text-lg font-extrabold tracking-tight text-gray-900">
            {formatMAD(product.price)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
          Qty {product.quantity}
        </span>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">Available in</p>
        {zones.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {zones.map(({ id, name }) => (
              <li
                key={id}
                className="max-w-full truncate rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200"
              >
                📍 {name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
            Not available in any zone — it can&apos;t be ordered.
          </p>
        )}
      </div>

      <ConfirmDelete itemName={product.name} onDelete={() => deleteProduct(product.id)} />
    </article>
  );
}
