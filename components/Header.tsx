"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { content } from "@/content";
import { CTAButton } from "./CTAButton";
import { CalButton } from "./CalButton";
import { Menu, X, MessageSquare, Mail, User, CalendarClock } from "lucide-react";

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
    <header className="sticky top-0 z-50">
      {/* Utility bar — contact info, hidden on scroll + mobile */}
      <div
        className={`hidden lg:block bg-teal-dark transition-all duration-300 overflow-hidden ${
          scrolled ? "max-h-0" : "max-h-10"
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 h-9 flex items-center justify-end gap-6">
          <a
            href={`sms:${content.business.phone}`}
            className="flex items-center gap-1.5 font-body text-xs text-cream/55 hover:text-cream transition-colors"
          >
            <MessageSquare size={12} />
            {content.business.phone}
          </a>
          <a
            href={`mailto:${content.business.email}`}
            className="flex items-center gap-1.5 font-body text-xs text-cream/55 hover:text-cream transition-colors"
          >
            <Mail size={12} />
            {content.business.email}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`bg-cream/96 backdrop-blur-sm border-b border-forest/[0.08] transition-shadow duration-300 ${
          scrolled ? "shadow-md" : "shadow-sm"
        }`}
      >
        {/* Thin accent line */}
        <div className="h-px bg-gradient-to-r from-teal/30 via-rose/40 to-teal/30" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "h-14" : "h-16 lg:h-[72px]"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex flex-col leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded group flex-shrink-0"
            >
              <span className="font-display text-lg font-semibold text-forest group-hover:text-teal transition-colors duration-200">
                {content.business.name}
              </span>
              <span className="text-[11px] text-forest/45 font-body hidden sm:block tracking-wide">
                {content.business.locationShort}
              </span>
            </Link>

            {/* Desktop nav — absolute centered so it never crowds the sides */}
            <nav className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              {[
                { href: "/services", label: "Services" },
                { href: "/gallery", label: "Gallery" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative font-body text-sm text-forest/65 hover:text-forest transition-colors duration-200 group py-1"
                >
                  {link.label}
                  <span className="absolute -bottom-px left-0 w-full h-px bg-rose rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </Link>
              ))}
            </nav>

            {/* Right: Account + Cal.com + CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/account/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-body text-sm text-forest/55 hover:text-teal transition-colors duration-200 group"
              >
                <User size={15} className="flex-shrink-0" />
                <span className="relative">
                  My Account
                  <span className="absolute -bottom-px left-0 w-full h-px bg-teal rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
              </Link>
              <div className="w-px h-4 bg-forest/15" />
              <CalButton
                label="Meet & Greet"
                className="flex items-center gap-1.5 font-body text-sm text-forest/55 hover:text-teal transition-colors duration-200 group"
              />
              <CTAButton href="/booking" label={content.ctas.primary} size="sm" />
            </div>

            {/* Mobile: CTA + hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <CTAButton href="/booking" label="Book" size="sm" />
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className="p-2 rounded-lg text-forest/70 hover:text-forest hover:bg-forest/5 transition-colors"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-5 border-t border-forest/[0.07] pt-4 flex flex-col gap-1">
            {[
              { href: "/services", label: "Services" },
              { href: "/gallery", label: "Gallery" },
              { href: "/faq", label: "FAQ" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm text-forest/70 hover:text-forest py-2.5 px-3 rounded-lg hover:bg-forest/5 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-forest/[0.07] my-1" />
            <Link
              href="/account/login"
              className="flex items-center gap-2 font-body text-sm text-forest/70 hover:text-forest py-2.5 px-3 rounded-lg hover:bg-forest/5 transition-colors"
              onClick={() => setOpen(false)}
            >
              <User size={14} /> My Account
            </Link>
            <CalButton
              label="Schedule a Meet & Greet"
              className="flex items-center gap-2 font-body text-sm text-forest/70 hover:text-forest py-2.5 px-3 rounded-lg hover:bg-forest/5 transition-colors w-full text-left"
            />
            <div className="h-px bg-forest/[0.07] my-1" />
            <a
              href={`sms:${content.business.phone}`}
              className="flex items-center gap-2 font-body text-xs text-forest/45 py-2 px-3"
            >
              <MessageSquare size={13} /> {content.business.phone}
            </a>
            <a
              href={`mailto:${content.business.email}`}
              className="flex items-center gap-2 font-body text-xs text-forest/45 py-2 px-3"
            >
              <Mail size={13} /> {content.business.email}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
