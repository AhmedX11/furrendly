import "dotenv/config";
import { db } from "./index";
import { categories, products, variants, reviews, orderItems, orders } from "./schema";
import { sql } from "drizzle-orm";

type Seed = {
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  petType: "dog" | "cat" | "small_pet";
  lifeStage: "puppy_kitten" | "adult" | "senior" | "all";
  category: string;
  flavor: string;
  ingredients: string;
  protein: number;
  fat: number;
  fiber: number;
  moisture: number;
  gramsPerKg: number;
  packColor: string;
  badges: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  sizes: { label: string; price: number; compareAt?: number; stock: number }[];
};

const cats = [
  { slug: "dry-food", name: "Dry Food", emoji: "🥣" },
  { slug: "wet-food", name: "Wet Food", emoji: "🥫" },
  { slug: "treats", name: "Treats & Chews", emoji: "🦴" },
  { slug: "health", name: "Health & Supplements", emoji: "💊" },
];

const rs = (n: number) => n * 100;

const items: Seed[] = [
  {
    slug: "chicken-brown-rice-adult-dog",
    name: "Chicken & Brown Rice Adult",
    brand: "Furrendly Kitchen",
    tagline: "Everyday nutrition for happy, waggy adults",
    description:
      "Real deboned chicken is the first ingredient, slow-baked with wholesome brown rice, pumpkin and flaxseed for a shiny coat and steady energy. No artificial colours, flavours or preservatives — just honest food your dog will dance for.",
    petType: "dog",
    lifeStage: "adult",
    category: "dry-food",
    flavor: "Chicken",
    ingredients:
      "Deboned chicken, chicken meal, brown rice, oatmeal, pumpkin, chicken fat (preserved with mixed tocopherols), flaxseed, carrots, blueberries, salmon oil, vitamins & minerals.",
    protein: 26,
    fat: 15,
    fiber: 4,
    moisture: 10,
    gramsPerKg: 14,
    packColor: "#12A27A",
    badges: ["Bestseller", "No fillers"],
    rating: 4.8,
    reviewCount: 1284,
    featured: true,
    sizes: [
      { label: "1.5 kg", price: rs(2450), stock: 120 },
      { label: "4 kg", price: rs(5890), compareAt: rs(6490), stock: 80 },
      { label: "12 kg", price: rs(15900), compareAt: rs(17900), stock: 35 },
    ],
  },
  {
    slug: "lamb-sweet-potato-grain-free-dog",
    name: "Lamb & Sweet Potato Grain-Free",
    brand: "Wild Meadow",
    tagline: "Gentle on tummies, big on flavour",
    description:
      "A single animal protein recipe for dogs with sensitive digestion. Pasture-raised lamb, sweet potato and chickpeas deliver clean energy, with prebiotics to keep the gut happy.",
    petType: "dog",
    lifeStage: "all",
    category: "dry-food",
    flavor: "Lamb",
    ingredients:
      "Lamb, lamb meal, sweet potato, chickpeas, peas, sunflower oil, chicory root (prebiotic), dried apple, spinach, vitamins & minerals.",
    protein: 25,
    fat: 14,
    fiber: 5,
    moisture: 10,
    gramsPerKg: 14,
    packColor: "#7C5CFF",
    badges: ["Grain-free", "Sensitive"],
    rating: 4.7,
    reviewCount: 642,
    featured: true,
    sizes: [
      { label: "2 kg", price: rs(3650), stock: 60 },
      { label: "6 kg", price: rs(9450), compareAt: rs(10500), stock: 40 },
    ],
  },
  {
    slug: "puppy-starter-salmon",
    name: "Puppy Starter Salmon & Oats",
    brand: "Furrendly Kitchen",
    tagline: "Big growth in tiny kibbles",
    description:
      "Small, easy-crunch kibble packed with DHA from salmon oil for brain and eye development, plus calcium for strong growing bones. Made for puppies up to 12 months.",
    petType: "dog",
    lifeStage: "puppy_kitten",
    category: "dry-food",
    flavor: "Salmon",
    ingredients:
      "Salmon, chicken meal, oatmeal, barley, salmon oil (DHA), egg, carrots, calcium carbonate, vitamins & minerals.",
    protein: 30,
    fat: 18,
    fiber: 3.5,
    moisture: 10,
    gramsPerKg: 25,
    packColor: "#FF7A59",
    badges: ["With DHA", "Vet approved"],
    rating: 4.9,
    reviewCount: 418,
    featured: true,
    sizes: [
      { label: "1.5 kg", price: rs(2790), stock: 90 },
      { label: "4 kg", price: rs(6650), compareAt: rs(7200), stock: 50 },
    ],
  },
  {
    slug: "senior-vitality-turkey-dog",
    name: "Senior Vitality Turkey",
    brand: "PawPure",
    tagline: "Golden years, golden energy",
    description:
      "Lower calorie, higher fibre recipe with glucosamine and chondroitin for stiff joints, plus antioxidants for a strong immune system in dogs 7+.",
    petType: "dog",
    lifeStage: "senior",
    category: "dry-food",
    flavor: "Turkey",
    ingredients:
      "Turkey, brown rice, barley, turkey meal, beet pulp, glucosamine, chondroitin, fish oil, cranberries, vitamins & minerals.",
    protein: 24,
    fat: 11,
    fiber: 6,
    moisture: 10,
    gramsPerKg: 12,
    packColor: "#2F7DD1",
    badges: ["Joint care"],
    rating: 4.6,
    reviewCount: 233,
    sizes: [
      { label: "2 kg", price: rs(3390), stock: 45 },
      { label: "7 kg", price: rs(10200), stock: 20 },
    ],
  },
  {
    slug: "beef-stew-wet-dog",
    name: "Hearty Beef Stew Tins",
    brand: "Barkbite",
    tagline: "Chunks in gravy — dinner-time hero",
    description:
      "Tender beef chunks with garden carrots and peas in a rich gravy. Serve as a complete meal or as a juicy topper on kibble. Pack of 6 × 400 g tins.",
    petType: "dog",
    lifeStage: "adult",
    category: "wet-food",
    flavor: "Beef",
    ingredients: "Beef, beef broth, liver, carrots, peas, potato starch, guar gum, vitamins & minerals.",
    protein: 9,
    fat: 6,
    fiber: 1,
    moisture: 78,
    gramsPerKg: 40,
    packColor: "#E2483D",
    badges: ["Pack of 6"],
    rating: 4.5,
    reviewCount: 310,
    sizes: [
      { label: "6 × 400 g", price: rs(2990), stock: 70 },
      { label: "12 × 400 g", price: rs(5590), compareAt: rs(5980), stock: 30 },
    ],
  },
  {
    slug: "peanut-butter-dental-chews",
    name: "Peanut Butter Dental Chews",
    brand: "Barkbite",
    tagline: "Fresh breath, fewer kisses avoided",
    description:
      "Twisty chews with a ridged shape that scrubs away plaque and tartar while your pup chomps. Real peanut butter makes it the best part of the day.",
    petType: "dog",
    lifeStage: "adult",
    category: "treats",
    flavor: "Peanut butter",
    ingredients: "Rice flour, glycerin, peanut butter, pea protein, cellulose, parsley, mint, calcium.",
    protein: 12,
    fat: 4,
    fiber: 3,
    moisture: 14,
    gramsPerKg: 1,
    packColor: "#F2A922",
    badges: ["Dental", "Bestseller"],
    rating: 4.8,
    reviewCount: 971,
    featured: true,
    sizes: [
      { label: "10 chews", price: rs(1290), stock: 200 },
      { label: "28 chews", price: rs(3190), compareAt: rs(3612), stock: 110 },
    ],
  },
  {
    slug: "chicken-jerky-bites",
    name: "Chicken Jerky Training Bites",
    brand: "Furrendly Kitchen",
    tagline: "Tiny bites, big good boys",
    description:
      "Single-ingredient chicken breast, gently air-dried into pea-sized bites — perfect for training sessions without the extra calories.",
    petType: "dog",
    lifeStage: "all",
    category: "treats",
    flavor: "Chicken",
    ingredients: "100% chicken breast.",
    protein: 70,
    fat: 4,
    fiber: 1,
    moisture: 18,
    gramsPerKg: 1,
    packColor: "#12A27A",
    badges: ["1 ingredient"],
    featured: true,
    rating: 4.9,
    reviewCount: 522,
    sizes: [
      { label: "150 g", price: rs(1450), stock: 140 },
      { label: "400 g", price: rs(3490), stock: 60 },
    ],
  },
  {
    slug: "ocean-fish-adult-cat",
    name: "Ocean Fish Adult Cat",
    brand: "Little Whiskers",
    tagline: "Purr-fectly balanced seafood feast",
    description:
      "Tuna and whitefish recipe with taurine for heart and eye health, and a crunchy kibble that helps keep teeth clean. Cats approve, humans relax.",
    petType: "cat",
    lifeStage: "adult",
    category: "dry-food",
    flavor: "Fish",
    ingredients:
      "Whitefish, tuna meal, rice, chicken fat, peas, fish oil, taurine, cranberries, yucca extract, vitamins & minerals.",
    protein: 32,
    fat: 15,
    fiber: 3,
    moisture: 10,
    gramsPerKg: 14,
    packColor: "#2F7DD1",
    badges: ["Bestseller", "With taurine"],
    rating: 4.8,
    reviewCount: 1105,
    featured: true,
    sizes: [
      { label: "1.2 kg", price: rs(2290), stock: 110 },
      { label: "3 kg", price: rs(5190), compareAt: rs(5725), stock: 70 },
      { label: "7 kg", price: rs(11200), compareAt: rs(12900), stock: 25 },
    ],
  },
  {
    slug: "indoor-hairball-chicken-cat",
    name: "Indoor Hairball Control",
    brand: "PawPure",
    tagline: "Less hairballs, more cuddles",
    description:
      "Natural fibre blend from beet pulp and psyllium helps hair pass through, with lower calories for indoor lounging lifestyles.",
    petType: "cat",
    lifeStage: "adult",
    category: "dry-food",
    flavor: "Chicken",
    ingredients:
      "Chicken, chicken meal, brown rice, beet pulp, psyllium husk, chicken fat, fish oil, taurine, vitamins & minerals.",
    protein: 30,
    fat: 12,
    fiber: 7,
    moisture: 10,
    gramsPerKg: 13,
    packColor: "#7C5CFF",
    badges: ["Indoor", "Hairball care"],
    rating: 4.6,
    reviewCount: 388,
    sizes: [
      { label: "1.5 kg", price: rs(2690), stock: 75 },
      { label: "4 kg", price: rs(6390), stock: 40 },
    ],
  },
  {
    slug: "kitten-growth-chicken",
    name: "Kitten Growth Chicken & Milk",
    brand: "Little Whiskers",
    tagline: "Tiny paws, mighty start",
    description:
      "Extra protein and calories for fast-growing kittens, with colostrum for natural immune support and DHA for sharp little minds.",
    petType: "cat",
    lifeStage: "puppy_kitten",
    category: "dry-food",
    flavor: "Chicken",
    ingredients:
      "Chicken, chicken meal, rice, egg, chicken fat, dried milk, colostrum, fish oil (DHA), taurine, vitamins & minerals.",
    protein: 36,
    fat: 20,
    fiber: 2.5,
    moisture: 10,
    gramsPerKg: 30,
    packColor: "#FF7A59",
    badges: ["With DHA"],
    rating: 4.9,
    reviewCount: 296,
    featured: true,
    sizes: [
      { label: "400 g", price: rs(990), stock: 150 },
      { label: "1.5 kg", price: rs(2990), stock: 80 },
    ],
  },
  {
    slug: "tuna-pate-wet-cat",
    name: "Tuna Pâté Pouches",
    brand: "Little Whiskers",
    tagline: "Silky smooth, licked-clean bowls",
    description:
      "Velvety tuna pâté in convenient single-serve pouches. Adds hydration to your cat's diet — great for picky eaters. 12 × 85 g.",
    petType: "cat",
    lifeStage: "all",
    category: "wet-food",
    flavor: "Tuna",
    ingredients: "Tuna, fish broth, chicken liver, sunflower oil, taurine, guar gum, vitamins & minerals.",
    protein: 11,
    fat: 4,
    fiber: 0.5,
    moisture: 82,
    gramsPerKg: 50,
    packColor: "#14B8C4",
    badges: ["Hydrating"],
    rating: 4.7,
    reviewCount: 745,
    featured: true,
    sizes: [
      { label: "12 × 85 g", price: rs(2390), stock: 95 },
      { label: "24 × 85 g", price: rs(4490), compareAt: rs(4780), stock: 50 },
    ],
  },
  {
    slug: "chicken-gravy-chunks-cat",
    name: "Chicken Chunks in Gravy",
    brand: "PawPure",
    tagline: "Gravy so good they'll lick the bowl",
    description:
      "Juicy chicken chunks in a savoury gravy, cooked gently to lock in flavour and moisture. Complete and balanced for adult cats.",
    petType: "cat",
    lifeStage: "adult",
    category: "wet-food",
    flavor: "Chicken",
    ingredients: "Chicken, chicken broth, liver, rice flour, taurine, vitamins & minerals.",
    protein: 10,
    fat: 5,
    fiber: 0.5,
    moisture: 80,
    gramsPerKg: 50,
    packColor: "#F2A922",
    badges: [],
    rating: 4.4,
    reviewCount: 189,
    sizes: [{ label: "12 × 85 g", price: rs(2190), stock: 0 }],
  },
  {
    slug: "salmon-crunchy-cat-treats",
    name: "Salmon Crunchy Cat Treats",
    brand: "Little Whiskers",
    tagline: "Shake the bag, summon the cat",
    description:
      "Crunchy outside, creamy salmon filling inside. Under 2 calories per treat so you can spoil them a little more often.",
    petType: "cat",
    lifeStage: "all",
    category: "treats",
    flavor: "Salmon",
    ingredients: "Chicken meal, salmon, rice, cheese powder, chicken fat, taurine, vitamins & minerals.",
    protein: 30,
    fat: 17,
    fiber: 3,
    moisture: 12,
    gramsPerKg: 1,
    packColor: "#E2483D",
    badges: ["Under 2 cal"],
    rating: 4.8,
    reviewCount: 860,
    sizes: [
      { label: "60 g", price: rs(590), stock: 300 },
      { label: "180 g", price: rs(1490), stock: 160 },
    ],
  },
  {
    slug: "omega-skin-coat-oil",
    name: "Omega 3 Skin & Coat Oil",
    brand: "PawPure",
    tagline: "Glossy coats in a few pumps",
    description:
      "Wild-caught fish oil rich in EPA & DHA for soft skin, a shiny coat and healthy joints. Easy pump bottle — just add to food. For dogs and cats.",
    petType: "dog",
    lifeStage: "all",
    category: "health",
    flavor: "Fish oil",
    ingredients: "Anchovy, sardine and mackerel oil; mixed tocopherols (vitamin E).",
    protein: 0,
    fat: 99,
    fiber: 0,
    moisture: 0,
    gramsPerKg: 0.2,
    packColor: "#14B8C4",
    badges: ["Dogs & cats"],
    rating: 4.7,
    reviewCount: 402,
    sizes: [
      { label: "250 ml", price: rs(2150), stock: 85 },
      { label: "500 ml", price: rs(3850), stock: 40 },
    ],
  },
  {
    slug: "probiotic-tummy-chews-dog",
    name: "Probiotic Tummy Chews",
    brand: "Furrendly Kitchen",
    tagline: "Happy gut, happy pup",
    description:
      "Soft chews with 6 probiotic strains and pumpkin to support digestion during food changes, travel or stressy days.",
    petType: "dog",
    lifeStage: "all",
    category: "health",
    flavor: "Pumpkin",
    ingredients: "Pumpkin, oat flour, probiotic blend (1B CFU), inulin, chicken liver flavour, coconut oil.",
    protein: 10,
    fat: 8,
    fiber: 6,
    moisture: 18,
    gramsPerKg: 0.1,
    packColor: "#F2A922",
    badges: ["Vet approved"],
    rating: 4.6,
    reviewCount: 214,
    sizes: [{ label: "60 chews", price: rs(2490), stock: 70 }],
  },
  {
    slug: "timothy-hay-rabbit-pellets",
    name: "Timothy Hay Rabbit Pellets",
    brand: "Wild Meadow",
    tagline: "Hop-approved fibre goodness",
    description:
      "High-fibre pellets made from sun-cured timothy hay for healthy digestion and teeth. Great for rabbits, guinea pigs and chinchillas.",
    petType: "small_pet",
    lifeStage: "adult",
    category: "dry-food",
    flavor: "Timothy hay",
    ingredients: "Timothy grass meal, soybean hulls, wheat middlings, cane molasses, vitamins & minerals.",
    protein: 14,
    fat: 2,
    fiber: 25,
    moisture: 12,
    gramsPerKg: 25,
    packColor: "#12A27A",
    badges: ["High fibre"],
    rating: 4.7,
    reviewCount: 158,
    sizes: [
      { label: "1 kg", price: rs(1650), stock: 60 },
      { label: "2.5 kg", price: rs(3690), stock: 30 },
    ],
  },
  {
    slug: "seed-fruit-mix-small-pets",
    name: "Garden Seed & Fruit Mix",
    brand: "Wild Meadow",
    tagline: "A crunchy little garden in every bowl",
    description:
      "A colourful blend of seeds, grains and dried fruit for hamsters and gerbils. Encourages natural foraging and keeps tiny teeth trim.",
    petType: "small_pet",
    lifeStage: "all",
    category: "treats",
    flavor: "Mixed",
    ingredients: "Sunflower seeds, oats, millet, dried apple, dried carrot, peas, pumpkin seeds, alfalfa.",
    protein: 13,
    fat: 6,
    fiber: 9,
    moisture: 12,
    gramsPerKg: 40,
    packColor: "#7C5CFF",
    badges: [],
    rating: 4.5,
    reviewCount: 97,
    sizes: [{ label: "500 g", price: rs(890), stock: 120 }],
  },
];

const reviewPool = [
  { author: "Ayesha K.", pet: "Mochi", rating: 5, body: "My picky eater finishes the whole bowl now. Delivery was quick too!" },
  { author: "Hamza R.", pet: "Tiger", rating: 5, body: "Coat looks so much shinier after three weeks. Subscribed and saving every month." },
  { author: "Sara M.", pet: "Biscuit", rating: 4, body: "Good quality and no tummy issues during the switch. Bag reseal could be better." },
  { author: "Bilal A.", pet: "Luna", rating: 5, body: "Vet recommended this and she was right. Energy levels are way up." },
  { author: "Fatima Z.", pet: "Coco", rating: 5, body: "She does a little spin every time I open the bag. Enough said." },
];

async function main() {
  console.log("Seeding Furrendly…");
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(reviews);
  await db.delete(variants);
  await db.delete(products);
  await db.delete(categories);

  const insertedCats = await db.insert(categories).values(cats).returning();
  const catId = Object.fromEntries(insertedCats.map((c) => [c.slug, c.id]));

  for (const [i, p] of items.entries()) {
    const { sizes, category, featured, ...rest } = p;
    const [row] = await db
      .insert(products)
      .values({ ...rest, categoryId: catId[category], featured: !!featured })
      .returning();
    await db.insert(variants).values(
      sizes.map((s, idx) => ({
        productId: row.id,
        label: s.label,
        sku: `FUR-${String(row.id).padStart(3, "0")}-${idx + 1}`,
        price: s.price,
        compareAtPrice: s.compareAt ?? null,
        stock: s.stock,
        sortOrder: idx,
      })),
    );
    const picks = [0, 1, 2].map((k) => reviewPool[(i + k) % reviewPool.length]);
    await db.insert(reviews).values(
      picks.map((r, k) => ({
        productId: row.id,
        author: r.author,
        petName: r.pet,
        rating: r.rating,
        body: r.body,
        createdAt: new Date(Date.now() - (k + 1) * 86400000 * (i + 3)),
      })),
    );
  }

  const [{ count }] = await db.execute<{ count: number }>(sql`select count(*)::int as count from products`).then((r) => r.rows);
  console.log(`Done — ${count} products.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
