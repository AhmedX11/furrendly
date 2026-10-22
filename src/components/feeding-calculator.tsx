"use client";
import { useState } from "react";

export function FeedingCalculator({ gramsPerKg, petType }: { gramsPerKg: number; petType: string }) {
  const def = petType === "cat" ? 4 : petType === "small_pet" ? 1 : 15;
  const max = petType === "dog" ? 60 : petType === "cat" ? 10 : 3;
  const [kg, setKg] = useState(def);
  // Portions scale sub-linearly with body weight (metabolic weight ≈ kg^0.75).
  const grams = Math.round(gramsPerKg * Math.pow(kg, 0.75) * (petType === "small_pet" ? 1 : 1.6));
  return (
    <div>
      <label htmlFor="pet-weight" className="flex items-baseline justify-between font-bold">
        <span>Your pet&apos;s weight</span>
        <span className="font-display text-2xl text-leaf-dark">{kg} kg</span>
      </label>
      <input
        id="pet-weight"
        type="range"
        min={petType === "small_pet" ? 0.5 : 1}
        max={max}
        step={petType === "dog" ? 1 : 0.5}
        value={kg}
        onChange={(e) => setKg(Number(e.target.value))}
        className="mt-3 w-full accent-[#12a27a]"
      />
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-sage-light p-4">
        <span className="font-bold">Suggested daily amount</span>
        <span className="font-display text-3xl font-bold">{grams} g</span>
      </div>
      <p className="mt-2 text-xs text-ink/55">A starting guide — adjust for activity level and check with your vet.</p>
    </div>
  );
}
