import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CTAButton } from "@/components/CTAButton";
import { PawPrint } from "@/components/PawPrint";
import { Star, ArrowUpRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: content.business.name,
  description:
    "Home-based dog boarding in Houghton/Kirkland, WA. $70/night. Real home, fenced yard, limited to 1–2 dogs.",
};

export default function HomePage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="bg-forest overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_380px] gap-0 items-stretch min-h-[540px] lg:min-h-[600px]">

            {/* Left: copy */}
            <div className="py-16 lg:py-24 flex flex-col justify-center">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-terra font-medium mb-6">
                Houghton · Kirkland, WA &nbsp;·&nbsp; $70/night
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream leading-[1.02]">
                {content.home.heroHeadline}
              </h1>
              <p className="mt-6 text-base lg:text-lg text-cream/55 font-body leading-relaxed max-w-md">
                {content.home.heroSubheadline}
              </p>
              <div className="mt-10 flex items-center gap-4">
                <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
                <Link
                  href="/services/dog-boarding"
                  className="group flex items-center gap-1.5 text-sm font-body text-cream/50 hover:text-cream transition-colors"
                >
                  How it works
                  <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-2.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <span className="text-xs text-cream/35 font-body">Trusted by Houghton &amp; Kirkland families</span>
              </div>
            </div>

            {/* Right: info panel — solid terracotta block */}
            <div className="hidden lg:flex flex-col justify-center bg-terra px-10 py-12 relative overflow-hidden">
              {/* Subtle repeating paw pattern */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 32 32'%3E%3Cellipse cx='16' cy='22.5' rx='6.5' ry='5' fill='white'/%3E%3Ccircle cx='7.5' cy='14.5' r='2.8' fill='white'/%3E%3Ccircle cx='12.5' cy='11' r='3' fill='white'/%3E%3Ccircle cx='19.5' cy='11' r='3' fill='white'/%3E%3Ccircle cx='24.5' cy='14.5' r='2.8' fill='white'/%3E%3C/svg%3E")`,
                  backgroundSize: "48px 48px",
                }}
              />
              <p className="font-body text-xs uppercase tracking-[0.15em] text-white/50 mb-6">Introductory rate</p>
              <p className="font-display text-7xl font-bold text-white leading-none">
                $70
              </p>
              <p className="font-body text-white/55 text-sm mt-1">per night</p>
              <div className="mt-8 space-y-3">
                {[
                  "Fully fenced yard",
                  "1–2 dogs max",
                  "Daily photo updates",
                  "No kennels, ever",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                      <Check size={9} className="text-white" strokeWidth={3} />
                    </div>
                    <span className="font-body text-sm text-white/70">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/15">
                <p className="font-body text-xs text-white/40">
                  Address shared after confirmation. Meet-and-greet required for first stay.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <div className="border-b border-forest/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-forest/8">
            {[
              { num: "$70", label: "Per night" },
              { num: "1–2", label: "Dogs max" },
              { num: "<24h", label: "Response time" },
              { num: "100%", label: "Home-based" },
            ].map((stat) => (
              <div key={stat.label} className="py-6 px-6 lg:px-10 first:pl-0 last:pr-0">
                <p className="font-display text-2xl lg:text-3xl font-bold text-forest">{stat.num}</p>
                <p className="font-body text-xs text-forest/40 mt-0.5 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BENEFITS ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-16 items-start">

            {/* Sticky label column */}
            <div className="lg:sticky lg:top-28">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-terra font-medium mb-4">
                Why families choose us
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest leading-[1.1]">
                Small by design.
              </h2>
              <p className="mt-3 text-sm text-forest/50 font-body leading-relaxed">
                We keep capacity intentionally small so every dog gets real attention.
              </p>
              <div className="mt-6 w-8 h-px bg-terra" />
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-1 gap-4">
              {content.home.bullets.map((b, i) => (
                <AnimatedSection key={b.title} delay={i * 80}>
                  <div className="flex gap-6 p-6 bg-white border border-forest/8 rounded-xl hover:border-forest/20 hover:shadow-[0_4px_20px_rgba(26,58,42,0.07)] transition-all duration-300 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-terra/8 flex items-center justify-center group-hover:bg-terra/15 transition-colors duration-300">
                      <span className="font-display text-lg font-bold text-terra/50 group-hover:text-terra/70 transition-colors">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-forest mb-1.5">{b.title}</h3>
                      <p className="font-body text-sm text-forest/55 leading-relaxed">{b.body}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-forest">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">

            {/* Featured quote */}
            <AnimatedSection>
              <div className="flex items-center gap-2 mb-8">
                <PawPrint size={14} className="text-terra opacity-70" />
                <p className="font-body text-xs uppercase tracking-[0.15em] text-terra font-medium">
                  {content.home.socialProofTitle}
                </p>
              </div>
              <blockquote className="font-display text-2xl lg:text-3xl font-medium text-cream leading-[1.35] italic">
                &ldquo;{content.home.reviews[0].quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-cream/80 font-body">{content.home.reviews[0].author}</p>
                  <p className="text-xs text-cream/35 font-body">{content.home.reviews[0].location}</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Smaller reviews stacked */}
            <div className="flex flex-col gap-5">
              {content.home.reviews.slice(1).map((r, i) => (
                <AnimatedSection key={r.author} delay={i * 100}>
                  <div className="border border-cream/10 rounded-xl p-6 hover:border-cream/20 transition-colors duration-300">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} size={11} fill="currentColor" className="text-gold" />
                      ))}
                    </div>
                    <p className="font-body text-sm text-cream/60 leading-relaxed italic mb-4">
                      &ldquo;{r.quote}&rdquo;
                    </p>
                    <p className="font-body text-xs font-semibold text-cream/50">{r.author} · {r.location}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 border-b border-forest/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-terra font-medium mb-4">Pricing</p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest leading-[1.1]">
                Transparent,<br />simple pricing.
              </h2>
              <p className="mt-4 text-sm text-forest/55 font-body leading-relaxed max-w-sm">
                $70/night, locked in for returning clients. No surprise fees, no upsells — just honest home care.
              </p>
              <ul className="mt-6 space-y-2">
                {content.pricing.notes.map((n) => (
                  <li key={n} className="flex items-start gap-2.5 text-sm font-body text-forest/50">
                    <span className="text-terra mt-0.5 flex-shrink-0">—</span>
                    {n}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
              </div>
            </AnimatedSection>

            {/* Price display */}
            <AnimatedSection delay={150}>
              <div className="bg-forest rounded-2xl p-10 lg:p-14">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-cream/30 mb-4">Per night</p>
                <div className="flex items-end gap-2">
                  <span className="font-display text-8xl font-bold text-cream leading-none">$70</span>
                </div>
                <div className="mt-8 pt-8 border-t border-cream/10 grid grid-cols-2 gap-4">
                  {[
                    { label: "Capacity", val: "1–2 dogs" },
                    { label: "Response", val: "< 24 hrs" },
                    { label: "Address", val: "On confirm" },
                    { label: "Meet & greet", val: "Required" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-cream/25 font-body uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm text-cream/70 font-body font-medium mt-0.5">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* ── AREA LINKS ───────────────────────────────────────── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-terra font-medium mb-2">Service areas</p>
              <h2 className="font-display text-2xl font-bold text-forest">Serving the Eastside</h2>
            </div>
            <div className="flex gap-3">
              {[
                { label: "Houghton", href: "/areas/houghton-dog-boarding" },
                { label: "Kirkland", href: "/areas/kirkland-dog-boarding" },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="group flex items-center gap-2 border border-forest/15 rounded-lg px-5 py-3 text-sm text-forest font-body font-medium hover:bg-forest hover:text-cream hover:border-forest transition-all duration-200"
                >
                  {a.label} dog boarding
                  <ArrowUpRight size={13} className="text-forest/30 group-hover:text-cream/60 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-terra relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 32 32'%3E%3Cellipse cx='16' cy='22.5' rx='6.5' ry='5' fill='white'/%3E%3Ccircle cx='7.5' cy='14.5' r='2.8' fill='white'/%3E%3Ccircle cx='12.5' cy='11' r='3' fill='white'/%3E%3Ccircle cx='19.5' cy='11' r='3' fill='white'/%3E%3Ccircle cx='24.5' cy='14.5' r='2.8' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: "64px 64px",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <h2 className="font-display text-3xl lg:text-5xl font-bold text-white leading-[1.1]">
                {content.home.finalCtaHeadline}
              </h2>
              <p className="mt-4 text-white/60 font-body text-base max-w-lg leading-relaxed">
                {content.home.finalCtaBody}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 bg-white text-terra font-body font-semibold text-sm rounded-lg px-7 py-3.5 hover:bg-white/90 transition-colors"
              >
                {content.ctas.primary}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-body font-medium text-sm rounded-lg px-7 py-3.5 hover:border-white/50 hover:bg-white/5 transition-colors"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
