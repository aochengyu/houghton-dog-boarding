import type { Metadata } from "next";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { PageHeader } from "@/components/PageHeader";
import { CTAButton } from "@/components/CTAButton";
import { Phone, Mail, MessageSquare } from "lucide-react";

const c = content.contact;
const biz = content.business;

export const metadata: Metadata = {
  title: c.pageTitle,
  description: c.metaDescription,
};

const mailtoHref = `mailto:${biz.email}?subject=${encodeURIComponent("Dog Boarding Inquiry")}&body=${encodeURIComponent("Hi! I'm interested in dog boarding. My dog's name is ___ and I'm looking for dates ___.")}`;

export default function ContactPage() {
  return (
    <>
      <PageHeader h1={c.h1} subtitle={c.intro} />
      <Section>
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-forest/5 shadow-sm space-y-6">
            {/* Phone */}
            <a
              href={`tel:${biz.phone}`}
              className="flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-cream-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-terra group-hover:text-white transition-colors">
                <Phone size={20} className="text-terra group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold font-body uppercase tracking-widest text-forest/40 mb-0.5">Phone / Text</p>
                <p className="font-body text-forest font-medium">{biz.phone}</p>
              </div>
            </a>

            <div className="border-t border-forest/5" />

            {/* Email */}
            <a href={mailtoHref} className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-cream-200 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-terra transition-colors">
                <Mail size={20} className="text-terra group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold font-body uppercase tracking-widest text-forest/40 mb-0.5">Email</p>
                <p className="font-body text-forest font-medium">{biz.email}</p>
              </div>
            </a>

            <div className="border-t border-forest/5" />

            {/* Note */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-cream-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MessageSquare size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-xs font-semibold font-body uppercase tracking-widest text-forest/40 mb-0.5">Prefer texting?</p>
                <p className="font-body text-forest/60 text-sm leading-relaxed">{c.preferTextNote}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="font-body text-forest/40 text-sm mb-4">Ready to get started?</p>
            <CTAButton href="/booking" label={content.ctas.primary} size="lg" />
          </div>
        </div>
      </Section>
    </>
  );
}
