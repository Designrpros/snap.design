import { categories, getDesignsByCategory, getSortedDesigns, sortOptions } from "@/data/designs";
import Hero from "@/components/hero/Hero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import SortBar from "@/components/filters/SortBar";

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const filtered = getDesignsByCategory(category);
  const designs = getSortedDesigns(filtered, sort);

  return (
    <>
      <Hero categories={categories} activeCategory={category} />
      <section className="pt-16 md:pt-24 pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 flex items-center justify-between">
          <SortBar options={sortOptions} activeSort={sort} />
          <p className="font-af text-caption text-medium-gray">
            {designs.length} design{designs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <GalleryGrid designs={designs} />
      </section>
    </>
  );
}
