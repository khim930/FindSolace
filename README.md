# FindSolace — Find what you need, close to home

A full-stack e-commerce platform built with Next.js 14, PostgreSQL (Prisma), Paystack payments, Cloudinary image hosting, and AI-powered product descriptions.

---

## 🚀 Quick start (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your environment variables
```bash
cp .env.example .env
```
Then fill in each value in `.env`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) (free) or [railway.app](https://railway.app) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal |
| `PAYSTACK_SECRET_KEY` | [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developer) |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Same Paystack dashboard |
| `CLOUDINARY_CLOUD_NAME` | [cloudinary.com](https://cloudinary.com) (free 25GB) |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |

### 3. Set up the database
```bash
npm run db:push        # Create all tables
npm run db:seed        # Add sample data + test accounts
```

### 4. Run the development server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Test accounts (after seeding)
| Role | Email | Password |
|---|---|---|
| Admin | admin@findsolace.gh | admin123 |
| Seller | kofi@findsolace.gh | seller123 |
| Buyer | buyer@findsolace.gh | buyer123 |

---

## 📁 Project structure

```
findsolace/
├── prisma/
│   ├── schema.prisma          # Full database schema (9 models)
│   └── seed.ts                # Sample data seeder
│
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx       # Product listing + search + filters
│   │   │   └── [slug]/        # Product detail page
│   │   ├── cart/              # Cart page
│   │   ├── checkout/          # Checkout + success confirmation
│   │   ├── login/             # Login + signup
│   │   ├── seller/            # Seller dashboard (protected)
│   │   ├── admin/             # Admin panel (protected)
│   │   ├── track/             # Order tracking
│   │   ├── about/             # About us
│   │   ├── contact/           # Contact form
│   │   ├── faq/               # FAQ accordion
│   │   ├── blog/              # Blog articles grid
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of service
│   │   └── refund/            # Refund policy
│   │
│   │   └── api/
│   │       ├── auth/          # NextAuth + registration
│   │       ├── products/      # CRUD + AI SEO generation
│   │       ├── orders/        # Create order + tracking
│   │       ├── payments/      # Paystack initialize + callback + webhook
│   │       ├── admin/         # Seller approve/suspend
│   │       ├── upload/        # Cloudinary signed uploads
│   │       └── newsletter/    # Email capture
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Sticky nav with cart count
│   │   │   ├── Footer.tsx     # Full footer with all links
│   │   │   └── Providers.tsx  # NextAuth + toast provider
│   │   ├── product/
│   │   │   ├── ProductCard.tsx       # Reusable product card
│   │   │   └── AddToCartButton.tsx   # Client-side cart button
│   │   ├── seller/
│   │   │   └── SellerDashboard.tsx   # Full seller hub
│   │   └── admin/
│   │       └── AdminDashboard.tsx    # Admin control panel
│   │
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── auth.ts            # NextAuth config + JWT
│       ├── paystack.ts        # Paystack API (initialize, verify, webhook)
│       ├── cloudinary.ts      # Image upload + signed URLs
│       ├── ai.ts              # Claude API for SEO descriptions
│       ├── commission.ts      # Tiered commission calculator
│       └── store.ts           # Zustand cart store (persisted)
```

---

## 💳 Payment flow (Paystack)

```
Buyer checkout → POST /api/orders (create order + commissions)
              → POST /api/payments/initialize (get Paystack URL)
              → Redirect to Paystack (card / MoMo)
              → Paystack callback → GET /api/payments/callback
              → Order confirmed → seller payouts updated
              → Redirect to /checkout/success
```

Additionally, Paystack sends a server-to-server webhook to `/api/payments/webhook` for reliability. Register this URL in your Paystack dashboard under **Settings → Webhooks**.

---

## 🤖 AI product descriptions

When a seller adds a product, hitting "Generate with AI" calls `/api/products/generate-seo` which sends the product title, category, features and price to Claude (claude-sonnet-4-20250514). Claude returns:
- A 3-paragraph SEO description (Ghana-context aware)
- A meta title under 60 characters
- 5–7 SEO keyword tags

---

## 📸 Image uploads

Product images are uploaded directly from the browser to Cloudinary using a signed upload URL (fetched from `/api/upload/signature`). This keeps your API key secret while allowing fast direct uploads.

Create an **upload preset** in your Cloudinary dashboard:
1. Settings → Upload → Add upload preset
2. Name it `findsolace_products`
3. Set signing mode to **Signed**

---

## 🚀 Deployment (Railway — recommended for Ghana)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial FindSolace"
git remote add origin https://github.com/yourusername/findsolace
git push -u origin main

# 2. Create project on railway.app
# 3. Add PostgreSQL plugin
# 4. Set all environment variables from .env
# 5. Railway auto-detects Next.js and deploys

# After deploy, run migrations:
railway run npm run db:push
railway run npm run db:seed
```

**Custom domain:** In Railway → Settings → Custom domain → add `yourdomain.gh` or `findsolace.gh`

---

## 📱 Mobile Money setup (Paystack)

Paystack handles MTN MoMo and Vodafone Cash automatically when you enable `mobile_money` as a channel. No additional setup needed beyond your Paystack account being verified for Ghana.

Test MoMo numbers for sandbox:
- MTN: 0551234987
- Vodafone: 0201234986

---

## 🔧 Useful commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run db:studio    # Prisma Studio (visual DB browser)
npm run db:migrate   # Run new migrations
npm run db:seed      # Re-seed sample data
```

---

## 📊 Revenue streams built in

| Stream | Implementation |
|---|---|
| Platform commission | 5–7% on each seller transaction (calculated in `commission.ts`) |
| Sponsored products | `isSponsored` flag + `SponsoredContent` model |
| Google AdSense | Add `<Script>` tag to `layout.tsx` with your AdSense ID |
| Affiliate tracking | `AffiliateClick` model + UTM tracking in `productListing.js` |

---

## 🇬🇭 Built for Ghana

- **Mobile Money first** — MTN MoMo & Vodafone Cash via Paystack
- **16 regions** — All regions in delivery address dropdown
- **GH₵ currency** — Throughout UI and all calculations
- **WhatsApp integration** — Seller contact via WhatsApp number
- **Low bandwidth friendly** — Next.js ISR, optimised images via Cloudinary CDN
