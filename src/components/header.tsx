"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, User, Menu, X, Truck } from "lucide-react";
import clsx from "clsx";
import { Logo } from "./art";
import { useCart } from "@/lib/cart-store";
import { money } from "@/lib/format";
import { store } from "@/lib/config";

const nav = [
  { href: "/shop?pet=dog", label: "Dog" },
  { href: "/shop?pet=cat", label: "Cat" },
  { href: "/shop?pet=small_pet", label: "Small Pets" },
  { href: "/shop?category=treats", label: "Treats" },
  { href: "/shop", label: "Shop all" },
];

export function Header({ userName }: { userName: string | null }) {
  const lines = useCart((s) => s.lines);
  const setOpen = useCart((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => setMounted(true), []);
  useEffect(() => setMenu(false), [pathname]);
  const count = mounted ? lines.reduce((s, l) => s + l.quantity, 0) : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-cream text-xs sm:text-sm font-semibold">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2">
          <Truck className="size-4 text-sun" />
          Free delivery over {money(store.freeShippingThreshold)}<span className="hidden sm:inline"> · Subscribe &amp; save 10%</span>
        </div>
      </div>
      <div className="border-b-2 border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 pt-5 pb-3 sm:px-6">
          <button className="lg:hidden -ml-1 p-2" onClick={() => setMenu(!menu)} aria-label="Menu">
            {menu ? <X /> : <Menu />}
          </button>
          <Link href="/" aria-label="Furrendly home" className="text-[15px] sm:text-base">
            <Logo />
          </Link>
          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 font-display font-semibold text-ink/80 transition hover:bg-sage-light hover:text-leaf-dark"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={submit} className="ml-auto hidden md:block">
            <label className="relative block">
              <span className="sr-only">Search products</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search kibble, treats…"
                className="w-56 rounded-full border-2 border-ink/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:w-72 focus:border-leaf"
              />
            </label>
          </form>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <Link
              href="/account"
              className="flex items-center gap-2 rounded-full p-2.5 font-display font-semibold hover:bg-sage-light"
              aria-label="Account"
            >
              <User className="size-5" />
              <span className="hidden xl:inline text-sm">{userName ? `Hi, ${userName.split(" ")[0]}` : "Sign in"}</span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-leaf py-2.5 pl-3.5 pr-4 font-display font-semibold text-white border-2 border-ink shadow-[0_3px_0_0_#0e3b2e] transition hover:-translate-y-0.5"
              aria-label={`Cart, ${count} items`}
            >
              <ShoppingBag className="size-5" />
              <span className="text-sm">{count}</span>
            </button>
          </div>
        </div>
        <div className={clsx("lg:hidden overflow-hidden transition-[max-height] duration-300", menu ? "max-h-96" : "max-h-0")}>
          <div className="space-y-1 px-4 pb-4">
            <form onSubmit={submit} className="md:hidden pb-2">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search kibble, treats…" className="input" />
            </form>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="block rounded-2xl px-4 py-3 font-display text-lg font-semibold hover:bg-sage-light">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
