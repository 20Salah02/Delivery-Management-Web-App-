import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ZonesManager } from "@/components/zones/ZonesManager";
import { createClient } from "@/lib/supabase/server";
import { ZONE_COLUMNS, type Zone } from "@/lib/types";

export const metadata: Metadata = { title: "Zones" };

async function ZonesContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("zones")
    .select(ZONE_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        Couldn&apos;t load your zones. Refresh the page to try again.
      </p>
    );
  }

  return <ZonesManager zones={(data ?? []) as Zone[]} />;
}

function ZonesSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-[50vh] animate-pulse rounded-3xl bg-gray-200 md:h-[60vh] lg:h-[70vh]" />
      <div className="h-64 animate-pulse rounded-3xl bg-gray-200" />
    </div>
  );
}

export default function ZonesPage() {
  return (
    <>
      <PageHeader title="Zones" description="Drop a pin, pick a radius — that's your delivery area." />
      <Suspense fallback={<ZonesSkeleton />}>
        <ZonesContent />
      </Suspense>
    </>
  );
}
