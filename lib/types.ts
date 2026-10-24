export type Zone = {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  created_at: string;
};

export const ZONE_COLUMNS = "id, name, center_lat, center_lng, radius_km, created_at";

/** Ensures numeric columns are numbers, whatever the driver returned. */
export function toZone(z: Zone): Zone {
  return {
    ...z,
    center_lat: Number(z.center_lat),
    center_lng: Number(z.center_lng),
    radius_km: Number(z.radius_km),
  };
}

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

export type Order = {
  id: string;
  product_id: string;
  zone_id: string;
  quantity: number;
  address: string | null;
  lat: number;
  lng: number;
  created_at: string;
  product: { name: string; price: number } | null;
  zone: { name: string } | null;
};

export const ORDER_COLUMNS =
  "id, product_id, zone_id, quantity, address, lat, lng, created_at, product:products(name, price), zone:zones(name)";

type OrderRow = Omit<Order, "product"> & { product: { name: string; price: number | string } | null };

export function toOrders(rows: unknown[]): Order[] {
  return (rows as OrderRow[]).map((o) => ({
    ...o,
    lat: Number(o.lat),
    lng: Number(o.lng),
    product: o.product ? { name: o.product.name, price: Number(o.product.price) } : null,
  }));
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
