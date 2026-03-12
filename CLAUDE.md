# CLAUDE.md — Houghton Home Dog Boarding

Guidelines for AI assistants working in this codebase.

## Project Overview
A static Next.js 14 (App Router) marketing site for a home-based dog boarding service.
Zero backend, zero database. Deploy target: Vercel.

## Tech Stack
- **Next.js 14** App Router, TypeScript strict mode
- **Tailwind CSS** with a custom design system (see `tailwind.config.ts`)
- **Radix UI** — Accordion (`@radix-ui/react-accordion`), Checkbox (`@radix-ui/react-checkbox`)
- **Lucide React** for icons
- **Google Fonts** — Playfair Display (display/headings) + DM Sans (body)

## Key Conventions

### Single Source of Truth
**All copy, prices, business info, and configuration lives in `content.ts`.**
Never hardcode business name, phone, email, pricing, or page copy directly in components.
Always import from `content.ts`.

### Component Structure
```
components/
  ui/           # Low-level primitives (button, etc.)
  *.tsx         # Page-level reusable components
app/
  page.tsx      # Server component (can export metadata)
  */page.tsx    # Server components unless interactivity needed
  */Client.tsx  # Client components (when useState/useEffect required)
lib/
  utils.ts      # cn() helper only
  schema.ts     # JSON-LD structured data helpers
```

### Client vs Server Components
- Keep pages as server components to enable `export const metadata`
- Extract interactive parts into `*Client.tsx` co-located files (e.g., `app/booking/BookingClient.tsx`)
- Never add `"use client"` to a page.tsx unless absolutely unavoidable

### Styling Rules
- Use Tailwind utility classes. No inline styles except for `animationDelay` (not available as Tailwind utility).
- Custom colors: `forest`, `cream`, `terra`, `gold` — see `tailwind.config.ts` for all shades.
- Custom fonts: `font-display` (Playfair Display) for headings, `font-body` (DM Sans) for body text.
- Animations: defined in `globals.css` as `@keyframes`, registered in `tailwind.config.ts` under `animation`.
- Scroll-reveal: use `<AnimatedSection>` component (IntersectionObserver-based).
- Shadows: use `shadow-card`, `shadow-card-hover`, `shadow-glow` custom tokens.

### SEO
- Every `page.tsx` must export a `metadata` object with `title` and `description`.
- Root layout includes LocalBusiness JSON-LD (from `lib/schema.ts`).
- FAQ page includes FAQPage JSON-LD.
- `public/sitemap.xml` and `public/robots.txt` are static — update domain when deploying.

## Commands
```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (must pass before merging)
npm run lint     # ESLint check
```

## Before Going Live
1. Fill in placeholders in `content.ts`: `phone`, `email`, `bookingFormUrl`, `bookingFormEmbedSrc`, `siteUrl`
2. Update domain in `public/robots.txt` and `public/sitemap.xml`
3. Run `npm run build` — all 12 pages must generate cleanly
4. Deploy via `vercel` CLI or GitHub integration

## Design System Quick Reference
| Token | Value | Usage |
|---|---|---|
| `forest` | `#1a3a2a` | Primary brand color, backgrounds, text |
| `cream` | `#faf6f0` | Page background, light surfaces |
| `terra` | `#c4693a` | CTA accent, hover states, active indicators |
| `gold` | `#d4a853` | Secondary accent, stars, badges |
| `font-display` | Playfair Display | H1–H4, card titles, hero text |
| `font-body` | DM Sans | All body text, labels, nav |

## Do Not
- Add a database or authentication (out of scope for MVP)
- Add new npm dependencies without strong justification — keep it lean
- Hardcode business details outside `content.ts`
- Use `any` TypeScript types
- Remove the waiver gate on the booking page
