import type { Category } from "@/types/design";
import FilterBar from "@/components/filters/FilterBar";
import Input from "@/components/ui/Input";

interface HeroProps {
  categories: Category[];
  activeCategory?: string;
}

export default function Hero({ categories, activeCategory }: HeroProps) {
  return (
    <section className="bg-warm-beige text-center px-4 pt-24 md:pt-36 pb-36 md:pb-48">
      <h1 className="font-display text-[3.5rem] md:text-[6rem] leading-[0.85] tracking-[-0.03em] font-bold text-dark-charcoal">
        design, extracted.
      </h1>

      <p className="font-af text-xl text-medium-gray mt-6 max-w-2xl mx-auto">
        Browse design systems from the world&apos;s best products. Copy colors, typography, spacing, and shadows directly into your project.
      </p>

      <div className="flex justify-center mt-10 mb-10">
        <Input icon placeholder="Paste a URL to extract its design..." />
      </div>

      <FilterBar categories={categories} activeCategory={activeCategory} />
    </section>
  );
}
