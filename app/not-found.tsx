import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-pad flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-black uppercase tracking-[0.18em] text-ember">404</p>
      <h1 className="mt-3 text-3xl font-black text-charcoal sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
        The page you are looking for does not exist or may have moved.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back home
      </Link>
    </main>
  );
}
