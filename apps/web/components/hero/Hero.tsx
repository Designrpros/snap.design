import type { Category } from "@snap/shared";
import FilterBar from "@/components/filters/FilterBar";

interface HeroProps {
  categories: Category[];
  activeCategory?: string;
}

export default function Hero({ categories, activeCategory }: HeroProps) {
  return (
    <section className="bg-eggshell text-center px-4 pt-20 md:pt-32 pb-24 md:pb-32 border-b border-chalk">
      <h1 className="font-display text-[3.5rem] md:text-[5.5rem] leading-[1] tracking-tight font-light text-obsidian mb-6">
        Design taste, extracted.
      </h1>

      <p className="font-af text-lg text-gravel max-w-xl mx-auto leading-relaxed mb-12">
        Search curated references by brand, mood, color, typography, or URL. Open any style for colors, type, spacing, components, and a DESIGN.md your agent can use.
      </p>

      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative flex items-center p-1 bg-eggshell border border-chalk rounded-2xl shadow-subtle">
          <input
            type="text"
            placeholder="Search styles or paste a URL"
            className="flex-1 bg-transparent border-none focus:ring-0 px-5 py-3 text-obsidian placeholder:text-slate font-af text-[15px]"
          />
          <button className="bg-gravel hover:bg-obsidian text-eggshell font-medium px-6 py-2.5 rounded-xl transition-colors text-[14px]">
            Search
          </button>
        </div>
      </div>

      <FilterBar categories={categories} activeCategory={activeCategory} />
    </section>
  );
}
