import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CTAButton } from "@/components/CTAButton";
import { PawPrint } from "@/components/PawPrint";
import { Star, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: content.business.name,
  description:
    "Home-based dog boarding in Houghton/Kirkland, WA. $70/night. Real home, fenced yard, limited to 1–2 dogs.",
};

const marqueeItems = [
  "Fully fenced yard",
  "No kennels · ever",
  "$70 per night",
  "1–2 dogs maximum",
  "Daily photo updates",
  "Kirkland, WA",
  "Response < 24 hours",
  "Home · not a facility",
  "Vaccine required",
  "Meet & greet first",
];

export default function HomePage() {
  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-forest overflow-hidden">
        {/* Dot grid texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(250,246,240,0.09) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-0 items-stretch min-h-[600px] lg:min-h-[700px]">

            {/* LEFT: editorial headline */}
            <div className="py-16 lg:py-24 xl:py-28 flex flex-col justify-center lg:pr-20">

              {/* Label row */}
              <div className="flex items-center gap-3 mb-10 opacity-0 animate-fade-up [animation-fill-mode:forwards]">
                <div className="h-px w-10 bg-terra flex-shrink-0" />
                <span className="font-body text-[10px] uppercase tracking-[0.3em] text-terra/80">
                  Houghton · Kirkland, WA
                </span>
              </div>

              {/* Giant headline — fluid size via clamp */}
              <h1
                className="font-display font-bold text-cream leading-[0.9] opacity-0 animate-fade-up [animation-delay:70ms] [animation-fill-mode:forwards]"
                style={{ fontSize: "clamp(3.25rem, 7.5vw, 6.75rem)" }}
              >
                A Real<br />
                <em className="not-italic text-cream/50 font-medium">Home.</em><br />
                Not a<br />
                Kennel.
              </h1>

              {/* Paw divider */}
              <div className="mt-10 mb-8 flex items-center gap-3 opacity-0 animate-fade-up [animation-delay:140ms] [animation-fill-mode:forwards]">
                <div className="h-px w-12 bg-terra/40" />
                <PawPrint size={13} className="text-terra opacity-70 flex-shrink-0" />
                <div className="h-px w-5 bg-terra/15" />
              </div>

              {/* Subheadline */}
              <p className="font-body text-sm lg:text-base text-cream/40 leading-relaxed max-w-[340px] opacity-0 animate-fade-up [animation-delay:200ms] [animation-fill-mode:forwards]">
                {content.home.heroSubheadline}
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-5 opacity-0 animate-fade-up [animation-delay:270ms] [animation-fill-mode:forwards]">
                <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
                <Link
                  href="/services/dog-boarding"
                  className="group flex items-center gap-1.5 text-sm font-body text-cream/35 hover:text-cream/65 transition-colors duration-200"
                >
                  How it works
                  <ArrowRight
                    size={13}
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
              </div>

              {/* Stars */}
              <div className="mt-9 flex items-center gap-2.5 opacity-0 animate-fade-up [animation-delay:340ms] [animation-fill-mode:forwards]">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <span className="text-[11px] font-body text-cream/25 ml-1">
                  Trusted by Eastside families
                </span>
              </div>
            </div>

            {/* RIGHT: price panel */}
            <div className="hidden lg:flex flex-col justify-between bg-terra px-9 py-14 relative overflow-hidden opacity-0 animate-[fadeInRight_0.85s_ease_0.25s_forwards]">
              {/* Large paw watermark */}
              <div aria-hidden className="absolute -right-12 -bottom-12 opacity-[0.08]">
                <PawPrint size={240} className="text-white" />
              </div>

              {/* Price display */}
              <div className="relative z-10">
                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/35 mb-4">
                  Introductory rate
                </p>
                <div className="flex items-start leading-none">
                  <span className="font-display text-xl font-bold text-white/45 mt-3 mr-1">$</span>
                  <span
                    className="font-display font-bold text-white leading-none"
                    style={{ fontSize: "clamp(4rem, 6vw, 5.5rem)" }}
                  >
                    70
                  </span>
                </div>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-white/30 mt-2">
                  per night
                </p>
              </div>

              {/* Checklist */}
              <div className="relative z-10 mt-8 space-y-4">
                {[
                  "Fully fenced yard",
                  "1–2 dogs max",
                  "Daily photo updates",
                  "No kennels, ever",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-white/75" strokeWidth={2.5} />
                    </div>
                    <span className="font-body text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>

              {/* Fine print */}
              <div className="relative z-10 mt-10 pt-7 border-t border-white/10">
                <p className="font-body text-[11px] text-white/20 leading-relaxed">
                  Address shared after confirmation.<br />
                  Meet-and-greet required for first stays.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────── */}
      <div className="bg-forest border-t border-cream/[0.07] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-4 px-7 font-body text-[10px] uppercase tracking-[0.25em] text-cream/25"
            >
              {item}
              <PawPrint size={9} className="text-terra/60 flex-shrink-0" />
            </span>
          ))}
        </div>
      </div>

      {/* ── BENEFITS ────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <AnimatedSection>
            <div className="mb-16 lg:mb-20">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-terra font-medium mb-5 label-accent">
                Why families choose us
              </p>
              <h2
                className="font-display font-bold text-forest leading-[1.0]"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
              >
                Small by design.{" "}
                <span className="italic font-medium text-forest/35">Big on care.</span>
              </h2>
            </div>
          </AnimatedSection>

          {/* 3-column grid with ghost numerals */}
          <div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
            {content.home.bullets.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 110}>
                <div className="group relative">
                  {/* Ghost numeral — decorative background text */}
                  <span
                    aria-hidden
                    className="absolute -top-3 -left-1 font-display font-bold text-forest/[0.05] leading-none select-none pointer-events-none"
                    style={{ fontSize: "clamp(5rem, 9vw, 7.5rem)" }}
                  >
                    0{i + 1}
                  </span>

                  {/* Content */}
                  <div className="relative pt-3">
                    {/* Accent line */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-body text-[10px] font-bold tracking-[0.2em] text-terra/60 uppercase">
                        0{i + 1}
                      </span>
                      <div className="h-px flex-1 bg-terra/20" />
                    </div>

                    <h3 className="font-display text-xl lg:text-2xl font-bold text-forest mb-3 leading-snug">
                      {b.title}
                    </h3>
                    <p className="font-body text-sm text-forest/50 leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-forest relative overflow-hidden">
        {/* Dot grid texture (matches hero) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(250,246,240,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Label */}
          <AnimatedSection>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-terra font-medium mb-14 label-accent">
              {content.home.socialProofTitle}
            </p>
          </AnimatedSection>

          {/* Featured quote — cinematic treatment */}
          <AnimatedSection delay={70}>
            <div className="relative mb-14">
              {/* Giant decorative opening quotation mark */}
              <span
                aria-hidden
                className="absolute font-display font-bold text-cream/[0.045] leading-none select-none pointer-events-none"
                style={{
                  fontSize: "clamp(8rem, 20vw, 16rem)",
                  top: "-0.5em",
                  left: "-0.05em",
                  lineHeight: 1,
                }}
              >
                &ldquo;
              </span>

              <blockquote
                className="relative font-display font-medium italic text-cream leading-[1.25]"
                style={{ fontSize: "clamp(1.6rem, 4vw, 3.5rem)" }}
              >
                {content.home.reviews[0].quote}
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <div className="w-px h-4 bg-cream/10" />
                <div>
                  <p className="font-body text-sm font-semibold text-cream/65">
                    {content.home.reviews[0].author}
                  </p>
                  <p className="font-body text-xs text-cream/30">
                    {content.home.reviews[0].location}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Smaller reviews — 2-col grid */}
          <div className="grid sm:grid-cols-2 gap-4 mt-2 border-t border-cream/[0.07] pt-10">
            {content.home.reviews.slice(1).map((r, i) => (
              <AnimatedSection key={r.author} delay={100 + i * 100}>
                <div className="rounded-2xl border border-cream/[0.08] p-7 hover:border-cream/[0.15] hover:bg-cream/[0.02] transition-all duration-300">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={11} fill="currentColor" className="text-gold" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-cream/50 leading-relaxed italic mb-5">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                  <p className="font-body text-xs text-cream/30 font-medium tracking-wide uppercase">
                    {r.author} · {r.location}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>

        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-cream-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-16 lg:gap-24 items-center">

            {/* Left: copy */}
            <AnimatedSection>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-terra font-medium mb-5 label-accent">
                Pricing
              </p>
              <h2
                className="font-display font-bold text-forest leading-[1.0]"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
              >
                One rate.{" "}
                <em className="not-italic italic font-medium text-forest/35">No surprises.</em>
              </h2>
              <div className="mt-6 w-10 h-px bg-terra" />
              <p className="mt-6 font-body text-sm text-forest/50 leading-relaxed max-w-sm">
                $70/night, locked in for returning clients. No upsells, no extras — just honest,
                attentive home care.
              </p>
              <ul className="mt-8 space-y-3">
                {content.pricing.notes.map((n) => (
                  <li key={n} className="flex items-start gap-3 text-sm font-body text-forest/40">
                    <span className="text-terra mt-0.5 flex-shrink-0">—</span>
                    {n}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
              </div>
            </AnimatedSection>

            {/* Right: price card */}
            <AnimatedSection delay={140} direction="right">
              <div className="relative rounded-3xl bg-forest overflow-hidden p-10 lg:p-14">
                {/* Paw watermark */}
                <div aria-hidden className="absolute -right-10 -bottom-10 opacity-[0.055]">
                  <PawPrint size={210} className="text-cream" />
                </div>

                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-cream/20 mb-5 relative z-10">
                  Per night
                </p>
                <div className="flex items-start leading-none relative z-10">
                  <span className="font-display text-xl font-bold text-cream/35 mt-3 mr-1.5">$</span>
                  <span
                    className="font-display font-bold text-cream leading-none"
                    style={{ fontSize: "clamp(4rem, 10vw, 7rem)" }}
                  >
                    70
                  </span>
                </div>

                <div className="mt-10 pt-8 border-t border-cream/[0.08] grid grid-cols-2 gap-6 relative z-10">
                  {[
                    { label: "Capacity", val: "1–2 dogs" },
                    { label: "Response", val: "< 24 hrs" },
                    { label: "Address", val: "On confirm" },
                    { label: "Meet & greet", val: "Required" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="font-body text-[10px] uppercase tracking-widest text-cream/20 mb-1">
                        {item.label}
                      </p>
                      <p className="font-body text-sm text-cream/60 font-medium">{item.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* ── AREA LINKS ──────────────────────────────────────────── */}
      <div className="border-t border-forest/[0.07]">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-terra font-medium mb-2">
                  Service areas
                </p>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-forest">
                  Serving the Eastside
                </h2>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[
                  { label: "Houghton", href: "/areas/houghton-dog-boarding" },
                  { label: "Kirkland", href: "/areas/kirkland-dog-boarding" },
                ].map((a) => (
                  <Link
                    key={a.href}
                    href={a.href}
                    className="group flex items-center gap-2 border border-forest/10 rounded-xl px-5 py-3 text-sm text-forest font-body font-medium hover:bg-forest hover:text-cream hover:border-forest transition-all duration-200"
                  >
                    {a.label} dog boarding
                    <ArrowRight
                      size={13}
                      className="text-forest/25 group-hover:text-cream/55 group-hover:translate-x-0.5 transition-all duration-200"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-24 lg:py-36 bg-terra relative overflow-hidden">
        {/* Paw tile pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.055] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 32 32'%3E%3Cellipse cx='16' cy='22.5' rx='6.5' ry='5' fill='white'/%3E%3Ccircle cx='7.5' cy='14.5' r='2.8' fill='white'/%3E%3Ccircle cx='12.5' cy='11' r='3' fill='white'/%3E%3Ccircle cx='19.5' cy='11' r='3' fill='white'/%3E%3Ccircle cx='24.5' cy='14.5' r='2.8' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

            <AnimatedSection>
              <h2
                className="font-display font-bold text-white leading-[1.0]"
                style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}
              >
                {content.home.finalCtaHeadline}
              </h2>
              <p className="mt-5 font-body text-base text-white/50 max-w-xl leading-relaxed">
                {content.home.finalCtaBody}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={150} direction="right">
              <div className="flex flex-col gap-3">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 bg-white text-terra font-body font-semibold text-sm rounded-xl px-8 py-4 hover:bg-cream transition-colors duration-200 whitespace-nowrap"
                >
                  {content.ctas.primary}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/60 font-body font-medium text-sm rounded-xl px-8 py-4 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Ask a question
                </Link>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>
    </>
  );
}
