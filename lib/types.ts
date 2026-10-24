export type Zone = {
  id: string;
  name: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  created_at: string;
};

export const ZONE_COLUMNS = "id, name, center_lat, center_lng, radius_km, created_at";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
