import Link from "next/link";
import { CatPeek } from "@/components/art";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 pt-28 text-center">
      <div className="relative inline-block">
        <CatPeek className="absolute -top-16 left-1/2 w-28 -translate-x-1/2" color="#12a27a" />
        <p className="sticker-text font-display text-9xl font-bold">404</p>
      </div>
      <h1 className="mt-4 text-3xl font-bold">This page wandered off</h1>
      <p className="mt-2 text-ink/60">Probably chasing a squirrel. Let&apos;s get you back.</p>
      <Link href="/shop" className="btn-primary mt-8">Back to the shop</Link>
    </div>
  );
}
