export type Zone = {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  created_at: string;
};

export const ZONE_COLUMNS = "id, name, center_lat, center_lng, radius_km, created_at";

export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  zone_ids: string[];
};

export const PRODUCT_COLUMNS = "id, name, price, quantity, created_at, product_zones(zone_id)";

type ProductRow = Omit<Product, "zone_ids"> & { product_zones: { zone_id: string }[] | null };

/** Flattens the nested product_zones join into a list of zone ids. */
export function toProducts(rows: unknown[]): Product[] {
  return (rows as ProductRow[]).map(({ product_zones, ...p }) => ({
    ...p,
    price: Number(p.price),
    quantity: Number(p.quantity),
    zone_ids: (product_zones ?? []).map((pz) => pz.zone_id),
  }));
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
