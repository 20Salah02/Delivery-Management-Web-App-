export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1 text-gray-500">{description}</p>
    </div>
  );
}

export function EmptyState({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
      <div aria-hidden="true" className="text-4xl">
        {icon}
      </div>
      <p className="mt-3 text-gray-600">{children}</p>
    </div>
  );
}
