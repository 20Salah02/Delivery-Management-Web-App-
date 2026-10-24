"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { Circle, MapContainer, Marker, TileLayer } from "react-leaflet";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  ZONE_COLOR,
  isDesktopPointer,
  pickedPinIcon,
} from "@/components/map/leaflet-setup";
import { AutoResize, ClickToPick, FitToCircles } from "@/components/map/MapHelpers";
import type { Zone } from "@/lib/types";

export type OrderMapProps = {
  zones: Zone[];
  /** Zones where the selected product is available (highlighted). */
  availableZoneIds: string[];
  /** The zone the order would be assigned to. */
  matchedZoneId: string | null;
  picked: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
};

export default function OrderMap({ zones, availableZoneIds, matchedZoneId, picked, onPick }: OrderMapProps) {
  const available = useMemo(() => new Set(availableZoneIds), [availableZoneIds]);

  // Fit to the product's zones when one is selected, otherwise to all zones.
  const fitCircles = useMemo(() => {
    const focus = available.size > 0 ? zones.filter((z) => available.has(z.id)) : zones;
    return focus.map((z) => ({ lat: z.center_lat, lng: z.center_lng, radiusKm: z.radius_km }));
  }, [zones, available]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom={isDesktopPointer()}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AutoResize />
      <FitToCircles circles={fitCircles} />
      <ClickToPick onPick={onPick} />

      {zones.map((zone) => {
        const isAvailable = available.has(zone.id);
        const isMatched = zone.id === matchedZoneId;
        return (
          <Circle
            key={zone.id}
            center={[zone.center_lat, zone.center_lng]}
            radius={zone.radius_km * 1000}
            // Non-interactive so taps inside a zone still drop the address pin.
            interactive={false}
            pathOptions={
              isAvailable
                ? { color: ZONE_COLOR, weight: isMatched ? 3 : 2, fillOpacity: isMatched ? 0.3 : 0.16 }
                : { color: "#9ca3af", weight: 1.5, dashArray: "5 6", fillOpacity: 0.04 }
            }
          />
        );
      })}

      {picked && (
        <Marker key={`${picked.lat},${picked.lng}`} position={[picked.lat, picked.lng]} icon={pickedPinIcon} />
      )}
    </MapContainer>
  );
}
