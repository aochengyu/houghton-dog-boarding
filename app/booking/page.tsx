import type { Metadata } from "next";
import { content } from "@/content";
import { Section } from "@/components/Section";
import { BookingClient } from "./BookingClient";

const bk = content.booking;

export const metadata: Metadata = {
  title: bk.pageTitle,
  description: bk.metaDescription,
};

export default function BookingPage() {
  return (
    <>
      <section className="bg-forest text-cream py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-cream leading-tight">
            {bk.h1}
          </h1>
          <p className="mt-4 text-cream/60 font-body text-lg max-w-xl">{bk.intro[0]}</p>
        </div>
      </section>

      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Steps */}
          <div className="mb-14">
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-forest mb-8">
              {bk.stepsTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bk.steps.map((step) => (
                <div key={step.num} className="bg-white rounded-3xl p-6 border border-forest/5 shadow-sm">
                  <div className="w-10 h-10 bg-forest rounded-full flex items-center justify-center text-cream font-display font-bold text-sm mb-4">
                    {step.num}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-forest mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-forest/60 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-cream-200 rounded-3xl p-8 mb-10 border border-forest/10">
            <h2 className="font-display text-xl font-semibold text-forest mb-4">Quick Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-body">
              <div>
                <p className="text-forest/40 uppercase tracking-widest text-xs font-semibold mb-1">Rate</p>
                <p className="text-forest font-semibold text-base">${content.pricing.boardingPerNight}/night</p>
              </div>
              <div>
                <p className="text-forest/40 uppercase tracking-widest text-xs font-semibold mb-1">Capacity</p>
                <p className="text-forest font-semibold text-base">1–2 dogs max</p>
              </div>
              <div>
                <p className="text-forest/40 uppercase tracking-widest text-xs font-semibold mb-1">Address</p>
                <p className="text-forest font-semibold text-base">Shared after confirmation</p>
              </div>
            </div>
          </div>

          {/* Waiver gate (client component) */}
          <BookingClient />
        </div>
      </Section>
    </>
  );
}
