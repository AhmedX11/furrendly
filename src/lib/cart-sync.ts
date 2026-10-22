"use client";
import { useCart } from "./cart-store";

/** Apply server truth (price, stock) to the persisted cart. Returns names of lines that changed. */
export function applySnapshots(snaps: { id: number; price: number; stock: number; active: boolean }[]) {
  const changed: string[] = [];
  useCart.setState((s) => ({
    lines: s.lines
      .map((l) => {
        const snap = snaps.find((x) => x.id === l.variantId);
        if (!snap || !snap.active || snap.stock <= 0) {
          changed.push(`${l.name} (${l.variantLabel}) is now out of stock`);
          return { ...l, quantity: 0 };
        }
        let next = l;
        if (snap.price !== l.unitPrice) {
          changed.push(`${l.name} price updated`);
          next = { ...next, unitPrice: snap.price };
        }
        if (l.quantity > snap.stock) {
          changed.push(`${l.name}: only ${snap.stock} available`);
          next = { ...next, quantity: snap.stock };
        }
        return { ...next, maxStock: snap.stock };
      })
      .filter((l) => l.quantity > 0),
  }));
  return changed;
}
