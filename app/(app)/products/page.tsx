import type { Metadata } from "next";
import { EmptyState, PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Products" description="What you deliver, and which zones it's available in." />
      <EmptyState icon="📦">No products yet — add one and assign it to a zone.</EmptyState>
    </>
  );
}
