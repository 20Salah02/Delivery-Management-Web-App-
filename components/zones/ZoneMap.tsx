"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  ZONE_COLOR,
  isDesktopPointer,
  pickedPinIcon,
} from "@/components/map/leaflet-setup";
import {
  AutoResize,
  ClickToPick,
  FitToCircles,
  FlyToCircle,
  type CircleArea,
} from "@/components/map/MapHelpers";
import type { Zone } from "@/lib/types";
import { formatKm } from "@/lib/validation";

export type ZoneMapProps = {
  zones: Zone[];
  picked: { lat: number; lng: number } | null;
  previewRadiusKm: number | null;
  focus: CircleArea | null;
  onPick: (lat: number, lng: number) => void;
};

export default function ZoneMap({ zones, picked, previewRadiusKm, focus, onPick }: ZoneMapProps) {
  const circles = useMemo(
    () => zones.map((z) => ({ lat: z.center_lat, lng: z.center_lng, radiusKm: z.radius_km })),
    [zones],
  );

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
      <FitToCircles circles={circles} />
      <FlyToCircle target={focus} />
      <ClickToPick onPick={onPick} />

      {zones.map((zone) => (
        <Circle
          key={zone.id}
          center={[zone.center_lat, zone.center_lng]}
          radius={zone.radius_km * 1000}
          pathOptions={{ color: ZONE_COLOR, weight: 2, fillOpacity: 0.12 }}
        >
          <Popup>
            <span className="block font-bold text-gray-900">{zone.name}</span>
            <span className="block text-gray-500">{formatKm(zone.radius_km)} radius</span>
          </Popup>
        </Circle>
      ))}

      {picked && (
        <>
          {/* Re-keyed on every pick so the drop animation replays. */}
          <Marker key={`${picked.lat},${picked.lng}`} position={[picked.lat, picked.lng]} icon={pickedPinIcon} />
          {previewRadiusKm !== null && (
            <Circle
              center={[picked.lat, picked.lng]}
              radius={previewRadiusKm * 1000}
              pathOptions={{ color: ZONE_COLOR, weight: 2, dashArray: "6 6", fillOpacity: 0.06 }}
              interactive={false}
            />
          )}
        </>
      )}
    </MapContainer>
  );
}
