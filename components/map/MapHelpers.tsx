"use client";

import { useEffect } from "react";
import L from "leaflet";
import { useMap, useMapEvents } from "react-leaflet";

export type CircleArea = { lat: number; lng: number; radiusKm: number };

function circleBounds({ lat, lng, radiusKm }: CircleArea) {
  return L.latLng(lat, lng).toBounds(radiusKm * 2000);
}

/** Keeps tiles correct when the container resizes (rotation, layout changes). */
export function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

/** Fits the view to all circles whenever the set of circles changes. */
export function FitToCircles({ circles }: { circles: CircleArea[] }) {
  const map = useMap();
  // A stable string key, so the effect only re-runs when the circles really change.
  const key = JSON.stringify(circles.map((c) => [c.lat, c.lng, c.radiusKm]));

  useEffect(() => {
    const parsed = (JSON.parse(key) as [number, number, number][]).map(
      ([lat, lng, radiusKm]) => ({ lat, lng, radiusKm }),
    );
    if (parsed.length === 0) return;
    const bounds = parsed.slice(1).reduce((b, c) => b.extend(circleBounds(c)), circleBounds(parsed[0]));
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 14 });
  }, [map, key]);

  return null;
}

/** Smoothly flies to one circle when `target` changes. */
export function FlyToCircle({ target }: { target: CircleArea | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyToBounds(circleBounds(target), { padding: [24, 24], duration: 0.6 });
  }, [map, target]);
  return null;
}

export function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}
