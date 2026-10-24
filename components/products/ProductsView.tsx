import { SetupCard } from "@/components/ui/SetupCard";
import type { Product, Zone } from "@/lib/types";
import { ProductForm } from "./ProductForm";
import { ProductList } from "./ProductList";

export function ProductsView({ zones, products }: { zones: Zone[]; products: Product[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
      <div className="min-w-0 lg:sticky lg:top-20">
        {zones.length > 0 ? (
          <ProductForm zones={zones} />
        ) : (
          <SetupCard
            icon="🗺️"
            href="/zones"
            title="Create a zone first"
            text="Products are sold inside delivery zones. Draw your first zone on the map, then come back to add products."
            cta="Go to Zones →"
          />
        )}
      </div>
      <ProductList products={products} zones={zones} />
    </div>
  );
}
