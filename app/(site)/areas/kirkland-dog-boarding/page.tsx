import type { Metadata } from "next";
import { content } from "@/content";
import { AreaPage } from "@/components/AreaPage";

const area = content.areas.kirkland;

export const metadata: Metadata = {
  title: area.pageTitle,
  description: area.metaDescription,
};

export default function KirklandPage() {
  return (
    <AreaPage
      locationLabel="Kirkland, WA"
      h1={area.h1}
      body={area.body}
    />
  );
}
