import Link from "next/link";

const footerLink =
  "inline-flex min-h-11 items-center rounded px-2 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-orange-500";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-orange-500 text-3xl shadow-lg shadow-orange-500/30">
            <span aria-hidden="true">🛵</span>
          </div>
          <p className="text-2xl font-bold tracking-tight">QuickDrop</p>
          <p className="mt-1 text-sm text-gray-500">Fast local delivery, mapped zone by zone.</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>

        <footer className="mt-4 flex justify-center gap-2 text-sm text-gray-500">
          <Link href="/terms" className={footerLink}>
            Terms
          </Link>
          <span aria-hidden="true" className="self-center">
            ·
          </span>
          <Link href="/privacy" className={footerLink}>
            Privacy
          </Link>
        </footer>
      </div>
    </main>
  );
}
