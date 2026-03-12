import type { Metadata } from "next";
import { CTAButton } from "@/components/CTAButton";

export const metadata: Metadata = {
  title: "Design System | Paws and Petals",
  description: "Color tokens, typography scale, and component library.",
  robots: "noindex",
};

// ── Helpers ───────────────────────────────────────────────────────
function Swatch({ bg, label, hex, ring }: { bg: string; label: string; hex: string; ring?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`h-16 w-full rounded-xl ${ring ? "ring-1 ring-black/10" : ""}`}
        style={{ background: bg }}
      />
      <p className="font-body text-xs font-semibold text-forest">{label}</p>
      <p className="font-mono text-[10px] text-forest/40">{hex}</p>
    </div>
  );
}

function TokenRow({ name, value, preview }: { name: string; value: string; preview: string }) {
  return (
    <div className="flex items-center gap-4 py-2.5 border-b border-forest/5">
      <div className="h-8 w-8 rounded-md flex-shrink-0 border border-black/5" style={{ background: preview }} />
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-forest font-semibold">{name}</p>
        <p className="font-mono text-[10px] text-forest/40 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-20">
      <div className="flex items-center gap-4 mb-8">
        <h2 className="font-display text-2xl font-bold text-forest">{title}</h2>
        <div className="h-px flex-1 bg-forest/10" />
      </div>
      {children}
    </section>
  );
}

// ── Page ─────────────────────────────────────────────────────────
export default function DesignSystemPage() {
  return (
    <div className="bg-cream min-h-screen">
      {/* Page header */}
      <div className="border-b border-forest/10 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <p className="font-body text-xs uppercase tracking-[0.25em] text-terra font-semibold mb-3">
            Paws and Petals
          </p>
          <h1 className="font-display text-5xl font-bold text-forest">Design System</h1>
          <p className="mt-3 font-body text-base text-forest/50 max-w-xl">
            Color tokens, typography scale, spacing, and component library. Reference this page before writing any UI code.
          </p>
          <div className="mt-5 w-10 h-px bg-terra" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {/* ── 1. COLOR PALETTE ─────────────────────────────────── */}
        <Section title="1 · Color Palette">
          <div className="grid grid-cols-2 gap-12">

            {/* Forest */}
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-4">Forest (primary)</p>
              <div className="grid grid-cols-5 gap-3">
                <Swatch bg="#f0f5f2" label="50" hex="#f0f5f2" ring />
                <Swatch bg="#d6e8dc" label="100" hex="#d6e8dc" ring />
                <Swatch bg="#aed1bc" label="200" hex="#aed1bc" />
                <Swatch bg="#7db49a" label="300" hex="#7db49a" />
                <Swatch bg="#2d6e55" label="500" hex="#2d6e55" />
                <Swatch bg="#1a3a2a" label="DEFAULT ★" hex="#1a3a2a" />
                <Swatch bg="#1f5240" label="600" hex="#1f5240" />
                <Swatch bg="#1a3a2d" label="700" hex="#1a3a2d" />
                <Swatch bg="#111e17" label="footer" hex="#111e17" />
              </div>
            </div>

            {/* Cream + Terra + Gold */}
            <div className="space-y-6">
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-3">Cream (page bg)</p>
                <div className="grid grid-cols-4 gap-3">
                  <Swatch bg="#fdfcfa" label="50" hex="#fdfcfa" ring />
                  <Swatch bg="#faf6f0" label="100 / DEFAULT ★" hex="#faf6f0" ring />
                  <Swatch bg="#f5ece0" label="200 (tinted card)" hex="#f5ece0" ring />
                  <Swatch bg="#ecd9c5" label="300" hex="#ecd9c5" />
                </div>
              </div>
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-3">Terra (CTA / accent)</p>
                <div className="grid grid-cols-3 gap-3">
                  <Swatch bg="#e8896a" label="light" hex="#e8896a" />
                  <Swatch bg="#c4693a" label="DEFAULT ★" hex="#c4693a" />
                  <Swatch bg="#9e4f26" label="dark" hex="#9e4f26" />
                </div>
              </div>
              <div>
                <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-3">Gold (stars / badges)</p>
                <div className="grid grid-cols-3 gap-3">
                  <Swatch bg="#e8c77a" label="light" hex="#e8c77a" />
                  <Swatch bg="#d4a853" label="DEFAULT ★" hex="#d4a853" />
                  <Swatch bg="#a87d2e" label="dark" hex="#a87d2e" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 2. SEMANTIC TOKENS ───────────────────────────────── */}
        <Section title="2 · Semantic Color Tokens">
          <p className="font-body text-sm text-forest/50 mb-8 max-w-2xl leading-relaxed">
            Use these tokens — never raw hex values or non-standard opacities. All Tailwind class opacities must be multiples of 5 (5, 10, 15…100). Non-multiples like <code className="font-mono bg-forest/5 px-1 rounded">/8</code>, <code className="font-mono bg-forest/5 px-1 rounded">/42</code>, <code className="font-mono bg-forest/5 px-1 rounded">/58</code> silently produce no CSS.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* On cream */}
            <div>
              <div className="bg-cream-200 rounded-xl p-1 mb-1">
                <p className="text-center font-body text-[10px] uppercase tracking-widest text-forest/40 py-2">On cream bg</p>
              </div>
              <div className="rounded-xl bg-cream-200 p-5 border border-forest/5">
                <TokenRow name="text-forest" value="100% — headings" preview="#1a3a2a" />
                <TokenRow name="text-forest/70" value="70% — body paragraphs" preview="rgba(26,58,42,0.70)" />
                <TokenRow name="text-forest/50" value="50% — secondary copy" preview="rgba(26,58,42,0.50)" />
                <TokenRow name="text-forest/40" value="40% — meta, labels" preview="rgba(26,58,42,0.40)" />
                <TokenRow name="text-forest/25" value="25% — captions, faint" preview="rgba(26,58,42,0.25)" />
                <div className="pt-4 pb-1">
                  <p className="font-body text-[10px] text-forest/30 uppercase tracking-widest mb-1">Borders</p>
                </div>
                <TokenRow name="border-forest/5" value="hairline — card borders" preview="rgba(26,58,42,0.05)" />
                <TokenRow name="border-forest/10" value="light — panel borders" preview="rgba(26,58,42,0.10)" />
                <TokenRow name="border-forest/20" value="medium — dividers" preview="rgba(26,58,42,0.20)" />
              </div>
            </div>

            {/* On forest */}
            <div>
              <div className="bg-forest rounded-xl p-1 mb-1">
                <p className="text-center font-body text-[10px] uppercase tracking-widest text-cream/40 py-2">On forest bg</p>
              </div>
              <div className="rounded-xl bg-forest p-5">
                <TokenRow name="text-cream" value="100% — headings" preview="#faf6f0" />
                <TokenRow name="text-cream/70" value="70% — body paragraphs" preview="rgba(250,246,240,0.70)" />
                <TokenRow name="text-cream/50" value="50% — secondary copy" preview="rgba(250,246,240,0.50)" />
                <TokenRow name="text-cream/30" value="30% — meta, attribution" preview="rgba(250,246,240,0.30)" />
                <TokenRow name="text-cream/20" value="20% — subtle decorative" preview="rgba(250,246,240,0.20)" />
                <div className="pt-4 pb-1">
                  <p className="font-body text-[10px] text-cream/25 uppercase tracking-widest mb-1">Borders</p>
                </div>
                <TokenRow name="border-cream/10" value="hairline — card borders" preview="rgba(250,246,240,0.10)" />
                <TokenRow name="border-cream/15" value="light — hover state" preview="rgba(250,246,240,0.15)" />
              </div>
            </div>

            {/* On terra + footer */}
            <div className="space-y-6">
              <div>
                <div className="bg-terra rounded-xl p-1 mb-1">
                  <p className="text-center font-body text-[10px] uppercase tracking-widest text-white/40 py-2">On terra bg</p>
                </div>
                <div className="rounded-xl bg-terra p-5">
                  <TokenRow name="text-white" value="100% — headings" preview="#ffffff" />
                  <TokenRow name="text-white/70" value="70% — body paragraphs" preview="rgba(255,255,255,0.70)" />
                  <TokenRow name="text-white/50" value="50% — secondary" preview="rgba(255,255,255,0.50)" />
                  <TokenRow name="text-white/30" value="30% — captions" preview="rgba(255,255,255,0.30)" />
                </div>
              </div>
              <div>
                <div className="rounded-xl p-1 mb-1" style={{ background: "#111e17" }}>
                  <p className="text-center font-body text-[10px] uppercase tracking-widest text-white/30 py-2">On footer (#111e17)</p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "#111e17" }}>
                  <TokenRow name="text-white/45" value="links, body" preview="rgba(255,255,255,0.45)" />
                  <TokenRow name="text-white/35" value="nav links" preview="rgba(255,255,255,0.35)" />
                  <TokenRow name="text-white/20" value="copyright" preview="rgba(255,255,255,0.20)" />
                  <TokenRow name="text-white/15" value="service area" preview="rgba(255,255,255,0.15)" />
                  <TokenRow name="border-white/5" value="footer divider" preview="rgba(255,255,255,0.05)" />
                </div>
              </div>
            </div>

          </div>

          {/* Semantic CSS class reference */}
          <div className="mt-8 rounded-xl border border-forest/10 bg-white p-6">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-4">Semantic utility classes (defined in globals.css)</p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 font-mono text-xs">
              {[
                [".ds-text-body", "text-forest/70 on cream"],
                [".ds-text-secondary", "text-forest/50 on cream"],
                [".ds-text-muted", "text-forest/40 on cream"],
                [".ds-text-faint", "text-forest/25 on cream"],
                [".ds-text-dark-body", "text-cream/70 on forest"],
                [".ds-text-dark-secondary", "text-cream/50 on forest"],
                [".ds-text-dark-muted", "text-cream/30 on forest"],
                [".ds-text-dark-faint", "text-cream/20 on forest"],
                [".ds-text-accent-body", "text-white/70 on terra"],
                [".ds-text-accent-muted", "text-white/30 on terra"],
                [".ds-label", "10px uppercase tracked terra"],
                [".ds-card", "white card with hairline border"],
              ].map(([cls, desc]) => (
                <div key={cls} className="flex gap-3 py-1.5 border-b border-forest/5">
                  <span className="text-terra font-semibold w-48 flex-shrink-0">{cls}</span>
                  <span className="text-forest/40">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 3. TYPOGRAPHY SCALE ──────────────────────────────── */}
        <Section title="3 · Typography Scale">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Display — Playfair Display */}
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-6">
                Playfair Display — headings, display
              </p>
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">clamp(3.25rem,7.5vw,6.75rem) bold</span>
                  <p className="font-display font-bold text-forest leading-[0.9]" style={{ fontSize: "clamp(2.5rem,5vw,4rem)" }}>
                    Hero Display
                  </p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-5xl (3rem) bold</span>
                  <p className="font-display text-5xl font-bold text-forest leading-[1.0]">Section H1</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-4xl (2.25rem) bold</span>
                  <p className="font-display text-4xl font-bold text-forest leading-[1.05]">Section H2</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-3xl (1.875rem) bold</span>
                  <p className="font-display text-3xl font-bold text-forest leading-snug">Card heading H3</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-2xl (1.5rem) semibold</span>
                  <p className="font-display text-2xl font-semibold text-forest">Sub-heading H4</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-xl (1.25rem) medium italic</span>
                  <p className="font-display text-xl font-medium italic text-forest">Editorial italic</p>
                </div>
              </div>
            </div>

            {/* Body — DM Sans */}
            <div>
              <p className="font-body text-xs font-bold uppercase tracking-widest text-forest/40 mb-6">
                DM Sans — body, UI, labels
              </p>
              <div className="space-y-5">
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-lg (1.125rem) regular</span>
                  <p className="font-body text-lg text-forest/70 leading-relaxed">Large body — intro paragraphs and lead copy.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-base (1rem) regular</span>
                  <p className="font-body text-base text-forest/70 leading-relaxed">Body — standard paragraph text for descriptions and content.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-sm (0.875rem) regular</span>
                  <p className="font-body text-sm text-forest/70 leading-relaxed">Small body — card descriptions, secondary paragraphs.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-xs (0.75rem) regular</span>
                  <p className="font-body text-xs text-forest/50 leading-relaxed">Caption — meta information, timestamps, and notes.</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-[10px] uppercase tracking-[0.25em] semibold</span>
                  <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra">Section eyebrow label</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">text-sm medium tracking-wide</span>
                  <p className="font-body text-sm font-medium tracking-wide text-forest">Button / nav text</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-forest/30 block mb-1">font-mono text-xs — code references</span>
                  <p className="font-mono text-xs text-terra">text-forest/50, bg-terra/10</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 4. TEXT HIERARCHY ON SURFACES ────────────────────── */}
        <Section title="4 · Text Hierarchy on Each Surface">
          <p className="font-body text-sm text-forest/50 mb-8">
            The full type hierarchy — eyebrow → H2 → body → secondary → muted → link — on every surface.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* On cream */}
            <div className="rounded-2xl bg-cream border border-forest/10 p-6 space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-forest/25 block">cream bg</span>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra">Section label</p>
              <h3 className="font-display text-xl font-bold text-forest">Card Heading</h3>
              <p className="font-body text-sm text-forest/70 leading-relaxed">Body paragraph text with comfortable line height.</p>
              <p className="font-body text-sm text-forest/50">Secondary copy, supporting detail.</p>
              <p className="font-body text-xs text-forest/40">Muted meta — date, location, tag.</p>
              <p className="font-body text-xs text-forest/25">Faint caption text.</p>
              <a className="font-body text-sm text-terra underline underline-offset-2">Inline link</a>
            </div>

            {/* On white */}
            <div className="rounded-2xl bg-white border border-forest/5 shadow-card p-6 space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-forest/25 block">white card</span>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra">Section label</p>
              <h3 className="font-display text-xl font-bold text-forest">Card Heading</h3>
              <p className="font-body text-sm text-forest/70 leading-relaxed">Body paragraph text with comfortable line height.</p>
              <p className="font-body text-sm text-forest/50">Secondary copy, supporting detail.</p>
              <p className="font-body text-xs text-forest/40">Muted meta — date, location, tag.</p>
              <p className="font-body text-xs text-forest/25">Faint caption text.</p>
              <a className="font-body text-sm text-terra underline underline-offset-2">Inline link</a>
            </div>

            {/* On forest */}
            <div className="rounded-2xl bg-forest p-6 space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-cream/20 block">forest bg</span>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra">Section label</p>
              <h3 className="font-display text-xl font-bold text-cream">Card Heading</h3>
              <p className="font-body text-sm text-cream/70 leading-relaxed">Body paragraph text with comfortable line height.</p>
              <p className="font-body text-sm text-cream/50">Secondary copy, supporting detail.</p>
              <p className="font-body text-xs text-cream/30">Muted meta — date, location, tag.</p>
              <p className="font-body text-xs text-cream/20">Faint caption text.</p>
              <a className="font-body text-sm text-terra underline underline-offset-2">Inline link</a>
            </div>

            {/* On terra */}
            <div className="rounded-2xl bg-terra p-6 space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/25 block">terra bg</span>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-white/50">Section label</p>
              <h3 className="font-display text-xl font-bold text-white">Card Heading</h3>
              <p className="font-body text-sm text-white/70 leading-relaxed">Body paragraph text with comfortable line height.</p>
              <p className="font-body text-sm text-white/50">Secondary copy, supporting detail.</p>
              <p className="font-body text-xs text-white/30">Muted meta — date, location, tag.</p>
              <p className="font-body text-xs text-white/20">Faint caption text.</p>
              <a className="font-body text-sm text-white underline underline-offset-2 opacity-80">Inline link</a>
            </div>

          </div>
        </Section>

        {/* ── 5. BUTTONS ───────────────────────────────────────── */}
        <Section title="5 · Buttons">
          <div className="space-y-6">
            {/* Sizes */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-4">Sizes — primary variant</p>
              <div className="flex flex-wrap items-end gap-4">
                <CTAButton href="#" label="Small (sm)" size="sm" />
                <CTAButton href="#" label="Medium (md)" size="md" />
                <CTAButton href="#" label="Large (lg)" size="lg" />
              </div>
            </div>

            {/* Variants */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-4">Variants — md size</p>
              <div className="flex flex-wrap items-center gap-4">
                <CTAButton href="#" label="Primary" variant="primary" />
                <CTAButton href="#" label="Secondary" variant="secondary" />
                <CTAButton href="#" label="Outline" variant="outline" />
              </div>
            </div>

            {/* On dark */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-4">On dark surfaces</p>
              <div className="bg-forest rounded-2xl p-6 flex flex-wrap gap-4">
                <CTAButton href="#" label="Primary" variant="primary" />
                <a href="#" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-cream/20 text-cream/70 font-body text-sm hover:border-cream/40 hover:text-cream transition-all">
                  Ghost on dark
                </a>
              </div>
            </div>

            {/* On terra */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-forest/40 mb-4">On terra (CTA section)</p>
              <div className="bg-terra rounded-2xl p-6 flex flex-wrap gap-4">
                <a href="#" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white text-terra font-body font-semibold text-sm hover:bg-cream transition-colors">
                  White on terra
                </a>
                <a href="#" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-white/20 text-white/60 font-body text-sm hover:border-white/40 hover:text-white transition-all">
                  Outline on terra
                </a>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 6. CARDS ─────────────────────────────────────────── */}
        <Section title="6 · Card Variants">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* White card */}
            <div className="ds-card">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra mb-3">White card (.ds-card)</p>
              <h3 className="font-display text-lg font-bold text-forest mb-2">Card title here</h3>
              <p className="font-body text-sm text-forest/50 leading-relaxed">Supporting description text. Use for services, features, and content listings.</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-body text-terra">Learn more →</div>
            </div>

            {/* Tinted card */}
            <div className="ds-card-tinted">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra mb-3">Tinted (.ds-card-tinted)</p>
              <h3 className="font-display text-lg font-bold text-forest mb-2">Card title here</h3>
              <p className="font-body text-sm text-forest/50 leading-relaxed">Use for "good fit" / "included" lists and secondary info panels.</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-body text-terra">Learn more →</div>
            </div>

            {/* Dark card */}
            <div className="ds-card-dark relative">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra mb-3">Dark (.ds-card-dark)</p>
              <h3 className="font-display text-lg font-bold text-cream mb-2">Card title here</h3>
              <p className="font-body text-sm text-cream/50 leading-relaxed">Use for pricing panels, feature highlights on dark sections.</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-body text-terra">Learn more →</div>
            </div>

            {/* Hover card */}
            <div className="bg-white rounded-2xl border border-forest/5 p-6 hover:border-forest/20 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra mb-3">Interactive (hover)</p>
              <h3 className="font-display text-lg font-bold text-forest mb-2">Hover over me</h3>
              <p className="font-body text-sm text-forest/50 leading-relaxed">Add <code className="font-mono text-[10px] bg-forest/5 px-1 rounded">hover:border-forest/20 hover:shadow-card-hover hover:-translate-y-1 transition-all</code></p>
            </div>

            {/* Dark hover card */}
            <div className="bg-forest rounded-2xl border border-cream/10 p-6 hover:border-cream/15 hover:bg-cream/[0.02] transition-all duration-300 cursor-pointer">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra mb-3">Dark interactive (hover)</p>
              <h3 className="font-display text-lg font-bold text-cream mb-2">Hover over me</h3>
              <p className="font-body text-sm text-cream/50 leading-relaxed">Add <code className="font-mono text-[10px] text-cream/30 px-1">hover:border-cream/15 hover:bg-cream/[0.02]</code></p>
            </div>

            {/* Badge / pill */}
            <div className="ds-card flex flex-col gap-4">
              <p className="font-body text-[10px] uppercase tracking-[0.25em] font-semibold text-terra">Badges / Pills</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-terra/10 text-terra font-body text-[10px] font-semibold uppercase tracking-widest">Most popular</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/20 text-gold-dark font-body text-[10px] font-semibold uppercase tracking-widest">New</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-forest/5 text-forest/50 font-body text-[10px] font-semibold uppercase tracking-widest">Included</span>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 7. SHADOWS ───────────────────────────────────────── */}
        <Section title="7 · Shadows">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { name: "shadow-card", label: "Resting card" },
              { name: "shadow-card-hover", label: "Hover / lifted" },
              { name: "shadow-glow", label: "Terra glow" },
              { name: "shadow-glow-terra", label: "Terra glow (strong)" },
            ].map((s) => (
              <div key={s.name} className="flex flex-col gap-3">
                <div className={`h-20 bg-white rounded-2xl ${s.name}`} />
                <p className="font-mono text-[10px] text-terra">{s.name}</p>
                <p className="font-body text-xs text-forest/40">{s.label}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 8. QUICK REFERENCE ───────────────────────────────── */}
        <Section title="8 · Quick Reference">
          <div className="bg-forest rounded-2xl p-8 font-mono text-sm">
            <p className="text-terra font-bold mb-4 tracking-wider">/* On cream (light) surfaces */</p>
            <div className="space-y-1 text-cream/60 mb-6 pl-4 text-xs leading-6">
              <p><span className="text-cream/40">heading    →</span> <span className="text-gold">text-forest</span></p>
              <p><span className="text-cream/40">body       →</span> <span className="text-gold">text-forest/70</span></p>
              <p><span className="text-cream/40">secondary  →</span> <span className="text-gold">text-forest/50</span></p>
              <p><span className="text-cream/40">muted      →</span> <span className="text-gold">text-forest/40</span></p>
              <p><span className="text-cream/40">faint      →</span> <span className="text-gold">text-forest/25</span></p>
              <p><span className="text-cream/40">card border→</span> <span className="text-gold">border-forest/5</span></p>
              <p><span className="text-cream/40">divider    →</span> <span className="text-gold">border-forest/10</span></p>
            </div>
            <p className="text-terra font-bold mb-4 tracking-wider">/* On forest (dark) surfaces */</p>
            <div className="space-y-1 text-cream/60 mb-6 pl-4 text-xs leading-6">
              <p><span className="text-cream/40">heading    →</span> <span className="text-gold">text-cream</span></p>
              <p><span className="text-cream/40">body       →</span> <span className="text-gold">text-cream/70</span></p>
              <p><span className="text-cream/40">secondary  →</span> <span className="text-gold">text-cream/50</span></p>
              <p><span className="text-cream/40">muted      →</span> <span className="text-gold">text-cream/30</span></p>
              <p><span className="text-cream/40">faint      →</span> <span className="text-gold">text-cream/20</span></p>
              <p><span className="text-cream/40">card border→</span> <span className="text-gold">border-cream/10</span></p>
            </div>
            <p className="text-terra font-bold mb-4 tracking-wider">/* On terra (accent) surfaces */</p>
            <div className="space-y-1 text-cream/60 mb-6 pl-4 text-xs leading-6">
              <p><span className="text-cream/40">heading    →</span> <span className="text-gold">text-white</span></p>
              <p><span className="text-cream/40">body       →</span> <span className="text-gold">text-white/70</span></p>
              <p><span className="text-cream/40">secondary  →</span> <span className="text-gold">text-white/50</span></p>
              <p><span className="text-cream/40">muted      →</span> <span className="text-gold">text-white/30</span></p>
            </div>
            <p className="text-terra font-bold mb-4 tracking-wider">/* NEVER use these — silently fail */</p>
            <p className="text-red-400/70 pl-4 text-xs">/6  /7  /8  /42  /48  /52  /55  /58  /62  /65  /72  /78  /88  /92</p>
          </div>
        </Section>

      </div>
    </div>
  );
}
