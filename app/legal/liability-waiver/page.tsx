import type { Metadata } from "next";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { PageHeader } from "@/components/PageHeader";
import { CTAButton } from "@/components/CTAButton";

const legal = content.legal.waiver;

export const metadata: Metadata = {
  title: legal.pageTitle,
  description: "Liability waiver for Houghton Home Dog Boarding in Kirkland, WA. Required reading before submitting a booking request.",
};

export default function LiabilityWaiverPage() {
  return (
    <>
      <PageHeader h1={legal.h1} />
      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-forest/5 shadow-sm mb-8 space-y-5">
            {legal.paragraphs.map((para, i) => (
              <p key={i} className="font-body text-forest/70 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <div className="bg-gold/10 border border-gold/30 rounded-2xl px-6 py-4 mb-10">
            <p className="text-sm font-body text-forest/60 italic">{legal.note}</p>
          </div>
          <CTAButton href="/booking" label={content.ctas.primary} size="md" />
        </div>
      </Section>
    </>
  );
}
