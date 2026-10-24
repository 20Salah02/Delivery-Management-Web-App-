"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ZONE_COLUMNS, type ActionResult, type Zone } from "@/lib/types";
import { isUuid, validateZone, type ZoneInput } from "@/lib/validation";

const SESSION_EXPIRED = "Your session expired. Please log in again.";

export async function createZone(input: ZoneInput): Promise<ActionResult<Zone>> {
  const parsed = validateZone(input);
  if (!parsed.ok) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: parsed.errors };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { ok: false, error: SESSION_EXPIRED };

  const { name, radiusKm, lat, lng } = parsed.value;
  const { data, error } = await supabase
    .from("zones")
    .insert({ name, radius_km: radiusKm, center_lat: lat, center_lng: lng })
    .select(ZONE_COLUMNS)
    .single();

  if (error) return { ok: false, error: "Couldn't save the zone. Please try again." };

  revalidatePath("/zones");
  revalidatePath("/");
  return { ok: true, data: data as Zone };
}

export async function deleteZone(id: string): Promise<ActionResult<null>> {
  if (!isUuid(id)) return { ok: false, error: "Unknown zone." };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return { ok: false, error: SESSION_EXPIRED };

  const { error } = await supabase.from("zones").delete().eq("id", id);
  if (error) {
    // 23503 = foreign key violation: orders still point at this zone.
    if (error.code === "23503") {
      return { ok: false, error: "This zone has orders, so it can't be deleted." };
    }
    return { ok: false, error: "Couldn't delete the zone. Please try again." };
  }

  revalidatePath("/zones");
  revalidatePath("/");
  return { ok: true, data: null };
}
