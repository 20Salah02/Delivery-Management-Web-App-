export function LoadError({ what }: { what: string }) {
  return (
    <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      Couldn&apos;t load your {what}. Refresh the page to try again.
    </p>
  );
}
