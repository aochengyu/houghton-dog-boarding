import type { Metadata } from "next";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { PageHeader } from "@/components/PageHeader";
import { CTAButton } from "@/components/CTAButton";
import { FAQAccordion } from "@/components/FAQAccordion";
import { faqPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: content.faq.pageTitle,
  description: content.faq.metaDescription,
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema()) }}
      />
      <PageHeader h1={content.faq.h1} />
      <Section>
        <div className="max-w-3xl mx-auto">
          <FAQAccordion items={content.faq.items} />
          <div className="mt-14 text-center">
            <p className="font-body text-forest/50 mb-6">
              Still have questions?{" "}
              <a href={`mailto:${content.business.email}`} className="text-terra underline underline-offset-2">
                {content.business.email}
              </a>
            </p>
            <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
          </div>
        </div>
      </Section>
    </>
  );
}
