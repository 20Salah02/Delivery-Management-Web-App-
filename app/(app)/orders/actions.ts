"use server";

import { revalidatePath } from "next/cache";
import { matchingZones, nearestMatchingZone } from "@/lib/geo";
import { createClient } from "@/lib/supabase/server";
import { ZONE_COLUMNS, toZone, type ActionResult, type Zone } from "@/lib/types";
import {
  OUTSIDE_ALL_ZONES,
  OUTSIDE_PRODUCT_ZONES,
  validateOrder,
  type OrderInput,
} from "@/lib/validation";

type ProductWithZones = {
  id: string;
  name: string;
  quantity: number;
  product_zones: { zones: Zone | null }[] | null;
};

/**
 * Creates an order only if it passes every server-side rule:
 * valid shape, 0 < quantity <= stock, and the point lies inside at least one
 * zone (haversine) where the product is available. Assigns the nearest such zone.
 */
export async function createOrder(
  input: OrderInput,
): Promise<ActionResult<{ zoneName: string; productName: string }>> {
  const parsed = validateOrder(input);
  if (!parsed.ok) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.errors };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { ok: false, error: "Your session expired. Please log in again." };

  const { productId, quantity, lat, lng, address } = parsed.value;

  // RLS guarantees we only ever see the user's own product and zones.
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(`id, name, quantity, product_zones(zones(${ZONE_COLUMNS}))`)
    .eq("id", productId)
    .maybeSingle();
  if (productError) return { ok: false, error: "Couldn't check the product. Please try again." };
  if (!productData) {
    return {
      ok: false,
      error: "That product no longer exists.",
      fieldErrors: { product: "Choose another product." },
    };
  }

  const product = productData as unknown as ProductWithZones;
  const stock = Number(product.quantity);
  if (quantity > stock) {
    const message = `Only ${stock} in stock for ${product.name}.`;
    return { ok: false, error: message, fieldErrors: { quantity: message } };
  }

  const productZones = (product.product_zones ?? [])
    .map((pz) => pz.zones)
    .filter((z): z is Zone => z !== null)
    .map(toZone);

  const zone = nearestMatchingZone(lat, lng, productZones);
  if (!zone) {
    // Tell the user whether they missed every zone or just this product's zones.
    const { data: allZones } = await supabase.from("zones").select(ZONE_COLUMNS);
    const insideAny = matchingZones(lat, lng, ((allZones ?? []) as Zone[]).map(toZone)).length > 0;
    const error = insideAny ? OUTSIDE_PRODUCT_ZONES : OUTSIDE_ALL_ZONES;
    return { ok: false, error, fieldErrors: { point: error } };
  }

  const { error } = await supabase.from("orders").insert({
    product_id: product.id,
    zone_id: zone.id,
    quantity,
    lat,
    lng,
    address,
  });
  if (error) return { ok: false, error: "Couldn't save the order. Please try again." };

  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true, data: { zoneName: zone.name, productName: product.name } };
}
