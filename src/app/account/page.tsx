import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { Package, LogOut, Repeat, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { money } from "@/lib/format";
import { AuthForms } from "@/components/auth-forms";
import { CatPeek, PetIcon } from "@/components/art";
import { logout } from "./actions";

export const metadata: Metadata = { title: "Account" };

const statusUi = {
  pending: { label: "Awaiting payment", icon: Clock, cls: "bg-sun/40 text-ink" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, cls: "bg-sage-light text-leaf-dark" },
  shipped: { label: "On the way", icon: Truck, cls: "bg-sky/15 text-sky" },
  delivered: { label: "Delivered", icon: CheckCircle2, cls: "bg-leaf text-white" },
  cancelled: { label: "Cancelled", icon: XCircle, cls: "bg-coral/15 text-coral" },
} as const;

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 lg:grid-cols-2">
        <div className="relative hidden overflow-hidden rounded-[2.5rem] border-4 border-ink bg-sage p-10 shadow-[0_10px_0_0_#0e3b2e] lg:block">
          <div className="paw-bg absolute inset-0" aria-hidden="true" />
          <div className="relative">
            <h1 className="sticker-text text-6xl font-bold leading-[0.95]">Welcome to the pack!</h1>
            <ul className="mt-8 space-y-4 text-lg font-bold">
              {[
                { i: Package, t: "Track every order in one place" },
                { i: Repeat, t: "Manage autoship & save 10%" },
                { i: Truck, t: "Faster checkout next time" },
              ].map(({ i: Icon, t }) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-2xl bg-white text-leaf"><Icon className="size-5" /></span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-3">
              {["dog", "cat", "small_pet"].map((t, i) => (
                <span key={t} className={`grid size-16 place-items-center rounded-full border-2 border-ink ${["bg-sun", "bg-coral", "bg-berry"][i]}`}>
                  <PetIcon type={t} className="size-9 text-white" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <AuthForms next={next} />
      </div>
    );
  }

  const myOrders = await db.query.orders.findMany({
    where: eq(orders.userId, user.id),
    orderBy: desc(orders.createdAt),
    with: { items: true },
    limit: 25,
  });
  const autoshipItems = myOrders.flatMap((o) => o.items.filter((i) => i.autoship));

  return (
    <div className="mx-auto max-w-5xl px-6 pt-12">
      <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-ink bg-leaf p-8 text-white shadow-[0_10px_0_0_#0e3b2e] sm:p-10">
        <div className="paw-bg absolute inset-0" aria-hidden="true" />
        <CatPeek className="absolute -top-1 right-8 hidden w-32 sm:block" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display font-semibold text-sun">My account</p>
            <h1 className="mt-1 text-4xl font-bold sm:text-5xl">Hi, {user.name.split(" ")[0]}! 🐾</h1>
            <p className="mt-2 text-white/80">{user.email} · member since {user.createdAt.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</p>
          </div>
          <form action={logout}>
            <button className="btn bg-white text-ink border-2 border-ink"><LogOut className="size-4" /> Sign out</button>
          </form>
        </div>
        <div className="relative mt-8 grid grid-cols-3 gap-3">
          {[
            { k: "Orders", v: myOrders.length },
            { k: "Autoship items", v: autoshipItems.length },
            { k: "Total spent", v: money(myOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0)) },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl bg-white/15 p-4">
              <p className="font-display text-2xl font-bold sm:text-3xl">{s.v}</p>
              <p className="text-sm text-white/80">{s.k}</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="mt-14 text-3xl font-bold">Your orders</h2>
      {myOrders.length === 0 ? (
        <div className="mt-6 rounded-[2rem] border-2 border-dashed border-ink/20 bg-white p-12 text-center">
          <Package className="mx-auto size-12 text-ink/30" />
          <p className="mt-3 font-display text-xl font-semibold">No orders yet</p>
          <p className="text-ink/60">Your pet is waiting patiently. Very patiently.</p>
          <Link href="/shop" className="btn-primary mt-6">Start shopping</Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {myOrders.map((o) => {
            const s = statusUi[o.status];
            return (
              <article key={o.id} className="rounded-[2rem] border-2 border-ink/10 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-semibold">{o.orderNumber}</p>
                    <p className="text-sm text-ink/60">
                      {o.createdAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {o.city} ·{" "}
                      {o.paymentMethod === "cod" ? "Cash on delivery" : "Card"}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-extrabold ${s.cls}`}>
                    <s.icon className="size-4" /> {s.label}
                  </span>
                </div>
                <ul className="mt-4 space-y-1 text-sm">
                  {o.items.map((i) => (
                    <li key={i.id} className="flex justify-between gap-4">
                      <span>
                        {i.productName} <span className="text-ink/55">· {i.variantLabel} × {i.quantity}</span>
                        {i.autoship && <Repeat className="ml-1 inline size-3.5 text-leaf" />}
                      </span>
                      <span className="font-bold">{money(i.unitPrice * i.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t-2 border-ink/5 pt-3 text-right font-display text-lg font-bold">Total {money(o.total)}</p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
