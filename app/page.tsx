import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { InfoCard } from "@/components/InfoCard";
import { CTAButton } from "@/components/CTAButton";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Star, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: content.business.name,
  description:
    "Home-based dog boarding in Houghton/Kirkland, WA. $70/night. Real home, fenced yard, limited to 1-2 dogs.",
};

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background: diagonal forest/cream split */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-700 to-forest-500" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 50%, #d4a853 0%, transparent 60%)",
          }}
        />

        {/* Decorative floating orbs */}
        <div className="absolute top-20 right-1/3 w-64 h-64 bg-terra/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}} />
        <div className="absolute -top-10 left-1/4 w-48 h-48 bg-forest-500/20 rounded-full blur-2xl animate-float" style={{animationDelay: '0.75s'}} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-2xl">
            {/* Pill label */}
            <span className="inline-block bg-gold/20 text-gold text-xs font-semibold font-body tracking-widest uppercase px-4 py-2 rounded-full mb-6 opacity-0 animate-fade-up delay-100">
              Houghton · Kirkland, WA
            </span>

            <h1 className="font-display text-5xl lg:text-7xl font-bold text-cream leading-[1.05] text-balance opacity-0 animate-fade-up delay-200">
              {content.home.heroHeadline}
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-cream/70 font-body leading-relaxed max-w-xl text-balance opacity-0 animate-fade-up delay-300">
              {content.home.heroSubheadline}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 opacity-0 animate-fade-up delay-400">
              <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
              <CTAButton
                href="/services/dog-boarding"
                label={content.ctas.secondary}
                size="lg"
                variant="outline"
                className="[&>button]:border-cream/40 [&>button]:text-cream [&>button]:hover:bg-cream [&>button]:hover:text-forest"
              />
            </div>

            {/* Trust badge */}
            <div className="mt-10 flex items-center gap-3 text-cream/50 text-sm font-body opacity-0 animate-fade-up delay-500">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" className="text-gold" />
                ))}
              </div>
              <span>Trusted by Kirkland &amp; Houghton dog families</span>
            </div>
          </div>

          {/* Price badge — floated, visible on lg */}
          <div className="hidden lg:block absolute right-16 top-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl max-w-xs opacity-0 animate-scale-in delay-300 animate-float hover:shadow-glow transition-shadow duration-300">
            <p className="text-xs font-semibold font-body uppercase tracking-widest text-forest/40 mb-1">Introductory Rate</p>
            <p className="font-display text-5xl font-bold text-forest">
              $70<span className="text-2xl font-normal text-forest/40">/night</span>
            </p>
            <p className="mt-3 text-sm text-forest/50 font-body">Limited spots · 1–2 dogs max</p>
            <div className="mt-4 pt-4 border-t border-forest/10 flex flex-col gap-1.5 text-sm text-forest/60 font-body">
              <span>✓ Fenced yard</span>
              <span>✓ Daily photo updates</span>
              <span>✓ No kennels, ever</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="bg-white border-y border-forest/5 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { num: "$70", label: "Per night" },
              { num: "1–2", label: "Dogs max" },
              { num: "24hr", label: "Response time" },
              { num: "100%", label: "Home-based" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-bold text-forest">{stat.num}</p>
                <p className="font-body text-xs uppercase tracking-widest text-forest/40 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BENEFITS */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest">
            Why families choose us
          </h2>
          <p className="mt-3 text-forest/50 font-body">
            Small by design. Thoughtful by nature.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.home.bullets.map((b, i) => (
            <AnimatedSection key={b.title} delay={i * 100}>
              <InfoCard
                icon={b.icon as keyof typeof import("lucide-react")}
                title={b.title}
                body={b.body}
              />
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* PRICING HIGHLIGHT */}
      <Section tinted>
        <div className="max-w-4xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest">
              Transparent, simple pricing
            </h2>
            <p className="mt-4 text-forest/60 font-body leading-relaxed">
              Our introductory rate of <strong className="text-forest">$70/night</strong> is locked in for returning clients. No surprise fees, no upsells — just honest, home-based care.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-body text-forest/60">
              {content.pricing.notes.map((n) => (
                <li key={n} className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">›</span> {n}
                </li>
              ))}
            </ul>
          </div>
          <AnimatedSection delay={200}>
            <div className="bg-forest text-cream rounded-3xl p-10 text-center min-w-[220px] shadow-xl hover:shadow-glow transition-shadow duration-300 hover:-translate-y-1 transition-all">
              <p className="font-display text-6xl font-bold">$70</p>
              <p className="font-body text-cream/60 mt-1">per night</p>
              <div className="mt-6">
                <CTAButton href="/booking" label="Check Availability" size="md" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* SOCIAL PROOF */}
      <Section>
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest">
            {content.home.socialProofTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.home.reviews.map((r, i) => (
            <AnimatedSection key={r.author} delay={i * 120}>
              <div className="relative bg-white rounded-3xl p-8 border border-forest/5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group">
                {/* Decorative quote mark */}
                <div className="absolute top-4 right-6 font-display text-7xl text-forest/5 leading-none select-none pointer-events-none group-hover:text-terra/10 transition-colors duration-300">
                  &ldquo;
                </div>
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" className="text-gold" />
                  ))}
                </div>
                <blockquote className="font-body text-forest/70 leading-relaxed italic mb-5">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-forest font-body text-sm">{r.author}</p>
                  <p className="text-xs text-forest/40 font-body">{r.location}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* AREA LINKS */}
      <Section tinted>
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-forest">
            Serving the Eastside
          </h2>
          <p className="mt-2 text-forest/50 font-body">Convenient to all neighborhoods</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          {[
            { label: "Houghton Dog Boarding", href: "/areas/houghton-dog-boarding" },
            { label: "Kirkland Dog Boarding", href: "/areas/kirkland-dog-boarding" },
          ].map((a, i) => (
            <AnimatedSection key={a.href} delay={i * 150}>
              <Link
                href={a.href}
                className="group flex items-center gap-2 bg-white border border-forest/10 rounded-2xl px-6 py-4 text-forest font-body font-medium hover:bg-forest hover:text-cream hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 shadow-card"
              >
                {a.label}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="bg-forest text-cream relative overflow-hidden">
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(ellipse at 20% 50%, #c4693a 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, #d4a853 0%, transparent 50%)",
          }}
        />
        {/* Floating decorative elements */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-terra/10 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-0 right-10 w-48 h-48 bg-gold/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />

        <div className="relative text-center max-w-2xl mx-auto">
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-cream text-balance">
            {content.home.finalCtaHeadline}
          </h2>
          <p className="mt-4 text-cream/60 font-body text-lg text-balance">
            {content.home.finalCtaBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
            <CTAButton href="/contact" label="Ask a Question" size="lg" variant="outline"
              className="[&>button]:border-cream/40 [&>button]:text-cream [&>button]:hover:bg-cream [&>button]:hover:text-forest"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
