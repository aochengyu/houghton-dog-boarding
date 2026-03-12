"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

export function FAQAccordion({ items }: { items: readonly FAQItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {items.map((item, i) => (
        <Accordion.Item
          key={i}
          value={String(i)}
          className={cn(
            "bg-white rounded-2xl border border-forest/5 shadow-sm overflow-hidden transition-all duration-200",
            "data-[state=open]:border-terra/20 data-[state=open]:shadow-card-hover"
          )}
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                "flex w-full items-center justify-between px-6 py-5 text-left",
                "font-body font-semibold text-forest hover:text-terra transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-forest",
                "[&[data-state=open]>svg]:rotate-180",
                "data-[state=open]:text-terra"
              )}
            >
              <span className="pr-4">{item.q}</span>
              <ChevronDown
                size={18}
                className="flex-shrink-0 text-forest/40 transition-transform duration-200"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
            <div className="border-l-4 border-terra mx-6 mb-5 pl-4">
              <p className="font-body text-forest/60 leading-relaxed py-1">{item.a}</p>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
