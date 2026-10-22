import { store } from "./config";

export type PricedLine = { unitPrice: number; quantity: number; autoship: boolean };

/** Single source of truth for totals — used by the cart UI and re-run on the server at checkout. */
export function computeTotals(lines: PricedLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const discount = Math.round(
    lines
      .filter((l) => l.autoship)
      .reduce((s, l) => s + l.unitPrice * l.quantity * store.autoshipDiscount, 0),
  );
  const afterDiscount = subtotal - discount;
  const shipping =
    lines.length === 0 || afterDiscount >= store.freeShippingThreshold ? 0 : store.shippingFee;
  return { subtotal, discount, shipping, total: afterDiscount + shipping };
}
