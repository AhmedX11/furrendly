"use client";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { ProductCardData } from "@/lib/queries";

export function QuickAdd({ p }: { p: ProductCardData }) {
  const add = useCart((s) => s.add);
  const [done, setDone] = useState(false);
  const v = p.firstVariant;
  return (
    <button
      disabled={!v}
      onClick={() => {
        if (!v) return;
        add({
          variantId: v.id,
          productId: p.id,
          slug: p.slug,
          name: p.name,
          brand: p.brand,
          variantLabel: v.label,
          unitPrice: v.price,
          packColor: p.packColor,
          petType: p.petType,
          autoship: false,
          maxStock: v.stock,
        });
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      className="grid size-11 place-items-center rounded-full border-2 border-ink bg-sun text-ink shadow-[0_3px_0_0_#0e3b2e] transition hover:-translate-y-0.5 hover:bg-leaf hover:text-white active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:hover:translate-y-0"
      aria-label={v ? `Add ${p.name} ${v.label} to cart` : `${p.name} is out of stock`}
      title={v ? `Add ${v.label}` : "Out of stock"}
    >
      {done ? <Check className="size-5" /> : <Plus className="size-5" />}
    </button>
  );
}
