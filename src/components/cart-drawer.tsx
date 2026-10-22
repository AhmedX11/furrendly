"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { X, Minus, Plus, Trash2, Repeat, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/lib/cart-store";
import { computeTotals } from "@/lib/pricing";
import { money } from "@/lib/format";
import { store } from "@/lib/config";
import { ProductPack, CatPeek } from "./art";

export function FreeShippingMeter({ amount }: { amount: number }) {
  const pct = Math.min(100, (amount / store.freeShippingThreshold) * 100);
  const left = store.freeShippingThreshold - amount;
  return (
    <div className="rounded-2xl bg-sage-light p-4">
      <p className="text-sm font-bold">
        {left > 0 ? (
          <>You&apos;re <span className="text-leaf-dark">{money(left)}</span> away from free delivery 🚚</>
        ) : (
          <>Woohoo! You&apos;ve unlocked <span className="text-leaf-dark">free delivery</span> 🎉</>
        )}
      </p>
      <div className="mt-2.5 h-3 overflow-hidden rounded-full border-2 border-ink bg-white">
        <div className="h-full rounded-full bg-leaf transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { lines, open, setOpen, setQty, remove, toggleAutoship } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);
  if (!mounted) return null;

  const totals = computeTotals(lines);

  return (
    <div className={clsx("fixed inset-0 z-50", !open && "pointer-events-none")} aria-hidden={!open}>
      <div
        className={clsx("absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity", open ? "opacity-100" : "opacity-0")}
        onClick={() => setOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out sm:rounded-l-[2rem] sm:border-l-2 sm:border-ink",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-2xl font-bold">Your basket</h2>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-sage-light" aria-label="Close cart">
            <X />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="relative grid size-36 place-items-center rounded-full bg-sage">
              <CatPeek className="absolute -top-10 w-28" />
              <ShoppingBag className="size-12 text-white" />
            </div>
            <p className="mt-6 font-display text-xl font-semibold">Your basket is feeling hungry</p>
            <p className="mt-1 text-ink/60">Let&apos;s find something tasty for your best friend.</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn-primary mt-6">
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6">
              <FreeShippingMeter amount={totals.subtotal - totals.discount} />
            </div>
            <ul className="mt-4 flex-1 space-y-3 overflow-y-auto px-6 pb-4">
              {lines.map((l) => (
                <li key={l.variantId} className="flex gap-3 rounded-3xl border-2 border-ink/10 bg-white p-3">
                  <Link href={`/product/${l.slug}`} onClick={() => setOpen(false)} className="w-20 shrink-0 rounded-2xl p-1" style={{ background: `${l.packColor}22` }}>
                    <ProductPack color={l.packColor} name={l.name} brand={l.brand} petType={l.petType} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-display font-semibold leading-tight">{l.name}</p>
                        <p className="text-sm text-ink/60">{l.variantLabel}</p>
                      </div>
                      <button onClick={() => remove(l.variantId)} className="p-1 text-ink/40 hover:text-coral" aria-label={`Remove ${l.name}`}>
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleAutoship(l.variantId)}
                      className={clsx(
                        "mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold transition",
                        l.autoship ? "bg-leaf text-white" : "bg-sage-light text-leaf-dark hover:bg-sage/50",
                      )}
                    >
                      <Repeat className="size-3" /> {l.autoship ? "Autoship · 10% off" : "Switch to autoship, save 10%"}
                    </button>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border-2 border-ink/15">
                        <button onClick={() => setQty(l.variantId, l.quantity - 1)} className="p-1.5" aria-label="Decrease">
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{l.quantity}</span>
                        <button
                          onClick={() => setQty(l.variantId, l.quantity + 1)}
                          disabled={l.quantity >= l.maxStock}
                          className="p-1.5 disabled:opacity-30"
                          aria-label="Increase"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="font-display font-semibold">{money(l.unitPrice * l.quantity)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t-2 border-ink/10 bg-white px-6 py-5 space-y-1.5">
              <Row label="Subtotal" value={money(totals.subtotal)} />
              {totals.discount > 0 && <Row label="Autoship savings" value={`−${money(totals.discount)}`} accent />}
              <Row label="Delivery" value={totals.shipping === 0 ? "Free" : money(totals.shipping)} />
              <div className="flex items-center justify-between pt-2 font-display text-xl font-bold">
                <span>Total</span>
                <span>{money(totals.total)}</span>
              </div>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full text-lg">
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={clsx("flex justify-between text-sm", accent ? "font-bold text-leaf-dark" : "text-ink/70")}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
