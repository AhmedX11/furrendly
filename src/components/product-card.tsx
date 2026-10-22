import Link from "next/link";
import { Star } from "lucide-react";
import { ProductPack } from "./art";
import { money } from "@/lib/format";
import type { ProductCardData } from "@/lib/queries";
import { QuickAdd } from "./quick-add";

export function ProductCard({ p }: { p: ProductCardData }) {
  return (
    <article className="group relative flex flex-col rounded-[1.75rem] border-2 border-ink/10 bg-white p-3 transition duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-[0_6px_0_0_#0e3b2e]">
      <Link href={`/product/${p.slug}`} className="relative block overflow-hidden rounded-[1.35rem]" style={{ background: `${p.packColor}1f` }}>
        <div className="aspect-square p-6 transition duration-300 group-hover:scale-105 group-hover:-rotate-2">
          <ProductPack color={p.packColor} name={p.name} brand={p.brand} petType={p.petType} />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.onSale && <span className="rounded-full bg-coral px-2.5 py-1 text-xs font-extrabold text-white">Sale</span>}
          {p.badges.slice(0, 1).map((b) => (
            <span key={b} className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-extrabold text-ink">{b}</span>
          ))}
        </div>
        {!p.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-cream/70 font-display text-lg font-bold">Out of stock</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col px-2 pt-3 pb-1">
        <p className="text-xs font-extrabold uppercase tracking-wider text-leaf">{p.brand}</p>
        <Link href={`/product/${p.slug}`} className="mt-0.5 font-display text-lg font-semibold leading-snug hover:text-leaf-dark">
          {p.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-sm text-ink/60">
          <Star className="size-4 fill-sun text-sun" />
          <span className="font-bold text-ink">{p.rating.toFixed(1)}</span>
          <span>({p.reviewCount.toLocaleString()})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <span className="text-xs text-ink/50">from</span>
            <p className="font-display text-xl font-bold leading-none">{money(p.minPrice)}</p>
          </div>
          <QuickAdd p={p} />
        </div>
      </div>
    </article>
  );
}
