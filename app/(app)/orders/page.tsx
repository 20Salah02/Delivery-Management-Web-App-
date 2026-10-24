import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" description="Deliveries placed inside your zones." />
      <EmptyState icon="🧾">No orders yet — place one by picking an address on the map.</EmptyState>
    </>
  );
}
