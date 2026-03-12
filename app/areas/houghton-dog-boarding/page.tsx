import type { Metadata } from "next";
import { content } from "@/content";
import { AreaPage } from "@/components/AreaPage";

const area = content.areas.houghton;

export const metadata: Metadata = {
  title: area.pageTitle,
  description: area.metaDescription,
};

export default function HoughtonPage() {
  return (
    <AreaPage
      locationLabel="Houghton, WA"
      h1={area.h1}
      body={area.body}
    />
  );
}
