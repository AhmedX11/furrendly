"use client";
import { useState } from "react";
import { Minus, Plus, Repeat, ShoppingBag, Check } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/lib/cart-store";
import { money } from "@/lib/format";
import { store } from "@/lib/config";

type V = { id: number; label: string; price: number; compareAtPrice: number | null; stock: number };
type P = { id: number; slug: string; name: string; brand: string; packColor: string; petType: string };

export function BuyBox({ product, variants }: { product: P; variants: V[] }) {
  const add = useCart((s) => s.add);
  const firstInStock = variants.find((v) => v.stock > 0) ?? variants[0];
  const [variantId, setVariantId] = useState(firstInStock?.id);
  const [autoship, setAutoship] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const v = variants.find((x) => x.id === variantId)!;
  const soldOut = !v || v.stock <= 0;
  const autoPrice = Math.round(v.price * (1 - store.autoshipDiscount));

  return (
    <div className="mt-8 rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[0_6px_0_0_#0e3b2e]">
      <p className="font-display text-lg font-semibold">Choose a size</p>
      <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
        {variants.map((x) => (
          <button
            key={x.id}
            role="radio"
            aria-checked={x.id === variantId}
            disabled={x.stock <= 0}
            onClick={() => {
              setVariantId(x.id);
              setQty(1);
            }}
            className={clsx(
              "rounded-2xl border-2 px-4 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
              x.id === variantId ? "border-leaf bg-sage-light ring-4 ring-leaf/15" : "border-ink/15 hover:border-ink",
            )}
          >
            <span className="block font-display font-semibold">{x.label}</span>
            <span className="text-sm text-ink/65">{x.stock > 0 ? money(x.price) : "Sold out"}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Purchase option">
        <Option active={!autoship} onClick={() => setAutoship(false)} title="One-time purchase">
          <span className="font-display text-2xl font-bold">{money(v.price)}</span>
          {v.compareAtPrice && <span className="ml-2 text-sm text-ink/45 line-through">{money(v.compareAtPrice)}</span>}
        </Option>
        <Option active={autoship} onClick={() => setAutoship(true)} title={<><Repeat className="size-4" /> Autoship &amp; save 10%</>}>
          <span className="font-display text-2xl font-bold text-leaf-dark">{money(autoPrice)}</span>
          <span className="ml-2 text-sm text-ink/45 line-through">{money(v.price)}</span>
          <span className="mt-1 block text-xs font-bold text-ink/55">Delivered every 4 weeks · skip or cancel anytime</span>
        </Option>
      </div>

      <div className="mt-6 flex gap-3">
        <div className="flex items-center rounded-full border-2 border-ink/15">
          <button className="p-3" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity">
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center font-display text-lg font-bold" aria-live="polite">{qty}</span>
          <button className="p-3 disabled:opacity-30" disabled={qty >= v.stock} onClick={() => setQty(qty + 1)} aria-label="Increase quantity">
            <Plus className="size-4" />
          </button>
        </div>
        <button
          disabled={soldOut}
          onClick={() => {
            add({
              variantId: v.id,
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              variantLabel: v.label,
              unitPrice: v.price,
              packColor: product.packColor,
              petType: product.petType,
              autoship,
              maxStock: v.stock,
              quantity: qty,
            });
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className="btn-primary flex-1 text-lg"
        >
          {soldOut ? "Sold out" : added ? <><Check className="size-5" /> Added!</> : <><ShoppingBag className="size-5" /> Add to basket</>}
        </button>
      </div>
      <p className={clsx("mt-3 text-sm font-bold", v.stock > 0 && v.stock < 30 ? "text-coral" : "text-leaf-dark")}>
        {v.stock <= 0 ? "Out of stock — check back soon" : v.stock < 30 ? `Only ${v.stock} left — order soon!` : "In stock · ships today"}
      </p>
    </div>
  );
}

function Option({ active, onClick, title, children }: { active: boolean; onClick: () => void; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={clsx(
        "rounded-2xl border-2 p-4 text-left transition",
        active ? "border-leaf bg-sage-light ring-4 ring-leaf/15" : "border-ink/15 hover:border-ink",
      )}
    >
      <span className="flex items-center gap-2 text-sm font-extrabold">
        <span className={clsx("grid size-5 place-items-center rounded-full border-2", active ? "border-leaf" : "border-ink/30")}>
          {active && <span className="size-2.5 rounded-full bg-leaf" />}
        </span>
        {title}
      </span>
      <span className="mt-2 block">{children}</span>
    </button>
  );
}
