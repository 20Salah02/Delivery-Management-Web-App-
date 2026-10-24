// Shared by forms (instant feedback) and server actions (source of truth).

export const MAX_RADIUS_KM = 100;

/** Parses "2.5" or "2,5" into a number; returns null for anything else. */
export function parseDecimal(raw: string): number | null {
  const value = raw.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(value)) return null;
  return Number(value);
}

export function isValidLatLng(lat: unknown, lng: unknown): boolean {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
  );
}

export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

export type ZoneInput = { name: string; radius: string; lat: number | null; lng: number | null };
export type ZoneErrors = Partial<Record<"name" | "radius" | "point", string>>;

export function validateZone(input: ZoneInput):
  | { ok: true; value: { name: string; radiusKm: number; lat: number; lng: number } }
  | { ok: false; errors: ZoneErrors } {
  const errors: ZoneErrors = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const radiusKm = typeof input.radius === "string" ? parseDecimal(input.radius) : null;

  if (!name) errors.name = "Give the zone a name.";
  else if (name.length > 100) errors.name = "Keep the name under 100 characters.";

  if (radiusKm === null) errors.radius = "Enter the radius as a number, e.g. 2.5";
  else if (radiusKm <= 0) errors.radius = "Radius must be greater than 0.";
  else if (radiusKm > MAX_RADIUS_KM) errors.radius = `Radius can't exceed ${MAX_RADIUS_KM} km.`;

  if (!isValidLatLng(input.lat, input.lng)) errors.point = "Tap the map to place the zone center.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { name, radiusKm: radiusKm as number, lat: input.lat as number, lng: input.lng as number },
  };
}

export function formatKm(km: number): string {
  return `${Number(km.toFixed(2))} km`;
}

export function formatCoords(lat: number, lng: number): string {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
