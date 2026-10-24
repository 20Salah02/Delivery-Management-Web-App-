import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

export const DEFAULT_CENTER: [number, number] = [33.57, -7.59]; // Casablanca
export const DEFAULT_ZOOM = 11;
export const ZONE_COLOR = "#f97316";

// Bundlers break Leaflet's default icon URL detection, so set them explicitly.
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

/** Animated pulsing pin for the point the user picked. */
export const pickedPinIcon = L.divIcon({
  className: "",
  html: '<div class="qd-pin"><span class="qd-pin__pulse"></span><span class="qd-pin__dot"></span></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
});

export function isDesktopPointer(): boolean {
  return window.matchMedia("(min-width: 768px) and (pointer: fine)").matches;
}
