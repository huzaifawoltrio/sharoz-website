# Artist Studio

A full-stack artist portfolio, blog, and shop built with Next.js 16 (App
Router), MongoDB Atlas (via Mongoose), and Cloudinary. Every image,
heading, and piece of content on the public site — the split hero,
full-bleed banner, feature tiles, paintings, journeys, blog, and shop —
is editable from the admin portal at `/admin`.

## Stack

- **Next.js 16.3.5** (App Router, Turbopack, Server Actions)
- **MongoDB Atlas** via **Mongoose** — content, catalog, and orders
- **Cloudinary** — image hosting; uploads are cropped client-side
  (`react-easy-crop`) before being sent straight to Cloudinary
- **Tiptap** — rich text editor for blog/journey posts and artwork
  descriptions
- **Zustand** — client-side shopping cart (persisted to `localStorage`)
- Custom email/password admin auth (`bcryptjs` + `jose` JWT session
  cookie) — no third-party auth provider

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create `.env.local`** from the template and fill in real values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Where to get it |
   | --- | --- |
   | `MONGODB_URI` | MongoDB Atlas → Connect → Drivers |
   | `SESSION_SECRET` | Any long random string, e.g. `openssl rand -base64 32` |
   | `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary Dashboard → Settings → API Keys |
   | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same value as `CLOUDINARY_CLOUD_NAME` |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Whatever you want the first admin login to be |

3. **Seed the database** — creates the admin account plus generic
   starter content (site settings, homepage, about page, one sample
   category/artwork/post per section) so the site isn't empty:

   ```bash
   npm run seed
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   - Public site: [http://localhost:3000](http://localhost:3000)
   - Admin portal: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
     (credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## What the admin can edit

- **Site Settings** — name, tagline, logo, contact email, social links
- **Homepage** — the split hero (Paintings/Journeys), tagline, the
  full-bleed banner section, and the 3-tile feature grid — image, label,
  and link for every slot
- **About** — heading, bio (rich text), portrait, gallery
- **Categories** — dropdown groupings for Journeys and Paintings
- **Journeys / Blog** — posts with a Tiptap editor, cover image, and
  draft/published status
- **Artworks** — powers both `/paintings` (portfolio) and `/shop`
  (for-sale filter): images, description, medium/dimensions/year,
  categories, an optional one-of-a-kind original, and/or print variants
  (size, price, stock)
- **Orders** — inquiries submitted through the (payment-free) checkout
  flow; status workflow with stock reservation/restoration
- **Messages** — submissions from the "Get in Touch" contact form
- **Account** — change the admin password

## Checkout model

There is no payment gateway. `/checkout` collects buyer details and
creates an **Order** (an inquiry) — the admin follows up manually to
arrange payment and shipping. Submitting an order atomically reserves
stock (decrements print stock / marks an original sold) so two buyers
can't claim the same piece; cancelling an order from the admin restores
it.

## Notes on the Next.js 16 conventions used here

This project intentionally follows Next 16 idioms rather than
14/15-era patterns — see `AGENTS.md` for why, and
`node_modules/next/dist/docs/` for the underlying reference docs:

- `proxy.ts` (not `middleware.ts`) does an optimistic redirect for
  `/admin/*`; the real check is `requireAdmin()` in `lib/dal.ts`
- `params` / `searchParams` are always awaited; pages use the generated
  `PageProps<'/route'>` / `LayoutProps<'/route'>` helpers
- Cache Components (`cacheComponents`) is left off — every DB-backed
  route exports `dynamic = "force-dynamic"` so admin edits show up
  immediately with no cache invalidation to manage, and `next build`
  doesn't need a live database connection
- Image uploads go straight from the browser to Cloudinary (signed via
  a Route Handler) so they aren't limited by the Server Actions body
  size cap
