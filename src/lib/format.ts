import { store } from "./config";

const fmt = new Intl.NumberFormat(store.locale, { maximumFractionDigits: 0 });

/** Prices are stored in minor units (paisa). */
export function money(minor: number) {
  return `Rs ${fmt.format(Math.round(minor / 100))}`;
}

export const petLabel: Record<string, string> = {
  dog: "Dogs",
  cat: "Cats",
  small_pet: "Small Pets",
};

export const lifeStageLabel: Record<string, string> = {
  puppy_kitten: "Puppy & Kitten",
  adult: "Adult",
  senior: "Senior",
  all: "All life stages",
};

export const petSingular: Record<string, string> = { dog: "Dog", cat: "Cat", small_pet: "Small pet" };
