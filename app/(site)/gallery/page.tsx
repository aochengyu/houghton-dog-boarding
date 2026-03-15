import type { Metadata } from "next";
import { content } from "@/content";
import { PageHeader } from "@/components/PageHeader";
import { GalleryClient } from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Paws and Petals — happy boarding guests, day care play, morning walks, and more. Based in Houghton/Kirkland, WA.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        h1="Our Gallery"
        subtitle="A peek into daily life at Paws and Petals — happy guests, backyard adventures, and cozy evenings."
      />

      <section className="py-16 lg:py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryClient />
        </div>
      </section>
    </>
  );
}
