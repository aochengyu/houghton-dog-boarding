import type { Metadata } from "next";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { PageHeader } from "@/components/PageHeader";
import { CTAButton } from "@/components/CTAButton";
import { Check, X, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Home Dog Boarding Service",
  description: content.services.dogBoarding.shortDesc,
};

const svc = content.services.dogBoarding;

export default function DogBoardingPage() {
  return (
    <>
      <PageHeader h1={svc.title} subtitle={svc.shortDesc} />

      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Price */}
          <div className="bg-forest text-cream rounded-3xl p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold font-body uppercase tracking-widest text-cream/40 mb-1">Introductory Rate</p>
              <p className="font-display text-4xl font-bold text-cream">{svc.priceLine}</p>
            </div>
            <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
          </div>

          {/* Two-col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Included */}
            <div className="bg-white rounded-3xl p-8 border border-forest/5 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-forest mb-5">What&apos;s included</h2>
              <ul className="space-y-3">
                {svc.included.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-forest/70">
                    <Check size={16} className="text-forest mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl p-8 border border-forest/5 shadow-sm">
              <h2 className="font-display text-2xl font-semibold text-forest mb-5">Requirements</h2>
              <ul className="space-y-3">
                {svc.requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-forest/70">
                    <Star size={14} className="text-gold mt-1 flex-shrink-0" fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Good fit */}
            <div className="bg-cream-200 rounded-3xl p-8 border border-forest/5">
              <h2 className="font-display text-2xl font-semibold text-forest mb-5">Great fit</h2>
              <ul className="space-y-3">
                {svc.goodFit.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-forest/70">
                    <Check size={16} className="text-terra mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not ideal */}
            <div className="bg-cream-200 rounded-3xl p-8 border border-forest/5">
              <h2 className="font-display text-2xl font-semibold text-forest mb-5">Not the right fit</h2>
              <ul className="space-y-3">
                {svc.notIdeal.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-body text-forest/60">
                    <X size={16} className="text-forest/30 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="font-body text-forest/50 mb-6">
              Questions? <a href={`mailto:${content.business.email}`} className="text-terra underline underline-offset-2">{content.business.email}</a>
            </p>
            <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
          </div>
        </div>
      </Section>
    </>
  );
}
