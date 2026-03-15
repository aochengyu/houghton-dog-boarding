import type { Metadata } from "next";
import "./globals.css";
import { content } from "@/content";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: content.business.name,
    template: `%s | ${content.business.name}`,
  },
  description:
    "Home-based pet boarding in Houghton/Kirkland, WA. $70/night. Cage-free, real home environment, fenced yard, daily photos.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
