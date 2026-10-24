import { SetupCard } from "@/components/ui/SetupCard";
import type { Order, Product, Zone } from "@/lib/types";
import { OrderList } from "./OrderList";
import { OrdersManager } from "./OrdersManager";

export function OrdersView({ zones, products, orders }: { zones: Zone[]; products: Product[]; orders: Order[] }) {
  return (
    <>
      {zones.length === 0 ? (
        <SetupCard
          icon="🗺️"
          href="/zones"
          title="Create a delivery zone first"
          text="Orders are only accepted inside your zones. Draw one on the map to get started."
          cta="Go to Zones →"
        />
      ) : products.length === 0 ? (
        <SetupCard
          icon="📦"
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
