import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Zones" };

export default function ZonesPage() {
  return (
    <>
      <PageHeader title="Zones" description="Delivery areas defined by a center point and radius." />
      <EmptyState icon="🗺️">No zones yet — create one on the map.</EmptyState>
    </>
  );
}
