"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { CircleArea } from "@/components/map/MapHelpers";
import type { Zone } from "@/lib/types";
import { MAX_RADIUS_KM, parseDecimal } from "@/lib/validation";
import { ZoneForm } from "./ZoneForm";
import { ZoneList } from "./ZoneList";

const ZoneMap = dynamic(() => import("./ZoneMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-200" />,
});

export function ZonesManager({ zones }: { zones: Zone[] }) {
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState("");
  const [focus, setFocus] = useState<CircleArea | null>(null);

  const radiusKm = parseDecimal(radius);
  const previewRadiusKm = radiusKm && radiusKm <= MAX_RADIUS_KM ? radiusKm : null;

  return (
    <>
      <div className="grid gap-6 md:landscape:grid-cols-[minmax(0,1fr)_340px] lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <section aria-label="Map" className="min-w-0 md:landscape:sticky md:landscape:top-20">
          <div className="relative z-0 h-[50vh] w-full overflow-hidden rounded-3xl bg-gray-200 shadow-sm ring-1 ring-black/5 md:h-[60vh] lg:h-[70vh]">
            <ZoneMap
              zones={zones}
              picked={picked}
              previewRadiusKm={previewRadiusKm}
              focus={focus}
              onPick={(lat, lng) => setPicked({ lat, lng })}
            />
          </div>
        </section>

        <ZoneForm
          picked={picked}
          radius={radius}
          onRadiusChange={setRadius}
          onClearPick={() => setPicked(null)}
          onSaved={() => {
            setPicked(null);
            setRadius("");
          }}
        />
      </div>

      <ZoneList zones={zones} onShow={(zone) => {
        setFocus({ lat: zone.center_lat, lng: zone.center_lng, radiusKm: zone.radius_km });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }} />
    </>
  );
}
