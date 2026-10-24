import { Spinner } from "@/components/Spinner";

const inputBase =
  "block min-h-12 w-full rounded-2xl border bg-white px-4 text-base text-gray-900 transition placeholder:text-gray-400 focus:outline-none focus:ring-4 disabled:bg-gray-50";
const inputOk = "border-gray-200 focus:border-orange-500 focus:ring-orange-500/15";
const inputBad = "border-red-400 focus:border-red-500 focus:ring-red-500/15";

export function Field({
  id,
  label,
  hint,
  error,
  ...props
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [props["aria-describedby"], hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-800">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className={`${inputBase} ${error ? inputBad : inputOk}`}
        {...props}
        aria-invalid={error ? true : props["aria-invalid"]}
        aria-describedby={describedBy}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 animate-fade-up text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function SubmitButton({
  pending,
  disabled,
  pendingLabel,
  children,
  className = "w-full",
}: {
  pending: boolean;
  disabled?: boolean;
  pendingLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-500 px-6 font-bold text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${className}`}
    >
      {pending && <Spinner />}
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({
  id,
  kind,
  children,
}: {
  id?: string;
  kind: "error" | "success";
  children: React.ReactNode;
}) {
  const styles =
    kind === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : "border-green-200 bg-green-50 text-green-800";
  return (
    <p
      id={id}
      role={kind === "error" ? "alert" : "status"}
      className={`animate-pop rounded-2xl border px-4 py-3 text-sm font-medium break-words ${styles}`}
    >
      {children}
    </p>
  );
}

export function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
      <span className="h-px flex-1 bg-gray-200" />
      or
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
