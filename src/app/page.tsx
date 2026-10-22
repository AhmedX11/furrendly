import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Repeat, Leaf, HeartHandshake, Sparkles } from "lucide-react";
import { getFeatured, getCategories } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";
import { CatPeek, Paw, PetIcon, ProductPack } from "@/components/art";

export const revalidate = 300;

const pets = [
  { type: "dog", title: "Dogs", blurb: "Kibble, stews & chews", bg: "bg-sun", text: "text-ink", icon: "text-ink" },
  { type: "cat", title: "Cats", blurb: "Pâtés, crunch & treats", bg: "bg-coral", text: "text-white", icon: "text-white" },
  { type: "small_pet", title: "Small Pets", blurb: "Hay, pellets & seed mix", bg: "bg-berry", text: "text-white", icon: "text-white" },
];

const promises = ["Real meat first", "No artificial nasties", "Vet approved recipes", "Fresh stock, fast delivery", "Subscribe & save 10%", "Cash on delivery"];

const testimonials = [
  { name: "Ayesha K.", pet: "Mochi, Persian cat", text: "Mochi turned her nose up at everything. The tuna pâté changed the game — bowl licked clean every single time." },
  { name: "Hamza R.", pet: "Tiger, Labrador", text: "Autoship means I never run out at 11pm again. His coat is honestly glossier after a month on the chicken & rice." },
  { name: "Sara M.", pet: "Biscuit, Beagle", text: "Delivery in Lahore was next day and the dental chews are the only thing he sits nicely for. 10/10." },
];

const faqs = [
  { q: "How fast is delivery?", a: "Orders placed before 3pm ship the same day. Lahore, Karachi and Islamabad usually receive within 1–2 days, other cities within 3–5 days." },
  { q: "How does Subscribe & Save work?", a: "Tick autoship on any item and you'll save 10% on it. We'll remind you before each refill and you can skip, pause or cancel any time from your account." },
  { q: "Can I pay cash on delivery?", a: "Yes! Cash on delivery is available nationwide, along with debit and credit cards." },
  { q: "What if my pet doesn't like it?", a: "Our Happy Bowl promise: if your pet isn't a fan of a new food, tell us within 14 days and we'll help you swap or refund it." },
];

export default async function Home() {
  const [featured, categories] = await Promise.all([getFeatured(8), getCategories()]);
  const heroPacks = featured.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-sage">
        <div className="paw-bg absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pt-14 pb-24 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-32">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 text-sm font-extrabold shadow-[0_3px_0_0_#0e3b2e]">
              <Sparkles className="size-4 text-coral" /> New: Puppy Starter with DHA
            </span>
            <h1 className="sticker-text mt-6 text-6xl font-bold leading-[0.95] sm:text-7xl lg:text-[5.5rem]">
              Happy bowls,
              <br />
              waggy tails.
            </h1>
            <p className="mt-6 max-w-md text-lg font-semibold text-ink/80">
              Vet-approved food made with real meat first — delivered to your door, so dinner time is always the best time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop?pet=dog" className="btn-sun text-lg">
                <PetIcon type="dog" className="size-6" /> Shop dog
              </Link>
              <Link href="/shop?pet=cat" className="btn-primary text-lg">
                <PetIcon type="cat" className="size-6" /> Shop cat
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-sun", "bg-coral", "bg-berry", "bg-sky"].map((c, i) => (
                  <span key={c} className={`grid size-9 place-items-center rounded-full border-2 border-white ${c}`}>
                    <PetIcon type={i % 2 ? "cat" : "dog"} className="size-5 text-white" />
                  </span>
                ))}
              </div>
              <div className="text-sm font-bold">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-sun text-ink" strokeWidth={1.5} />
                  ))}
                  <span className="ml-1">4.8/5</span>
                </div>
                <span className="text-ink/70">loved by 12,000+ pet parents</span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div className="absolute inset-[6%] rounded-full border-4 border-ink bg-leaf shadow-[0_10px_0_0_#0e3b2e]" />
            <CatPeek className="absolute left-1/2 top-[-2%] w-40 -translate-x-1/2 sm:w-48" />
            {heroPacks[0] && (
              <div className="absolute left-[28%] top-[22%] w-[44%] animate-float">
                <ProductPack {...pick(heroPacks[0])} size="lg" />
              </div>
            )}
            {heroPacks[1] && (
              <div className="absolute left-[2%] top-[44%] w-[32%] -rotate-12 animate-float [animation-delay:-1.5s]">
                <ProductPack {...pick(heroPacks[1])} />
              </div>
            )}
            {heroPacks[2] && (
              <div className="absolute right-[2%] top-[42%] w-[32%] rotate-12 animate-float [animation-delay:-3s]">
                <ProductPack {...pick(heroPacks[2])} />
              </div>
            )}
            <div className="absolute bottom-[4%] right-[8%] grid size-28 rotate-12 place-items-center rounded-full border-4 border-ink bg-sun text-center font-display font-bold leading-tight shadow-[0_5px_0_0_#0e3b2e] animate-wiggle">
              <span>
                Save
                <br />
                <span className="text-3xl">10%</span>
                <br />
                <span className="text-xs">on autoship</span>
              </span>
            </div>
          </div>
        </div>
        <svg viewBox="0 0 1440 80" className="absolute -bottom-px left-0 w-full text-cream" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 40 Q 180 0 360 40 T 720 40 T 1080 40 T 1440 40 V80 H0Z" fill="currentColor" />
        </svg>
      </section>

      {/* TRUST STRIP */}
      <section className="mx-auto -mt-2 grid max-w-7xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
        {[
          { icon: ShieldCheck, t: "Vet approved", s: "Every recipe reviewed" },
          { icon: Truck, t: "Fast delivery", s: "Free over Rs 5,000" },
          { icon: Repeat, t: "Autoship", s: "Save 10%, skip anytime" },
          { icon: HeartHandshake, t: "Happy Bowl promise", s: "14-day swap or refund" },
        ].map(({ icon: Icon, t, s }) => (
          <div key={t} className="flex items-center gap-3 rounded-3xl bg-white p-4 border-2 border-ink/10">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sage-light text-leaf-dark">
              <Icon className="size-6" />
            </span>
            <div>
              <p className="font-display font-semibold leading-tight">{t}</p>
              <p className="text-sm text-ink/60">{s}</p>
            </div>
          </div>
        ))}
      </section>

      {/* SHOP BY PET */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <SectionHead kicker="Who are we feeding?" title="Shop by pet" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {pets.map((p) => (
            <Link
              key={p.type}
              href={`/shop?pet=${p.type}`}
              className={`card-pop group relative flex h-56 items-end overflow-hidden ${p.bg} p-6 transition hover:-translate-y-1`}
            >
              <PetIcon type={p.type} className={`absolute -right-6 -top-4 size-48 opacity-90 transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${p.icon}`} />
              <div className={`relative ${p.text}`}>
                <h3 className="text-4xl font-bold">{p.title}</h3>
                <p className="mt-1 font-semibold opacity-85">{p.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-display font-semibold">
                  Shop now <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MARQUEE */}
      <section className="mt-20 -rotate-1 overflow-hidden border-y-4 border-ink bg-sun py-4" aria-label="Our promises">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl font-bold">
          {[...promises, ...promises].map((p, i) => (
            <span key={i} className="flex items-center gap-10">
              {p} <Paw className="size-6 text-leaf" />
            </span>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <div className="flex items-end justify-between gap-4">
          <SectionHead kicker="Bowl-licking favourites" title="Bestsellers" />
          <Link href="/shop" className="hidden items-center gap-1 font-display font-semibold text-leaf-dark hover:underline sm:flex">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <SectionHead kicker="Find it fast" title="What's on the menu?" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="group flex items-center gap-4 rounded-3xl border-2 border-ink/10 bg-white p-5 transition hover:border-ink hover:shadow-[0_5px_0_0_#0e3b2e]"
            >
              <span className={`grid size-14 place-items-center rounded-2xl text-3xl transition group-hover:-rotate-12 ${["bg-sage-light", "bg-sun/40", "bg-coral/25", "bg-berry/20"][i % 4]}`}>
                {c.emoji}
              </span>
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{c.name}</p>
                <p className="text-sm text-ink/55">{c.count} products</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AUTOSHIP */}
      <section className="mx-auto max-w-7xl px-6 pt-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-ink bg-leaf px-6 py-14 text-white shadow-[0_10px_0_0_#0e3b2e] sm:px-12">
          <div className="paw-bg absolute inset-0" aria-hidden="true" />
          <CatPeek className="absolute -top-1 right-10 hidden w-36 md:block" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <p className="font-display font-semibold text-sun">Subscribe &amp; Save</p>
              <h2 className="mt-2 text-4xl font-bold sm:text-5xl">Never run out of kibble again.</h2>
              <p className="mt-4 max-w-md text-white/85">
                Turn on autoship for any product and save 10% on every delivery. Skip, pause or cancel whenever you like.
              </p>
              <Link href="/shop" className="btn-sun mt-6">
                Start saving <ArrowRight className="size-4" />
              </Link>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {[
                { n: "1", t: "Pick their faves", s: "Choose food & size, tick autoship." },
                { n: "2", t: "Set the rhythm", s: "Every 2, 4 or 6 weeks — your call." },
                { n: "3", t: "Relax & save", s: "10% off, delivered on repeat." },
              ].map((s) => (
                <li key={s.n} className="rounded-3xl bg-white p-5 text-ink">
                  <span className="grid size-10 place-items-center rounded-full bg-sun font-display text-xl font-bold border-2 border-ink">{s.n}</span>
                  <p className="mt-3 font-display text-lg font-semibold">{s.t}</p>
                  <p className="text-sm text-ink/65">{s.s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="mx-auto grid max-w-7xl items-center gap-12 px-6 pt-24 lg:grid-cols-2">
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Leaf, t: "Real ingredients", c: "bg-sage-light", ic: "text-leaf-dark" },
              { icon: ShieldCheck, t: "Vet reviewed", c: "bg-sun/40", ic: "text-ink" },
              { icon: HeartHandshake, t: "Ethically sourced", c: "bg-coral/25", ic: "text-coral" },
              { icon: Sparkles, t: "No artificial colours", c: "bg-berry/20", ic: "text-berry" },
            ].map(({ icon: Icon, t, c, ic }, i) => (
              <div key={t} className={`rounded-[2rem] ${c} p-6 ${i % 2 ? "translate-y-8" : ""}`}>
                <Icon className={`size-9 ${ic}`} />
                <p className="mt-6 font-display text-xl font-semibold leading-tight">{t}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHead kicker="The Furrendly promise" title="Food we'd happily share (but won't)." />
          <p className="mt-5 text-lg text-ink/75">
            We started Furrendly because finding honest pet food shouldn&apos;t mean squinting at labels. Every recipe on our
            shelves leads with real meat or fish, skips cheap fillers and artificial colours, and is checked by vets before it
            ever reaches your bowl.
          </p>
          <ul className="mt-6 space-y-3 font-semibold">
            {["Guaranteed analysis & full ingredients on every product", "Feeding calculator for exact daily portions", "Stored cool and dated — never stale stock"].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Paw className="mt-0.5 size-5 shrink-0 text-leaf" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 pt-28">
        <SectionHead kicker="Straight from the pack" title="Tails are wagging" center />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure key={t.name} className={`card-pop p-6 ${i === 1 ? "md:-translate-y-4 bg-sage-light" : ""}`}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="size-5 fill-sun text-ink" strokeWidth={1.5} />
                ))}
              </div>
              <blockquote className="mt-4 text-lg font-semibold leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-leaf text-white">
                  <PetIcon type={i === 0 ? "cat" : "dog"} className="size-6" />
                </span>
                <span>
                  <span className="block font-display font-semibold">{t.name}</span>
                  <span className="text-sm text-ink/60">{t.pet}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pt-24">
        <SectionHead kicker="Good questions" title="Pet parent FAQ" center />
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-3xl border-2 border-ink/10 bg-white px-6 py-4 open:border-ink open:shadow-[0_4px_0_0_#0e3b2e]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sage-light text-leaf-dark transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function pick(p: { packColor: string; name: string; brand: string; petType: string }) {
  return { color: p.packColor, name: p.name, brand: p.brand, petType: p.petType };
}

function SectionHead({ kicker, title, center }: { kicker: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <p className="font-display font-semibold text-coral">{kicker}</p>
      <h2 className="mt-1 text-4xl font-bold sm:text-5xl">{title}</h2>
    </div>
  );
}
