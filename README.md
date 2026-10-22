# Furrendly — pet food store

Full-stack Next.js 16 (App Router) e-commerce store for dog, cat and small pet food.

**Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · PostgreSQL · Drizzle ORM · Zustand · Zod · jose (JWT sessions) · bcrypt

## Pages (5)

| Route | What it does |
|---|---|
| `/` | Hero, shop-by-pet, bestsellers, categories, Subscribe & Save, promise, reviews, FAQ |
| `/shop` | Catalog with pet / category / life-stage filters, search, sort, pagination (all URL-driven, server-rendered) |
| `/product/[slug]` | Size variants, one-time vs autoship pricing, stock levels, ingredients, guaranteed analysis, feeding calculator, reviews, related products |
| `/checkout` | Guest or signed-in checkout, COD / card, validation, order confirmation (`?placed=`) |
| `/account` | Sign in / register, order history with status, autoship summary |

Cart is a slide-out drawer available on every page (persisted in localStorage).

## E-commerce behaviour

- **Server is the source of truth for money.** The client sends only variant IDs, quantities and autoship flags; prices are read from Postgres inside the checkout transaction.
- **No overselling.** Checkout locks the variant rows (`SELECT … FOR UPDATE`) and decrements stock with a guarded `UPDATE … WHERE stock >= qty`, all in one transaction. If stock ran out, the customer gets a clear message and their basket is corrected.
- **Fresh basket.** Opening checkout re-syncs cart prices and stock against the database.
- **Autoship (Subscribe & Save)** — 10% off a line; totals computed by one shared function (`src/lib/pricing.ts`) on client and server.
- **Free-delivery threshold** with progress meter (config in `src/lib/config.ts`).
- Order lines snapshot product name / size / price so history never changes when the catalog does.
- Registering links earlier guest orders made with the same email.
- Guest order confirmations are only viewable by the browser that placed them (httpOnly cookie) or the owning account.

## Database

PostgreSQL via Drizzle. Works with any Postgres host (Neon, Supabase, AWS RDS, self-hosted). Indexed on slug, pet type, category, featured, order user/email; prices stored as integers in minor units. Schema: `src/db/schema.ts`, migrations in `drizzle/`.

## Run locally

```bash
cp .env.example .env          # set DATABASE_URL and AUTH_SECRET
npm install
npm run db:migrate            # apply migrations
npm run db:seed               # 17 products, 4 categories, reviews
npm run dev                   # http://localhost:3000
```

## Before going live

- **Card payments:** the "card" option currently records the order as *Awaiting payment* (the UI says a payment link is sent by SMS). Wire a gateway (Stripe, PayFast, Safepay, JazzCash/Easypaisa) in `src/app/checkout/actions.ts` and mark orders paid from its webhook.
- **Emails/SMS:** no notifications are sent yet; hook up Resend/Postmark (and an SMS provider) where the order is created.
- **Product photos:** packs are illustrated SVGs (`ProductPack` in `src/components/art.tsx`). Add an `image_url` column and swap in `next/image` when you have photography.
- **Admin:** manage products/stock/order status with `npm run db:studio` for now, or build an admin area.
- Set a strong `AUTH_SECRET` (`openssl rand -base64 32`) and serve over HTTPS (session cookies are `Secure` in production).
