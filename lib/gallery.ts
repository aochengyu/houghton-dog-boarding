// ============================================================
// GALLERY CONFIGURATION
//
// To add real photos:
//   1. Drop your image files into /public/gallery/
//      (supports .jpg, .jpeg, .png, .webp)
//   2. Add an entry to the `photos` array below
//   3. Remove the placeholder entries when ready
//
// Aspect ratios:
//   "landscape" → 3:2  (e.g. 1200×800)
//   "portrait"  → 2:3  (e.g. 800×1200)
//   "square"    → 1:1  (e.g. 800×800)
// ============================================================

export type GalleryCategory = "all" | "boarding" | "day-care" | "walking" | "cats";

export type GalleryPhoto = {
  src: string;
  alt: string;
  category: Exclude<GalleryCategory, "all">;
  caption?: string;
  aspect: "landscape" | "portrait" | "square";
};

export const photos: GalleryPhoto[] = [
  {
    src: "/gallery/placeholder-01.svg",
    alt: "Dog enjoying the backyard",
    category: "boarding",
    caption: "Afternoon playtime in the fenced yard",
    aspect: "landscape",
  },
  {
    src: "/gallery/placeholder-02.svg",
    alt: "Cat resting in a quiet space",
    category: "cats",
    caption: "A calm, private space for our feline guests",
    aspect: "portrait",
  },
  {
    src: "/gallery/placeholder-03.svg",
    alt: "Dogs on a morning walk",
    category: "walking",
    caption: "Morning stroll through Houghton",
    aspect: "square",
  },
  {
    src: "/gallery/placeholder-04.svg",
    alt: "Dog settled in for the evening",
    category: "boarding",
    caption: "All settled in for a cozy night",
    aspect: "landscape",
  },
  {
    src: "/gallery/placeholder-05.svg",
    alt: "Day care guest playing",
    category: "day-care",
    caption: "Full-day fun at day care",
    aspect: "portrait",
  },
  {
    src: "/gallery/placeholder-06.svg",
    alt: "Happy dog in the yard",
    category: "boarding",
    caption: "A very happy boarding guest",
    aspect: "landscape",
  },
  {
    src: "/gallery/placeholder-07.svg",
    alt: "Dog on leash walk",
    category: "walking",
    caption: "Leashed walk in the neighborhood",
    aspect: "landscape",
  },
  {
    src: "/gallery/placeholder-08.svg",
    alt: "Cat day care guest",
    category: "cats",
    caption: "Our cat guests get their own quiet zone",
    aspect: "portrait",
  },
];

export const categoryLabels: Record<GalleryCategory, string> = {
  all: "All",
  boarding: "Boarding",
  "day-care": "Day Care",
  walking: "Walking",
  cats: "Cats",
};
