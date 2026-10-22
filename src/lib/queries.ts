import "server-only";
import { db } from "@/db";
import { categories, products, variants, reviews } from "@/db/schema";
import { and, asc, desc, eq, ilike, inArray, or, sql, type SQL } from "drizzle-orm";

export type ShopFilters = {
  pet?: string;
  category?: string;
  stage?: string;
  q?: string;
  sort?: string;
  page?: number;
};

export const PAGE_SIZE = 12;

const minPrice = sql<number>`(select min(${variants.price}) from ${variants} where ${variants.productId} = ${products.id})`;
const inStock = sql<boolean>`exists(select 1 from ${variants} where ${variants.productId} = ${products.id} and ${variants.stock} > 0)`;
const maxCompare = sql<number | null>`(select max(${variants.compareAtPrice}) from ${variants} where ${variants.productId} = ${products.id})`;

const firstVariant = sql<{ id: number; label: string; price: number; stock: number } | null>`(
  select json_build_object('id', v.id, 'label', v.label, 'price', v.price, 'stock', v.stock)
  from ${variants} v where v.product_id = ${products.id} and v.stock > 0
  order by v.sort_order limit 1)`;

const cardFields = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  brand: products.brand,
  tagline: products.tagline,
  petType: products.petType,
  flavor: products.flavor,
  packColor: products.packColor,
  badges: products.badges,
  rating: products.rating,
  reviewCount: products.reviewCount,
  categoryName: categories.name,
  minPrice,
  inStock,
  firstVariant,
  onSale: sql<boolean>`${maxCompare} is not null`,
};

export type ProductCardData = Awaited<ReturnType<typeof getFeatured>>[number];

export async function getFeatured(limit = 8) {
  return db
    .select(cardFields)
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(and(eq(products.isActive, true), eq(products.featured, true)))
    .orderBy(desc(products.reviewCount))
    .limit(limit);
}

export async function getCategories() {
  return db
    .select({
      id: categories.id,
      slug: categories.slug,
      name: categories.name,
      emoji: categories.emoji,
      count: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .leftJoin(products, and(eq(products.categoryId, categories.id), eq(products.isActive, true)))
    .groupBy(categories.id)
    .orderBy(asc(categories.id));
}

export async function searchProducts(f: ShopFilters) {
  const where: SQL[] = [eq(products.isActive, true)];
  if (f.pet && ["dog", "cat", "small_pet"].includes(f.pet))
    where.push(eq(products.petType, f.pet as "dog" | "cat" | "small_pet"));
  if (f.category) where.push(eq(categories.slug, f.category));
  if (f.stage && ["puppy_kitten", "adult", "senior"].includes(f.stage))
    where.push(
      inArray(products.lifeStage, [f.stage as "puppy_kitten" | "adult" | "senior", "all"]),
    );
  if (f.q?.trim()) {
    const term = `%${f.q.trim()}%`;
    where.push(
      or(
        ilike(products.name, term),
        ilike(products.brand, term),
        ilike(products.flavor, term),
        ilike(products.tagline, term),
      )!,
    );
  }

  const order =
    f.sort === "price-asc"
      ? [asc(minPrice)]
      : f.sort === "price-desc"
        ? [desc(minPrice)]
        : f.sort === "rating"
          ? [desc(products.rating), desc(products.reviewCount)]
          : f.sort === "new"
            ? [desc(products.createdAt)]
            : [desc(products.featured), desc(products.reviewCount)];

  const page = Math.max(1, f.page ?? 1);
  const cond = and(...where);

  const [rows, [{ total }]] = await Promise.all([
    db
      .select(cardFields)
      .from(products)
      .innerJoin(categories, eq(categories.id, products.categoryId))
      .where(cond)
      .orderBy(...order, asc(products.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ total: sql<number>`count(*)::int` })
      .from(products)
      .innerJoin(categories, eq(categories.id, products.categoryId))
      .where(cond),
  ]);
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProductBySlug(slug: string) {
  const product = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isActive, true)),
    with: {
      category: true,
      variants: { orderBy: asc(variants.sortOrder) },
      reviews: { orderBy: desc(reviews.createdAt), limit: 6 },
    },
  });
  return product ?? null;
}

export async function getRelated(productId: number, petType: "dog" | "cat" | "small_pet", limit = 4) {
  return db
    .select(cardFields)
    .from(products)
    .innerJoin(categories, eq(categories.id, products.categoryId))
    .where(and(eq(products.isActive, true), eq(products.petType, petType), sql`${products.id} <> ${productId}`))
    .orderBy(desc(products.rating))
    .limit(limit);
}
