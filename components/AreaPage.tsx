import { content } from "@/content";
import { Section } from "@/components/Section";
import { CTAButton } from "@/components/CTAButton";

interface AreaPageProps {
  locationLabel: string;
  h1: string;
  body: readonly string[];
}

export function AreaPage({ locationLabel, h1, body }: AreaPageProps) {
  return (
    <>
      <section className="bg-forest text-cream py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-gold/20 text-gold text-xs font-semibold font-body tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            {locationLabel}
          </span>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-cream leading-tight text-balance">
            {h1}
          </h1>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {body.map((para, i) => (
              <p key={i} className="font-body text-forest/70 leading-relaxed text-lg">
                {para}
              </p>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
            <CTAButton href="/faq" label="Read FAQ" size="lg" variant="outline" />
          </div>
        </div>
      </Section>
    </>
  );
}
