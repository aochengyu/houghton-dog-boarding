import Link from "next/link";
import { content } from "@/content";
import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-forest text-cream/80 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <p className="font-display text-xl text-cream font-semibold mb-2">
              {content.business.name}
            </p>
            <p className="text-sm text-cream/60 mb-4">{content.business.tagline}</p>
            <p className="text-xs text-cream/50">Serving {content.business.serviceArea.join(", ")}</p>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/40 mb-3">Contact</p>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${content.business.phone}`}
                className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors"
              >
                <Phone size={13} /> {content.business.phone}
              </a>
              <a
                href={`mailto:${content.business.email}`}
                className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors"
              >
                <Mail size={13} /> {content.business.email}
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-cream/40 mb-3">Links</p>
            <div className="flex flex-col gap-2">
              {[
                { href: "/booking", label: "Book a Stay" },
                { href: "/faq", label: "FAQ" },
                { href: "/legal/cancellation", label: "Cancellation Policy" },
                { href: "/legal/liability-waiver", label: "Liability Waiver" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-cream/70 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream/10 text-center text-xs text-cream/30">
          © {new Date().getFullYear()} {content.business.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
