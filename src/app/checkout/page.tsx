import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { CheckCircle2, Package } from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { money } from "@/lib/format";
import { CheckoutForm } from "@/components/checkout-form";
import { CatPeek } from "@/components/art";
import { ClearCart } from "@/components/clear-cart";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ placed?: string }> }) {
  const { placed } = await searchParams;
  const user = await getCurrentUser();

  if (placed) {
    const allowed = (await cookies()).get("furrendly_last_order")?.value === placed;
    const order = await db.query.orders.findFirst({ where: eq(orders.orderNumber, placed), with: { items: true } });
    const canView = order && (allowed || (user && order.userId === user.id));
    if (canView) {
      return (
        <div className="mx-auto max-w-2xl px-6 pt-16">
          <ClearCart />
          <div className="relative rounded-[2.5rem] border-4 border-ink bg-white p-8 text-center shadow-[0_10px_0_0_#0e3b2e] sm:p-12">
            <CatPeek className="absolute -top-[4.6rem] left-1/2 w-36 -translate-x-1/2" color="#12a27a" />
            <CheckCircle2 className="mx-auto size-16 text-leaf" />
            <h1 className="mt-4 text-4xl font-bold">Order placed — yay!</h1>
            <p className="mt-2 text-ink/70">
              Thanks {order.fullName.split(" ")[0]}! Your pet&apos;s food is being packed. Keep this order number handy for tracking.
            </p>
            <p className="mt-5 inline-block rounded-full bg-sage-light px-5 py-2 font-display text-lg font-semibold text-leaf-dark">
              {order.orderNumber}
            </p>
            <ul className="mt-8 divide-y-2 divide-ink/5 text-left">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3">
                  <span>
                    <span className="font-bold">{i.productName}</span>
                    <span className="text-ink/60"> · {i.variantLabel} × {i.quantity}</span>
                    {i.autoship && <span className="ml-2 rounded-full bg-leaf px-2 py-0.5 text-xs font-bold text-white">Autoship</span>}
                  </span>
                  <span className="font-bold">{money(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1 border-t-2 border-ink/10 pt-4 text-left text-sm">
              {order.discount > 0 && <p className="flex justify-between font-bold text-leaf-dark"><span>Autoship savings</span><span>−{money(order.discount)}</span></p>}
              <p className="flex justify-between text-ink/70"><span>Delivery</span><span>{order.shipping ? money(order.shipping) : "Free"}</span></p>
              <p className="flex justify-between pt-1 font-display text-xl font-bold"><span>Total</span><span>{money(order.total)}</span></p>
              <p className="pt-1 text-ink/60">
                Payment: {order.paymentMethod === "cod" ? "Cash on delivery" : "Card — we'll SMS a secure payment link to confirm"}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/shop" className="btn-primary">Keep shopping</Link>
              <Link href="/account" className="btn-ghost"><Package className="size-4" /> Track order</Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <h1 className="text-5xl font-bold">Checkout</h1>
      <p className="mt-2 text-ink/65">
        {user ? <>Signed in as <b>{user.email}</b></> : <>Checking out as a guest · <Link href="/account?next=/checkout" className="font-bold text-leaf-dark underline">Sign in</Link> to track orders easily</>}
      </p>
      <CheckoutForm defaults={{ fullName: user?.name ?? "", email: user?.email ?? "" }} />
    </div>
  );
}
