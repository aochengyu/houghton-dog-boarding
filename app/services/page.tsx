import type { Metadata } from "next";
import Link from "next/link";
import { content } from "@/content";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CTAButton } from "@/components/CTAButton";
import { PageHeader } from "@/components/PageHeader";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: `Services | ${content.business.name}`,
  description:
    "Dog boarding, cat boarding, dog walking, and drop-in visits in Houghton/Kirkland, WA. In-home, personal care — never a kennel.",
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
                  <p className="font-body text-sm text-forest/55 leading-relaxed mb-6 max-w-xl">
                    {svc.shortDesc}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {svc.included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 font-body text-sm text-forest/60">
                        <Check size={14} className="text-forest/40 mt-0.5 flex-shrink-0" />
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
                      className="group flex items-center justify-center gap-1.5 text-sm font-body text-forest/40 hover:text-forest/70 transition-colors"
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
          <p className="font-body text-sm text-forest/40">
            Questions about a service?{" "}
            <a href={`mailto:${content.business.email}`} className="text-terra underline underline-offset-2">
              {content.business.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
