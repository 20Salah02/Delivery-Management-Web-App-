"use client";

import { useState, useTransition } from "react";
import { deleteZone } from "@/app/(app)/zones/actions";
import { EmptyState } from "@/components/PageHeader";
import { Spinner } from "@/components/Spinner";
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
              className="animate-fade-up"
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
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteZone(zone.id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  return (
    <article
      className={`flex h-full flex-col rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md ${
        pending ? "scale-[0.98] opacity-50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-xl"
        >
          📍
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold break-words">{zone.name}</h3>
          <p className="mt-0.5 font-mono text-xs text-gray-500">
            {formatCoords(zone.center_lat, zone.center_lng)}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
          {formatKm(zone.radius_km)}
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-3 animate-pop rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        {confirming ? (
          <>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="min-h-11 flex-1 rounded-full bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="flex min-h-11 flex-1 animate-pop items-center justify-center gap-2 rounded-full bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              {pending && <Spinner />}
              {pending ? "Deleting…" : "Yes, delete"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onShow}
              className="min-h-11 flex-1 rounded-full bg-orange-50 px-4 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500"
            >
              Show on map
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Delete ${zone.name}`}
              className="min-h-11 rounded-full px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95 focus-visible:outline-2 focus-visible:outline-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}
