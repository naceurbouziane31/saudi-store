import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-cream flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-h1 text-ink-700 mb-3">
        ما لقينا الصفحة اللي تدورين عليها
      </h1>
      <p className="text-ink-500 mb-6 max-w-md">
        ممكن الرابط غلط أو الصفحة انحذفت.
      </p>
      <Link
        href="/"
        className="bg-brand hover:bg-brand-hover text-white px-6 py-3 rounded-full transition-colors duration-base"
      >
        رجعيني للرئيسية
      </Link>
    </main>
  );
}
