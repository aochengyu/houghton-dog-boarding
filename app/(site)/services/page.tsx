import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CTAButton } from "@/components/CTAButton";
import { PageHeader } from "@/components/PageHeader";
import { Check, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Dog boarding, cat boarding, day care, dog walking, and drop-in visits in Houghton/Kirkland, WA. Cage-free, in-home personal care.",
};

type ServiceEntry = {
  key: string;
  svc: { title: string; shortDesc: string; priceLine: string; included: readonly string[] };
  href: string | null;
  badge?: string;
};

const services: ServiceEntry[] = [
  {
    key: "dogBoarding",
    svc: content.services.dogBoarding,
    href: "/services/dog-boarding",
    badge: "Most popular",
  },
  {
    key: "catBoarding",
    svc: content.services.catBoarding,
    href: null,
  },
  {
    key: "dayCare",
    svc: content.services.dayCare,
    href: null,
    badge: "New",
  },
  {
    key: "dogWalking",
    svc: content.services.dogWalking,
    href: null,
  },
  {
    key: "dropIn",
    svc: content.services.dropIn,
    href: null,
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        h1="Our Services"
        subtitle="Home-based pet care in Houghton/Kirkland — tailored to each animal, never rushed."
      />

      {/* ── INDIVIDUAL SERVICES ──────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {services.map(({ key, svc, href, badge }, i) => (
            <AnimatedSection key={key} delay={i * 80}>
              <div className="bg-white rounded-3xl border border-forest/[0.07] p-8 lg:p-10 flex flex-col lg:flex-row lg:items-start gap-8">
                {/* Left */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="font-display text-2xl font-bold text-forest">{svc.title}</h2>
                    {badge && (
                      <span className="font-body text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-terra/10 text-terra font-semibold">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="font-display text-2xl font-bold text-terra mb-4">{svc.priceLine}</p>
                  <p className="font-body text-sm text-forest/65 leading-relaxed mb-6 max-w-xl">
                    {svc.shortDesc}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {svc.included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 font-body text-sm text-forest/70">
                        <Check size={14} className="text-teal/60 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: CTA */}
                <div className="lg:flex-shrink-0 flex flex-col gap-3 lg:w-40">
                  <CTAButton href="/booking" label="Book now" size="md" />
                  {href && (
                    <Link
                      href={href}
                      className="group flex items-center justify-center gap-1.5 text-sm font-body text-forest/50 hover:text-forest/80 transition-colors"
                    >
                      Details
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Bottom note */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 text-center">
          <p className="font-body text-sm text-forest/55">
            Questions about a service?{" "}
            <a href={`mailto:${content.business.email}`} className="text-terra underline underline-offset-2">
              {content.business.email}
            </a>
          </p>
        </div>
      </section>

      {/* ── PACKAGES ─────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-cream-200 border-t border-forest/[0.07]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={14} className="text-terra" />
              <p className="font-body text-[10px] uppercase tracking-[0.25em] text-terra font-semibold label-accent">
                Bundle & Save
              </p>
            </div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-forest mb-3">
              Package Deals
            </h2>
            <p className="font-body text-sm text-forest/65 max-w-lg leading-relaxed mb-12">
              Pre-pay for multiple services and save. Walk Pack expires 30 days from purchase. Weekly Stay applies to consecutive nights.
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 gap-5">
            {content.packages.map((pkg, i) => (
              <AnimatedSection key={pkg.title} delay={i * 80}>
                <div className={`relative rounded-2xl p-7 flex flex-col h-full border transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 ${
                  pkg.highlight
                    ? "bg-teal border-teal text-cream"
                    : "bg-white border-forest/[0.07]"
                }`}>
                  {/* Savings badge */}
                  <span className={`absolute top-5 right-5 font-body text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                    pkg.highlight ? "bg-cream/15 text-cream" : "bg-teal/10 text-teal"
                  }`}>
                    {pkg.savings}
                  </span>

                  <p className={`font-body text-[10px] uppercase tracking-[0.2em] font-semibold mb-2 ${
                    pkg.highlight ? "text-cream/55" : "text-forest/45"
                  }`}>
                    {pkg.tagline}
                  </p>

                  <h3 className={`font-display text-xl font-bold mb-3 ${
                    pkg.highlight ? "text-cream" : "text-forest"
                  }`}>
                    {pkg.title}
                  </h3>

                  <p className={`font-body text-sm leading-relaxed flex-1 mb-6 ${
                    pkg.highlight ? "text-cream/70" : "text-forest/65"
                  }`}>
                    {pkg.description}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className={`font-display text-3xl font-bold ${
                      pkg.highlight ? "text-cream" : "text-forest"
                    }`}>
                      {pkg.price}
                    </span>
                    <span className={`font-body text-sm line-through ${
                      pkg.highlight ? "text-cream/40" : "text-forest/35"
                    }`}>
                      {pkg.originalPrice}
                    </span>
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/booking"
                      className={`inline-flex items-center justify-center w-full gap-2 font-body font-semibold text-sm rounded-xl px-5 py-3 transition-all duration-200 ${
                        pkg.highlight
                          ? "bg-cream text-teal hover:bg-cream/90"
                          : "bg-teal text-cream hover:bg-teal-dark"
                      }`}
                    >
                      Book this package
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <p className="font-body text-xs text-forest/45 text-center mt-10">
              Package pricing requires pre-payment. Not combinable with other offers. Ask us about custom arrangements.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
