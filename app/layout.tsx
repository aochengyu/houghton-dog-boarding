import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { localBusinessSchema } from "@/lib/schema";
import { content } from "@/content";

export const metadata: Metadata = {
  title: {
    default: content.business.name,
    template: `%s | ${content.business.name}`,
  },
  description:
    "Home-based dog boarding in Houghton/Kirkland, WA. $70/night. Small capacity, fenced yard, daily photos. No kennels — just a real home.",
  openGraph: {
    type: "website",
    siteName: content.business.name,
    locale: "en_US",
    url: content.business.siteUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
