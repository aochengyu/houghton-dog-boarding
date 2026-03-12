# Houghton Home Dog Boarding — Marketing Site

A production-quality Next.js marketing site for a home-based dog boarding service. Zero backend, zero cost, deploy to Vercel in minutes.

## Tech Stack
- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — mobile-first, custom design system
- **Radix UI** — accessible Accordion for FAQ
- **Google Fonts** — Playfair Display + DM Sans
- Deploy-ready for **Vercel**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing Content

**All copy, prices, and contact info live in one file: `content.ts`**

Before going live, update these fields in `content.ts`:

| Field | Where | Example |
|---|---|---|
| Phone | `content.business.phone` | `"(425) 555-0100"` |
| Email | `content.business.email` | `"hello@example.com"` |
| Google Form URL | `content.business.bookingFormUrl` | `"https://forms.gle/..."` |
| Google Form Embed | `content.business.bookingFormEmbedSrc` | `"https://docs.google.com/forms/d/.../viewform?embedded=true"` |
| Site URL | `content.business.siteUrl` | `"https://yourdomain.com"` |

Also update `public/robots.txt` and `public/sitemap.xml` with your real domain.

## Pages

| Route | Purpose |
|---|---|
| `/` | Home — hero, benefits, reviews, CTA |
| `/services/dog-boarding` | Service details, pricing, requirements |
| `/areas/houghton-dog-boarding` | Local SEO page — Houghton |
| `/areas/kirkland-dog-boarding` | Local SEO page — Kirkland |
| `/booking` | Waiver gate + booking form link |
| `/faq` | Accordion FAQ with JSON-LD |
| `/contact` | Phone, email, text note |
| `/legal/cancellation` | Cancellation policy |
| `/legal/liability-waiver` | Liability waiver |

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deploys.

## Customizing

- **Colors**: `tailwind.config.ts` → `colors`
- **Fonts**: `app/globals.css` → Google Fonts import, `:root` CSS variables
- **SEO metadata**: Each `page.tsx` exports a `metadata` object — edit there
- **JSON-LD schema**: `lib/schema.ts`
