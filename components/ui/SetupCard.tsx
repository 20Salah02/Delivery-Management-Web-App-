import Link from "next/link";

/** Highlighted call-to-action shown when a prerequisite (zone, product) is missing. */
export function SetupCard({
  icon,
  href,
  title,
  text,
  cta,
}: {
  icon: string;
  href: string;
  title: string;
  text: string;
  cta: string;
}) {
  return (
    <section className="animate-fade-up rounded-3xl bg-linear-to-br from-orange-500 to-amber-500 p-6 text-white shadow-lg shadow-orange-500/25">
      <div aria-hidden="true" className="text-4xl">
        {icon}
      </div>
      <h2 className="mt-3 text-lg font-bold">{title}</h2>
      <p className="mt-1 text-sm text-white/90">{text}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white px-6 font-bold text-orange-600 shadow-sm transition hover:bg-orange-50 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-auto"
      >
        {cta}
      </Link>
    </section>
  );
}
