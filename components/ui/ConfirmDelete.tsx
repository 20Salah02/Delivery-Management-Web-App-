"use client";

import { useState, useTransition } from "react";
import { Spinner } from "@/components/Spinner";
import type { ActionResult } from "@/lib/types";

/**
 * Two-step delete: "Delete" turns into "Cancel / Yes, delete".
 * `children` are the card's other actions, shown while not confirming.
 */
export function ConfirmDelete({
  itemName,
  onDelete,
  children,
}: {
  itemName: string;
  onDelete: () => Promise<ActionResult<null>>;
  children?: React.ReactNode;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await onDelete();
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
      }
    });
  }

  return (
    <div className={`mt-auto pt-4 transition ${pending ? "opacity-60" : ""}`}>
      {error && (
        <p role="alert" className="mb-3 animate-pop rounded-2xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <div className="flex gap-2">
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
            {children}
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Delete ${itemName}`}
              className="ml-auto min-h-11 rounded-full px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-95 focus-visible:outline-2 focus-visible:outline-red-600"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
