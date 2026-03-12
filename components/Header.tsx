"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { content } from "@/content";
import { CTAButton } from "./CTAButton";
import { DogIcon } from "./DogIcon";
import { Menu, X, Phone, Mail } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-forest/10 transition-all duration-300 ${
        scrolled ? "shadow-md h-auto" : "shadow-sm"
      }`}
    >
      {/* Thin colored top border */}
      <div className="h-0.5 bg-terra w-full" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"}`}>
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded group"
          >
            <DogIcon variant="mark" size={32} className="flex-shrink-0 group-hover:opacity-80 transition-opacity" />
            <div className="flex flex-col leading-tight">
              <span className="font-display text-lg lg:text-xl font-semibold text-forest transition-colors duration-200 group-hover:text-terra">
                {content.business.name}
              </span>
              <span className="text-xs text-forest/60 font-body hidden sm:block">
                {content.business.locationShort}
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {[
              { href: "/services/dog-boarding", label: "Services" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-body text-forest/70 hover:text-forest transition-colors group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-terra rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Desktop contact + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href={`tel:${content.business.phone}`}
              className="flex items-center gap-1.5 text-sm font-body text-forest/70 hover:text-terra transition-colors"
            >
              <Phone size={14} />
              <span>{content.business.phone}</span>
            </a>
            <a
              href={`mailto:${content.business.email}`}
              className="flex items-center gap-1.5 text-sm font-body text-forest/70 hover:text-terra transition-colors"
            >
              <Mail size={14} />
              <span className="truncate max-w-[180px]">{content.business.email}</span>
            </a>
            <CTAButton href="/booking" label={content.ctas.primary} size="sm" />
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <CTAButton href="/booking" label="Book" size="sm" />
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg text-forest hover:bg-forest-100 transition-colors"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu — smooth slide down via max-height */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="pb-4 border-t border-forest/10 mt-1 pt-4 flex flex-col gap-3">
            <Link href="/services/dog-boarding" className="text-sm font-body text-forest py-1 hover:text-terra transition-colors" onClick={() => setOpen(false)}>Services</Link>
            <Link href="/faq" className="text-sm font-body text-forest py-1 hover:text-terra transition-colors" onClick={() => setOpen(false)}>FAQ</Link>
            <Link href="/contact" className="text-sm font-body text-forest py-1 hover:text-terra transition-colors" onClick={() => setOpen(false)}>Contact</Link>
            <a href={`tel:${content.business.phone}`} className="flex items-center gap-2 text-sm font-body text-terra py-1">
              <Phone size={14} /> {content.business.phone}
            </a>
            <a href={`mailto:${content.business.email}`} className="flex items-center gap-2 text-sm font-body text-terra py-1">
              <Mail size={14} /> {content.business.email}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
