"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Banknote, CreditCard, Lock, AlertCircle, Repeat, Loader2 } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/lib/cart-store";
import { applySnapshots } from "@/lib/cart-sync";
import { computeTotals } from "@/lib/pricing";
import { money } from "@/lib/format";
import { placeOrder, getVariantSnapshots } from "@/app/checkout/actions";
import { ProductPack } from "./art";
import { FreeShippingMeter } from "./cart-drawer";

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Other"];

export function CheckoutForm({ defaults }: { defaults: { fullName: string; email: string } }) {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const [mounted, setMounted] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [pending, start] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const ids = useCart.getState().lines.map((l) => l.variantId);
    if (ids.length) getVariantSnapshots(ids).then((s) => setNotices(applySnapshots(s)));
  }, []);

  if (!mounted) return <div className="mt-10 h-96 animate-pulse rounded-[2rem] bg-white" />;

  if (lines.length === 0)
    return (
      <div className="mt-10 rounded-[2rem] border-2 border-dashed border-ink/20 bg-white p-12 text-center">
        <p className="font-display text-2xl font-semibold">Your basket is empty</p>
        {notices.length > 0 && <p className="mt-2 text-coral font-bold">{notices.join(" · ")}</p>}
        <Link href="/shop" className="btn-primary mt-6">Find something tasty</Link>
      </div>
    );

  const totals = computeTotals(lines);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setError(null);
    setFieldErrors({});
    start(async () => {
      const res = await placeOrder({
        fullName: String(fd.get("fullName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        address: String(fd.get("address") ?? ""),
        city: String(fd.get("city") ?? ""),
        notes: String(fd.get("notes") ?? ""),
        paymentMethod: payment,
        lines: useCart.getState().lines.map((l) => ({ variantId: l.variantId, quantity: l.quantity, autoship: l.autoship })),
      });
      if (res.ok) {
        clear();
        router.push(`/checkout?placed=${res.orderNumber}`);
        return;
      }
      setError(res.error);
      setFieldErrors(res.fieldErrors ?? {});
      if (res.stockIssues) {
        const snaps = await getVariantSnapshots(useCart.getState().lines.map((l) => l.variantId));
        setNotices(applySnapshots(snaps));
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return (
    <form onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        {(error || notices.length > 0) && (
          <div role="alert" className="flex gap-3 rounded-3xl border-2 border-coral bg-coral/10 p-4 font-semibold">
            <AlertCircle className="size-5 shrink-0 text-coral" />
            <div>
              {error && <p>{error}</p>}
              {notices.map((n) => (
                <p key={n} className="text-sm">{n}</p>
              ))}
            </div>
          </div>
        )}

        <Section n={1} title="Contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field name="fullName" label="Full name" defaultValue={defaults.fullName} autoComplete="name" error={fieldErrors.fullName} />
            <Field name="phone" label="Phone (for delivery updates)" placeholder="03XX XXXXXXX" type="tel" autoComplete="tel" error={fieldErrors.phone} />
            <div className="sm:col-span-2">
              <Field name="email" label="Email" type="email" defaultValue={defaults.email} autoComplete="email" error={fieldErrors.email} />
            </div>
          </div>
        </Section>

        <Section n={2} title="Delivery address">
          <div className="grid gap-4 sm:grid-cols-[1fr_200px]">
            <Field name="address" label="House, street, area" autoComplete="street-address" error={fieldErrors.address} />
            <div>
              <label className="label" htmlFor="city">City</label>
              <select id="city" name="city" className={clsx("input", fieldErrors.city && "border-coral")} defaultValue="Lahore">
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="notes">Delivery notes (optional)</label>
              <textarea id="notes" name="notes" rows={2} className="input resize-none" placeholder="Gate code, landmark, best time to call…" />
            </div>
          </div>
        </Section>

        <Section n={3} title="Payment">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
            {[
              { v: "cod" as const, icon: Banknote, t: "Cash on delivery", s: "Pay the rider when your order arrives" },
              { v: "card" as const, icon: CreditCard, t: "Debit / credit card", s: "We'll SMS you a secure payment link" },
            ].map((o) => (
              <button
                type="button"
                key={o.v}
                role="radio"
                aria-checked={payment === o.v}
                onClick={() => setPayment(o.v)}
                className={clsx(
                  "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition",
                  payment === o.v ? "border-leaf bg-sage-light ring-4 ring-leaf/15" : "border-ink/15 bg-white hover:border-ink",
                )}
              >
                <o.icon className={clsx("mt-0.5 size-6", payment === o.v ? "text-leaf-dark" : "text-ink/50")} />
                <span>
                  <span className="block font-display font-semibold">{o.t}</span>
                  <span className="text-sm text-ink/60">{o.s}</span>
                </span>
              </button>
            ))}
          </div>
        </Section>
      </div>

      <aside className="lg:sticky lg:top-36 lg:self-start">
        <div className="rounded-[2rem] border-2 border-ink bg-white p-6 shadow-[0_6px_0_0_#0e3b2e]">
          <h2 className="text-2xl font-bold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (
              <li key={l.variantId} className="flex items-center gap-3">
                <div className="relative w-14 shrink-0 rounded-xl p-1" style={{ background: `${l.packColor}22` }}>
                  <ProductPack color={l.packColor} name={l.name} brand={l.brand} petType={l.petType} />
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-ink text-xs font-bold text-white">{l.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold leading-tight">{l.name}</p>
                  <p className="flex items-center gap-1 text-sm text-ink/60">
                    {l.variantLabel}
                    {l.autoship && <span className="inline-flex items-center gap-0.5 font-bold text-leaf-dark"><Repeat className="size-3" /> Autoship</span>}
                  </p>
                </div>
                <span className="font-bold">{money(l.unitPrice * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <FreeShippingMeter amount={totals.subtotal - totals.discount} />
          </div>
          <dl className="mt-5 space-y-1.5 text-sm">
            <div className="flex justify-between text-ink/70"><dt>Subtotal</dt><dd>{money(totals.subtotal)}</dd></div>
            {totals.discount > 0 && (
              <div className="flex justify-between font-bold text-leaf-dark"><dt>Autoship savings (10%)</dt><dd>−{money(totals.discount)}</dd></div>
            )}
            <div className="flex justify-between text-ink/70"><dt>Delivery</dt><dd>{totals.shipping ? money(totals.shipping) : "Free"}</dd></div>
            <div className="flex justify-between border-t-2 border-ink/10 pt-3 font-display text-2xl font-bold"><dt>Total</dt><dd>{money(totals.total)}</dd></div>
          </dl>
          <button type="submit" disabled={pending} className="btn-primary mt-5 w-full text-lg">
            {pending ? <><Loader2 className="size-5 animate-spin" /> Placing order…</> : <><Lock className="size-4" /> Place order · {money(totals.total)}</>}
          </button>
          <p className="mt-3 text-center text-xs text-ink/55">Prices and stock are confirmed when you place your order.</p>
        </div>
      </aside>
    </form>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border-2 border-ink/10 bg-white p-6">
      <h2 className="flex items-center gap-3 text-2xl font-bold">
        <span className="grid size-9 place-items-center rounded-full border-2 border-ink bg-sun text-lg">{n}</span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ name, label, error, ...rest }: { name: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        className={clsx("input", error && "border-coral focus:border-coral focus:ring-coral/15")}
        {...rest}
      />
      {error && <p id={`${name}-err`} className="mt-1 text-sm font-bold text-coral">{error}</p>}
    </div>
  );
}
