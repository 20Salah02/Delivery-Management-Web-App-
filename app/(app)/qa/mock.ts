import type { Order, Product, Zone } from "@/lib/types";
const t = "2026-10-24T10:00:00.000Z";
export const zones: Zone[] = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Maarif", center_lat: 33.58, center_lng: -7.632, radius_km: 1.5, created_at: t },
  { id: "00000000-0000-4000-8000-000000000002", name: "Ain Diab", center_lat: 33.593, center_lng: -7.675, radius_km: 2, created_at: t },
  { id: "00000000-0000-4000-8000-000000000003", name: "Casa Centre with a very very long zone name for overflow testing", center_lat: 33.595, center_lng: -7.618, radius_km: 2, created_at: t },
];
const [a, b, c] = zones.map((z) => z.id);
export const products: Product[] = [
  { id: "10000000-0000-4000-8000-000000000001", name: "Pizza Margherita", price: 65, quantity: 40, created_at: t, zone_ids: [a, c] },
  { id: "10000000-0000-4000-8000-000000000002", name: "Tacos Poulet", price: 45, quantity: 60, created_at: t, zone_ids: [a, b, c] },
  { id: "10000000-0000-4000-8000-000000000003", name: "Msemen", price: 8, quantity: 100, created_at: t, zone_ids: [c] },
  { id: "10000000-0000-4000-8000-000000000004", name: "Supercalifragilisticexpialidocious burger deluxe", price: 1250.5, quantity: 50, created_at: t, zone_ids: [] },
];
export const orders: Order[] = [
  { id: "20000000-0000-4000-8000-000000000001", product_id: products[0].id, zone_id: a, quantity: 2, address: "Bd Zerktouni, near Twin Center", lat: 33.5815, lng: -7.6345, created_at: t, product: { name: "Pizza Margherita", price: 65 }, zone: { name: "Maarif" } },
  { id: "20000000-0000-4000-8000-000000000002", product_id: products[1].id, zone_id: b, quantity: 3, address: null, lat: 33.5925, lng: -7.679, created_at: t, product: { name: "Tacos Poulet", price: 45 }, zone: { name: "Ain Diab" } },
  { id: "20000000-0000-4000-8000-000000000003", product_id: products[2].id, zone_id: c, quantity: 6, address: "Averyveryverylongaddresswithoutanyspacesatalltotestbreakingwordsproperly", lat: 33.594, lng: -7.615, created_at: t, product: { name: "Msemen", price: 8 }, zone: { name: zones[2].name } },
];
