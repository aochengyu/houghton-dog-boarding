import { content } from "@/content";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: content.business.name,
    url: content.business.siteUrl,
    telephone: content.business.phone,
    email: content.business.email,
    description: content.home.heroSubheadline,
    areaServed: content.business.serviceArea.map((area) => ({
      "@type": "City",
      name: area,
    })),
    priceRange: "$70/night",
    openingHours: "Mo-Su 07:00-20:00",
  };
}

export function faqPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
