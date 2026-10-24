import { EmptyState } from "@/components/PageHeader";
import type { Order } from "@/lib/types";
import { formatCoords, formatDate, formatMAD } from "@/lib/validation";

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <section aria-labelledby="your-orders" className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <h2 id="your-orders" className="text-xl font-bold">
          Orders
        </h2>
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-bold text-orange-700">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <EmptyState icon="🧾">No orders yet — pick a product and tap an address on the map.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order, i) => (
            <li
              key={order.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function OrderCard({ order }: { order: Order }) {
  const productName = order.product?.name ?? "Deleted product";
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-xl"
        >
          🛵
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold break-words">
            {productName} <span className="font-semibold text-gray-400">× {order.quantity}</span>
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
          </p>
        </div>
        {order.product && (
          <span className="shrink-0 text-right text-sm font-extrabold tracking-tight">
            {formatMAD(order.product.price * order.quantity)}
          </span>
        )}
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-gray-500">Zone</dt>
          <dd className="min-w-0 truncate rounded-full bg-orange-50 px-3 py-0.5 font-semibold text-orange-700 ring-1 ring-orange-200">
            📍 {order.zone?.name ?? "—"}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-gray-500">Location</dt>
          <dd className="font-mono text-xs text-gray-700">{formatCoords(order.lat, order.lng)}</dd>
        </div>
        {order.address && (
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-gray-500">Note</dt>
            <dd className="min-w-0 text-right break-words text-gray-700">{order.address}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
