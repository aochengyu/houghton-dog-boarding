import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { localBusinessSchema } from "@/lib/schema";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
