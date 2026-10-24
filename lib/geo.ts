const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance between two points, in kilometres. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export type ZoneLike = { center_lat: number; center_lng: number; radius_km: number };

/** Zones that contain the point, nearest center first. */
export function matchingZones<T extends ZoneLike>(
  lat: number,
  lng: number,
  zones: T[],
): (T & { distanceKm: number })[] {
  return zones
    .map((zone) => ({ ...zone, distanceKm: haversineKm(lat, lng, zone.center_lat, zone.center_lng) }))
    .filter((zone) => zone.distanceKm <= zone.radius_km)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/** The zone an order is assigned to: the nearest center among the zones containing the point. */
export function nearestMatchingZone<T extends ZoneLike>(lat: number, lng: number, zones: T[]) {
  return matchingZones(lat, lng, zones)[0] ?? null;
}
