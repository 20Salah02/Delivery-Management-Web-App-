import type { Order, Product, Zone } from "@/lib/types";
import { formatDate, formatKm, formatMAD } from "@/lib/validation";

const MAX_ORDERS_SHOWN = 4;

export function ZoneSummaryCard({
  zone,
  products,
  orders,
}: {
  zone: Zone;
  products: Product[];
  orders: Order[];
}) {
  return (
    <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <header className="flex items-start gap-3">
        <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl">
          📍
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold break-words">{zone.name}</h3>
          <p className="text-sm text-gray-500">{formatKm(zone.radius_km)} radius</p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-xs font-bold text-white">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </header>

      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
          Products ({products.length})
        </h4>
        {products.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5">
            {products.map((p) => (
              <li key={p.id} className="max-w-full truncate rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200">
                {p.name} · {formatMAD(p.price)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No products available here yet.</p>
        )}
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">Orders</h4>
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {orders.slice(0, MAX_ORDERS_SHOWN).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                <span className="min-w-0 truncate font-medium">
                  {o.product?.name ?? "Deleted product"}{" "}
                  <span className="text-gray-400">× {o.quantity}</span>
                </span>
                <time dateTime={o.created_at} className="shrink-0 text-xs text-gray-500">
                  {formatDate(o.created_at)}
                </time>
              </li>
            ))}
            {orders.length > MAX_ORDERS_SHOWN && (
              <li className="pt-2 text-xs font-semibold text-gray-500">
                +{orders.length - MAX_ORDERS_SHOWN} more
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No orders in this zone yet.</p>
        )}
      </div>
    </article>
  );
}
