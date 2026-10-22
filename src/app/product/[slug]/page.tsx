import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, ShieldCheck, Truck, HeartHandshake } from "lucide-react";
import { getProductBySlug, getRelated } from "@/lib/queries";
import { ProductPack, CatPeek, Paw } from "@/components/art";
import { ProductCard } from "@/components/product-card";
import { BuyBox } from "@/components/buy-box";
import { FeedingCalculator } from "@/components/feeding-calculator";
import { petLabel, lifeStageLabel } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  return p ? { title: p.name, description: p.tagline } : { title: "Not found" };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const related = await getRelated(p.id, p.petType);

  const analysis = [
    { k: "Protein", v: p.protein, c: "bg-leaf" },
    { k: "Fat", v: p.fat, c: "bg-sun" },
    { k: "Fibre", v: p.fiber, c: "bg-berry" },
    { k: "Moisture", v: p.moisture, c: "bg-sky" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8">
      <nav className="text-sm font-bold text-ink/55" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link> /{" "}
        <Link href={`/shop?pet=${p.petType}`} className="hover:text-ink">{petLabel[p.petType]}</Link> /{" "}
        <Link href={`/shop?category=${p.category.slug}`} className="hover:text-ink">{p.category.name}</Link> /{" "}
        <span className="text-ink">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-36 lg:self-start">
          <div
            className="relative grid aspect-square place-items-center overflow-hidden rounded-[2.5rem] border-4 border-ink shadow-[0_10px_0_0_#0e3b2e]"
            style={{ background: `${p.packColor}26` }}
          >
            <div className="absolute inset-[12%] rounded-full" style={{ background: `${p.packColor}33` }} />
            <CatPeek className="absolute -top-1 right-8 w-24" color={p.packColor} />
            <div className="relative w-[62%] animate-float">
              <ProductPack color={p.packColor} name={p.name} brand={p.brand} petType={p.petType} size="lg" />
            </div>
            <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
              {p.badges.map((b) => (
                <span key={b} className="rounded-full border-2 border-ink bg-white px-3 py-1 text-sm font-extrabold">{b}</span>
              ))}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-bold">
            {[
              { i: ShieldCheck, t: "Vet approved" },
              { i: Truck, t: "Ships today" },
              { i: HeartHandshake, t: "Happy Bowl promise" },
            ].map(({ i: Icon, t }) => (
              <div key={t} className="rounded-2xl bg-white border-2 border-ink/10 p-3">
                <Icon className="mx-auto size-6 text-leaf" />
                <p className="mt-1">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-extrabold uppercase tracking-wider text-leaf">{p.brand}</p>
          <h1 className="mt-1 text-4xl font-bold leading-tight sm:text-5xl">{p.name}</h1>
          <p className="mt-2 text-lg font-semibold text-ink/70">{p.tagline}</p>
          <a href="#reviews" className="mt-3 inline-flex items-center gap-1.5 text-sm">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-5 ${i < Math.round(p.rating) ? "fill-sun text-ink" : "text-ink/30"}`} strokeWidth={1.5} />
              ))}
            </span>
            <span className="font-extrabold">{p.rating.toFixed(1)}</span>
            <span className="text-ink/60 underline">{p.reviewCount.toLocaleString()} reviews</span>
          </a>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
            <span className="rounded-full bg-sage-light px-3 py-1 text-leaf-dark">{petLabel[p.petType]}</span>
            <span className="rounded-full bg-sun/40 px-3 py-1">{lifeStageLabel[p.lifeStage]}</span>
            <span className="rounded-full bg-coral/20 px-3 py-1">{p.flavor}</span>
          </div>

          <BuyBox
            product={{ id: p.id, slug: p.slug, name: p.name, brand: p.brand, packColor: p.packColor, petType: p.petType }}
            variants={p.variants.map((v) => ({ id: v.id, label: v.label, price: v.price, compareAtPrice: v.compareAtPrice, stock: v.stock }))}
          />

          <div className="mt-10 space-y-4">
            <Panel title="About this food" open>
              <p className="leading-relaxed text-ink/80">{p.description}</p>
            </Panel>
            <Panel title="Ingredients">
              <p className="leading-relaxed text-ink/80">{p.ingredients}</p>
            </Panel>
            <Panel title="Guaranteed analysis">
              <div className="space-y-3">
                {analysis.map((a) => (
                  <div key={a.k}>
                    <div className="flex justify-between text-sm font-bold">
                      <span>{a.k} {a.k === "Fibre" || a.k === "Moisture" ? "(max)" : "(min)"}</span>
                      <span>{a.v}%</span>
                    </div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-ink/5">
                      <div className={`h-full rounded-full ${a.c}`} style={{ width: `${Math.min(100, a.v)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
            {p.category.slug !== "health" && p.category.slug !== "treats" && (
              <Panel title="Feeding calculator" open>
                <FeedingCalculator gramsPerKg={p.gramsPerKg} petType={p.petType} />
              </Panel>
            )}
          </div>
        </div>
      </div>

      <section id="reviews" className="pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display font-semibold text-coral">What the pack says</p>
            <h2 className="mt-1 text-4xl font-bold">Reviews</h2>
          </div>
          <div className="flex items-center gap-3 rounded-full border-2 border-ink bg-sun px-5 py-2 font-display font-bold shadow-[0_4px_0_0_#0e3b2e]">
            <Star className="size-5 fill-white text-ink" /> {p.rating.toFixed(1)} out of 5 · {p.reviewCount.toLocaleString()} reviews
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {p.reviews.map((r) => (
            <article key={r.id} className="rounded-[1.75rem] border-2 border-ink/10 bg-white p-6">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-4 ${i < r.rating ? "fill-sun text-ink" : "text-ink/25"}`} strokeWidth={1.5} />
                ))}
              </div>
              <p className="mt-3 font-semibold leading-relaxed">{r.body}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-ink/60">
                <Paw className="size-4 text-leaf" /> <span className="font-bold text-ink">{r.author}</span>
                {r.petName && <>· for {r.petName}</>}
              </p>
            </article>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="pt-24">
          <p className="font-display font-semibold text-coral">Pairs nicely with</p>
          <h2 className="mt-1 text-4xl font-bold">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Panel({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-3xl border-2 border-ink/10 bg-white px-6 py-4 open:border-ink/25">
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-xl font-semibold">
        {title}
        <span className="grid size-8 place-items-center rounded-full bg-sage-light text-leaf-dark transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
