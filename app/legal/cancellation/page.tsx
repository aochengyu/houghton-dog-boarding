import type { Metadata } from "next";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { PageHeader } from "@/components/PageHeader";
import { CTAButton } from "@/components/CTAButton";

const legal = content.legal.cancellation;

export const metadata: Metadata = {
  title: legal.pageTitle,
};

export default function CancellationPage() {
  return (
    <>
      <PageHeader h1={legal.h1} />
      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-forest/5 shadow-sm mb-8">
            <ul className="space-y-4">
              {legal.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3 font-body text-forest/70 leading-relaxed">
                  <span className="text-gold mt-1 flex-shrink-0">›</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <p className="font-body text-forest/50 text-sm leading-relaxed italic mb-10">{legal.note}</p>
          <CTAButton href="/booking" label={content.ctas.primary} size="md" />
        </div>
      </Section>
    </>
  );
}
