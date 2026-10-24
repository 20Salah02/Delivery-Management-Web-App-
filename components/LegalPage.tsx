import Link from "next/link";

export const CONTACT_EMAIL = "contact@quickdrop.example";
export const LEGAL_UPDATED = "October 24, 2026";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="flex-1 px-4 py-8 md:py-12">
      <article className="mx-auto max-w-prose">
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-gray-900 focus-visible:outline-2 focus-visible:outline-orange-500"
        >
          <span aria-hidden="true">🛵</span> QuickDrop
        </Link>

        <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-900">
          <strong>Demo notice:</strong> QuickDrop is a demo built for a technical evaluation project.
          It is not a commercial service. Please don&apos;t enter real customer data.
        </div>

        <h1 className="mt-8 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {LEGAL_UPDATED}</p>

        <div className="mt-8 space-y-4 leading-relaxed wrap-anywhere text-gray-700 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-gray-900 [&_li]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1">
          {children}
        </div>

        <nav className="mt-12 flex flex-wrap gap-x-4 border-t border-gray-200 pt-6 text-sm text-gray-500">
          <Link href="/terms" className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 hover:text-gray-900">
            Terms
          </Link>
          <Link href="/privacy" className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/login" className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 hover:text-gray-900">
            Log in
          </Link>
        </nav>
      </article>
    </main>
  );
}
