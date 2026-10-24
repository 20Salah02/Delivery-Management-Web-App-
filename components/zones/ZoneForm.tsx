"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { createZone } from "@/app/(app)/zones/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui/fields";
import { formatCoords, validateZone, type ZoneErrors } from "@/lib/validation";

const QUICK_RADII = ["1", "2", "5", "10"];

export function ZoneForm({
  picked,
  radius,
  onRadiusChange,
  onClearPick,
  onSaved,
}: {
  picked: { lat: number; lng: number } | null;
  radius: string;
  onRadiusChange: (value: string) => void;
  onClearPick: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<ZoneErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  // A fresh pick hides the "place a pin" error.
  const pointError = picked ? undefined : errors.point;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);

    const input = { name, radius, lat: picked?.lat ?? null, lng: picked?.lng ?? null };
    const check = validateZone(input);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await createZone(input);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        return;
      }
      setName("");
      onSaved();
      setSuccess(`“${result.data.name}” is live on the map 🎉`);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSuccess(null), 4000);
    });
  }

  return (
    <section
      aria-labelledby="new-zone"
      className="animate-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6"
    >
      <h2 id="new-zone" className="text-lg font-bold">
        New zone
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 space-y-5" noValidate>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-gray-800">Center</p>
          <div
            aria-live="polite"
            className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-2 transition ${
              picked
                ? "border-orange-200 bg-orange-50"
                : pointError
                  ? "border-red-400 bg-red-50"
                  : "border-dashed border-gray-300 bg-gray-50"
            }`}
          >
            <span aria-hidden="true" className={picked ? "animate-pop" : ""}>
              📍
            </span>
            {picked ? (
              <>
                <span className="min-w-0 flex-1 truncate font-mono text-sm text-gray-800">
                  {formatCoords(picked.lat, picked.lng)}
                </span>
                <button
                  type="button"
                  onClick={onClearPick}
                  className="-mr-2 min-h-11 shrink-0 rounded-full px-3 text-sm font-semibold text-orange-700 hover:bg-orange-100 focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  Clear
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500">Tap the map to drop the center pin</span>
            )}
          </div>
          {pointError && (
            <p role="alert" className="mt-1.5 animate-fade-up text-sm font-medium text-red-600">
              {pointError}
            </p>
          )}
        </div>

        <Field
          id="zone-name"
          label="Name"
          placeholder="e.g. Maarif"
          autoComplete="off"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
          error={errors.name}
        />

        <div>
          <Field
            id="zone-radius"
            label="Radius (km)"
            placeholder="e.g. 2.5"
            inputMode="decimal"
            autoComplete="off"
            value={radius}
            onChange={(e) => onRadiusChange(e.target.value)}
            disabled={pending}
            error={errors.radius}
            hint="The dashed circle on the map previews it."
          />
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Quick radius">
            {QUICK_RADII.map((km) => {
              const active = radius.trim() === km;
              return (
                <button
                  key={km}
                  type="button"
                  onClick={() => onRadiusChange(km)}
                  disabled={pending}
                  aria-pressed={active}
                  className={`min-h-11 rounded-full px-4 text-sm font-semibold transition active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500 ${
                    active
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {km} km
                </button>
              );
            })}
          </div>
        </div>

        {formError && <FormMessage kind="error">{formError}</FormMessage>}
        {success && <FormMessage kind="success">{success}</FormMessage>}

        <SubmitButton pending={pending} pendingLabel="Saving…">
          Save zone
        </SubmitButton>
      </form>
    </section>
  );
}
