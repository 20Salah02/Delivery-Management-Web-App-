"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { createOrder } from "@/app/(app)/orders/actions";
import { Field, FormMessage, SubmitButton } from "@/components/ui/fields";
import type { Product } from "@/lib/types";
import {
  formatCoords,
  formatKm,
  formatMAD,
  parseInteger,
  validateOrder,
  type OrderErrors,
} from "@/lib/validation";

const stepperClass =
  "flex min-h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-xl font-bold text-gray-700 transition hover:bg-gray-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-orange-500 disabled:opacity-40";

export function OrderForm({
  products,
  productId,
  onProductChange,
  picked,
  onClearPick,
  match,
  onSaved,
}: {
  products: Product[];
  productId: string;
  onProductChange: (id: string) => void;
  picked: { lat: number; lng: number } | null;
  onClearPick: () => void;
  match: { name: string; distanceKm: number } | null;
  onSaved: () => void;
}) {
  const [quantity, setQuantity] = useState("1");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<OrderErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (successTimer.current) clearTimeout(successTimer.current);
  }, []);

  const product = products.find((p) => p.id === productId) ?? null;
  const qty = parseInteger(quantity) ?? 0;
  const stock = product?.quantity ?? 0;
  const total = product && qty > 0 ? product.price * qty : null;

  function step(delta: number) {
    const max = stock || Infinity;
    setQuantity(String(Math.min(max, Math.max(1, qty + delta))));
  }

  // A point error belongs to the pin that caused it; moving the pin hides it.
  const pickedKey = picked ? `${picked.lat},${picked.lng}` : "";
  const [errorPickKey, setErrorPickKey] = useState("");
  const pointError = errorPickKey === pickedKey ? errors.point : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);

    const input = { productId, quantity, lat: picked?.lat ?? null, lng: picked?.lng ?? null, address };
    const check = validateOrder(input);
    if (!check.ok) {
      setErrors(check.errors);
      setErrorPickKey(pickedKey);
      return;
    }
    setErrors({});

    startTransition(async () => {
      const result = await createOrder(input);
      if (!result.ok) {
        setErrors(result.fieldErrors ?? {});
        setErrorPickKey(pickedKey);
        // Zone errors are shown right under the address instead.
        if (!result.fieldErrors?.point) setFormError(result.error);
        return;
      }
      setQuantity("1");
      setAddress("");
      onSaved();
      setSuccess(`Order placed! ${result.data.productName} will be delivered from ${result.data.zoneName} 🛵`);
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSuccess(null), 5000);
    });
  }

  return (
    <section
      aria-labelledby="new-order"
      className="animate-fade-up rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6"
    >
      <h2 id="new-order" className="text-lg font-bold">
        New order
      </h2>
      <p className="mt-0.5 text-sm text-gray-500">The address must be inside a zone that delivers the product.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5" noValidate>
        <div>
          <label htmlFor="order-product" className="mb-1.5 block text-sm font-semibold text-gray-800">
            Product
          </label>
          <select
            id="order-product"
            value={productId}
            onChange={(e) => {
              onProductChange(e.target.value);
              setErrors((err) => ({ ...err, product: undefined, quantity: undefined, point: undefined }));
              setFormError(null);
            }}
            disabled={pending}
            aria-invalid={Boolean(errors.product)}
            aria-describedby={errors.product ? "order-product-error" : undefined}
            className={`block min-h-12 w-full rounded-2xl border bg-white px-4 text-base text-gray-900 transition focus:outline-none focus:ring-4 disabled:bg-gray-50 ${
              errors.product
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                : "border-gray-200 focus:border-orange-500 focus:ring-orange-500/15"
            }`}
          >
            <option value="">Choose a product…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {formatMAD(p.price)} · {p.quantity} in stock
              </option>
            ))}
          </select>
          {errors.product && (
            <p id="order-product-error" className="mt-1.5 animate-fade-up text-sm font-medium text-red-600">
              {errors.product}
            </p>
          )}
        </div>

        <Field
          id="order-quantity"
          label="Quantity"
          inputMode="numeric"
          autoComplete="off"
          className="text-center"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={pending}
          error={errors.quantity}
          hint={product ? `${stock} in stock` : undefined}
          before={
            <button type="button" onClick={() => step(-1)} disabled={pending || qty <= 1} aria-label="Decrease quantity" className={stepperClass}>
              −
            </button>
          }
          after={
            <button type="button" onClick={() => step(1)} disabled={pending || (stock > 0 && qty >= stock)} aria-label="Increase quantity" className={stepperClass}>
              +
            </button>
          }
        />

        <div>
          <p className="mb-1.5 text-sm font-semibold text-gray-800">Delivery address</p>
          <div
            aria-live="polite"
            className={`flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-2 transition ${
              pointError
                ? "border-red-400 bg-red-50"
                : picked
                  ? "border-orange-200 bg-orange-50"
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
              <span className="text-sm text-gray-500">Tap the map to set the delivery point</span>
            )}
          </div>

          {pointError ? (
            <p role="alert" className="mt-2 flex animate-pop items-start gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20">
              <span aria-hidden="true">⛔</span>
              {pointError}
            </p>
          ) : (
            picked &&
            product &&
            (match ? (
              <p className="mt-2 animate-fade-up rounded-2xl bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
                ✓ Inside <strong>{match.name}</strong> · {formatKm(match.distanceKm)} from center
              </p>
            ) : (
              <p className="mt-2 animate-fade-up rounded-2xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
                This point looks outside {product.name}&apos;s zones.
              </p>
            ))
          )}
        </div>

        <Field
          id="order-address"
          label="Address note (optional)"
          placeholder="Building, floor, landmark…"
          autoComplete="street-address"
          maxLength={300}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={pending}
          error={errors.address}
        />

        {formError && <FormMessage kind="error">{formError}</FormMessage>}
        {success && <FormMessage kind="success">{success}</FormMessage>}

        {total !== null && (
          <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
            <span className="text-sm font-medium text-gray-500">Total</span>
            <span className="text-lg font-extrabold tracking-tight">{formatMAD(total)}</span>
          </div>
        )}

        <SubmitButton pending={pending} pendingLabel="Checking address…">
          Place order
        </SubmitButton>
      </form>
    </section>
  );
}
