"use client";

import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  ZONE_COLOR,
  isDesktopPointer,
  orderDotIcon,
} from "@/components/map/leaflet-setup";
import { AutoResize, FitToCircles } from "@/components/map/MapHelpers";
import type { Order, Zone } from "@/lib/types";
import { formatDate, formatKm } from "@/lib/validation";

export type OverviewMapProps = { zones: Zone[]; orders: Order[] };

export default function OverviewMap({ zones, orders }: OverviewMapProps) {
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

      {orders.map((order) => (
        <Marker key={order.id} position={[order.lat, order.lng]} icon={orderDotIcon}>
          <Popup>
            <span className="block font-bold text-gray-900">
              {order.product?.name ?? "Order"} × {order.quantity}
            </span>
            <span className="block text-gray-500">📍 {order.zone?.name ?? "—"}</span>
            <span className="block text-xs text-gray-400">{formatDate(order.created_at)}</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
