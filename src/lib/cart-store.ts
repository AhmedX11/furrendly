"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  variantId: number;
  productId: number;
  slug: string;
  name: string;
  brand: string;
  variantLabel: string;
  unitPrice: number;
  packColor: string;
  petType: string;
  quantity: number;
  autoship: boolean;
  maxStock: number;
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  setQty: (variantId: number, qty: number) => void;
  toggleAutoship: (variantId: number) => void;
  remove: (variantId: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (line) =>
        set((s) => {
          const qty = line.quantity ?? 1;
          const existing = s.lines.find((l) => l.variantId === line.variantId);
          if (existing) {
            return {
              open: true,
              lines: s.lines.map((l) =>
                l.variantId === line.variantId
                  ? { ...l, quantity: Math.min(l.quantity + qty, l.maxStock), autoship: line.autoship || l.autoship }
                  : l,
              ),
            };
          }
          return { open: true, lines: [...s.lines, { ...line, quantity: Math.min(qty, line.maxStock) }] };
        }),
      setQty: (variantId, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(Math.max(qty, 0), l.maxStock) } : l))
            .filter((l) => l.quantity > 0),
        })),
      toggleAutoship: (variantId) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.variantId === variantId ? { ...l, autoship: !l.autoship } : l)),
        })),
      remove: (variantId) => set((s) => ({ lines: s.lines.filter((l) => l.variantId !== variantId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "furrendly-cart", partialize: (s) => ({ lines: s.lines }) },
  ),
);
