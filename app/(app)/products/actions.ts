"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types";
import { isUuid, validateProduct, type ProductInput } from "@/lib/validation";

const SESSION_EXPIRED = "Your session expired. Please log in again.";

export async function createProduct(input: ProductInput): Promise<ActionResult<{ name: string }>> {
  const parsed = validateProduct(input);
  if (!parsed.ok) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.errors };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { ok: false, error: SESSION_EXPIRED };

  const { name, price, quantity, zoneIds } = parsed.value;

  // RLS only returns the user's own zones, so a shorter list means a foreign or deleted zone.
  const { data: ownedZones, error: zonesError } = await supabase
    .from("zones")
    .select("id")
    .in("id", zoneIds);
  if (zonesError) return { ok: false, error: "Couldn't check your zones. Please try again." };
  if ((ownedZones ?? []).length !== zoneIds.length) {
    return {
      ok: false,
      error: "One of the selected zones no longer exists. Refresh the page and try again.",
      fieldErrors: { zones: "Re-select the zones." },
    };
  }

  const { data: product, error } = await supabase
    .from("products")
    .insert({ name, price, quantity })
    .select("id, name")
    .single();
  if (error || !product) return { ok: false, error: "Couldn't save the product. Please try again." };

  const { error: linkError } = await supabase
    .from("product_zones")
    .insert(zoneIds.map((zone_id) => ({ product_id: product.id, zone_id })));
  if (linkError) {
    // No transactions over the REST API: undo the product so we never keep a half-saved one.
    await supabase.from("products").delete().eq("id", product.id);
    return { ok: false, error: "Couldn't assign the zones. Nothing was saved — please try again." };
  }

  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true, data: { name: product.name as string } };
}

export async function deleteProduct(id: string): Promise<ActionResult<null>> {
  if (!isUuid(id)) return { ok: false, error: "Unknown product." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { ok: false, error: SESSION_EXPIRED };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    // 23503 = foreign key violation: orders still reference this product.
    if (error.code === "23503") {
      return { ok: false, error: "This product has orders, so it can't be deleted." };
    }
    return { ok: false, error: "Couldn't delete the product. Please try again." };
  }

  revalidatePath("/products");
  revalidatePath("/");
  return { ok: true, data: null };
}
