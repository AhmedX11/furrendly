import Link from "next/link";
import { Logo, Paw } from "./art";
import { Newsletter } from "./newsletter";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-leaf text-white">
      <div className="paw-bg absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light className="text-lg" />
          <p className="mt-5 max-w-xs text-white/85">
            Honest, vet-approved food for dogs, cats and small pets — delivered with a wag across Pakistan.
          </p>
          <Newsletter />
        </div>
        {[
          { h: "Shop", l: [["Dog food", "/shop?pet=dog"], ["Cat food", "/shop?pet=cat"], ["Small pets", "/shop?pet=small_pet"], ["Treats & chews", "/shop?category=treats"]] },
          { h: "Help", l: [["Track an order", "/account"], ["Delivery info", "/#faq"], ["Returns", "/#faq"], ["Subscribe & save", "/#faq"]] },
          { h: "Furrendly", l: [["Our story", "/#story"], ["Ingredients promise", "/#story"], ["Contact", "mailto:hello@furrendly.pk"]] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="font-display text-lg font-semibold">{col.h}</h4>
            <ul className="mt-4 space-y-2.5 text-white/85">
              {col.l.map(([t, h]) => (
                <li key={t}>
                  <Link href={h} className="hover:text-sun">{t}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="relative border-t-2 border-white/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-sm text-white/75">
          <span>© {new Date().getFullYear()} Furrendly. Made with love (and treats).</span>
          <span className="flex items-center gap-2"><Paw className="size-4 text-sun" /> Cash on delivery · Cards · Easy returns</span>
        </div>
      </div>
    </footer>
  );
}
