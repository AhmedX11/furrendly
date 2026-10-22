"use server";
import { z } from "zod";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders, orderItems, variants, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { computeTotals } from "@/lib/pricing";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.email("Please enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d][\d\s-]{9,16}$/, "Please enter a valid phone number"),
  address: z.string().trim().min(8, "Please enter your full address").max(500),
  city: z.string().trim().min(2, "Please enter your city").max(80),
  notes: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(["cod", "card"]),
  lines: z
    .array(
      z.object({
        variantId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(50),
        autoship: z.boolean(),
      }),
    )
    .min(1, "Your basket is empty")
    .max(50),
});

export type CheckoutInput = z.input<typeof schema>;
export type CheckoutResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; stockIssues?: { variantId: number; available: number }[] };

class StockError extends Error {
  constructor(public issues: { variantId: number; available: number }[]) {
    super("stock");
  }
}

function orderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(7);
  return "FUR-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function placeOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0]);
      if (!fieldErrors[k]) fieldErrors[k] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }
  const data = parsed.data;
  const user = await getCurrentUser();

  // Merge duplicate variant lines defensively
  const merged = new Map<number, { quantity: number; autoship: boolean }>();
  for (const l of data.lines) {
    const prev = merged.get(l.variantId);
    merged.set(l.variantId, { quantity: (prev?.quantity ?? 0) + l.quantity, autoship: l.autoship || !!prev?.autoship });
  }
  const ids = [...merged.keys()];

  try {
    const number = await db.transaction(async (tx) => {
      // Prices always come from the database, never from the client.
      const rows = await tx
        .select({
          id: variants.id,
          label: variants.label,
          price: variants.price,
          stock: variants.stock,
          productId: products.id,
          productName: products.name,
          active: products.isActive,
        })
        .from(variants)
        .innerJoin(products, eq(products.id, variants.productId))
        .where(inArray(variants.id, ids))
        .for("update", { of: variants });

      const issues: { variantId: number; available: number }[] = [];
      for (const id of ids) {
        const row = rows.find((r) => r.id === id);
        const want = merged.get(id)!.quantity;
        if (!row || !row.active) issues.push({ variantId: id, available: 0 });
        else if (row.stock < want) issues.push({ variantId: id, available: row.stock });
      }
      if (issues.length) throw new StockError(issues);

      const lines = rows.map((r) => ({
        ...r,
        quantity: merged.get(r.id)!.quantity,
        autoship: merged.get(r.id)!.autoship,
        unitPrice: r.price,
      }));
      const totals = computeTotals(lines);

      for (const l of lines) {
        const updated = await tx
          .update(variants)
          .set({ stock: sql`${variants.stock} - ${l.quantity}` })
          .where(and(eq(variants.id, l.id), gte(variants.stock, l.quantity)))
          .returning({ id: variants.id });
        if (!updated.length) throw new StockError([{ variantId: l.id, available: 0 }]);
      }

      const num = orderNumber();
      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: num,
          userId: user?.id ?? null,
          email: data.email.toLowerCase(),
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          notes: data.notes || null,
          paymentMethod: data.paymentMethod,
          status: data.paymentMethod === "cod" ? "confirmed" : "pending",
          ...totals,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((l) => ({
          orderId: order.id,
          productId: l.productId,
          variantId: l.id,
          productName: l.productName,
          variantLabel: l.label,
          unitPrice: l.unitPrice,
          quantity: l.quantity,
          autoship: l.autoship,
        })),
      );
      return num;
    });

    // Lets a guest view their own confirmation without exposing orders by number alone.
    (await cookies()).set("furrendly_last_order", number, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
    return { ok: true, orderNumber: number };
  } catch (e) {
    if (e instanceof StockError) {
      return {
        ok: false,
        error: "Some items just sold out or have limited stock. We've updated your basket — please review and try again.",
        stockIssues: e.issues,
      };
    }
    console.error("placeOrder failed", e);
    return { ok: false, error: "Something went wrong placing your order. Please try again." };
  }
}

/** Fresh price/stock for whatever is in the browser cart, so the summary never shows stale prices. */
export async function getVariantSnapshots(variantIds: number[]) {
  const ids = z.array(z.number().int().positive()).max(50).parse(variantIds);
  if (!ids.length) return [];
  return db
    .select({ id: variants.id, price: variants.price, stock: variants.stock, active: products.isActive })
    .from(variants)
    .innerJoin(products, eq(products.id, variants.productId))
    .where(inArray(variants.id, ids));
}
