"use client";

import { deleteZone } from "@/app/(app)/zones/actions";
import { EmptyState } from "@/components/PageHeader";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import type { Zone } from "@/lib/types";
import { formatCoords, formatKm } from "@/lib/validation";

export function ZoneList({ zones, onShow }: { zones: Zone[]; onShow: (zone: Zone) => void }) {
  return (
    <section aria-labelledby="your-zones" className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <h2 id="your-zones" className="text-xl font-bold">
          Your zones
        </h2>
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-bold text-orange-700">
          {zones.length}
        </span>
      </div>

      {zones.length === 0 ? (
        <EmptyState icon="🗺️">No zones yet — create one on the map.</EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone, i) => (
            <li
              key={zone.id}
              className="min-w-0 animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
            >
              <ZoneCard zone={zone} onShow={() => onShow(zone)} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ZoneCard({ zone, onShow }: { zone: Zone; onShow: () => void }) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl"
        >
          📍
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold wrap-anywhere">{zone.name}</h3>
          <p className="mt-0.5 font-mono text-xs text-gray-500">
            {formatCoords(zone.center_lat, zone.center_lng)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
          {formatKm(zone.radius_km)}
        </span>
      </div>

      <ConfirmDelete itemName={zone.name} onDelete={() => deleteZone(zone.id)}>
        <button
          type="button"
          onClick={onShow}
          className="min-h-11 flex-1 rounded-full bg-orange-50 px-4 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          Show on map
        </button>
      </ConfirmDelete>
    </article>
  );
}
