import Link from "next/link";
import { content } from "@/content";
import { Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#111e17]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 pb-10 border-b border-white/5">
          <div>
            <p className="font-display text-xl text-cream font-semibold leading-tight">
              {content.business.name}
            </p>
            <p className="text-sm text-white/30 font-body mt-1">{content.business.tagline}</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${content.business.phone}`}
                className="flex items-center gap-2 text-sm text-white/45 hover:text-white/80 transition-colors font-body"
              >
                <Phone size={13} />
                {content.business.phone}
              </a>
              <a
                href={`mailto:${content.business.email}`}
                className="flex items-center gap-2 text-sm text-white/45 hover:text-white/80 transition-colors font-body"
              >
                <Mail size={13} />
                {content.business.email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-14 gap-y-2">
            {[
              { href: "/booking", label: "Book a Stay" },
              { href: "/faq", label: "FAQ" },
              { href: "/services", label: "Services" },
              { href: "/contact", label: "Contact" },
              { href: "/legal/cancellation", label: "Cancellation Policy" },
              { href: "/legal/liability-waiver", label: "Liability Waiver" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/35 hover:text-white/70 transition-colors font-body py-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-white/20 font-body">
            © {new Date().getFullYear()} {content.business.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/15 font-body">
            Serving {content.business.serviceArea.join(" · ")}
          </p>
        </div>

      </div>
    </footer>
  );
}
