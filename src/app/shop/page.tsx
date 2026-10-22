import Link from "next/link";
import type { Metadata } from "next";
import { X, SearchX } from "lucide-react";
import clsx from "clsx";
import { searchProducts, getCategories, type ShopFilters } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { SortSelect } from "@/components/sort-select";
import { CatPeek, PetIcon } from "@/components/art";
import { petLabel, petSingular, lifeStageLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Shop" };

type SP = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const f: ShopFilters = {
    pet: one(sp.pet),
    category: one(sp.category),
    stage: one(sp.stage),
    q: one(sp.q),
    sort: one(sp.sort),
    page: Number(one(sp.page) ?? 1) || 1,
  };
  const [{ rows, total, page, pages }, categories] = await Promise.all([searchProducts(f), getCategories()]);

  const href = (patch: Partial<Record<keyof ShopFilters, string | undefined>>) => {
    const next = { ...f, page: undefined, ...patch } as Record<string, unknown>;
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v !== undefined && v !== "" && v !== null) params.set(k, String(v));
    const s = params.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  const heading = f.q
    ? `Results for “${f.q}”`
    : f.pet
      ? `${petSingular[f.pet] ?? "Pet"} food & treats`
      : f.category
        ? categories.find((c) => c.slug === f.category)?.name ?? "Shop"
        : "Shop all";

  const active = [
    f.pet && { k: "pet" as const, label: petLabel[f.pet] },
    f.category && { k: "category" as const, label: categories.find((c) => c.slug === f.category)?.name },
    f.stage && { k: "stage" as const, label: lifeStageLabel[f.stage] },
    f.q && { k: "q" as const, label: `“${f.q}”` },
  ].filter(Boolean) as { k: keyof ShopFilters; label: string }[];

  return (
    <div>
      <section className="relative overflow-hidden bg-sage">
        <div className="paw-bg absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-16">
          <nav className="text-sm font-bold text-ink/60" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-ink">Home</Link> / <span className="text-ink">Shop</span>
          </nav>
          <h1 className="sticker-text mt-3 text-5xl font-bold sm:text-6xl">{heading}</h1>
          <p className="mt-3 font-semibold text-ink/75">{total} tasty {total === 1 ? "product" : "products"} ready to ship</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { v: undefined, l: "All pets" },
              { v: "dog", l: "Dogs" },
              { v: "cat", l: "Cats" },
              { v: "small_pet", l: "Small pets" },
            ].map((o) => (
              <Link
                key={o.l}
                href={href({ pet: o.v })}
                className={clsx(
                  "chip",
                  f.pet === o.v ? "border-ink bg-ink text-white" : "border-ink/20 bg-white hover:border-ink",
                )}
              >
                {o.v && <PetIcon type={o.v} className="size-4" />} {o.l}
              </Link>
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 60" className="absolute -bottom-px left-0 w-full text-cream" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 30 Q 360 0 720 30 T 1440 30 V60 H0Z" fill="currentColor" />
        </svg>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 pt-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-6 lg:block lg:sticky lg:top-36 lg:self-start">
          <FilterGroup title="Category">
            <FilterLink href={href({ category: undefined })} active={!f.category}>All categories</FilterLink>
            {categories.map((c) => (
              <FilterLink key={c.slug} href={href({ category: c.slug })} active={f.category === c.slug} count={c.count}>
                <span className="mr-1">{c.emoji}</span> {c.name}
              </FilterLink>
            ))}
          </FilterGroup>
          <FilterGroup title="Life stage">
            <FilterLink href={href({ stage: undefined })} active={!f.stage}>Any age</FilterLink>
            {(["puppy_kitten", "adult", "senior"] as const).map((s) => (
              <FilterLink key={s} href={href({ stage: s })} active={f.stage === s}>
                {lifeStageLabel[s]}
              </FilterLink>
            ))}
          </FilterGroup>
        </aside>

        <div className="min-w-0">
          <div className="-mx-6 mb-4 flex gap-2 overflow-x-auto px-6 pb-1 lg:hidden" aria-label="Filter by category">
            <MobileChip href={href({ category: undefined })} active={!f.category}>All</MobileChip>
            {categories.map((c) => (
              <MobileChip key={c.slug} href={href({ category: c.slug })} active={f.category === c.slug}>
                {c.emoji} {c.name}
              </MobileChip>
            ))}
            {(["puppy_kitten", "adult", "senior"] as const).map((st) => (
              <MobileChip key={st} href={href({ stage: f.stage === st ? undefined : st })} active={f.stage === st}>
                {lifeStageLabel[st]}
              </MobileChip>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {active.map((a) => (
                <Link key={a.k} href={href({ [a.k]: undefined })} className="chip border-leaf bg-sage-light text-leaf-dark hover:bg-sage/40">
                  {a.label} <X className="size-3.5" />
                </Link>
              ))}
              {active.length > 1 && (
                <Link href="/shop" className="chip border-transparent text-ink/60 underline">Clear all</Link>
              )}
            </div>
            <SortSelect value={f.sort ?? "popular"} />
          </div>

          {rows.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-[2rem] border-2 border-dashed border-ink/20 bg-white px-6 py-16 text-center">
              <div className="relative">
                <CatPeek className="absolute -top-12 left-1/2 w-24 -translate-x-1/2" color="#12a27a" />
                <SearchX className="size-14 text-ink/30" />
              </div>
              <p className="mt-4 font-display text-2xl font-semibold">No sniffs found</p>
              <p className="mt-1 text-ink/60">Try a different search or clear some filters.</p>
              <Link href="/shop" className="btn-primary mt-6">See everything</Link>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
              {rows.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
              {Array.from({ length: pages }).map((_, i) => (
                <Link
                  key={i}
                  href={href({ page: String(i + 1) })}
                  className={clsx(
                    "grid size-11 place-items-center rounded-full border-2 font-display font-semibold",
                    page === i + 1 ? "border-ink bg-leaf text-white" : "border-ink/15 bg-white hover:border-ink",
                  )}
                >
                  {i + 1}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border-2 border-ink/10 bg-white p-4">
      <h2 className="px-2 pb-2 font-display text-lg font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">{children}</div>
    </div>
  );
}

function FilterLink({ href, active, children, count }: { href: string; active: boolean; children: React.ReactNode; count?: number }) {
  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center justify-between rounded-2xl px-3 py-2 text-sm font-bold transition",
        active ? "bg-leaf text-white" : "text-ink/75 hover:bg-sage-light",
      )}
    >
      <span>{children}</span>
      {count !== undefined && <span className={clsx("ml-2 text-xs", active ? "text-white/80" : "text-ink/40")}>{count}</span>}
    </Link>
  );
}

function MobileChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={clsx("chip shrink-0 whitespace-nowrap", active ? "border-leaf bg-leaf text-white" : "border-ink/15 bg-white")}
    >
      {children}
    </Link>
  );
}
