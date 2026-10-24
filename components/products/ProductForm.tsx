"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { createProduct } from "@/app/(app)/products/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui/fields";
import type { Zone } from "@/lib/types";
import { MAX_QUANTITY, parseInteger, validateProduct, type ProductErrors } from "@/lib/validation";

const stepperClass =
  "flex min-h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xl font-bold text-gray-700 transition hover:bg-gray-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500 disabled:opacity-40";

export function ProductForm({ zones }: { zones: Zone[] }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [zoneIds, setZoneIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<ProductErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  const qty = parseInteger(quantity) ?? 0;
  const allSelected = zoneIds.length === zones.length;

  function toggleZone(id: string) {
    setZoneIds((ids) => (ids.includes(id) ? ids.filter((z) => z !== id) : [...ids, id]));
  }

  function step(delta: number) {
    setQuantity(String(Math.min(MAX_QUANTITY, Math.max(1, qty + delta))));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);

    const input = { name, price, quantity, zoneIds };
    const check = validateProduct(input);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await createProduct(input);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setFormError(result.error);
        return;
      }
      setName("");
      setPrice("");
      setQuantity("1");
      setZoneIds([]);
      setSuccess(`“${result.data.name}” added to your catalog.`);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSuccess(null), 4000);
    });
  }

  return (
    <section
      aria-labelledby="new-product"
      className="animate-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6"
    >
      <h2 id="new-product" className="text-lg font-bold">
        New product
      </h2>
      <p className="mt-0.5 text-sm text-gray-500">It can only be ordered inside the zones you pick.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
        <Field
          id="product-name"
          label="Name"
          placeholder="e.g. Chicken tajine"
          autoComplete="off"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={pending}
          error={errors.name}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <Field
            id="product-price"
            label="Price"
            placeholder="0.00"
            inputMode="decimal"
            autoComplete="off"
            suffix="MAD"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            disabled={pending}
            error={errors.price}
          />
          <Field
            id="product-quantity"
            label="Quantity"
            inputMode="numeric"
            autoComplete="off"
            className="text-center"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={pending}
            error={errors.quantity}
            before={
              <button type="button" onClick={() => step(-1)} disabled={pending || qty <= 1} aria-label="Decrease quantity" className={stepperClass}>
                −
              </button>
            }
            after={
              <button type="button" onClick={() => step(1)} disabled={pending || qty >= MAX_QUANTITY} aria-label="Increase quantity" className={stepperClass}>
                +
              </button>
            }
          />
        </div>

        <fieldset className="relative" aria-describedby={errors.zones ? "zones-error" : undefined}>
          <legend className="flex min-h-11 items-center text-sm font-semibold text-gray-800">
            Available in&nbsp;
            <span className="font-normal text-gray-500">
              ({zoneIds.length}/{zones.length})
            </span>
          </legend>
          <button
            type="button"
            onClick={() => setZoneIds(allSelected ? [] : zones.map((z) => z.id))}
            disabled={pending}
            className="absolute top-0 -right-2 min-h-11 rounded-full px-3 text-sm font-semibold text-orange-700 hover:bg-orange-50 focus-visible:outline-2 focus-visible:outline-orange-500"
          >
            {allSelected ? "Clear all" : "Select all"}
          </button>
          <div className="flex flex-wrap gap-2">
            {zones.map((zone) => {
              const checked = zoneIds.includes(zone.id);
              return (
                <label
                  key={zone.id}
                  className={`flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition select-none active:scale-95 has-focus-visible:outline-2 has-focus-visible:outline-orange-500 ${
                    checked
                      ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/25"
                      : errors.zones
                        ? "border-red-300 bg-white text-gray-700"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleZone(zone.id)}
                    disabled={pending}
                  />
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      checked ? "bg-white text-orange-600" : "border border-gray-300"
                    }`}
                  >
                    {checked && "✓"}
                  </span>
                  <span className="truncate">{zone.name}</span>
                </label>
              );
            })}
          </div>
          {errors.zones && (
            <p id="zones-error" className="mt-2 animate-fade-up text-sm font-medium text-red-600">
              {errors.zones}
            </p>
          )}
        </fieldset>

        {formError && <FormMessage kind="error">{formError}</FormMessage>}
        {success && <FormMessage kind="success">{success}</FormMessage>}

        <SubmitButton pending={pending} pendingLabel="Saving…">
          Save product
        </SubmitButton>
      </form>
    </section>
  );
}
