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
      <section className="pt-12 md:pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10 flex items-center justify-between">
          <SortBar options={sortOptions} activeSort={sort} />
          <p className="font-af text-[13px] text-gravel">
            {designs.length} curated style{designs.length !== 1 ? "s" : ""}
          </p>
        </div>
        <GalleryGrid designs={designs} />
      </section>
    </>
  );
}
