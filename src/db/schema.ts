import {
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  real,
  index,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const petTypeEnum = pgEnum("pet_type", ["dog", "cat", "small_pet"]);
export const lifeStageEnum = pgEnum("life_stage", ["puppy_kitten", "adult", "senior", "all"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "card"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull(),
    name: varchar("name", { length: 120 }).notNull(),
    emoji: varchar("emoji", { length: 8 }).notNull().default("🐾"),
  },
  (t) => [uniqueIndex("categories_slug_idx").on(t.slug)],
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull(),
    name: varchar("name", { length: 200 }).notNull(),
    brand: varchar("brand", { length: 120 }).notNull(),
    tagline: varchar("tagline", { length: 200 }).notNull(),
    description: text("description").notNull(),
    petType: petTypeEnum("pet_type").notNull(),
    lifeStage: lifeStageEnum("life_stage").notNull().default("all"),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id),
    flavor: varchar("flavor", { length: 80 }).notNull(),
    ingredients: text("ingredients").notNull(),
    // Guaranteed analysis, stored as % values
    protein: real("protein").notNull(),
    fat: real("fat").notNull(),
    fiber: real("fiber").notNull(),
    moisture: real("moisture").notNull(),
    // Daily feeding guide: grams per kg of body weight
    gramsPerKg: real("grams_per_kg").notNull().default(15),
    packColor: varchar("pack_color", { length: 9 }).notNull(),
    badges: text("badges").array().notNull().default([]),
    rating: real("rating").notNull().default(0),
    reviewCount: integer("review_count").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_pet_type_idx").on(t.petType),
    index("products_category_idx").on(t.categoryId),
    index("products_featured_idx").on(t.featured),
  ],
);

// Sizes (1kg / 3kg / 10kg). Price and stock live on the variant, like real stores.
export const variants = pgTable(
  "product_variants",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 40 }).notNull(),
    sku: varchar("sku", { length: 60 }).notNull(),
    price: integer("price").notNull(), // minor units (paisa / cents)
    compareAtPrice: integer("compare_at_price"),
    stock: integer("stock").notNull().default(0),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    uniqueIndex("variants_sku_idx").on(t.sku),
    index("variants_product_idx").on(t.productId),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: varchar("author", { length: 80 }).notNull(),
    petName: varchar("pet_name", { length: 80 }),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("reviews_product_idx").on(t.productId)],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 20 }).notNull(),
    userId: uuid("user_id").references(() => users.id),
    email: varchar("email", { length: 255 }).notNull(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    phone: varchar("phone", { length: 30 }).notNull(),
    address: text("address").notNull(),
    city: varchar("city", { length: 80 }).notNull(),
    notes: text("notes"),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: integer("subtotal").notNull(),
    discount: integer("discount").notNull().default(0),
    shipping: integer("shipping").notNull(),
    total: integer("total").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("orders_number_idx").on(t.orderNumber),
    index("orders_user_idx").on(t.userId),
    index("orders_email_idx").on(t.email),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: serial("id").primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    variantId: integer("variant_id")
      .notNull()
      .references(() => variants.id),
    // Snapshot at purchase time so later catalog edits don't rewrite history
    productName: varchar("product_name", { length: 200 }).notNull(),
    variantLabel: varchar("variant_label", { length: 40 }).notNull(),
    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    autoship: boolean("autoship").notNull().default(false),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)],
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  variants: many(variants),
  reviews: many(reviews),
}));
export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, { fields: [variants.productId], references: [products.id] }),
}));
export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
}));
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
export const ordersRelations = relations(orders, ({ many, one }) => ({
  items: many(orderItems),
  user: one(users, { fields: [orders.userId], references: [users.id] }),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

export type Product = typeof products.$inferSelect;
export type Variant = typeof variants.$inferSelect;
export type Category = typeof categories.$inferSelect;

export const subscribers = pgTable(
  "newsletter_subscribers",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("subscribers_email_idx").on(t.email)],
);
