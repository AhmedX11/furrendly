"use client";
import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { v: "popular", l: "Most popular" },
  { v: "rating", l: "Top rated" },
  { v: "price-asc", l: "Price: low to high" },
  { v: "price-desc", l: "Price: high to low" },
  { v: "new", l: "Newest" },
];

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const params = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-sm font-bold">
      <span className="text-ink/60">Sort</span>
      <select
        value={value}
        onChange={(e) => {
          const p = new URLSearchParams(params.toString());
          if (e.target.value === "popular") p.delete("sort");
          else p.set("sort", e.target.value);
          p.delete("page");
          router.push(`/shop${p.size ? `?${p}` : ""}`);
        }}
        className="rounded-full border-2 border-ink/15 bg-white px-4 py-2 font-bold outline-none focus:border-leaf"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v}>{o.l}</option>
        ))}
      </select>
    </label>
  );
}
