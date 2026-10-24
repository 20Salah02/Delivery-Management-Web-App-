import { Suspense } from "react";
import Link from "next/link";
import { BottomNav, TopNav } from "@/components/shell/NavLinks";
import { LogoutButton } from "@/components/shell/LogoutButton";
import { UserEmail } from "@/components/shell/UserEmail";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-xl font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-xl bg-orange-500 text-lg">
              🛵
            </span>
            QuickDrop
          </Link>
          <div className="ml-2">
            <TopNav />
          </div>
          <div className="ml-auto flex min-w-0 items-center gap-1">
            <Suspense fallback={<span className="h-4 w-24 animate-pulse rounded bg-gray-100" />}>
              <UserEmail />
            </Suspense>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 px-4 pt-6 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-10">
        {children}
      </main>

      <BottomNav />
    </>
  );
}
